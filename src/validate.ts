import { Ajv } from 'ajv';
import addFormats from "ajv-formats";
import { exec } from 'child_process';
import { rmSync, writeFileSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { installOscalCli, isJavaInstalled, isOscalCliInstalled, validateWithSarif } from './oscal.js';
import { OscalSchema } from './schema/oscal.complete.js';
import { OscalJsonPackage } from './types.js';


const execAsync = promisify(exec);

export async function validate(
  document: OscalJsonPackage,
  useAjv:boolean=false
): Promise<{ isValid: boolean; errors?: string[] }> {
  const javaInstalled = await isJavaInstalled();

  if (!javaInstalled) {
    // If Java is not installed, use JSON Schema validation only
    console.error("Validating with schema");
    return validateWithJsonSchema(document);
  }

  let oscalCliInstalled = await isOscalCliInstalled();

  if (!oscalCliInstalled||useAjv) {
    // If OSCAL CLI is not installed, attempt to install it
    try {
      if(!useAjv){

      installOscalCli();
      oscalCliInstalled = true;
    }else{
      return validateWithJsonSchema(document);
    }
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
  addFormats(ajv);
  const validate = ajv.compile(OscalSchema);
  const isJsonSchemaValid = validate({...document,$schema:"http://csrc.nist.gov/ns/oscal/1.0"});
  if (!isJsonSchemaValid) {
    console.error(validate.errors);
    return {
      isValid: false,
      errors: validate.errors?.map((error: any) => `JSON Schema: ${error.message} at ${error.instancePath}`)
    };
  }

  return { isValid: true };
}
