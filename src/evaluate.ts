import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { executeOscalCliCommand, installOscalCli, isOscalCliInstalled } from './commands.js';
import { Catalog, Profile } from './types.js';

interface EvaulateOptions {
    document: string;
    expression: string;
    metaschema?:string;
  }
  
export async function evaluateMetapathCommand(options:EvaulateOptions): Promise<void> {
   await evaluateMetapath(options);
}


export async function evaluateMetapath(options:EvaulateOptions): Promise<string|undefined> {

    if(typeof options.metaschema==='undefined'||options.metaschema===""){
        options.metaschema = "https://raw.githubusercontent.com/usnistgov/OSCAL/main/src/metaschema/oscal_complete_metaschema.xml"
    }
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
  
  const args = ['-e "'+options.expression+'"',"-m "+options.metaschema,`-i ${options.document}`]

  try {
    const command = "metaschema metapath eval";

    const [result,errors] =await executeOscalCliCommand(command, args);
    console.error(errors);
    const parsedOutput="["+parseMetaPathFromOutput(result).join(",")+"]";
    return parsedOutput;
} catch (error) {
    console.error("Error evaluating metapath", error);
    return ;
  }
}

function parseMetaPathFromOutput(output:string):string[] {
    const lines = output.split('\n').filter(line => line.trim() !== '');
    const metapaths:string[] = [];

    for (const line of lines) {
        if (line.includes('file:')) {
            console.log(line);
                metapaths.push(line);
        }
    }

    return metapaths;
}
