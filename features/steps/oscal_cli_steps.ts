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
import { Log } from 'sarif';
import Ajv from 'ajv';
import addFormats from "ajv-formats"
import { validate, validateDefinition, validateFile } from '../../src/validate.js';
import { readFileSync } from 'fs';
import { convert } from '../../src/convert.js';
import { sarifSchema } from '../../src/schema/sarif.js';
import { Control } from '../../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let documentPath: string;
let outputPath: string;
let metaschemaDocumentPath: string;
let metaschemaDocuments:string[];
let documentType: string;
let cliInstalled: boolean;
let executionResult: string;
let executionErrors: string;
let convertResult: string;
let definitionToValidate: string;
let exampleObject: any;
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
  metaschemaDocuments=[metaschemaDocumentPath];
});
Given('I have a second Metaschema extensions document {string}', (filename: string) => {
  metaschemaDocuments = [metaschemaDocumentPath,path.join(__dirname, '..', '..', 'examples', filename)];
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
});

When('I install OSCAL CLI', async function () {
  if(!cliInstalled){
    await installOscalCli();
  }
});

Then('OSCAL CLI should be installed', async function () {
  cliInstalled = await isOscalCliInstalled();
  expect(cliInstalled).to.be.true;
});

When('I execute the OSCAL CLI command {string} on the document', async function (command: string) {
  const [cmd, ...args] = command.split(' ');
  args.push(documentPath);
  [executionResult,executionErrors] = await executeOscalCliCommand(cmd, args);
});
When('I validate with sarif output on the document', async function () {
  sarifResult = await validateWithSarif([documentPath]);
});

Then('I should receive the execution result', function () {
  expect(executionResult).to.exist;
});

When('I convert the document to JSON', async function () {
  const outputFile = path.join(__dirname, '..', '..', 'examples', 'ssp.json');
  [conversionResult,executionErrors] = await executeOscalCliCommand('convert', [documentPath,'--to=json', outputFile, '--overwrite']);
  console.error(executionErrors);
});

Then('I should receive the conversion result', function () {
  expect(conversionResult).to.exist;
});


When('I validate with metaschema extensions and sarif output on the document', async () => {
  sarifResult = await validateWithSarif([documentPath,"-c",metaschemaDocumentPath]);
})

Then('I should receive the sarif output', () => {
 const isValid=ajv.validate(sarifSchema,sarifResult)
  const errors = ajv.errors
  console.error(errors);
  // expect(errors).to.be.undefined
  // expect(isValid).to.be.true;
expect(sarifResult.runs).to.exist;
expect(sarifResult.version).to.exist;
})

Then('I should receive a validation object', () => {
expect(typeof validateResult.isValid==='boolean');
})

When('I validate with imported validate function', async () => {
  try {
    validateResult=await validateFile(documentPath,{useAjv:false,extensions:metaschemaDocuments})    
  } catch (error) {
    console.error(error);
  }
})

Then('I should receive a valid json object', async () => {
  // Write code here that turns the phrase above into concrete actions
  const document=JSON.parse(readFileSync(outputPath).toString());
  const {isValid,errors}=await validate( document)
 expect(isValid).to.be.true;
})

When('I convert it with imported convert function', async () => {
  await convert(documentPath,outputPath);
})

Given('I want an OSCAL document {string}', (filename: string) => {
  outputPath = path.join(__dirname, '..', '..', 'examples', filename);
})

Then('the validation result should be valid', () => {
  console.error(validateResult.errors);
  expect(validateResult.isValid).to.be.true;
})

When('I validate with imported validateDefinition function', () => {
  validateResult=validateDefinition(definitionToValidate as any,exampleObject)
  // Write code here that turns the phrase above into concrete actions
})


Given('I have an example OSCAL definition {string}', (s: string) => {
  // Write code here that turns the phrase above into concrete actions
definitionToValidate = s;
})

Given('I have an example OSCAL object {string}', (s: string) => {
  // Write code here that turns the phrase above into concrete actions
if (definitionToValidate==="control"){
  exampleObject={
    id:"psych_101",
    title:"test",
    class:"awsoem",
  }

}
})



