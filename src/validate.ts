import { Ajv } from 'ajv';
import { exec } from 'child_process';
import { promisify } from 'util';
import { OscalSchema } from './schema/oscal.complete.js';
import { OscalJsonPackage } from './types.js';
import {isOscalCliInstalled,isJavaInstalled,validateWithSarif, installOscalCli} from './oscal.js'
import {  readFileSync, rm, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { v4 } from 'uuid';

const execAsync = promisify(exec);

export async function validateOscalDocument(
  document: OscalJsonPackage,
): Promise<{ isValid: boolean; errors?: string[] }> {
  const javaInstalled = await isJavaInstalled();

  if (!javaInstalled) {
    // If Java is not installed, use JSON Schema validation only
    return validateWithJsonSchema(document);
  }

  let oscalCliInstalled = await isOscalCliInstalled();

  if (!oscalCliInstalled) {
    // If OSCAL CLI is not installed, attempt to install it
    try {
      await installOscalCli();
      oscalCliInstalled = true;
    } catch (error) {
      console.error('Failed to install OSCAL CLI:', error);
      // Fallback to JSON Schema validation if installation fails
      return validateWithJsonSchema(document);
    }
  }

  if (oscalCliInstalled) {
    // Use OSCAL CLI for validation
    const tempFile = path.join(`./oscal-cli-tmp-input-${v4()}.json`);
    writeFileSync(tempFile,JSON.stringify(document));
    const fil=readFileSync(tempFile);
    var response =  parseSarifToErrorStrings(await validateWithSarif([tempFile]));
    rmSync(tempFile);
    return response;
  } else {
    // Fallback to JSON Schema validation
    return validateWithJsonSchema(document);
  }
}
function parseSarifToErrorStrings(sarifResult: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (sarifResult.runs && sarifResult.runs.length > 0) {
    for (const run of sarifResult.runs) {
      if (run.results && run.results.length > 0) {
        for (const result of run.results) {
          if (result.message && result.message.text) {
            let errorMessage = result.message.text;
            if (result.locations && result.locations.length > 0) {
              const location = result.locations[0];
              if (location.physicalLocation && location.physicalLocation.region) {
                const region = location.physicalLocation.region;
                errorMessage += ` at line ${region.startLine}, column ${region.startColumn}`;
              }
            }
            errors.push(errorMessage);
          }
        }
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

function validateWithJsonSchema(
  document: OscalJsonPackage,
): { isValid: boolean; errors?: string[] } {
  const ajv = new Ajv();
  const validate = ajv.compile(OscalSchema);
  const isJsonSchemaValid = validate(document);

  if (!isJsonSchemaValid) {
    return {
      isValid: false,
      errors: validate.errors?.map((error: any) => `JSON Schema: ${error.message} at ${error.instancePath}`)
    };
  }

  return { isValid: true };
}
