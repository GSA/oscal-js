import { exec } from 'child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { executeOscalCliCommand, installOscalCli, isOscalCliInstalled } from './commands.js';
import { Catalog, Profile } from './types.js';

const execAsync = promisify(exec);

export async function resolveProfile(
  document: Profile,
): Promise<Catalog|undefined> {
  let oscalCliInstalled = await isOscalCliInstalled();

  if (!oscalCliInstalled) {
    // If OSCAL CLI is not installed, attempt to install it
    try {
      await installOscalCli();
      oscalCliInstalled = true;
    } catch (error) {
      console.error("Error installing CLI:", error);
      return undefined;
    }
  }

  const tempFile = path.join(process.cwd(), `oscal-cli-tmp-input-${v4()}.json`);
  const tempOutput = path.join(process.cwd(), `oscal-cli-tmp-output-${v4()}.json`);

  try {
    writeFileSync(tempFile, JSON.stringify(document));
    
    const args = ["--to=JSON", tempFile, tempOutput, '--show-stack-trace'];
    await executeOscalCliCommand("resolve-profile", args);
    
    const result = JSON.parse(readFileSync(tempOutput, 'utf-8'));
    return result as Catalog;
  } catch (error) {
    console.error("Error resolving profile:", error);
    return undefined;
  } finally {
    // Clean up temporary files
    try {
      if (tempFile) {
        unlinkSync(tempFile);
      }
      if (tempOutput) {
        unlinkSync(tempOutput);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up temporary files:", cleanupError);
    }
  }
}

export async function resolveProfileFromFile(
  filePath: string
): Promise<Catalog|undefined> {
  let oscalCliInstalled = await isOscalCliInstalled();

  if (!oscalCliInstalled) {
    try {
      await installOscalCli();
      oscalCliInstalled = true;
    } catch (error) {
      console.error("Error installing CLI:", error);
      return undefined;
    }
  }

  const tempOutput = path.join(process.cwd(), `oscal-cli-tmp-output-${v4()}.json`);

  try {
    const args = ["--to=JSON", filePath, tempOutput, '--show-stack-trace'];
    await executeOscalCliCommand("resolve-profile", args);
    
    const result = JSON.parse(readFileSync(tempOutput, 'utf-8'));
    return result as Catalog;
  } catch (error) {
    console.error("Error resolving profile from file:", error);
    return undefined;
  } finally {
    try {
      if (tempOutput) {
        unlinkSync(tempOutput);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up temporary output file:", cleanupError);
    }
  }
}