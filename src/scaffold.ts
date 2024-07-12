import https from 'https';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import { SystemSecurityPlanSSP } from './types';

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
      choices: ['fedramp-ssp', 'fedramp-poam'],
    },
  ]);

  const { baseline } = await inquirer.prompt([
    {
      type: 'list',
      name: 'baseline',
      message: 'Select the OSCAL baseline:',
      choices: ['HIGH', 'MODERATE', 'LOW', 'LI-SaaS'],
    },
  ]);

  const { resolved } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'resolved',
      message: 'Use resolved catalog?',
    },
  ]);

  const { sspName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'sspName',
      message: 'Enter the SSP name:',
      default: 'My SSP',
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

  const templateUrls = {
    'fedramp-ssp': 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/templates/ssp/json/FedRAMP-SSP-OSCAL-Template.json',
    'fedramp-poam': 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/templates/poam/json/FedRAMP-POAM-OSCAL-Template.json'
  };

  const baselineUrls = {
    'HIGH': 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_HIGH-baseline_profile.json',
    'MODERATE': 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_MODERATE-baseline_profile.json',
    'LOW': 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_LOW-baseline_profile.json',
    'LI-SaaS': 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_LI-SaaS-baseline-resolved-profile_catalog.json'
  };

  const templateUrl = templateUrls[template];
  const baselineUrl = baselineUrls[baseline];

  const templateFileName = `${sspName.replace(/\s+/g, '-')}-${path.basename(templateUrl)}`;
  const templateFilePath = path.join(outputPath, templateFileName);

  console.log(`Downloading template from "${templateUrl}"`);
  const templateContent = await downloadFile(templateUrl);

  console.log(`Downloading baseline from "${baselineUrl}"`);
  const baselineContent = await downloadFile(baselineUrl);

  // Parse the template and baseline JSON
  const templateJson:{"system-security-plan":SystemSecurityPlanSSP} = JSON.parse(templateContent);
  const baselineJson = JSON.parse(baselineContent);

  // Update the SSP
  console.log(templateContent)
  templateJson['system-security-plan'].uuid = uuidv4();
  templateJson['system-security-plan'].metadata.title = sspName;
  templateJson['system-security-plan'].metadata["last-modified"] = new Date().toISOString();
  templateJson['system-security-plan'].metadata.version = "1.0";
  templateJson['system-security-plan']["import-profile"] = {
    href: baselineUrl
  };

  // Write the updated SSP to file
  fs.writeFileSync(templateFilePath, JSON.stringify(templateJson, null, 2));

  console.log(`OSCAL template "${template}" with baseline "${baseline}" scaffolded successfully at "${templateFilePath}".`);
};

function downloadFile(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(new Error(`Error downloading the file: ${err.message}`));
    });
  });
}