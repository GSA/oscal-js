import { program } from 'commander';
import { convertCommand } from './convert.js';
import { installOscalExecutor, isOscalExecutorInstalled} from './env.js';
import { evaluateMetapathCommand } from './evaluate.js';
import { resolveProfileCommand } from './resolve.js';
import { scaffold } from './scaffold.js';
import { checkServerStatus, serverCommand, startServer, stopServer } from './server.js';
import { validateCommand } from './validate.js';
import { useVersion } from './versions.js';

program
  .version("1.4.8")
  .command('validate [file]')
  .option('-s, --use-server', 'Use OSCAL server for operations')
  .option('-f, --file <path>', 'Path to the OSCAL document or directory')
  .option('-e, --extensions <extensions>', 'List of extension namespaces')
  .option('-r, --recursive', 'Recursively validate files in directories')
  .description('Validate the OSCAL document(s)')
  .action(validateCommand);


program.command('convert [file]')
  .description('Convert an OSCAL document (XML, JSON, YAML)')
  .option('-s, --use-server', 'Use OSCAL server for operations')
  .option('-f, --file <path>', 'Path to the OSCAL document or folder')
  .option('-o, --output <path>', 'Path to the output file or folder')
  .option('-t, --type <type>', 'JSON, YAML, or XML type setting when converting a directory')
  .action(convertCommand);

program.command('resolve [file]')
  .description('Resolve an OSCAL profile (XML, JSON, YAML)')
  .option('-s, --use-server', 'Use OSCAL server for operations')
  .option('-f, --file <path>', 'Path to the OSCAL profile document')
  .option('-o, --output <path>', 'Path to the output file')
  .action(resolveProfileCommand);

  program
  .command('use [version]')
  .description('Install or switch to a specific OSCAL CLI version')
  .action(useVersion);

program.command('scaffold')
  .option('-o, --output <path>', 'Path to the output')
  .description('Scaffold an OSCAL package')
  .action(scaffold);

program.command('server [command]')
.option('-b,--background', 'Start the OSCAL server')
.addHelpText('afterAll', 'commands: [start,stop,status,health,restart]')
.description('Start OSCAL Server')
.action(serverCommand);


program.command('metaquery')
  .option('-e, --expression <path>', 'Path to the output')
  .option('-i, --document <path>', 'Path to the document')
  .option('-m, --metaschema <path>', 'Path to the metaschema-module')
  .description('Evaluate metapath query against an oscal document')
  .action(evaluateMetapathCommand);

  export const run = () => {
    const args = process.argv.slice(2);
    const command = args[0];
  
    if (command === 'use') {
      // If the command is 'use', directly parse the arguments without checking for OSCAL CLI installation
      program.parse(process.argv);
    } else if (command==='server'||args.includes("-s")||args.includes("--use-server")){
      isOscalExecutorInstalled('oscal-server')
        .then((installed) => {
          if (!installed) {
            return installOscalExecutor('oscal-server');
          }
        })
        .then(() => {
          program.parse(process.argv);
        })
        .catch((error) => {
          console.error('Error:', error);
          process.exit(1);
        });      
    }else {
      // For all other commands, check for OSCAL CLI installation first
      isOscalExecutorInstalled('oscal-cli')
        .then((installed) => {
          if (!installed) {
            return installOscalExecutor('oscal-cli');
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
  };