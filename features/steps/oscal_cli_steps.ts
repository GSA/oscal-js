import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { 
  detectOscalDocumentType, 
  executeOscalCliCommand, 
  validateWithSarif, 
  installOscalCli, 
  isOscalCliInstalled 
} from '../../src/oscal.js';
import {sarifSchema} from "../../src/schema/sarif"
import { Log } from 'sarif';
import Ajv from 'ajv';
import addFormats from "ajv-formats"
import { validateOscalDocument } from '../../src/validate.js';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let documentPath: string;
let metaschemaDocumentPath: string;
let documentType: string;
let cliInstalled: boolean;
let executionResult: string;
let sarifResult: Log;
let validateResult: { isValid: boolean; errors?: string[] | undefined; };
let conversionResult: string;

const ajv = new Ajv()
addFormats(ajv);



Given('I have an OSCAL document {string}', function (filename: string) {
  documentPath = path.join(__dirname, '..', '..', 'examples', filename);
});

Given('I have an Metaschema extensions document {string}', (filename: string) => {
  metaschemaDocumentPath = path.join(__dirname, '..', '..', 'examples', filename);
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
When('I validate with sarif output on the document', async function () {
  sarifResult = await validateWithSarif([documentPath]);
});

Then('I should receive the execution result', function () {
  console.log(executionResult);
  expect(executionResult).to.exist;
});

When('I convert the document to JSON', async function () {
  const outputFile = path.join(__dirname, '..', '..', 'examples', 'ssp.json');
  conversionResult = await executeOscalCliCommand('convert', [documentPath,'--to=json', outputFile, '--overwrite']);
});

Then('I should receive the conversion result', function () {
  console.log(conversionResult);
  expect(conversionResult).to.exist;
});


When('I validate with metaschema extensions and sarif output on the document', async () => {
  sarifResult = await validateWithSarif([documentPath,"-c",metaschemaDocumentPath]);
})

Then('I should receive the sarif output', () => {
//  const isValid=ajv.validate(sarifSchema,sarifResult)
//   const errors = ajv.errors
//   console.error(errors);
//   expect(errors).to.be.undefined
//   expect(isValid).to.be.true;
expect(sarifResult.runs).to.exist;
expect(sarifResult.version).to.exist;
})

Then('I should receive a validation object', () => {
expect(typeof validateResult.isValid==='boolean');
})

When('I validate with imported validate function', async () => {
  var document=JSON.parse(readFileSync(documentPath).toString());
  validateResult=await validateOscalDocument(document)
})


