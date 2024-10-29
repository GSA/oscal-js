import { randomUUID } from 'crypto';
import fs, { readFileSync, unlinkSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import path, { resolve } from 'path';
import { executeOscalCliCommand } from './env.js';
import { getServerClient } from './server.js';
import { OscalJsonPackage } from './types.js';
import { OscalExecutorOptions } from './utils.js';
import {  resolveUri } from './utils.js';

export type OscalConvertOptions = {
  outputFormat: 'json'|'yaml'|'xml',
} 


export async function convert(
  document: OscalJsonPackage,
  options: OscalConvertOptions,
  executor: OscalExecutorOptions = 'oscal-server'
): Promise<string|OscalJsonPackage> {
  const tempInputFile = path.resolve(process.cwd(), `oscal-cli-tmp-input-${randomUUID()}.json`);
  const tempOutputFile = path.resolve(process.cwd(), `oscal-cli-tmp-output-${randomUUID()}.${options.outputFormat}`);

  try {
    writeFileSync(tempInputFile, JSON.stringify(document));
    await convertDocument(tempInputFile, tempOutputFile, options, executor);
    const convertedContent = readFileSync(tempOutputFile, 'utf8');

    let result;
    if (options.outputFormat === 'json') {
      result = JSON.parse(convertedContent);
    } else if (['yaml'].includes(options.outputFormat)) {
      result = convertedContent; // Return as string if YAML parser is not available
    } else {
      result = convertedContent;
    }

    return result;
  } finally {
    await Promise.all([
      unlinkSync(tempInputFile),
      unlinkSync(tempOutputFile)
    ]);
  }
}

export async function convertDocument(
  documentPath: string,
  outputPath: string,
  options: OscalConvertOptions = { outputFormat: 'xml' },
  executor: OscalExecutorOptions = 'oscal-server'
): Promise<void> {
  if (executor === 'oscal-server') {
    try {
      await convertFileWithServer(resolveUri(documentPath), resolveUri(outputPath), options);
      return;
    } catch (error) {
      console.warn("Server conversion failed. Falling back to CLI conversion.");
      executor = 'oscal-cli';
    }
  }

  if (executor === 'oscal-cli') {
    try {
      await convertFileWithCli(documentPath, outputPath, options);
      return;
    } catch (error) {
      console.error("CLI conversion failed:", error);
      throw error;
    }
  }

  throw new Error(`Unsupported executor: ${executor}`);
}
async function handleFolderConversion(
  inputFolder: string,
  outputFolder: string,
  options: OscalConvertOptions,
  executor:OscalExecutorOptions
): Promise<void> {
  const { outputFormat } = options;
  const validTypes = ['json', 'yaml', 'xml'];
  const outputFormats = outputFormat && validTypes.includes(outputFormat.toLowerCase())
    ? [outputFormat.toLowerCase()]
    : validTypes;

  for (const format of outputFormats) {
    const formatOutputFolder = outputFormat
      ? outputFolder
      : path.resolve(outputFolder, format);
    fs.mkdirSync(formatOutputFolder, { recursive: true });

    const files = fs.readdirSync(inputFolder);
    for (const inputFile of files) {
      const inputPath = path.resolve(inputFolder, inputFile);
      const outputPath = path.resolve(formatOutputFolder, `${path.parse(inputFile).name}.${format}`);
      const inputFileExtension = path.extname(inputPath).toLowerCase().slice(1);
      if (validTypes.includes(inputFileExtension)) {
        await convertDocument(inputPath, outputPath, { ...options, outputFormat: format as any },executor);
      }
    }
  }
}

export async function handleSingleFileConversion(
  inputFile: string,
  output: string,
  options: OscalConvertOptions,
  executor: OscalExecutorOptions = 'oscal-cli'
): Promise<void> {
  const outputExt = path.extname(output).toLowerCase();
  if (['.json', '.yaml', '.xml'].includes(outputExt)) {
    const outputFormat = outputExt.slice(1) as 'json' | 'yaml' | 'xml';
    await convertDocument(inputFile, output, { ...options, outputFormat }, executor);
  } else {
    const outputFormats = ['json', 'yaml', 'xml'];
    for (const format of outputFormats) {
      const outputFolder = path.resolve(output, format);
      fs.mkdirSync(outputFolder, { recursive: true });
      const outputFile = path.resolve(outputFolder, `${path.parse(inputFile).name}.${format}`);
      await convertDocument(inputFile, outputFile, { ...options, outputFormat: format as 'json' | 'yaml' | 'xml' }, executor);
    }
  }
}

async function convertFileWithCli(
  inputFile: string,
  outputFile: string,
  options: OscalConvertOptions
): Promise<void> {
  const args = [`--to=${options.outputFormat}`, inputFile, outputFile, "--overwrite"];
  const [result, errors] = await executeOscalCliCommand("convert", args);
  if (errors) console.error(errors);
}


async function convertFileWithServer(
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
          acceptHeader = 'text/xml';
          break;
        case 'yaml':
        case 'yml':
          acceptHeader = 'text/yaml';
          break;
        default:
          console.warn(`Unsupported output format: ${options.outputFormat}. Defaulting to JSON.`);
      }
    }

    const client = await getServerClient();
    const { response, error,data } = await client.GET('/convert', {
      params: { query: { document: encodedArgs,format:options.outputFormat } },
      parseAs:"blob",
      headers: { Accept: acceptHeader }
    });
    if (!response.ok) {
      console.error(error?.error);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!data) {
      console.error("Data not found");
      throw new Error(`HTTP error! missing data!`);
    }
    const fileOutput = await data.text()
    fs.writeFileSync(outputFile,fileOutput);
  } catch (error) {
    console.error('Error during conversion:', error);
    throw error;
  }
}

export const convertCommand = async (
  fileArg: string | undefined,
  commandOptions: { file?: string; output?: string; type?: string; server: boolean }
) => {
  let { file, output, type, server } = commandOptions;
  const options: OscalConvertOptions = { outputFormat: type as 'json' | 'yaml' | 'xml'  };
  const executor = server ? "oscal-server" : 'oscal-cli';
  file = fileArg || file;

  if (!file) {
    const answer = await inquirer.prompt<{ file: string }>([{
      type: 'input',
      name: 'file',
      message: 'Enter the path to the OSCAL document or folder:',
      validate: (input: string) => input.trim() !== '' ? true : 'This field is required'
    }]);
    file = answer.file;
  }

  if (!output) {
    const answer = await inquirer.prompt<{ output: string }>([{
      type: 'input',
      name: 'output',
      message: 'Enter the path for the output file or folder:',
      validate: (input: string) => input.trim() !== '' ? true : 'This field is required'
    }]);
    output = answer.output;
  }

  if (fs.lstatSync(file).isDirectory()) {
    await handleFolderConversion(file, output, options,executor);
  } else {
    await handleSingleFileConversion(file, output, options, executor);
  }
};