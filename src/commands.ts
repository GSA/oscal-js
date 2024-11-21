import { program } from 'commander';
import { convertCommand } from './convert.js';
import { installOscalExecutor, isOscalExecutorInstalled } from './env.js';
import { evaluateMetapathCommand } from './evaluate.js';
import { resolveProfileCommand } from './resolve.js';
import { scaffoldCommand } from './scaffold.js';
import { serverCommand } from './server.js';
import { validateCommand } from './validate.js';
import { useCommand } from './versions.js';

program
  .version("2.0.7.rc2")
  .command('validate [file]')
  .option('-s, --server', 'Use OSCAL server for operations')
  .option('-f, --file <path>', 'Path to the OSCAL document or directory')
  .option('-e, --extensions <extensions...>', 'List of extension namespaces')
  .option('-m, --module <module_path>', 'Metaschema module uri (future builds)')
  .option('-r, --recursive', 'Recursively validate files in directories')
  .option('-q, --quiet', 'Only Return Errors')
  .option('-d, --disableSchema', 'Disable Schema validation')
  .description('Validate the OSCAL document(s)')
  .action(validateCommand);


program.command('convert [file]')
  .description('Convert an OSCAL document (XML, JSON, YAML)')
  .option('-s, --server', 'Use OSCAL server for operations')
  .option('-f, --file <path>', 'Path to the OSCAL document or folder')
  .option('-o, --output <path>', 'Path to the output file or folder')
  .option('-t, --type <type>', 'JSON, YAML, or XML type setting when converting a directory')
  .action(convertCommand);

program.command('resolve [file]')
  .description('Resolve an OSCAL profile (XML, JSON, YAML)')
  .option('-s, --server', 'Use OSCAL server for operations')
  .option('-f, --file <path>', 'Path to the OSCAL profile document')
  .option('-o, --output <path>', 'Path to the output file')
  .action(resolveProfileCommand);

  program
  .command('use [version]')
  .description('Install or switch to a specific OSCAL CLI version')
  .action(useCommand);

program.command('scaffold')
  .option('-o, --output <path>', 'Path to the output')
  .description('Scaffold an OSCAL package')
  .action(scaffoldCommand);

program.command('server [command]')
.option('-c, --command <cmd>', 'server command')
.option('-t, --tag <tag>', 'server tag')
.option('-bg, --background', 'start in the background')
.description('Start OSCAL Server')
.action(serverCommand);


program.command('metaquery [document]')
  .option('-s, --server', 'Use OSCAL server for operations')
  .option('-e, --expression <path>', 'Path to the output')
  .option('-i, --document <path>', 'Path to the document')
  .option('-m, --metaschema <path>', 'Path to the metaschema-module')
  .description('Evaluate metapath query against an oscal document')
  .action(evaluateMetapathCommand);

  export const run = () => {
    const args = process.argv.slice(2);
    const command = args[0];
  
    if (command === 'use'||command=='server'||command=='scaffold'||args.includes("-s")||args.includes("--server")) {
      // If the command is 'use', directly parse the arguments without checking for OSCAL CLI installation
      program.parse(process.argv);
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