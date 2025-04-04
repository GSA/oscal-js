import { Ajv, ErrorObject } from 'ajv';
import addFormats from "ajv-formats";
import chalk from 'chalk';
import { randomUUID } from 'crypto';
import fs, { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import path, { resolve } from 'path';
import { Location, Log, ReportingDescriptor, Result, Run } from 'sarif';
import { v4 } from 'uuid';
import { executeOscalCliCommand, installOscalCli, isJavaInstalled, isOscalExecutorInstalled } from './env.js';
import { oscalSchema } from './schema/oscal.complete.js';
import { getServerClient } from './server.js';
import { OscalJsonPackage, ResourceHypertextReference } from './types.js';
import { ExecutorOptions, resolveUri } from './utils.js';

export type ValidationOptions = {
    extensions?: ResourceHypertextReference[],
    quiet?:boolean
    module?:string
    flags?:("disable-schema" | "disable-constraint")[] 
} 


export type ServerValidationOptions = ValidationOptions & {
  inline: boolean
} 


let ajv: Ajv | null = null;

function getAjv(): Ajv {
  if (!ajv) {
    ajv = new Ajv({
      allErrors: true,
      verbose: true,
      schemas:[oscalSchema]
    });
    addFormats(ajv);
  }
  return ajv;
}


async function executeSarifValidationWithFileUpload(document: OscalJsonPackage, options: ServerValidationOptions): Promise<{isValid: boolean, log: Log}> {
  try {
    const constraint = (options.extensions || []).map(resolveUri);
    const client = await getServerClient("http://localhost",8888,options.quiet);
    
    const { response, error, data } = await client.POST('/validate', {      
      body: document as any, 
      params: {
        query: {
          constraint,
          flags: options.flags
        }
      },
      parseAs: 'json'
    });

    if (error) {
      console.error(error.error);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    if (!data) {
      throw new Error(`HTTP error! missing data`);
    }

    const responseCode = response.headers.get("exit-status");
    const isValid = responseCode === "OK";
    const log = data as any;
    
    return { isValid, log };
  } catch (error) {
    console.error('Error during validation:', error);
    throw error;
  }
}

export async function validate(
  document: OscalJsonPackage,
  options: ValidationOptions = {extensions: []},
  executor:ExecutorOptions='oscal-server'
): Promise<{isValid:boolean,log:Log}> {
  if (executor === 'oscal-server') {
    return executeSarifValidationWithFileUpload(document, {...options, inline: true});
  }

  const javaInstalled = await isJavaInstalled();
  if (!javaInstalled) {
    console.error("Java not installed. Validating with schema");
    return validateWithJsonSchema(document);
  }

  let oscalCliInstalled = await isOscalExecutorInstalled('oscal-cli');
  if (!oscalCliInstalled) {
    try {
      installOscalCli();
      oscalCliInstalled = true;
    } catch (error) {
      console.error('Failed to install OSCAL CLI:', error);
      return validateWithJsonSchema(document);
    }
  }

  const tempFile = path.resolve(`./oscal-cli-tmp-input-${v4()}.json`);
  writeFileSync(tempFile, JSON.stringify(document));
  const result = await validateDocument(tempFile, options);
  rmSync(tempFile);
  return result;
}

export async function validateDocument(
  documentPath: string,
  options: ValidationOptions = {extensions: [],module:"http://csrc.nist.gov/ns/oscal/1.0"},
  executor:ExecutorOptions='oscal-server'
): Promise<{ isValid: boolean; log: Log }> {
    return executeSarifValidation(documentPath, options,executor);  
  }

 

  export async function executeSarifValidation(
    filePath: string,
    options: ValidationOptions = {},
    executor: ExecutorOptions
  ): Promise<{ isValid: boolean; log: Log }> {

    const additionalArgs = (options.extensions || []).flatMap(x => ["-c", x]);
  
    if (executor === 'oscal-server') {
      try {
        return await executeSarifValidationViaServer((filePath), { ...options, inline: false });
      } catch (error) {
        console.warn("Server validation failed. Falling back to CLI validation.");
        executor = 'oscal-cli';
      }
    }
  
    if (executor === 'oscal-cli') {
      if(options.flags?.includes("disable-schema")){
        additionalArgs.push("--disable-schema-validation")
      }
      let command = "validate"
      if(options.module==="http://csrc.nist.gov/ns/oscal/metaschema/1.0"){
        command = "metaschema validate"
      }else if(options.module!=='http://csrc.nist.gov/ns/oscal/1.0'&&typeof options.module!=='undefined'){
        command = "metaschema validate-content"
        additionalArgs.push("-m")
        additionalArgs.push(options.module!)
      }
      return await executeSarifValidationViaCLI(command,[filePath, ...additionalArgs],options.quiet);
    }
  
    return { isValid: false, log: buildSarifFromMessage("Invalid executor specified") };
  }

export function parseSarifToErrorStrings(sarifResult: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (sarifResult.runs && sarifResult.runs.length > 0) {
    for (const run of sarifResult.runs) {
      if (run.results && run.results.length > 0) {
        for (const result of run.results) {
          if (result.message && result.message.text) {
            let errorMessage = result.message.text;
            if (result.locations && result.locations.length > 0) {
              const location = result.locations[0];
              if (location.physicalLocation) {
                const artifactLocation = location.physicalLocation.artifactLocation;
                const region = location.physicalLocation.region;
                if (artifactLocation && artifactLocation.uri && region) {
                  errorMessage += ` in file ${artifactLocation.uri} at line ${region.startLine}, column ${region.startColumn}`;
                }
              }
            }
            errors.push(errorMessage);
          }
        }
      }
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

function convertAjvErrorsToSarif(errors: ErrorObject[]): Log {
  const results: Result[] = errors.map((error) => {
    const location: Location = {
      physicalLocation: {
        artifactLocation: {
          uri: error.instancePath || '/',
        },
        region: {
          startLine: error.instancePath ? parseInt(error.instancePath.split('/')[1]) : 1,
          startColumn: 1,
        },
      },
    };

    return {
      level: 'error',
      message: {
        text: error.message || 'Unknown error',
      },
      locations: [location],
    };
  });

  const sarif: Log = {
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'AJV Validator',
            informationUri: 'https://ajv.js.org/',
            rules: [],
          },
        },
        results: results,
      },
    ],
  };

  return sarif;
}
function validateWithJsonSchema(
  document: OscalJsonPackage,
): {isValid:boolean,log:Log} {
  const ajv = getAjv();
  const validate = ajv.compile(oscalSchema);
  const isValid=validate({...document, $schema: "http://csrc.nist.gov/ns/oscal/1.0"});
  return {isValid,log:convertAjvErrorsToSarif(validate.errors||[])}
}
export const OscalDefinitions=[ "catalog", "group", "control", "part", 
  "parameter", "parameter-constraint", "parameter-guideline",
   "parameter-value", "parameter-selection"
, "include-all", "metadata"
, "location-uuid", "party-uuid", "role-id", "back-matter"
, "property", "link", "responsible-party"
, "action", "responsible-role"
, "hash", "remarks", "published"
, "last-modified", "version"
, "oscal-version", "email-address", "telephone-number"
, "address", "addr-line", "document-id"
, "profile", "import", "merge", "modify"
, "insert-controls"
, "select-control-by-id"
, "select-profile-control-by-id"
, "with-id", "matching", "component-definition"
, "import-component-definition"
, "defined-component", "capability", "incorporates-component"
, "control-implementation", "implemented-requirement"
, "statement", "system-component"
, "protocol", "port-range", "implementation-status", "system-user", "authorized-privilege"
, "function-performed", "inventory-item", "set-parameter"
, "system-id", "system-security-plan"
, "import-profile", "system-characteristics"
, "system-information", "impact", "base"
, "selected", "adjustment-justification"
, "security-impact-level", "status", "date-authorized", "authorization-boundary"
, "diagram", "network-architecture", "data-flow", "system-implementation"
, "by-component", "assessment-plan", "import-ssp", "local-objective"
, "assessment-method", "activity", "task", "reviewed-controls", "select-objective-by-id"
, "assessment-subject-placeholder"
, "assessment-subject", "select-subject-by-id"
, "subject-reference", "assessment-assets", "finding-target", "finding", "observation", "origin"
, "origin-actor", "related-task"
, "threat-id", "risk", "logged-by", "risk-status"
, "characterization", "response", "assessment-part"
, "assessment-results", "result", "import-ap", "plan-of-action-and-milestones", "local-definitions", "poam-item"];


export type OscalDefinition =typeof OscalDefinitions[number] 


export function validateDefinition(
  definitionName: OscalDefinition,
  document: any,
): { isValid: boolean; errors?: string[]; } {
  const ajv = getAjv();

  const validateFn = ajv.getSchema(oscalSchema.$id+"#/definitions/"+definitionName);
  if (!validateFn) {
    console.log(validateFn)
    return { 
      isValid: false, 
      errors: [`Definition not found: ${definitionName}`] 
    };
  }
  const isValid = (validateFn as any)!(document);

  if (!isValid) {
    return {
      isValid: false,
      errors: validateFn.errors?.map((error: any) => `${error.message} at ${error.instancePath}`)
    };
  }

  return { isValid: true };
}



export async function validateDirectory(dirPath: string, options: ValidationOptions = { extensions: [] },executor: ExecutorOptions): Promise<{isValid:boolean,log:Log}> {
  const files = fs.readdirSync(dirPath);
  
  const validationPromises = files.map(async (file) => {
    const filePath = path.resolve(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (!stats.isDirectory() && isValidFileType(filePath)) {
      try {
        return await validateDocument(filePath, options,executor);
      } catch (error) {
        console.error(`Error validating ${filePath}:`, error);
        return {log:buildSarifFromMessage(("!" +error).toString()),isValid:false};
      }
    }
    return {isValid:true,log:{runs:[],version:'2.1.0',$schema:""} as Log}; // Consider directories or invalid file types as "valid"
  });

  const results = await Promise.all(validationPromises);
  
  // Check if all validations passed
  const isValid = results.every(result => result.isValid === true);
     
  const runs = results.map(result => (result.log?.runs||[])).reduce((a,b)=>[...a,...b]);
  let log=buildSarif(runs);
  return {isValid,log};
}
export const fedrampValidationOptions:ValidationOptions = {
extensions:["https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/oscal-external-constraints.xml","https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/fedramp-external-constraints.xml","https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/fedramp-external-allowed-values.xml"]
}

export const validateCommand =async function(fileArg,commandOptions: { file?: string, extensions?: string[], recursive?: boolean,server?:boolean,quiet?:boolean,module:string,disableSchema?:boolean}) {
  let { file, extensions, recursive,server,quiet ,disableSchema,module} = commandOptions;
  
  let options:ValidationOptions = {extensions,quiet,flags:disableSchema?['disable-schema']:[],module}
  if(disableSchema){
    !quiet && console.log("Disabling schema validation");
  }
  if(Array.isArray(options.extensions)&&options.extensions.includes("fedramp")){
    options.extensions=fedrampValidationOptions.extensions;
  }
  const filePath=fileArg || file;
  if (typeof filePath === 'undefined') {
    const answer = await inquirer.prompt<{ file: string }>([{
      type: 'input',
      name: 'file',
      message: 'Enter the path to the OSCAL document or directory:',
      validate: (input: string) => input.trim() !== '' ? true : 'This field is required'
    }]);
    file = answer.file;
  }
  
  const isRemote = filePath.startsWith("http");
  const pathOrUri = isRemote ? filePath : path.resolve(filePath);
  !quiet && console.log('Beginning OSCAL document validation for', file);
  const executor = server ? "oscal-server" : 'oscal-cli';
  !quiet && console.log('Beginning executing on', executor);
  if(!isRemote){
      const stats = fs.statSync(pathOrUri);
      if (stats.isDirectory()) {
          if (recursive) {
              await validateDirectoryRecursively(pathOrUri, options, buildSarifFromMessage("initial sarif"), executor);
          }
          else {
              await validateDirectory(pathOrUri, options, executor);
          }
      }
  }
  if (recursive) {
      console.warn('The --recursive option is ignored for single files.');
  }
  const { isValid, log } = await validateDocument(pathOrUri, options, executor);
  !isValid && console.log(formatSarifOutput(log));
}

async function validateDirectoryRecursively(dirPath: string, options:ValidationOptions,log:Log=buildSarif([]),executor:ExecutorOptions='oscal-server'): Promise<{isValid:boolean,log:Log}> {
  const files = fs.readdirSync(dirPath);
  let runs:Run[] = [];
  let isValid = true;
  for (const file of files) {
    const filePath = path.resolve(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const subdirResult = await validateDirectoryRecursively(filePath, options,log,executor);
      subdirResult.log.runs&&runs.concat(subdirResult.log.runs);
      if(!subdirResult.isValid){
        isValid = false;
      }
      if (!subdirResult) return {isValid:false,log:buildSarifFromMessage("Failed to validate")}; // Stop if validation failed in subdirectory
    } else if (isValidFileType(filePath)) {
      const {isValid,log} = await validateDocument(filePath,options);
      log&&log.runs&&runs.concat(log.runs);
      if (!isValid) return {isValid:false,log:buildSarifFromMessage("Failed to validate")}; // Stop if validation failed for this file
    }
  }
  return {isValid,log:buildSarif(runs)}; // All validations passed
}

function isValidFileType(filePath: string): boolean {
const validExtensions = ['.xml', '.json', '.yaml', '.yml'];
return validExtensions.includes(path.extname(filePath).toLowerCase());
}

const executeSarifValidationViaCLI = async (command:string,args: string[],quiet:boolean=false): Promise<{isValid:boolean,log:Log}> => {
  const tempFile = path.resolve(`oscal-cli-sarif-log-${v4()}.json`);
  const sarifArgs = [...args, '-o', tempFile, "--sarif-include-pass", '--show-stack-trace'];
  var consoleErr = ""
  try {
    const [out, err] = await executeOscalCliCommand(command, sarifArgs, false,quiet);
    consoleErr = err;
    !quiet&&console.log(out);
    console.error(chalk.red(err));
  } catch (error) {
    !quiet&&console.error(chalk.red(error));
    if (!existsSync(tempFile)) {
      throw (consoleErr)
    }
    const sarifOutput = readFileSync(tempFile, 'utf8');
    rmSync(tempFile);
    return {isValid:false,log:JSON.parse(sarifOutput) as Log};
  }
  try {
    const sarifOutput = readFileSync(tempFile, 'utf8');
    rmSync(tempFile);
    return {isValid:true,log:JSON.parse(sarifOutput) as Log}
  } catch (error) {
    throw new Error(`Failed to read or parse SARIF output: ${error}`);
  }
};


async function executeSarifValidationViaServer(document:string,options:ServerValidationOptions): Promise<{isValid:boolean,log:Log}> {
  try {
      let documentUri = resolveUri(document)
      const constraint=(options.extensions||[]).map(resolveUri)
      
      const params = {query:
        {
          document:documentUri,
          constraint,
          module:options.module,
          flags:options.flags}}
      const client = await getServerClient("http://localhost",8888,options.quiet);
      const {response,error,data} =await client.GET('/validate',{params,
        parseAs:'json'
      })
      if(error){
        console.error(error.error)
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!data) {
        throw new Error(`HTTP error! missing data`);
      }
      
      const responseCode = response.headers.get("exit-status")
      let isValid = false;
      if(responseCode=="OK"){
        isValid = true;
      }
      const log = data as any;
    return {isValid,log};  
} catch (error) {
    console.error('Error during validation:', error);
    throw error;
  }
}


function buildSarifFromMessage(message: string): Log {
  const ruleId = randomUUID();
  
  const rule: ReportingDescriptor = {
    id: ruleId,
    name: 'Runtime Error',
    shortDescription: {
      text: 'An error occured during runtime'
    }
  };

  const result: Result = {
    ruleId: ruleId,
    level: 'warning',
    message: {
      text: message
    },
    locations: [
      {
        physicalLocation: {
          artifactLocation: {
            uri: 'unknown'
          },
          region: {
            startLine: 1,
            startColumn: 1
          }
        }
      }
    ]
  };

  const run: Run = {
    tool: {
      driver: {
        name: 'oscal-js',
        rules: [rule]
      }
    },
    results: [result]
  };

  return buildSarif([run]);
}
function buildSarif(runs: Run[]): Log {  

  const log: Log = {
    version: '2.1.0',
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    runs
  };

  return log;
}

export const validateWithSarif = async ( args: string[]): Promise<Log> => {
  console.warn(chalk.yellow("[WARN]")+chalk.red("validateWithSarif")+" is deprecated, please use validateDocument or validate")
  const tempFile = path.join(`oscal-cli-sarif-log-${v4()}.json`);
  const sarifArgs = [...args, '-o', tempFile,"--sarif-include-pass"];

  try {
    await executeOscalCliCommand('validate', sarifArgs, false);
  } catch (error) {
    console.error("Error executing oscal cli command validate "+sarifArgs);
    const sarifOutput = readFileSync(tempFile, 'utf8');
    rmSync(tempFile);
    return JSON.parse(sarifOutput) as Log;
  }
  try {
    const sarifOutput = readFileSync(tempFile, 'utf8');
    rmSync(tempFile);
    return JSON.parse(sarifOutput) as Log;
  } catch (error) {
    console.error("ERRORING",error);
    throw new Error(`Failed to read or parse SARIF output: ${error}`);
  }
};

export function formatSarifOutput(
  log: Log,
  logOptions: { showFileName }={ showFileName: true } 
) {
  try {
    // Check if log is valid
    if (!log || !log.runs || !log.runs[0] || !log.runs[0].results) {
      return chalk.red('Invalid SARIF log format');
    }

    // Extract and filter results
    const results = log.runs[0].results;

    // Format the output with different chalk styles
    const formattedOutput = results
      .filter((x) => x.kind != 'informational' && x.kind !== 'pass')
      .map((result) => {
        // Construct message with or without file name based on the option
        const fileDetails = logOptions.showFileName
          ? chalk.gray(
              (result.ruleId || "") +
                " " +
                (result.locations ? createTerminalLink(result.locations[0] as any) : "")
            )
          : chalk.gray(result.ruleId || "");

        if (result.kind == 'fail') {
          // Highlight error messages
          return (
            chalk.red.bold("[" + result.level?.toUpperCase() + "] ") +
            fileDetails +
            "\n" +
            chalk.hex("#b89642")(result.message.text)
          );
        } else {
          return chalk.yellow.bold(result.message.text);
        }
      })
      .join('\n\n');

    return formattedOutput;
  } catch (error: any) {
    return chalk.red(`Error processing SARIF log: ${error.message}`);
  }

  function createTerminalLink(location: Location) {
    const filePath = location?.physicalLocation?.artifactLocation?.uri || '';
    const lineNumber = location?.physicalLocation?.region?.startLine;
    const columnNumber = location?.physicalLocation?.region?.startColumn;
   
    if (filePath.startsWith('http')) {
      const fileName = filePath.split('/').pop() || filePath;
      const linkText = `${fileName}:${lineNumber}:${columnNumber}`;

      if (filePath.includes('githubusercontent.com')) {
          // Convert raw GitHub URL to permalink format
          const [org, repo, ref, ...pathParts] = filePath
              .replace('https://raw.githubusercontent.com/', '')
              .replace('refs/heads/', '')
              .split('/');
              
          const path = pathParts.join('/');
          const githubLink = `https://github.com/${org}/${repo}/blob/${ref}/${path}#L${lineNumber}`;
          return `\u001b]8;;${githubLink}\u0007${linkText}\u001b]8;;\u0007`;
      }
      
      // For other remote resources, use the direct URL
      return `\u001b]8;;${filePath}#L${lineNumber}\u0007${linkText}\u001b]8;;\u0007`;
  }
  
    const absolutePath = resolve(filePath);
    const fileName = filePath.split('/').pop() || filePath;

    // VSCode format: vscode://file/{full_path}:{line}
    const vscodeLink = `vscode://file/${absolutePath}:${lineNumber}:${columnNumber}`;

    // Create an ANSI escape sequence for the clickable link
    // Format: \u001b]8;;{link}\u0007{text}\u001b]8;;\u0007
    const linkText = `${fileName}:${lineNumber}:${columnNumber}`;
    const terminalLink = `\u001b]8;;${vscodeLink}\u0007${linkText}\u001b]8;;\u0007`;

    return terminalLink;
  }
}

