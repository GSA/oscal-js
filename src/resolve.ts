import { exec } from 'child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { Catalog, Profile } from './types.js';
import inquirer from 'inquirer';
import { executeOscalCliCommand, installOscalCli, installOscalExecutor, isOscalExecutorInstalled } from './env.js';
import { detectOscalDocumentType,  OscalExecutorOptions } from './utils.js';
import { OscalConvertOptions } from './convert.js';
import { getServerClient } from './server.js';
import { ResolveOptions } from 'dns';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);
export type OscalResolveOptions = {
  outputFormat: 'json'|'yaml'|'xml',
} 


export async function resolveProfileInline(
  document: Profile,
  options: OscalConvertOptions,
  executor: OscalExecutorOptions = 'oscal-server'
): Promise<string|Catalog> {
  const tempInputFile = path.join(process.cwd(), `oscal-cli-tmp-input-${randomUUID()}.json`);
  const tempOutputFile = path.join(process.cwd(), `oscal-cli-tmp-output-${randomUUID()}.${options.outputFormat}`);

  try {
    writeFileSync(tempInputFile, JSON.stringify(document));
    await resolveProfileDocument(tempInputFile, tempOutputFile, options, executor);
    const resolvedDocument = readFileSync(tempOutputFile, 'utf8');

    if (options.outputFormat === 'json') {
      return JSON.parse(resolvedDocument);
    }else{
      return resolvedDocument;
    }
  } finally {
    await Promise.all([
      unlinkSync(tempInputFile),
      unlinkSync(tempOutputFile)
    ]);
  }
}
export async function resolveProfile(
  documentPath: string,
  options: OscalConvertOptions,
  executor: OscalExecutorOptions = 'oscal-server'
): Promise<string|Catalog> {
  const tempOutputFile = path.join(process.cwd(), `oscal-cli-tmp-output-${randomUUID()}.${options.outputFormat}`);

  try {
    await resolveProfileDocument(documentPath, tempOutputFile, options, executor);
    const resolvedDocument = readFileSync(tempOutputFile, 'utf8');

    if (options.outputFormat === 'json') {
      return JSON.parse(resolvedDocument);
    }else{
      return resolvedDocument;
    }
  } finally {
    await Promise.all([
      unlinkSync(tempOutputFile)
    ]);
  }
}


export async function resolveProfileDocument(
  filePath: string,
  outputPath: string,
  options:OscalResolveOptions={outputFormat:'json'},executor:OscalExecutorOptions='oscal-server'): Promise<void> {

  try {
    
    if(executor==='oscal-server'){
      await resolveFileWithServer(filePath,outputPath,options)
    }else{
      const args = ["--to=JSON", filePath, outputPath, '--show-stack-trace'];
      await executeOscalCliCommand("resolve-profile", args);     
    }
  } catch (error) {
    console.error("Error resolving profile from file:", error);
    return undefined;
  }
}


async function resolveFileWithServer(
  inputFile: string,
  outputFile: string,
  options: OscalConvertOptions
): Promise<void> {
  try {
    const encodedArgs = `file://${inputFile.trim()}`;
    
    // Determine the Accept header based on options.outputFormat
    let acceptHeader = 'application/json'; // Default to JSON
    if (options.outputFormat) {
      switch (options.outputFormat.toLowerCase()) {
        case 'json':
          acceptHeader = 'application/json';
          break;
        case 'xml':
          acceptHeader = 'application/xml';
          break;
        case 'yaml':
          acceptHeader = 'application/yaml';
          break;
        // Add more cases as needed
        default:
          console.warn(`Unsupported output format: ${options.outputFormat}. Defaulting to JSON.`);
      }
    }
    const client =await getServerClient();
    const { response, error,data } = await client.GET('/resolve', {
      params: { query: { document: encodedArgs,format:options.outputFormat } },
      parseAs: "blob" ,
      headers: { Accept: acceptHeader }
    });

    if (!response.ok) {
      console.error(error?.error);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!data) {
      throw new Error('No data received from the server');
    }

    // Convert blob to text
    const fileOutput = await data.text();

    writeFileSync(outputFile, fileOutput);
  } catch (error) {
    console.error('Error during validation:', error);
    throw error;
  }
}


export const resolveProfileCommand=async (fileArg,options: { file?: string; output?: string }) => {
  let { file, output } = options;
  file = fileArg ||file
  if (!file) {
    const answer = await inquirer.prompt<{ file: string }>([{
      type: 'input',
      name: 'file',
      message: 'Enter the path to the OSCAL profile document:',
      validate: (input: string) => input.trim() !== '' ? true : 'This field is required'
    }]);
    file = answer.file;
  }

  if (!output) {
    const answer = await inquirer.prompt<{ output: string }>([{
      type: 'input',
      name: 'output',
      message: 'Enter the path for the resolved output file:',
      validate: (input: string) => input.trim() !== '' ? true : 'This field is required'
    }]);
    output = answer.output;
  }

  console.log('Resolving OSCAL profile:', file);

  try {
    const [_, fileType] = await detectOscalDocumentType(file);

    // Determine output file type
    const outputFileType = path.extname(output).toLowerCase().slice(1);
    const validOutputTypes = ['json', 'xml', 'yaml'];
    const outputType = validOutputTypes.includes(outputFileType) ? outputFileType : fileType;

    const args = ["--to=" + outputType, file, output, "--overwrite","--show-stack-trace"];
    const [result, errors] = await executeOscalCliCommand("resolve-profile", args);

    if (errors) {
      console.error('Errors during profile resolution:', errors);
    } else {
      console.log('Profile successfully resolved. Output saved to:', output);
      console.log(result);
    }
  } catch (error) {
    console.error('Error resolving OSCAL profile:', error);
    process.exit(1);
  }
}