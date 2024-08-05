import { exec } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
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
      }catch{
        console.log("Error installing CLI");
      } 
      const tempFile = path.join(`./oscal-cli-tmp-input-${v4()}.json`);
      writeFileSync(tempFile,JSON.stringify(document));
      const tempOutput = path.join(`./oscal-cli-tmp-outout-${v4()}.json`);
      const args = ["--to=JSON", tempFile, tempOutput,'--show-stack-trace'];
      await executeOscalCliCommand("resolve-profile", args);
      const result=JSON.parse(readFileSync(tempOutput).toString());
      return result as Catalog;

     }

}