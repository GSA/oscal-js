import { describe, expect, it, jest } from '@jest/globals';
import { detectOscalDocumentType, executeOscalCliCommand, installOscalCli, isOscalCliInstalled } from './dist/oscal.js';
import path from 'path';

describe('OSCAL CLI Wrapper', () => {
  it('should detect the OSCAL document type', async () => {
    const filePath = path.join(__filename, '..', 'examples', 'ssp.xml');
    const [documentType] = await detectOscalDocumentType(filePath);
    expect(documentType).toBe('ssp');
  });

  it('should check if OSCAL CLI is installed', async () => {
    const installed = await isOscalCliInstalled();
    expect(typeof installed).toBe('boolean');
  });

  it('should install OSCAL CLI if not installed', async () => {
    const installed = await isOscalCliInstalled();
    if (!installed) {
      await installOscalCli();
      const newInstalled = await isOscalCliInstalled();
      expect(newInstalled).toBe(true);
    }
  });

  it('should execute OSCAL CLI command', async () => {
    const command = 'ssp';
    const args = ['validate', path.join(__dirname, '..', 'examples', 'ssp.xml')];
    const result = await executeOscalCliCommand(command, args);
    console.log(result);
    return result;
  });

  it('should convert OSCAL document from XML to JSON', async () => {
    const inputFile = path.join(__dirname, '..', 'examples', 'ssp.xml');
    const outputFile = path.join(__dirname, '..', 'examples', 'ssp.json');
    jest.setTimeout(10000);
    const result = await executeOscalCliCommand("ssp", ['convert', '--to=json', inputFile, outputFile, '--overwrite']);
    console.log(result);
    return result;
  });
});