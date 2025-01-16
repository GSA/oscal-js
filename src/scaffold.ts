import https from 'https';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

interface ScaffoldOptions {
  output?: string;
}

const examples = {
  'fedramp-ssp': {
    url: 'https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/content/rev5/examples/ssp/xml/fedramp-ssp-example.oscal.xml',
    description: 'FedRAMP System Security Plan Example'
  },
  'nist-ssp': {
    url: 'https://raw.githubusercontent.com/usnistgov/oscal-content/refs/heads/main/examples/ssp/xml/ssp-example.xml',
    description: 'NIST System Security Plan Example'
  }
} as const;

type ExampleType = keyof typeof examples;

interface PromptAnswers {
  selected: ExampleType;
  systemName: string;
}

async function createPrompts(): Promise<PromptAnswers> {
  const choices = Object.entries(examples).map(([key, value]) => ({
    name: value.description,
    value: key
  }));

  return inquirer.prompt([
    {
      type: 'list', // Changed from checkbox to list for single selection
      name: 'selected',
      message: 'Select an OSCAL SSP example to download:',
      choices
    },
    {
      type: 'input',
      name: 'systemName',
      message: 'Enter the name of your system:',
      validate: (input) => {
        if (input.trim().length < 1) {
          return 'System name cannot be empty';
        }
        return true;
      }
    }
  ]);
}

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

function updateSystemTitle(xmlContent: string, systemName: string): string {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const doc = parser.parseFromString(xmlContent, 'text/xml');

  // Update title in metadata
  const metadataTitle = doc.getElementsByTagName('title')[0];
  if (metadataTitle) {
    metadataTitle.textContent = `System Security Plan for ${systemName}`;
  }

  // Update system name in system-characteristics
  const systemCharacteristics = doc.getElementsByTagName('system-characteristics')[0];
  if (systemCharacteristics) {
    const systemTitle = systemCharacteristics.getElementsByTagName('title')[0];
    if (systemTitle) {
      systemTitle.textContent = systemName;
    }
  }

  return serializer.serializeToString(doc);
}

export const scaffoldCommand = async (options: ScaffoldOptions) => {
  console.log('\nOSCAL Example Downloader and Customizer');
  
  const outputPath = options.output || './';
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  try {
    const { selected, systemName } = await createPrompts();
    const { url } = examples[selected];
    
    console.log(`\nDownloading ${selected.toUpperCase()} example from "${url}"`);
    let content = await downloadFile(url);
    
    console.log('Updating system title...');
    content = updateSystemTitle(content, systemName);

    const fileName = `${systemName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ssp.xml`;
    const filePath = path.join(outputPath, fileName);

    fs.writeFileSync(filePath, content);
    console.log(`\nSaved customized SSP to "${filePath}"`);
    console.log('OSCAL example downloaded and customized successfully.');
  } catch (error) {
    console.error( error);
    process.exit(1);
  }
};