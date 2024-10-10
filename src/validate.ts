import { Ajv, ErrorObject } from 'ajv';
import addFormats from "ajv-formats";
import chalk from 'chalk';
import { randomUUID } from 'crypto';
import fs, { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import { tmpdir } from 'os';
import path from 'path';
import { Location, Log, ReportingDescriptor, Result, Run } from 'sarif';
import { v4 } from 'uuid';
import { executeOscalCliCommand, installOscalCli, installOscalExecutorIfNeeded, isJavaInstalled, isOscalExecutorInstalled } from './env.js';
import { oscalSchema } from './schema/oscal.complete.js';
import { getServerClient } from './server.js';
import { OscalJsonPackage, ResourceHypertextReference } from './types.js';
import { OscalExecutorOptions } from './utils.js';
import { Url } from 'url';


export type OscalValidationOptions = {
    extensions?: ResourceHypertextReference[],
    flags?:("disable-schema" | "disable-constraint")[] 
} 


export type OscalServerValidationOptions = OscalValidationOptions&{
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



export async function validate(
  document: OscalJsonPackage,
  options: OscalValidationOptions = {extensions: []},
  executor:OscalExecutorOptions='oscal-server'
): Promise<{isValid:boolean,log:Log}> {
  if (executor==='oscal-server') {
    console.log(document)
    let tempFilePath: string | null = null;
        // Create a temporary file
        tempFilePath = path.resolve(tmpdir(), `temp-${Date.now()}.json`);
        fs.writeFileSync(tempFilePath, JSON.stringify(document));

    return executeSarifValidationViaServer((tempFilePath),{...options,inline:true});
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
  options: OscalValidationOptions = {extensions: []},
  executor:OscalExecutorOptions='oscal-server'
): Promise<{ isValid: boolean; log: Log }> {      
    return executeSarifValidation(documentPath, options,executor);  
  }

 

export async function executeSarifValidation(
  filePath: string,
  options: OscalValidationOptions = {},
  executor:OscalExecutorOptions
): Promise<{ isValid: boolean; log: Log }> {
  const additionalArgs = (options.extensions||[]).flatMap(x => ["-c", x]);
  if(executor==='oscal-cli'){
    return await executeSarifValidationViaCLI([filePath, ...additionalArgs]);
  }else if(executor==='oscal-server'){
    return  await executeSarifValidationViaServer(filePath,{...options,inline:false}); 
  }else {
    return {isValid:false,log:buildSarifFromMessage("")}
  }
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



export async function validateDirectory(dirPath: string, options: OscalValidationOptions = { extensions: [] },executor: OscalExecutorOptions): Promise<{isValid:boolean,log:Log}> {
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

export const validateCommand =async function(fileArg,commandOptions: { file?: string, extensions?: string[], recursive?: boolean,server?:boolean }) {
  let { file, extensions, recursive,server } = commandOptions;

  let options:OscalValidationOptions = {extensions}
  if(Array.isArray(options.extensions)&&options.extensions.includes("fedramp")){
    let fedramp_extensions:string[] = []
    fedramp_extensions.push("https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/fedramp-external-constraints.xml")
    fedramp_extensions.push("https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/oscal-external-constraints.xml")
    fedramp_extensions.push("https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/fedramp-external-allowed-values.xml")
    options.extensions=[...fedramp_extensions,...options.extensions.filter(x=>x!=='fedramp')];
  }
  file = fileArg || file;
  if (typeof file === 'undefined') {
    const answer = await inquirer.prompt<{ file: string }>([{
      type: 'input',
      name: 'file',
      message: 'Enter the path to the OSCAL document or directory:',
      validate: (input: string) => input.trim() !== '' ? true : 'This field is required'
    }]);
    file = answer.file;
  }

  console.log('Beginning OSCAL document validation for', file);
  const executor = server?"oscal-server":'oscal-cli';
  
  console.log('Beginning executing on', executor);
  
  try {
    const stats = fs.statSync(file);
    if (stats.isDirectory()) {
      if (recursive) {
        await validateDirectoryRecursively(file,options,buildSarifFromMessage("initial sarif"),executor);
      } else {
        await validateDirectory(file,options,executor);
      }
    } else {
      if (recursive) {
        console.warn('The --recursive option is ignored for single files.');
      }
      await validateDocument(file, options,executor);
    }
  } catch (error) {
    console.error('Error during validation:', error);
    process.exit(1);
  }
}

async function validateDirectoryRecursively(dirPath: string, options:OscalValidationOptions,log:Log=buildSarif([]),executor:OscalExecutorOptions='oscal-server'): Promise<{isValid:boolean,log:Log}> {
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

const executeSarifValidationViaCLI = async (args: string[],quiet:boolean=false): Promise<{isValid:boolean,log:Log}> => {
  const tempFile = path.resolve(`oscal-cli-sarif-log-${v4()}.json`);
  const sarifArgs = [...args, '-o', tempFile, "--sarif-include-pass", '--show-stack-trace'];
  var consoleErr = ""
  try {
    const [out, err] = await executeOscalCliCommand('validate', sarifArgs, false);
    consoleErr = err;
    !quiet&&console.log(out);
    !quiet&&console.error(chalk.red(err));
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

const toUri =(document:string)=>{
  return !document.startsWith("http")&&!document.startsWith("file")?"file://"+document:document
}

async function executeSarifValidationViaServer(document:string,options:OscalServerValidationOptions): Promise<{isValid:boolean,log:Log}> {
  try {
      let documentUri = toUri(document)
      const constraint=(options.extensions||[]).map(toUri)
      
      const params = {query:{document:documentUri,constraint,flags:options.flags}}
      const client = await getServerClient()
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
