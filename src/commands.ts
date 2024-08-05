import { ChildProcess, exec, execSync, spawn } from 'child_process';
import chalk from 'chalk';
import { program } from 'commander';
import fs, { existsSync, readFileSync, rmSync } from 'fs';
import inquirer from 'inquirer';
import yaml from 'js-yaml'; // Make sure to import js-yaml
import path, { dirname, join } from 'path';
import { Log } from "sarif";
import { fileURLToPath } from 'url';
import { promisify, styleText } from 'util';
import { v4 } from 'uuid';
import xml2js from 'xml2js';
import { scaffold } from './scaffold.js';
import { platform } from 'os';
import { parseSarifToErrorStrings } from './validate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type OscalDocumentType = 'catalog' | 'profile' | 'component-definition' | 'ssp' | 'metaschema' | 'poam' | 'ar' | 'ap';
type FileFormat = 'xml' | 'json' | 'yaml';


export async function detectOscalDocumentType(filePath: string): Promise<[OscalDocumentType, FileFormat]> {
  const fileExtension = path.extname(filePath).toLowerCase();

  if (!['.xml', '.json', '.yaml', '.yml'].includes(fileExtension)) {
    throw new Error('Unsupported file format. Only XML YAML and JSON are supported.');
  }

  const fileContent = (await readFileSync(filePath)).toString();

  if (fileExtension === '.xml') {
    return parseXmlDocument(fileContent);
  } else if (fileExtension === ".json") {
    return parseJsonDocument(fileContent);
  } else {
    return parseYamlDocument(fileContent);
  }
}
async function parseYamlDocument(fileContent: string): Promise<[OscalDocumentType, FileFormat]> {
  return new Promise((resolve, reject) => {
    try {
      const yamlData = yaml.load(fileContent);
      if (typeof yamlData !== 'object' || yamlData === null) {
        reject(new Error('Invalid YAML structure'));
      }
      const rootElement = Object.keys(yamlData)[0];
      resolve([getDocumentType(rootElement), 'yaml']);
    } catch (error) {
      reject(new Error(`Failed to parse YAML: ${error}`));
    }
  });
}
async function parseXmlDocument(fileContent: string): Promise<[OscalDocumentType, FileFormat]> {
  const parser = new xml2js.Parser();
  try {
    const result = await parser.parseStringPromise(fileContent);
    const rootElement = Object.keys(result)[0];
    return [getDocumentType(rootElement), 'xml'];
  } catch (error) {
    throw new Error(`Failed to parse XML: ${error}`);
  }
}

function parseJsonDocument(fileContent: string): [OscalDocumentType, FileFormat] {
  try {
    const jsonData = JSON.parse(fileContent);
    const rootElement = Object.keys(jsonData)[0];
    return [getDocumentType(rootElement), 'json'];
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}

function getDocumentType(rootElement: string): OscalDocumentType {
  switch (rootElement) {
    case 'catalog': return 'catalog';
    case 'profile': return 'profile';
    case 'plan-of-action-and-milestones': return 'poam';
    case 'component-definition': return 'component-definition';
    case 'system-security-plan': return 'ssp';
    case 'assessment-results': return 'ar';
    case 'assessment-plan': return 'ap';
    default: return 'metaschema';
  }
}

const checkCommand = (command: string): Promise<boolean> => {
  return new Promise((resolve) => {
    exec(command, (error) => {
      resolve(!error);
    });
  });
};

export const isOscalCliInstalled = async (): Promise<boolean> => {
  const command = process.platform === 'win32' 
    ? 'where oscal-cli'
    : 'which oscal-cli';
  
  const isInPath = await checkCommand(command);
  if (isInPath) return true;

  const oscalCliInstallPath = path.join('.', 'oscal-cli');
  return fs.existsSync(oscalCliInstallPath);
};

export const isJavaInstalled = async (): Promise<boolean> => {
  const command = process.platform === 'win32'
    ? 'where java'
    : 'which java';
  
  return checkCommand(command);
};
export const installOscalCli = (): void => {
  const oscalCliInstallUrl = `https://repo1.maven.org/maven2/dev/metaschema/oscal/oscal-cli-enhanced/2.0.0/oscal-cli-enhanced-2.0.0-oscal-cli.zip`;
  const isWindows = process.platform === 'win32';

  // Use AppData for Windows, or .local for other systems
  const homeDir = isWindows ? process.env.APPDATA : (process.env.HOME || process.env.USERPROFILE);
  const localPath = isWindows ? path.join(homeDir as string, 'OSCAL-CLI') : path.join(homeDir as string, '.local');

  const localBinPath = isWindows ? path.join(process.env.USERPROFILE as string, 'AppData', 'Local', 'Microsoft', 'WindowsApps') : path.join(localPath, 'bin');
  const oscalCliPath = path.join(localPath, 'oscal-cli');
  const extractedCliPath = path.join(oscalCliPath, 'oscal-cli');
  const oscalCliExecutablePath = path.join(extractedCliPath, 'bin', 'oscal-cli');
  const zipFilePath = path.join(localPath, 'oscal-cli-enhanced-2.0.0-oscal-cli.zip');

  try {
    // Create necessary directories
    fs.mkdirSync(oscalCliPath, { recursive: true });
    if (!isWindows) {
      fs.mkdirSync(localBinPath, { recursive: true });
    }

    // Download the zip file
    console.log(`Downloading OSCAL CLI...`);
    execSync(`curl -sSLo "${zipFilePath}" "${oscalCliInstallUrl}"`);

    // Unzip the file to oscal-cli directory
    console.log(`Extracting OSCAL CLI...`);
    if (isWindows) {
      execSync(`powershell -command "Expand-Archive -Path '${zipFilePath}' -DestinationPath '${oscalCliPath}' -Force"`);
    } else {
      execSync(`unzip -o "${zipFilePath}" -d "${oscalCliPath}"`);
    }

    // Make the CLI executable (for non-Windows systems)
    if (!isWindows) {
      execSync(`chmod +x "${oscalCliExecutablePath}"`);
    }

    // Create a shortcut (Windows) or symbolic link (other systems)
    const sourceFile = isWindows ? `${oscalCliExecutablePath}.bat` : oscalCliExecutablePath;
    const aliasPath = path.join(localBinPath, 'oscal-cli' + (isWindows ? '.bat' : ''));

    if (fs.existsSync(aliasPath)) {
      fs.unlinkSync(aliasPath); // Remove existing alias if it exists
    }

    if (isWindows) {
      // For Windows, create a .bat file in WindowsApps directory
      const batchContent = `@echo off\n"${sourceFile}" %*`;
      fs.writeFileSync(aliasPath, batchContent);
    } else {
      fs.symlinkSync(sourceFile, aliasPath);
    }

    // Delete the zip file
    fs.unlinkSync(zipFilePath);

    console.log(`OSCAL CLI installed to ${extractedCliPath}`);
    console.log(`Alias created at ${aliasPath}`);

  } catch (error: any) {
    throw new Error(`Failed to install OSCAL CLI: ${error.message}`);
  }
};

const execPromise = promisify(exec);
export type stdIn = string;
export type stdErr = string;

export const executeOscalCliCommand = async (command: string, args: string[], showLoader: boolean = false): Promise<[stdIn, stdErr]> => {
  return new Promise((resolve, reject) => {
    findOscalCliPath().then(oscalCliPath => {
      const isWindows = process.platform === 'win32';
      const fullArgs = [command, ...args];

      console.log(chalk.green("oscal-cli ") + chalk.blue(command)+' '+(args.join(" ")));

      let spawnArgs: [string, string[], object];
      if (isWindows) {
        // On Windows, we need to spawn cmd.exe and pass the command as an argument
        spawnArgs = [
          'cmd.exe',
          ['/c', oscalCliPath, ...fullArgs],
          { windowsVerbatimArguments: true }
        ];
      } else {
        spawnArgs = [oscalCliPath, fullArgs, {}];
      }

      const oscalCliProcess = spawn(...spawnArgs);

      let stdout = '';
      let stderr = '';

      // Indeterminate loading glyph
      const loadingGlyph = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let loadingIndex = 0;

      let loading: NodeJS.Timeout | null = null;
      if (showLoader) {
        loading = setInterval(() => {
          process.stdout.write(`\r\x1b[36m${loadingGlyph[loadingIndex]}\x1b[0m`);
          loadingIndex = (loadingIndex + 1) % loadingGlyph.length;
        }, 100);
      }

      oscalCliProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      oscalCliProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      oscalCliProcess.on('error', (error) => {
        if (loading) clearInterval(loading);
        reject(new Error(`Failed to start OSCAL CLI process: ${error.message}`));
      });

      oscalCliProcess.on('close', (code) => {
        if (loading) {
          clearInterval(loading);
          process.stdout.write('\r\x1b[K'); // Clear the loading glyph line
        }

        if (code === 0) {
          resolve([stdout, stderr]);
        } else {
          reject(new Error(`OSCAL CLI process exited with code ${code}:\n${stderr}`));
        }
      });
    }).catch(error => reject(error));
  });
};
export const validateWithSarif = async (args: string[]): Promise<Log> => {
  const tempFile = path.join(`oscal-cli-sarif-log-${v4()}.json`);
  const sarifArgs = [...args, '-o', tempFile, "--sarif-include-pass", '--show-stack-trace'];
  var consoleErr = ""
  try {
    const [out, err] = await executeOscalCliCommand('validate', sarifArgs, false);
    consoleErr = err;
    console.log(out);
    console.error(chalk.red(err));
  } catch (error) {
    console.error(chalk.red(error));
    if (!existsSync(tempFile)) {
      throw (consoleErr)
    }
    const sarifOutput = readFileSync(tempFile, 'utf8');
    rmSync(tempFile);
    return JSON.parse(sarifOutput) as Log;
  }
  try {
    const sarifOutput = readFileSync(tempFile, 'utf8');
    rmSync(tempFile);
    return JSON.parse(sarifOutput) as Log;
  } catch (error) {
    throw new Error(`Failed to read or parse SARIF output: ${error}`);
  }
};

const findOscalCliPath = async (): Promise<string> => {
  const command = process.platform === 'win32' ? 'where oscal-cli' : 'which oscal-cli';

  try {
    const { stdout } = await execPromise(command);
    const paths = stdout.trim().split('\n');
    if (paths.length > 0) {
      return paths[0]; // Return the first found path
    }
  } catch (error) {
    // Command failed or oscal-cli not found
  }

  throw new Error("OSCAL CLI not found");
};

program
  .version("1.3.5")
  .command('validate')
  .option('-f, --file <path>', 'Path to the OSCAL document or directory')
  .option('-e, --extensions <extensions>', 'List of extension namespaces')
  .option('-r, --recursive', 'Recursively validate files in directories')
  .description('Validate the OSCAL document(s)')
  .action(async (options: { file?: string, extensions?: string, recursive?: boolean }) => {
    let { file, extensions, recursive } = options;

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

    try {
      const stats = fs.statSync(file);
      if (stats.isDirectory()) {
        if (recursive) {
          await validateDirectoryRecursively(file, extensions);
        } else {
          await validateDirectory(file, extensions);
        }
      } else {
        if (recursive) {
          console.warn('The --recursive option is ignored for single files.');
        }
        await validateFile(file, extensions);
      }
    } catch (error) {
      console.error('Error during validation:', error);
      process.exit(1);
    }
  });

  async function validateDirectoryRecursively(dirPath: string, extensions?: string): Promise<boolean> {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        const subdirResult = await validateDirectoryRecursively(filePath, extensions);
        if (!subdirResult) return false; // Stop if validation failed in subdirectory
      } else if (isValidFileType(filePath)) {
        const fileResult = await validateFile(filePath, extensions);
        if (!fileResult) return false; // Stop if validation failed for this file
      }
    }
    return true; // All validations passed
  }

function isValidFileType(filePath: string): boolean {
  const validExtensions = ['.xml', '.json', '.yaml', '.yml'];
  return validExtensions.includes(path.extname(filePath).toLowerCase());
}

async function validateDirectory(dirPath: string, extensions?: string) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (!stats.isDirectory() && isValidFileType(filePath)) {
      await validateFile(filePath, extensions);
    }
  }
}


async function validateFile(filePath: string, extensions?: string): Promise<boolean> {
  console.log(chalk.cyan(`Validating file: ${filePath}`));
  try {
    const [documentType, fileType] = await detectOscalDocumentType(filePath);
    console.log(chalk.cyan(`Detected ${documentType} ${fileType}`));

    const args = [filePath, `--as=${fileType}`];

    if (extensions === 'fedramp' || extensions === 'https://fedramp.gov/ns/oscal') {
      const fedrampExtensionsPath = findFedrampExtensionsFile();
      if (fedrampExtensionsPath) {
        args.push('-c', fedrampExtensionsPath);
      } else {
        console.warn(chalk.yellow('FedRAMP extensions file not found. Proceeding without it.'));
      }
    } else if (extensions) {
      const extensionsList = extensions.split(',');
      args.push(...extensionsList.flatMap(x => ['-c', x]));
    }

    const result = await validateWithSarif(args) as any;
    if (result.runs[0].results.some(r => r.level === 'error')) {
      console.error(`Validation failed for ${filePath}`);
      parseSarifToErrorStrings(result).errors.forEach((error)=>{
        console.error(chalk.red(error));
      })
      return false;
    }
    console.log(`Validation passed for ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error validating ${filePath}:`, error);
    console.error(JSON.stringify(error));
    return false;
  }
}



function findFedrampExtensionsFile() {
  try {
    // Get the directory of the current module
    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDir = dirname(currentFilePath);

    // Construct the path to the extensions file
    // Adjust this path based on your package structure
    const extensionsPath = join(currentDir, '..', 'extensions', 'fedramp-external-constraints.xml');

    // Check if the file exists
    if (existsSync(extensionsPath)) {
      return extensionsPath;
    }
  } catch (error) {
    console.error('Error finding extensions file:', error);
  }

  // If we couldn't find the file, return null
  return null;
}

program.command('convert')
  .description('Convert an OSCAL document (XML, JSON, YAML)')
  .option('-f, --file <path>', 'Path to the OSCAL document or folder')
  .option('-o, --output <path>', 'Path to the output file or folder')
  .option('-t, --type <type>', 'JSON, YAML, or XML type setting when converting a directory')
  .action(async (options: { file?: string; output?: string; type?: string }) => {
    let { file, output, type } = options;

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
      await handleFolderConversion(file, output, type);
    } else {
      await handleSingleFileConversion(file, output);
    }
  });

async function handleFolderConversion(inputFolder: string, outputFolder: string, type?: string): Promise<void> {
  console.log("Converting folder");
  const validTypes = ['json', 'yaml', 'xml'];
  const outputFormats = type && validTypes.includes(type.toLowerCase())
    ? [type.toLowerCase()]
    : validTypes;

  for (const format of outputFormats) {
    const formatOutputFolder = type
      ? outputFolder
      : path.join(outputFolder, format);
    fs.mkdirSync(formatOutputFolder, { recursive: true });

    const files = fs.readdirSync(inputFolder);
    for (const inputFile of files) {
      const inputPath = path.join(inputFolder, inputFile);
      const outputPath = path.join(formatOutputFolder, `${path.parse(inputFile).name}.${format}`);
      const inputFileExtension = path.extname(inputPath).toLowerCase().slice(1);
      if (validTypes.includes(inputFileExtension)) {
        await convertFile(inputPath, outputPath, format);
      }
    }
  }
}

async function handleSingleFileConversion(inputFile: string, output: string): Promise<void> {
  const outputExt = path.extname(output).toLowerCase();
  if (['.json', '.yaml', '.xml'].includes(outputExt)) {
    // If output has a valid extension, treat it as a file
    const outputFormat = outputExt.slice(1);
    await convertFile(inputFile, output, outputFormat);
  } else {
    // If output doesn't have a valid extension, treat it as a folder
    const [_, inputFormat] = await detectOscalDocumentType(inputFile);
    const outputFormats = ['json', 'yaml', 'xml'];

    for (const format of outputFormats) {
      const outputFolder = path.join(output, format);
      fs.mkdirSync(outputFolder, { recursive: true });

      const outputFile = path.join(outputFolder, `${path.parse(inputFile).name}.${format}`);
      await convertFile(inputFile, outputFile, format);
    }
  }
}

async function convertFile(inputFile: string, outputFile: string, outputFormat: string): Promise<void> {
  const [documentType, fileType] = await detectOscalDocumentType(inputFile);
  const args = [`--to=${outputFormat}`, inputFile, outputFile, "--overwrite"];
  const [result, errors] = await executeOscalCliCommand("convert", args);
  if (errors) console.error(errors);
}

// program
//   .command('generate')
//   .description('Generate an OSCAL document using OpenAI API')
//   .option('-t, --type <oscal-type>', 'OSCAL-TYPE to generate')
//   .option('-f, --format <oscal-format>', 'OSCAL-FORMAT (XML,JSON) to generate')
//   .option('-p, --prompt <path>', 'Prompt for generating the document')
//   .action(generateOSCALDocument);



program.command('resolve')
  .description('Resolve an OSCAL profile (XML, JSON, YAML)')
  .option('-f, --file <path>', 'Path to the OSCAL profile document')
  .option('-o, --output <path>', 'Path to the output file')
  .action(async (options: { file?: string; output?: string }) => {
    let { file, output } = options;

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

      const args = ["--to=" + outputType, file, output, "--overwrite"];
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
  });


program.command('scaffold')
  .option('-o, --output <path>', 'Path to the output')
  .description('Scaffold an OSCAL package')
  .action(scaffold);

export const run = () => {
  isOscalCliInstalled()
    .then((installed) => {
      if (!installed) {
        return installOscalCli();
      }
    })
    .then(() => {
      program.parse(process.argv);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
