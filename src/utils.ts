import xml2js from 'xml2js';
import yaml from 'js-yaml'; // Make sure to import js-yaml
import { exec } from "child_process";
import { existsSync, readFileSync } from "fs";
import path, { dirname, join } from "path";
import { promisify } from "util";
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);
export type OscalExecutorOptions = 'oscal-cli'|'oscal-server'


function getDocumentType(rootElement: string): string {
    switch (rootElement) {
      case 'catalog': return 'catalog';
      case 'profile': return 'profile';
      case 'plan-of-action-and-milestones': return 'poam';
      case 'component-definition': return 'component-definition';
      case 'system-security-plan': return 'ssp';
      case 'assessment-results': return 'ar';
      case 'assessment-plan': return 'ap';
      default: return 'metaschema';
    }
  }
  // Cross-platform which promise function
export const whichPromise = async (command: string): Promise<string | null> => {
    try {
      if (process.platform === 'win32') {
        const { stdout } = await execPromise(`where ${command}`);
        return stdout.split('\r\n')[0].trim() || null;
      } else {
        const { stdout } = await execPromise(`which ${command}`);
        return stdout.trim() || null;
      }
    } catch (error) {
      return null;
    }
  };


async function parseYamlDocument(fileContent: string): Promise<[string, string]> {
    return new Promise((resolve, reject) => {
      try {
        const yamlData = yaml.load(fileContent);
        if (typeof yamlData !== 'object' || yamlData === null) {
          reject(new Error('Invalid YAML structure'));
        }
        const rootElement = Object.keys(yamlData as object)[0];
        resolve([getDocumentType(rootElement), 'yaml']);
      } catch (error) {
        reject(new Error(`Failed to parse YAML: ${error}`));
      }
    });
  }
  
  async function parseXmlDocument(fileContent: string): Promise<[string, string]> {
    const parser = new xml2js.Parser();
    try {
      const result = await parser.parseStringPromise(fileContent);
      const rootElement = Object.keys(result)[0];
      return [getDocumentType(rootElement), 'xml'];
    } catch (error) {
      throw new Error(`Failed to parse XML: ${error}`);
    }
  }
  
  function parseJsonDocument(fileContent: string): [string, string] {
    try {
      const jsonData = JSON.parse(fileContent);
      const rootElement = Object.keys(jsonData)[0];
      return [getDocumentType(rootElement), 'json'];
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }
  

export async function detectOscalDocumentType(filePath: string): Promise<[string, string]> {
    const fileExtension = path.extname(filePath).toLowerCase();
    if (!['.xml', '.json', '.yaml', '.yml'].includes(fileExtension)) {
      throw new Error('Unsupported file format. Only XML YAML and JSON are supported.');
    }
  
    const fileContent = readFileSync(filePath).toString();
    
    if (fileExtension === '.xml') {
      return parseXmlDocument(fileContent);
    } else if (fileExtension === ".json") {
      return parseJsonDocument(fileContent);
    } else {
      return parseYamlDocument(fileContent);
    }
  }


export function findFedrampExtensionsFile() {
    try {
      // Get the directory of the current module
      const currentFileUrl = import.meta.url;
      const currentFilePath = fileURLToPath(currentFileUrl);
      const currentDir = dirname(currentFilePath);
  
      // Construct the path to the extensions file
      // Adjust this path based on your package structure
      const extensionsPath = join(currentDir, '..', 'extensions', 'fedramp-external-constraints.xml');
  
      // Check if the file exists
      if (existsSync(extensionsPath)) {
        return extensionsPath;
      }
    } catch (error) {
      console.error('Error finding extensions file:', error);
    }
  
    // If we couldn't find the file, return null
    return null;
  }
