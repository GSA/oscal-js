import { program } from 'commander';
import fs from 'fs';
import xml2js from 'xml2js';
import { exec, spawn } from 'child_process';
import inquirer from 'inquirer';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {  OpenAI } from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to detect the OSCAL document type and file format
const detectOscalDocumentType = (filePath) => {
  console.log("Reading document at " + filePath);
  const fileExtension = path.extname(filePath).toLowerCase();
  let documentType;
  let fileFormat;

  if (fileExtension === '.xml') {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parser = new xml2js.Parser();

    return new Promise((resolve, reject) => {
      parser.parseString(fileContent, (err, result) => {
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
          resolve([documentType, fileFormat ]);
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
    return Promise.resolve([documentType, fileFormat ]);
  } else {
    return Promise.reject(new Error('Unsupported file format. Only XML and JSON are supported.'));
  }
};
// Function to check if the OSCAL CLI is installed
const isOscalCliInstalled = () => {
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

// Function to install the OSCAL CLI
const installOscalCli = () => {
  return new Promise((resolve, reject) => {
    const oscalCliVersion = '1.0.3';
    const oscalCliInstallUrl = `https://repo1.maven.org/maven2/gov/nist/secauto/oscal/tools/oscal-cli/cli-core/${oscalCliVersion}/cli-core-${oscalCliVersion}-oscal-cli.zip`;
    const oscalCliInstallPath = './oscal-cli/';

    exec(`mkdir -p ${oscalCliInstallPath}`, (error) => {
      if (error) {
        reject(error);
        return;
      }

      exec(`curl -o ${oscalCliInstallPath}/oscal-cli.zip ${oscalCliInstallUrl}`, (error) => {
        if (error) {
          reject(error);
          return;
        }

        exec(`unzip -o ${oscalCliInstallPath}/oscal-cli.zip -d ${oscalCliInstallPath}`, (error) => {
          if (error) {
            reject(error);
            return;
          }

          exec(`chmod +x ${oscalCliInstallPath}/bin/oscal-cli`, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      });
    });
  });
}

// Function to execute the Java OSCAL CLI command
const executeOscalCliCommand = (command, args,showLoader=true) => {
  return new Promise((resolve, reject) => {
    const oscalCliPath = './oscal-cli/bin/oscal-cli';
    const fullArgs = [command, ...args];
    const oscalCliProcess = spawn(oscalCliPath, fullArgs);

    let stdout = '';
    let stderr = '';
    // Indeterminate loading glyph
    const loadingGlyph = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let loadingIndex = 0;

    const loading = setInterval(() => {
      process.stdout.write(`\r\x1b[36m${loadingGlyph[loadingIndex]}\x1b[0m`);
      loadingIndex = (loadingIndex + 1) % loadingGlyph.length;
    }, 100);
    oscalCliProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    oscalCliProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    oscalCliProcess.on('disconnect', () => {
      clearInterval(loading);
      reject(new Error(`OSCAL CLI process disconnected`));
    });

    oscalCliProcess.on('message', (message) => {
      console.log(message);
    });

    oscalCliProcess.on('close', (code) => {
      clearInterval(loading);
      process.stdout.write('\r\x1b[K'); // Clear the loading glyph line

      if (code === 0) {
        resolve(stdout + stderr);
      } else {
        reject(new Error(`OSCAL CLI process exited with code ${code}:\n${stderr}`));
      }
    });
  });
};

// Commander.js configuration
program
  .version('1.0.0')
  .description('OSCAL CLI')
  .command('validate')
  .option('-f, --file <path>', 'Path to the OSCAL document')
  .description('Validate the OSCAL document')
  .action((options) => {
    const { file } = options;
    // Logic for validation command
    if(typeof file==='undefined'){
      console.log("use -f or --file to specify the file");
      return;
    }
    console.log('Begin OSCAL document validation at ', file);

    detectOscalDocumentType(file)
      .then(async ([command,fileType]) => {
        console.log("Detected "+command+" "+fileType);
        // Execute the OSCAL CLI command
        const args = ["validate", file,"--as="+fileType];
        const output=await executeOscalCliCommand(command, args);
        console.log(output);
      })
      .catch((error) => {
        console.error('Error detecting OSCAL document type:', error);
        process.exit(1);
      });
    // Access options using options.file and options.output
  });




program.command('convert')
  .description('Convert an OSCAL document (XML,JSON)')
  .option('-f, --file <path>', 'Path to the OSCAL document')
  .option('-o, --output <path>', 'Path to the output')
  .option('-v, --verbosity <level>', 'logging level [debug,info,warning,error,silent]')
  .action((options) => {
    const { file, output } = options;
    // Logic for conversion command
    console.info('Converting OSCAL document ' + file, " => " + output);
    // Execute the OSCAL CLI conversion command
    detectOscalDocumentType(file).then(async ([command,fileType]) => {
      const args = ["convert", "--to="+fileType, file, output];
      const result=await executeOscalCliCommand(command, args);
      console.log(result);
    })
  });

  
  async function getOpenAIKey() {
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
  
  async function generateOSCALDocument(options) {
    const { prompt, type,format } = options;
    console.log("Generating "+type);
    if(!prompt||!type||!format){
      console.log("Missing parameters");
      !type && console.log("Please enter oscal -type (ssp,etc)")
      !format && console.log("Please enter oscal -format (xml,json)")
      !prompt && console.log("Describe your oscal item -prompt")
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
        messages:[{ role: 'user', content: `Please generate an oscal ${type} in ${format} with content: ${prompt}` }],
        stream: true,
      });
      for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
      }
      // Get the generated document from the API response
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
  

export const scaffold = async (options) => {
  // Logic for scaffolding command
  console.log('Scaffolding OSCAL document');

  // Prompt the user to select the OSCAL template
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

  // Prompt the user for the output path if not provided as an option
  let outputPath = options.output;
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

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Copy the entire template directory to the output path
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
        // Install the OSCAL CLI if not found
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

export { detectOscalDocumentType, isOscalCliInstalled, installOscalCli, executeOscalCliCommand };
