import { executeOscalCliCommand, installOscalCli, isOscalExecutorInstalled } from './env.js';
import { detectOscalDocumentType } from './utils.js';

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
      const [documentType,fileFormat]=await detectOscalDocumentType(options.document)
      const metaschemaMap = {
        'catalog': 'oscal_catalog_metaschema.xml',
        'profile': 'oscal_profile_metaschema.xml',
        'component': 'oscal_component_metaschema.xml',
        'ssp': 'oscal_ssp_metaschema.xml',
        'poam': 'oscal_poam_metaschema.xml',
        'assessment-plan': 'oscal_assessment-plan_metaschema.xml',
        'assessment-results': 'oscal_assessment-results_metaschema.xml'
    }

    const metaschemaFile = metaschemaMap[documentType] || 'oscal_complete_metaschema.xml'
     
    options.metaschema = `https://raw.githubusercontent.com/usnistgov/OSCAL/main/src/metaschema/${metaschemaFile}`
  }
  
  const args = ['-e "'+options.expression+'"',"-m "+options.metaschema,`-i ${options.document}`]

  try {
    const command = "metaschema metapath eval";

    const [result,errors] =await executeOscalCliCommand(command, args);
    return parseMetaPathFromOutput(result);
} catch (error) {
    console.error("Error evaluating metapath", error);
    return ;
  }
}

function parseMetaPathFromOutput(output:string):string {
    const lines = output.split('\n').filter(line => line.trim() !== '');
    return lines.pop()||"";
}
