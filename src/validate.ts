import { Ajv } from 'ajv';
import addFormats from "ajv-formats";
import { readFileSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { installOscalCli, isJavaInstalled, isOscalCliInstalled, validateWithSarif } from './oscal.js';
import { oscalSchema } from './schema/oscal.complete.js';
import { OscalJsonPackage, ResourceHypertextReference } from './types.js';

export type OscalValidationOptions = {
    extensions: ResourceHypertextReference[],
    useAjv: boolean  
} 

export const fedrampValidationOptions: OscalValidationOptions = {
    extensions: ["./examples/fedramp-external-constraints.xml", "./oscal-external-constraints.xml"],
    useAjv: false
};

export async function validate(
  document: OscalJsonPackage,
  options: OscalValidationOptions = {extensions: [], useAjv: false}
): Promise<{ isValid: boolean; errors?: string[] }> {
  if (options.useAjv) {
    return validateWithJsonSchema(document);
  }

  const javaInstalled = await isJavaInstalled();
  if (!javaInstalled) {
    console.error("Java not installed. Validating with schema");
    return validateWithJsonSchema(document);
  }

  let oscalCliInstalled = await isOscalCliInstalled();
  if (!oscalCliInstalled) {
    try {
      installOscalCli();
      oscalCliInstalled = true;
    } catch (error) {
      console.error('Failed to install OSCAL CLI:', error);
      return validateWithJsonSchema(document);
    }
  }

  const tempFile = path.join(`./oscal-cli-tmp-input-${v4()}.json`);
  writeFileSync(tempFile, JSON.stringify(document));
  const result = await validateSarif(tempFile, options);
  rmSync(tempFile);
  return result;
}

export async function validateFile(
  documentPath: string,
  options: OscalValidationOptions = {extensions: [], useAjv: false}
): Promise<{ isValid: boolean; errors?: string[] }> {
  if (options.useAjv) {
    throw new Error("Cannot use AJV with file validation");
  }

  let oscalCliInstalled = await isOscalCliInstalled();
  if (!oscalCliInstalled) {
    installOscalCli();
    oscalCliInstalled = true;
  }

  if (!oscalCliInstalled) {
    return { isValid: false, errors: ["OSCAL CLI not installed"] };
  }

  return validateSarif(documentPath, options);
}

export async function validateSarif(
  filePath: string,
  options: OscalValidationOptions
): Promise<{ isValid: boolean; errors?: string[] }> {
  const additionalArgs = options.extensions.flatMap(x => ["-c", x]);
  const sarifResult = await validateWithSarif([filePath, ...additionalArgs]);
  return parseSarifToErrorStrings(sarifResult);
}

export async function validateFileSarif(
  documentPath: string,
  options: OscalValidationOptions = {extensions: [], useAjv: false}
): Promise<any> {
  if (options.useAjv) {
    throw new Error("Cannot use AJV with file validation");
  }

  let oscalCliInstalled = await isOscalCliInstalled();
  if (!oscalCliInstalled) {
    installOscalCli();
    oscalCliInstalled = true;
  }

  if (!oscalCliInstalled) {
    throw new Error("OSCAL CLI not installed");
  }

  const additionalArgs = options.extensions.flatMap(x => ["-c", x]);
  return validateWithSarif([documentPath, ...additionalArgs]);
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
  const validate = ajv.compile(oscalSchema);
  const isJsonSchemaValid = validate({...document, $schema: "http://csrc.nist.gov/ns/oscal/1.0"});
  if (!isJsonSchemaValid) {
    console.error(validate.errors);
    return {
      isValid: false,
      errors: validate.errors?.map((error: any) => `JSON Schema: ${error.message} at ${error.instancePath}`)
    };
  }

  return { isValid: true };
}