import { program } from 'commander';
import yaml from 'js-yaml'; // Make sure to import js-yaml
import fs, { existsSync, readFileSync, rmSync, symlinkSync, unlinkSync } from 'fs';
import xml2js from 'xml2js';
import { exec, spawn, ChildProcess } from 'child_process';
import inquirer from 'inquirer';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Log, Run } from "sarif"
import { OpenAI } from 'openai';
import { promisify } from 'util';
import { v4 as uuidv4, v4 } from 'uuid';
import { execSync } from 'child_process';

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

  try {
    // Create .local/bin and .local/oscal-cli directories if they don't exist
    fs.mkdirSync(localBinPath, { recursive: true });
    fs.mkdirSync(oscalCliPath, { recursive: true });

    // Download the zip file
    console.log(`Downloading OSCAL CLI...`);
    execSync(`curl -L -o ${zipFilePath} ${oscalCliInstallUrl}`);

    // Unzip the file to .local/oscal-cli
    console.log(`Extracting OSCAL CLI...`);
    execSync(`unzip -o ${zipFilePath} -d ${oscalCliPath}`);

    // Make the CLI executable
    execSync(`chmod +x ${oscalCliExecutablePath}`);

    // Create a symbolic link (alias) in .local/bin
    const aliasPath = path.join(localBinPath, 'oscal-cli');
    if (fs.existsSync(aliasPath)) {
      fs.unlinkSync(aliasPath); // Remove existing symlink if it exists
    }
    fs.symlinkSync(oscalCliExecutablePath, aliasPath);

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
  .version('1.2.1')
  .description('OSCAL CLI')
  .command('validate')
  .option('-f, --file <path>', 'Path to the OSCAL document')
  .option('-e, --extensions <extensions>', 'List of extension namespaces')
  .description('Validate the OSCAL document')
  .action((options: { file?: string, extensions?: string }) => {
    const { file, extensions } = options;
    if (typeof file === 'undefined') {
      console.log("use -f or --file to specify the file");
      return;
    }

    console.log('Beginning OSCAL document validation at', file);

    detectOscalDocumentType(file)
      .then(async ([documentType, fileType]) => {
        console.log("Detected " + documentType + " " + fileType);

        // Prepare arguments for the OSCAL CLI command
        const args = [file, "--as=" + fileType];

        // Handle FedRAMP extensions
        if (extensions === 'fedramp' || extensions === 'https://fedramp.gov/ns/oscal') {
          const fedrampExtensionsPath = findFedrampExtensionsFile();
          if (fedrampExtensionsPath) {
            args.push('-c', fedrampExtensionsPath);
          } else {
            console.warn('FedRAMP extensions file not found. Proceeding without it.');
          }
        } else if (extensions) {
          // Handle other extensions
          const extensionsList = extensions.split(',');
          args.push(...extensionsList.flatMap(x => ['-c', x]));
        }

        try {
          const result = await validateWithSarif(args);
          console.log('Validation result:', result);
        } catch (error) {
          console.error('Error during validation:', error);
        }
      })
      .catch((error) => {
        console.error('Error detecting OSCAL document type:', error);
        process.exit(1);
      });
  });

function findFedrampExtensionsFile(): string | null {
  // Get the directory of the current script
  const currentDir = path.dirname(require.main?.filename || '');
  
  // Go up one directory (assuming we're in a 'dist' folder)
  const parentDir = path.dirname(currentDir);
  
  // Construct the path to the extensions file
  const extensionsPath = path.join(parentDir, 'extensions', 'fedramp-external-constraints.xml');
  
  // Check if the file exists
  if (fs.existsSync(extensionsPath)) {
    return extensionsPath;
  } else {
    return null;
  }
}
program.command('convert')
  .description('Convert an OSCAL document (XML,JSON,YAML)')
  .option('-f, --file <path>', 'Path to the OSCAL document')
  .option('-o, --output <path>', 'Path to the output')
  .action((options: { file?: string; output?: string }) => {
    const { file, output } = options;
    if (!file || !output) {
      console.log("Both --file and --output are required");
      return;
    }
    // Execute the OSCAL CLI conversion command
    detectOscalDocumentType(file).then(async ([documentType, fileType]) => {

      const args = [ "--to=" + fileType, file, output,"--overwrite"];
      const [result,errors] = await executeOscalCliCommand("convert", args);
      errors&&console.error(errors);
    });
  });

export async function getOpenAIKey(): Promise<string> {
  const openaiKey = process.env.OPENAI_KEY;

  if (openaiKey) {
    return openaiKey;
  } else {
    console.log("inquiring");
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Please enter your OpenAI API key:',
      },
    ]);
    return answers.apiKey;
  }
}

interface GenerateOptions {
  prompt?: string;
  type?: string;
  format?: string;
}

export async function generateOSCALDocument(options: GenerateOptions) {
  const { prompt, type, format } = options;
  console.log("Generating " + type);
  if (!prompt || !type || !format) {
    console.log("Missing parameters");
    !type && console.log("Please enter oscal -type (ssp,etc)");
    !format && console.log("Please enter oscal -format (xml,json)");
    !prompt && console.log("Describe your oscal item -prompt");
    return;
  }
  try {
    const apiKey = await getOpenAIKey();

    // Set up OpenAI API configuration
    const openAi = new OpenAI({
      apiKey: apiKey,
    });

    // Call the OpenAI API to generate the document
    const stream = await openAi.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Please generate an oscal ${type} in ${format} with content: ${prompt}` }],
      stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
  } catch (error) {
    console.error('Error generating OSCAL document:', error);
  }
}

program
  .command('generate')
  .description('Generate an OSCAL document using OpenAI API')
  .option('-t, --type <oscal-type>', 'OSCAL-TYPE to generate')
  .option('-f, --format <oscal-format>', 'OSCAL-FORMAT (XML,JSON) to generate')
  .option('-p, --prompt <path>', 'Prompt for generating the document')
  .action(generateOSCALDocument);



  program.command('resolve')
  .description('Resolve an OSCAL profile (XML,JSON)')
  .option('-f, --file <path>', 'Path to the OSCAL document')
  .option('-o, --output <path>', 'Path to the output')
  .action((options: { file?: string; output?: string }) => {
    const { file, output } = options;
    if (!file || !output) {
      console.log("Both --file and --output are required");
      return;
    }
    // Execute the OSCAL CLI conversion command
    detectOscalDocumentType(file).then(async ([_, fileType]) => {
      const args = [ "--to=" + fileType, file, output];
      const result = await executeOscalCliCommand("resolve-profile", args);
      console.log(result);
    });
  });



interface ScaffoldOptions {
  output?: string;
}

export const scaffold = async (options: ScaffoldOptions) => {
  console.log('Scaffolding OSCAL document');

  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select the OSCAL template:',
      choices: ['fedramp', 'nist'],
    },
  ]);
  const { baseline } = await inquirer.prompt([
    {
      type: 'list',
      name: 'baseline',
      message: 'Select the OSCAL baseline:',
      choices: ['HIGH', 'MODERATE', 'LOW'],
    },
  ]);

  let outputPath = options.output as string;
  if (!outputPath) {
    const { output } = await inquirer.prompt([
      {
        type: 'input',
        name: 'output',
        message: 'Enter the output path:',
        default: './',
      },
    ]);
    outputPath = output;
  }

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const templatePath = path.join(__dirname, 'templates', template);
  const destinationPath = path.join(outputPath, template);
  console.log(`Copying "${templatePath}" => "${destinationPath}".`);
  fs.cpSync(templatePath, destinationPath, { recursive: true });
  console.log(`OSCAL template "${template}" scaffolded successfully at "${destinationPath}".`);
};

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
