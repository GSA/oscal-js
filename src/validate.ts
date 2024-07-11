import { Ajv } from 'ajv';
import addFormats from "ajv-formats";
import { readFileSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { installOscalCli, isJavaInstalled, isOscalCliInstalled, validateWithSarif } from './commands.js';
import { oscalSchema } from './schema/oscal.complete.js';
import { AssessmentPart, ImportAssessmentPlan, LocalDefinitions, OscalJsonPackage, POAMItem, PlanOfActionAndMilestonesPOAM, ResourceHypertextReference } from './types.js';

export type OscalValidationOptions = {
    extensions: ResourceHypertextReference[],
    useAjv: boolean  
} 

export const fedrampValidationOptions: OscalValidationOptions = {
    extensions: ["./examples/fedramp-external-constraints.xml", "./oscal-external-constraints.xml"],
    useAjv: false
};
let ajv: Ajv | null = null;

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

type OscalDefinition = 
| "catalog"
| "group"
| "control"
| "part"
| "parameter"
| "parameter-constraint"
| "parameter-guideline"
| "parameter-value"
| "parameter-selection"
| "include-all"
| "metadata"
| "location-uuid"
| "party-uuid"
| "role-id"
| "back-matter"
| "property"
| "link"
| "responsible-party"
| "action"
| "responsible-role"
| "hash"
| "remarks"
| "published"
| "last-modified"
| "version"
| "oscal-version"
| "email-address"
| "telephone-number"
| "address"
| "addr-line"
| "document-id"
| "profile"
| "import"
| "merge"
| "modify"
| "insert-controls"
| "select-control-by-id"
| "select-profile-control-by-id"
| "with-id"
| "matching"
| "component-definition"
| "import-component-definition"
| "defined-component"
| "capability"
| "incorporates-component"
| "control-implementation"
| "implemented-requirement"
| "statement"
| "system-component"
| "protocol"
| "port-range"
| "implementation-status"
| "system-user"
| "authorized-privilege"
| "function-performed"
| "inventory-item"
| "set-parameter"
| "system-id"
| "system-security-plan"
| "import-profile"
| "system-characteristics"
| "system-information"
| "impact"
| "base"
| "selected"
| "adjustment-justification"
| "security-impact-level"
| "status"
| "date-authorized"
| "authorization-boundary"
| "diagram"
| "network-architecture"
| "data-flow"
| "system-implementation"
| "by-component"
| "assessment-plan"
| "import-ssp"
| "local-objective"
| "assessment-method"
| "activity"
| "task"
| "reviewed-controls"
| "select-objective-by-id"
| "assessment-subject-placeholder"
| "assessment-subject"
| "select-subject-by-id"
| "subject-reference"
| "assessment-assets"
| "finding-target"
| "finding"
| "observation"
| "origin"
| "origin-actor"
| "related-task"
| "threat-id"
| "risk"
| "logged-by"
| "risk-status"
| "characterization"
| "response"
| "assessment-part"
| "assessment-results"
| "result"
| "import-ap"
| "plan-of-action-and-milestones"
| "local-definitions"
| "poam-item";
export function validateDefinition(
  definitionName: OscalDefinition,
  document: any,
): { isValid: boolean; errors?: string[]; } {
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
  });
  addFormats(ajv);
  ajv.addSchema(oscalSchema,);

  const validateFn = ajv.getSchema(oscalSchema.$id+"#/definitions/"+definitionName);
  if (!validateFn) {
    console.log(validateFn)
    return { 
      isValid: false, 
      errors: [`Definition not found: ${definitionName}`] 
    };
  }
  const isValid = (validateFn as any)!(document);

  if (!isValid) {
    return {
      isValid: false,
      errors: validateFn.errors?.map((error: any) => `${error.message} at ${error.instancePath}`)
    };
  }

  return { isValid: true };
}

