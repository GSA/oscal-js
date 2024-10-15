import inquirer from "inquirer";
import { getVersionsFromMaven } from "./maven.js";
import chalk from "chalk";
import { installOscalCli } from "./env.js";

export const useCommand = async (version) => {
    const {versions}= await getVersionsFromMaven();
    if (!version) {
      const choices = (versions.reverse()).map(v => ({
        name: v,
        value: v
      }))
      
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedVersion',
          message: 'Select the OSCAL CLI version to install:',
          choices: [{ name: 'latest', value: 'latest' },...choices, ]
        }
      ]);
      
      version = answer.selectedVersion;
    }
    
    if (!versions.includes(version) && version !== 'latest') {
      console.error(chalk.red(`Unknown version: ${version}`));
      console.log(chalk.yellow('Available versions:'));
      Object.keys(versions).forEach(v => console.log(chalk.blue(`- ${v}`)));
      console.log(chalk.blue(`- latest`));
      return;
    }
    
    await installOscalCli(version);
  }