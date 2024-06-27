import {Ajv} from 'ajv';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { OscalJsonPackage } from './types.js';

const execAsync = promisify(exec);

export async function validateOscalDocument(
  document: OscalJsonPackage,
  schemaPath: string,
  useOscalCli: boolean = true
): Promise<{ isValid: boolean; errors?: string[] }> {
  // JSON Schema validation
  const ajv =new Ajv();
  const schemaContent = await fs.readFile(schemaPath, 'utf-8');
  
  const schema = JSON.parse(schemaContent);
  
  const validate = ajv.compile(schema);
  const isJsonSchemaValid = validate(document);
  
  if (!isJsonSchemaValid) {
    return { 
      isValid: false, 
      errors: validate.errors?.map((error:any) => `JSON Schema: ${error.message} at ${error.instancePath}`)
    };
  }
  
  // If we only performed JSON Schema validation and it passed
  return { isValid: true };
}

