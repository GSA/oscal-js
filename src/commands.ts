import { ChildProcess, exec, execSync, spawn } from 'child_process';
import { program } from 'commander';
import fs, { existsSync, readFileSync, rmSync } from 'fs';
import inquirer from 'inquirer';
import yaml from 'js-yaml'; // Make sure to import js-yaml
import path, { dirname, join } from 'path';
import { Log } from "sarif";
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { v4 } from 'uuid';
import xml2js from 'xml2js';
import { scaffold } from './scaffold.js';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type OscalDocumentType = 'catalog' | 'profile' | 'component-definition' | 'ssp' | 'metaschema'|'poam'|'ar'|'ap';
type FileFormat = 'xml' | 'json'|'yaml';


export async function detectOscalDocumentType(filePath: string): Promise<[OscalDocumentType, FileFormat]> {
  const fileExtension = path.extname(filePath).toLowerCase();
  
  if (!['.xml', '.json','.yaml','.yml'].includes(fileExtension)) {
    throw new Error('Unsupported file format. Only XML YAML and JSON are supported.');
  }

  const fileContent = (await readFileSync(filePath)).toString();

  if (fileExtension === '.xml') {
    return parseXmlDocument(fileContent);
  } else if (fileExtension ===".json") {
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

// Function to check if the OSCAL CLI is installed
export const isOscalCliInstalled = (): Promise<boolean> => {
  return new Promise((resolve) => {
    exec('which oscal-cli', (error) => {
      if (!error) {
        resolve(true);
      } else {
        const oscalCliInstallPath = './oscal-cli/';
        resolve(fs.existsSync(oscalCliInstallPath));
      }
    });
  });
};

export const isJavaInstalled = (): Promise<boolean> => {
  return new Promise((resolve) => {
    exec('which java', (error) => {
      if (!error) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export const installOscalCli = (): void => {
  const oscalCliInstallUrl = `https://codeload.github.com/wandmagic/oscal/zip/refs/heads/cli`;
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const localPath = path.join(homeDir as string, '.local');
  const localBinPath = path.join(localPath, 'bin');
  const oscalCliPath = path.join(localPath, 'oscal-cli');
  const extractedCliPath = path.join(oscalCliPath, 'oscal-cli');
  const oscalCliExecutablePath = path.join(extractedCliPath, 'bin', 'oscal-cli');
  const zipFilePath = path.join(localPath, 'oscal-cli.zip');
  const isWindows = process.platform === 'win32';

  try {
    // Create .local/bin and .local/oscal-cli directories if they don't exist
    fs.mkdirSync(localBinPath, { recursive: true });
    fs.mkdirSync(oscalCliPath, { recursive: true });

    // Download the zip file
    console.log(`Downloading OSCAL CLI...`);
    execSync(`curl -sSLo ${zipFilePath} ${oscalCliInstallUrl}`);

    // Unzip the file to .local/oscal-cli
    console.log(`Extracting OSCAL CLI...`);
    execSync(isWindows ? `expand ${zipFilePath} -F:* ${oscalCliPath}` : `unzip -o ${zipFilePath} -d ${oscalCliPath}`);

    // Make the CLI executable (for non-Windows systems)
    if (!isWindows) {
      execSync(`chmod +x ${oscalCliExecutablePath}`);
    }

    // Create a symbolic link (alias) in .local/bin
    const sourceFile = isWindows ? `${oscalCliExecutablePath}.bat` : oscalCliExecutablePath;
    const aliasPath = path.join(localBinPath, 'oscal-cli' + (isWindows ? '.bat' : ''));
    
    if (fs.existsSync(aliasPath)) {
      fs.unlinkSync(aliasPath); // Remove existing symlink if it exists
    }

    if (isWindows) {
      // For Windows, use mklink command to create a symbolic link
      execSync(`mklink "${aliasPath}" "${sourceFile}"`, { shell: 'cmd.exe' });
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
export type stdIn=string;
export type stdErr=string;
export const executeOscalCliCommand = async (command: string, args: string[], showLoader: boolean = false): Promise<[stdIn,stdErr]> => {
  return new Promise((resolve, reject) => {
    findOscalCliPath().then(oscalCliPath => {
      const fullArgs = [command, ...args];
      console.log("oscal-cli "+fullArgs.join(" "))
      const oscalCliProcess: ChildProcess = spawn(oscalCliPath, fullArgs);

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

      oscalCliProcess.on('disconnect', () => {
        if (loading) clearInterval(loading);
        reject(new Error(`OSCAL CLI process disconnected`+stderr));
      });

      oscalCliProcess.on('message', (message) => {
        stdout += message.toString();
      });
      oscalCliProcess.on('close', (code) => {
        if (loading) {
          clearInterval(loading);
          process.stdout.write('\r\x1b[K'); // Clear the loading glyph line
        }

        if (code === 0) {
          resolve([stdout,stderr]);
        } else {
          reject(new Error(`OSCAL CLI process exited with code ${code}:\n${stderr}`));
        }
      });
    }).catch(error => reject(error));
  });
};
export const validateWithSarif = async ( args: string[]): Promise<Log> => {
  const tempFile = path.join(`oscal-cli-sarif-log-${v4()}.json`);
  const sarifArgs = [...args, '-o', tempFile,"--sarif-include-pass",'--show-stack-trace'];
  var consoleErr=""
  try {
    const [out,err]=await executeOscalCliCommand('validate', sarifArgs, false);
    console.error(err);
    consoleErr = err;
    console.log(out);
  } catch (error) {
    if(!existsSync(tempFile)){
      throw(consoleErr)
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
  try {
    const { stdout } = await execPromise('which oscal-cli');
    return stdout.trim();
  } catch (error) {
    // If 'which' command fails, fall back to the local path
    return './oscal-cli/bin/oscal-cli';
  }
};

program
.version("1.3.0")
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

async function validateDirectoryRecursively(dirPath: string, extensions?: string) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      await validateDirectoryRecursively(filePath, extensions);
    } else if (isValidFileType(filePath)) {
      await validateFile(filePath, extensions);
    }
  }
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


async function validateFile(filePath: string, extensions?: string) {
  console.log(`Validating file: ${filePath}`);
  try {
    const [documentType, fileType] = await detectOscalDocumentType(filePath);
    console.log(`Detected ${documentType} ${fileType}`);

    const args = [filePath, `--as=${fileType}`];

    if (extensions === 'fedramp' || extensions === 'https://fedramp.gov/ns/oscal') {
      const fedrampExtensionsPath = findFedrampExtensionsFile();
      if (fedrampExtensionsPath) {
        args.push('-c', fedrampExtensionsPath);
      } else {
        console.warn('FedRAMP extensions file not found. Proceeding without it.');
      }
    } else if (extensions) {
      const extensionsList = extensions.split(',');
      args.push(...extensionsList.flatMap(x => ['-c', x]));
    }

    //const result =
    await validateWithSarif(args);
    // console.log(`Validation result for ${filePath}:`, result);
  } catch (error) {
    console.error(`Error validating ${filePath}:`, error);
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

      const args = ["--to=" + outputType, file, output,"--overwrite"];
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
