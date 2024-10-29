import { Given, Then, When } from '@cucumber/cucumber';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { assert, expect } from 'chai';
import { existsSync, readFileSync } from 'fs';
import path, { join } from 'path';
import { Log } from 'sarif';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseString } from 'xml2js';
import { setDefaultTimeout,BeforeAll,AfterAll } from '@cucumber/cucumber';
import { Catalog } from '../../src/types.js';
import { startServer, stopServer } from '../../src/server.js';
import {
  installOscalCli,
  executeOscalCliCommand,
  isOscalExecutorInstalled,
  installOscalServer
} from '../../src/env.js';
import { detectOscalDocumentType, OscalExecutorOptions } from '../../src/utils.js';
import {
  validate,
  validateDefinition,
  validateDocument
} from '../../src/validate.js';
import { convert, convertDocument } from '../../src/convert.js';
import { resolveProfile, resolveProfileDocument } from '../../src/resolve.js';
import { evaluateMetapath, evaluateMetapathDocument } from '../../src/evaluate.js';
import { sarifSchema } from '../../src/schema/sarif.js';

startServer()
const DEFAULT_TIMEOUT = 17000;
setDefaultTimeout(DEFAULT_TIMEOUT);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ajv = new Ajv();
addFormats(ajv);

let documentPath: string;
let metaschemaDocumentPath: string;
let metaschemaDocuments: string[];
let outputPath: string;
let documentType: string;
let executorInstalled: boolean;
let executionResult: string;
let executionErrors: string;
let validateResult: { isValid: boolean; log: Log };
let sarifResult: Log;
let conversionResult: string;
let resolutionResult: Catalog |string| undefined;
let resolutionResultOutputPath: string;
let evalResult: string | undefined;
let evalQuery: string | undefined;
let definitionToValidate: string;
let exampleObject: any;
let constraintId: string;
let constraintExists: boolean;

let metapathResult: string | undefined;
let oscalObject: any;

Given('I have an OSCAL document {string}', function (filename: string) {
  console.log(filename+"resolving");
  documentPath = path.resolve(__dirname, '..', '..', 'examples', filename);
});

Given('I have a Metaschema extensions document {string}', function (filename: string) {
  metaschemaDocumentPath = path.resolve(__dirname, '..', '..', 'extensions', filename);
  metaschemaDocuments = [metaschemaDocumentPath];
});

When('I detect the document type', async function () {
  [documentType] = await detectOscalDocumentType(documentPath);
});

Then('the document type should be {string}', function (expectedType: string) {
  expect(documentType).to.equal(expectedType);
});

When('I check if {string} is installed', async function (tool:any) {
  executorInstalled = await isOscalExecutorInstalled(tool);
});

Then('I should receive a boolean result', function () {
  expect(executorInstalled).to.be.a('boolean');
});

When('I install {string}', async function (tool: string) {
  if (tool === 'oscal-cli') {
    await installOscalCli();
  } else if (tool === 'oscal-server') {
    await installOscalServer();
  }
});

Then('{string} should be installed', async function (tool: OscalExecutorOptions) {
  executorInstalled = await isOscalExecutorInstalled(tool);
  if(tool=='oscal-server'){
    startServer(true);
  }
  expect(executorInstalled).to.be.true;
});

When('I execute the OSCAL CLI command {string} on the document', async function (command: string) {
    const [cmd, ...args] = command.split(' ');
    args.push(documentPath);
    [executionResult, executionErrors] = await executeOscalCliCommand(cmd, args);
});

When('I validate with metaschema extensions and sarif output on the document using {string}', async function (executor: OscalExecutorOptions) {
  console.log(documentPath,metaschemaDocuments);
  validateResult = await validateDocument(documentPath, { extensions: metaschemaDocuments }, executor);
  sarifResult = validateResult.log;
});


When('I convert the document to JSON using {string}', async function (executor: string) {
  outputPath = path.resolve(__dirname, '..', '..', 'examples', 'ssp.json');
  if (executor === 'oscal-cli') {
    [conversionResult, executionErrors] = await executeOscalCliCommand('convert', [documentPath, '--to=json', outputPath, '--overwrite']);
  } else if (executor === 'oscal-server') {
    await convertDocument(documentPath, outputPath, { outputFormat: 'json' }, 'oscal-server');
  }
});

When('I convert the document to YAML using {string}', async function (executor: string) {
  outputPath = path.resolve(__dirname, '..', '..', 'examples', 'ssp.yaml');
  if (executor === 'oscal-cli') {
    [conversionResult, executionErrors] = await executeOscalCliCommand('convert', [documentPath, '--to=yaml', outputPath, '--overwrite']);
  } else if (executor === 'oscal-server') {
    await convertDocument(documentPath, outputPath, { outputFormat: 'yaml' }, 'oscal-server');
  }
});

When('I validate with sarif output on the document using {string}', async function (executor: OscalExecutorOptions) {
  validateResult = await validateDocument(documentPath, {extensions:[]}, executor);
  sarifResult = validateResult.log;
});


Then('I should receive the execution result', function () {
  expect(executionResult).to.exist;
});

Then('I should receive the conversion result', function () {
  expect(existsSync(outputPath)).to.be.true;
});

Then('I should receive the sarif output', function () {
  const isValid = ajv.validate(sarifSchema, sarifResult);
  const errors = ajv.errors;
  errors && console.error(errors);
  expect(sarifResult.runs).to.exist;
  expect(sarifResult.version).to.exist;
});

Then('conversion result is a json', async function () {
  const fileContent = readFileSync(outputPath).toString();
  let isValidJson = false;
  try {
    JSON.parse(fileContent);
    isValidJson = true;
  } catch (error) {
    isValidJson = false;
  }
  expect(isValidJson).to.be.true;
});

Then('conversion result is a yaml', async function () {
  const fileContent = readFileSync(outputPath).toString();
  let isValidYaml = false;
  try {
    yaml.load(fileContent);
    isValidYaml = true;
  } catch (error) {
    isValidYaml = false;
  }
  expect(isValidYaml).to.be.true;
});

When('I validate with imported validate function using {string}', async function (executor: OscalExecutorOptions) {
  validateResult = await validateDocument(documentPath, {extensions:metaschemaDocuments}, executor);
});

Then('I should receive a validation object', function () {
  expect(typeof validateResult.isValid === 'boolean').to.be.true;
});

Given('I want an OSCAL document {string}', function (filename: string) {
  outputPath = path.resolve(__dirname, '..', '..', 'examples', filename);
});

When('I convert it with imported convert function using {string}', async function (executor:any) {
  const outputFormat = path.extname(outputPath).slice(1) as 'json' | 'yaml';
  await convertDocument(documentPath, outputPath, { outputFormat }, executor);
});

Then('I should receive a valid json object', function () {
  const fileContent = readFileSync(outputPath).toString();
  let isValidJson = false;
  try {
    JSON.parse(fileContent);
    isValidJson = true;
  } catch (error) {
    isValidJson = false;
  }
  expect(isValidJson).to.be.true;
});

Given('I want to resolve the profile', function () {
  // This step is just for setup, no implementation needed
});

When('I resolve it with imported resolve function using {string}', async function (executor: OscalExecutorOptions) {
  resolutionResult = await resolveProfile(documentPath, {outputFormat:'json'}, executor);
});

Then('the resolved profile should be valid', async function () {
  if (typeof resolutionResult === 'undefined') {
    throw new Error("Resolution failed");
  }
  const { isValid, log } = await validate(resolutionResult as any);
  expect(isValid).to.be.true;
});

// Additional steps for specific scenarios

When('we should have errors in the sarif output', function () {
  expect(validateResult.log.runs.some(x => x.results?.some(x => x.level?.toLowerCase() === "error" || x.level?.toLowerCase() === 'warning'))).to.be.true;
});

Given('I have an example OSCAL definition {string}', function (s: string) {
  definitionToValidate = s;
});

Given('I have an example OSCAL object {string}', function (s: string) {
  if (definitionToValidate === "control") {
    exampleObject = {
      id: "psych_101",
      title: "test",
      class: "awesome",
    };
  }
});

When('I validate with imported validateDefinition function', function () {
  validateResult = { ...validateDefinition(definitionToValidate as any, exampleObject) } as any;
});

When('I look for a constraint by ID {string}', function (id: string) {
  constraintId = id;
});

Then('I should Find a node in the constraint file', function (done) {
  const xmlContent = readFileSync(metaschemaDocumentPath, 'utf-8');
  
  parseString(xmlContent, (err, result) => {
    if (err) {
      done(err);
      return;
    }

    function searchForConstraint(obj: any): boolean {
      if (typeof obj !== 'object') return false;
      
      if (Array.isArray(obj)) {
        return obj.some(item => searchForConstraint(item));
      }
      
      if (obj.$ && obj.$.id === constraintId) {
        return true;
      }
      
      return Object.values(obj).some(value => searchForConstraint(value));
    }

    constraintExists = searchForConstraint(result);
    expect(constraintExists).to.be.true;
    done();
  });
});

Given('I want query with metapath {string}', function (s: string) {
  evalQuery = s;
});

When('I query with the eval function', async function () {
  assert.isString(evalQuery);
  assert.isString(documentPath);
  evalResult = await evaluateMetapath({ document: documentPath, expression: evalQuery! });
});

// Server-specific steps

When('I start the oscal server the OSCAL SERVER command {string} on the document', async function (command: string) {
  await startServer();
});

When('I execute validate endpoint on the document with oscal-server', async function () {
  validateResult = await validateDocument(documentPath, {extensions:metaschemaDocuments}, 'oscal-server');
});

Then('the validation result should be valid', () => {
  expect(validateResult.isValid).to.be.true
})
When('I validate with imported validate function', async function () {
  const oscalObject = readFileSync(documentPath).toJSON()
  validateResult = await validate(oscalObject as any,{extensions:metaschemaDocuments});
});
When('I validate with imported validateDocument function', async function () {
  validateResult = await validateDocument(documentPath,{extensions:metaschemaDocuments});
});

Given('I have an Metaschema extensions document {string}', function (filename: string) {
  metaschemaDocumentPath = path.resolve(__dirname, '..', '..', 'extensions', filename);
  metaschemaDocuments = [metaschemaDocumentPath];
});

Given('I have a second Metaschema extensions document {string}', function (filename: string) {
  const secondMetaschemaDocumentPath = path.resolve(__dirname, '..', '..', 'extensions', filename);
  metaschemaDocuments.push(secondMetaschemaDocumentPath);
});

When('I resolve it with imported resolve function using oscal-server', async function () {
  await resolveProfileDocument((documentPath),resolutionResultOutputPath,{outputFormat:"json"},'oscal-server')
  resolutionResult=JSON.parse(readFileSync(resolutionResultOutputPath).toString())
});
When('I resolve it with imported resolve function using oscal-cli', async function () {
  await resolveProfileDocument(documentPath,resolutionResultOutputPath,{outputFormat:"json"},'oscal-cli')
  resolutionResult=JSON.parse(readFileSync(resolutionResultOutputPath).toString())
});



When('I evaluate the metapath expression {string} using {string}', async function (expression, executor) {          
          const options = {
      document: documentPath,
      expression: expression,
      server: executor === 'oscal-server'
  };
  metapathResult = await evaluateMetapathDocument(options);
});


Then('I should receive the metapath result', function () {
  expect(metapathResult).to.not.be.undefined;
});

Then('the result should contain a title', function () {
  expect(metapathResult).to.match(/title|Title/);
});

Then('I should receive an empty result', function () {
  expect(metapathResult).to.be.empty;
});

Then('the result should contain implementation status values', function () {
  expect(metapathResult).to.match(/implemented|partial|planned/);
});