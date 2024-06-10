import { program } from 'commander';
import fs from 'fs';
import xml2js from 'xml2js';
import { exec, spawn } from 'child_process';
import inquirer from 'inquirer';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to detect the OSCAL document type
const detectOscalDocumentType = (filePath) => {
  console.log("Reading document at " + filePath);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const parser = new xml2js.Parser();

  return new Promise((resolve, reject) => {
    parser.parseString(fileContent, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const rootElement = Object.keys(result)[0];
        let documentType;

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

        resolve(documentType);
      }
    });
  });
}
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
const executeOscalCliCommand = (command, args) => {
  return new Promise((resolve, reject) => {
    const oscalCliPath = './oscal-cli/bin/oscal-cli';
    const fullArgs = [command, ...args];
    const oscalCliProcess = spawn(oscalCliPath, fullArgs);

    let stdout = '';
    let stderr = '';

    oscalCliProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    oscalCliProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    oscalCliProcess.on("disconnect",()=>{
      reject(new Error(`OSCAL CLI process disconnected`));
    })
    oscalCliProcess.on("message",(message)=>{
      console.log(message);
    })
    oscalCliProcess.on('close', (code) => {
      if (code === 0) {
        resolve(stdout+stderr);
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
    console.log('Validating OSCAL document at ', file);

    detectOscalDocumentType(file)
      .then((command) => {
        // Execute the OSCAL CLI command
        const args = ["validate", file];
        executeOscalCliCommand(command, args);
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
  .action((options) => {
    const { file, output } = options;
    // Logic for conversion command
    console.log('Converting OSCAL document ' + file, " => " + output);

    // Determine the input and output file extensions
    const inputExtension = path.extname(file).toLowerCase();
    const outputExtension = path.extname(output).toLowerCase();

    // Determine the conversion command based on the file extensions
    let toArg;
    if (inputExtension === '.xml' && outputExtension === '.json') {
      toArg = '--to=json';
    } else if (inputExtension === '.json' && outputExtension === '.xml') {
      toArg = '--to=xml';
    } else {
      console.error('Invalid file extension for conversion.');
      process.exit(1);
    }

    // Execute the OSCAL CLI conversion command
    const args = ["convert", toArg, file, output];
    detectOscalDocumentType(file).then((command) => {
      executeOscalCliCommand(command, args);
    })
  });


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
