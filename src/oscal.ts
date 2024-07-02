import { program } from 'commander';
import fs, { readFileSync, rmSync } from 'fs';
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
import { sarifSchema } from './schema/sarif';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type OscalDocumentType = 'catalog' | 'profile' | 'component-definition' | 'ssp' | 'metaschema';
type FileFormat = 'xml' | 'json';


// Function to detect the OSCAL document type and file format
export const detectOscalDocumentType = (filePath: string): Promise<[OscalDocumentType, FileFormat]> => {
  console.log("Reading document at " + filePath);
  const fileExtension = path.extname(filePath).toLowerCase();
  let documentType: OscalDocumentType;
  let fileFormat: FileFormat;

  if (fileExtension === '.xml') {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parser = new xml2js.Parser();

    return new Promise((resolve, reject) => {
      parser.parseString(fileContent, (err: Error | null, result: any) => {
        if (err) {
          reject(err);
        } else {
          const rootElement = Object.keys(result)[0];

          switch (rootElement) {
            case 'catalog':
              documentType = 'catalog';
              break;
            case 'profile':
              documentType = 'profile';
              break;
            case 'component-definition':
              documentType = 'component-definition';
              break;
            case 'system-security-plan':
              documentType = 'ssp';
              break;
            default:
              documentType = 'metaschema';
              break;
          }

          fileFormat = 'xml';
          resolve([documentType, fileFormat]);
        }
      });
    });
  } else if (fileExtension === '.json') {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    const rootElement = Object.keys(jsonData)[0];

    switch (rootElement) {
      case 'catalog':
        documentType = 'catalog';
        break;
      case 'profile':
        documentType = 'profile';
        break;
      case 'component-definition':
        documentType = 'component-definition';
        break;
      case 'system-security-plan':
        documentType = 'ssp';
        break;
      default:
        documentType = 'metaschema';
        break;
    }

    fileFormat = 'json';
    return Promise.resolve([documentType, fileFormat]);
  } else {
    return Promise.reject(new Error('Unsupported file format. Only XML and JSON are supported.'));
  }
};

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

// Function to install the OSCAL CLI
export const installOscalCli = (): void => {
  const oscalCliInstallUrl = `https://codeload.github.com/wandmagic/oscal/zip/refs/heads/cli`;
  const oscalCliInstallPath = './oscal-cli';
  const zipFilePath = './oscal-cli.zip';

  try {
    // Download the zip file
    execSync(`curl -o ${zipFilePath} ${oscalCliInstallUrl}`);

    // Unzip the file
    execSync(`unzip -o ${zipFilePath}`);

    // Make the CLI executable
    execSync(`chmod +x ${oscalCliInstallPath}/bin/oscal-cli`);

    // Delete the zip file
    fs.unlinkSync(zipFilePath);
  } catch (error:any) {
    throw new Error(`Failed to install OSCAL CLI: ${error.message}`);
  }
};

const execPromise = promisify(exec);

export const executeOscalCliCommand = async (command: string, args: string[], showLoader: boolean = true): Promise<string> => {
  return new Promise((resolve, reject) => {
    findOscalCliPath().then(oscalCliPath => {
      const fullArgs = [command, ...args];
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
          resolve(stdout);
        } else {
          console.error(stdout);
          reject(new Error(`OSCAL CLI process exited with code ${code}:\n${stderr}`));
        }
      });
    }).catch(error => reject(error));
  });
};
export const validateWithSarif = async ( args: string[]): Promise<Log> => {
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

const findOscalCliPath = async (): Promise<string> => {
  try {
    const { stdout } = await execPromise('which oscal-cli');
    return stdout.trim();
  } catch (error) {
    // If 'which' command fails, fall back to the local path
    return './oscal-cli/bin/oscal-cli';
  }
};
// Commander.js configuration
program
  .version('1.0.0')
  .description('OSCAL CLI')
  .command('validate')
  .option('-f, --file <path>', 'Path to the OSCAL document')
  .description('Validate the OSCAL document')
  .action((options: { file?: string }) => {
    const { file } = options;
    if (typeof file === 'undefined') {
      console.log("use -f or --file to specify the file");
      return;
    }
    console.log('Begin OSCAL document validation at ', file);

    detectOscalDocumentType(file)
      .then(async ([documentType, fileType]) => {
        console.log("Detected " + documentType + " " + fileType);
        // Execute the OSCAL CLI command
        const args = [documentType, file, "--as=" + fileType];
        const output = await executeOscalCliCommand('validate', args);
      })
      .catch((error) => {
        console.error('Error detecting OSCAL document type:', error);
        process.exit(1);
      });
  });

program.command('convert')
  .description('Convert an OSCAL document (XML,JSON)')
  .option('-f, --file <path>', 'Path to the OSCAL document')
  .option('-o, --output <path>', 'Path to the output')
  .option('-v, --verbosity <level>', 'logging level [debug,info,warning,error,silent]')
  .action((options: { file?: string; output?: string }) => {
    const { file, output } = options;
    if (!file || !output) {
      console.log("Both --file and --output are required");
      return;
    }
    console.info('Converting OSCAL document ' + file, " => " + output);
    // Execute the OSCAL CLI conversion command
    detectOscalDocumentType(file).then(async ([command, fileType]) => {
      const args = [command, "--to=" + fileType, file, output];
      const result = await executeOscalCliCommand("convert", args);
      console.log(result);
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
