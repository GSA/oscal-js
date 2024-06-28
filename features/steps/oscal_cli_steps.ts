import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { 
  detectOscalDocumentType, 
  executeOscalCliCommand, 
  installOscalCli, 
  isOscalCliInstalled 
} from '../../src/oscal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let documentPath: string;
let documentType: string;
let cliInstalled: boolean;
let executionResult: string;
let conversionResult: string;

Given('I have an OSCAL document {string}', function (filename: string) {
  documentPath = path.join(__dirname, '..', '..', 'examples', filename);
});
When('I detect the document type', async function () {
  [documentType] = await detectOscalDocumentType(documentPath);
});

Then('the document type should be {string}', function (expectedType: string) {
  expect(documentType).to.equal(expectedType);
});

When('I check if OSCAL CLI is installed', async function () {
  cliInstalled = await isOscalCliInstalled();
});

Then('I should receive a boolean result', function () {
  expect(cliInstalled).to.be.a('boolean');
});

Given('OSCAL CLI is not installed', async function () {
  cliInstalled = await isOscalCliInstalled();
  if (cliInstalled) {
    // Mock uninstallation for testing purposes
    cliInstalled = false;
  }
});

When('I install OSCAL CLI', async function () {
  await installOscalCli();
});

Then('OSCAL CLI should be installed', async function () {
  cliInstalled = await isOscalCliInstalled();
  expect(cliInstalled).to.be.true;
});

When('I execute the OSCAL CLI command {string} on the document', async function (command: string) {
  const [cmd, ...args] = command.split(' ');
  args.push(documentPath);
  executionResult = await executeOscalCliCommand(cmd, args);
});

Then('I should receive the execution result', function () {
  console.log(executionResult);
  expect(executionResult).to.exist;
});

When('I convert the document to JSON', async function () {
  const outputFile = path.join(__dirname, '..', '..', 'examples', 'ssp.json');
  conversionResult = await executeOscalCliCommand('ssp', ['convert', '--to=json', documentPath, outputFile, '--overwrite']);
});

Then('I should receive the conversion result', function () {
  console.log(conversionResult);
  expect(conversionResult).to.exist;
});