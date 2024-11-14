import { executeOscalCliCommand } from './env.js';
import {  resolveUri } from './utils.js';
import { getServerClient } from './server.js';

interface EvaluateOptions {
  document: string;
  expression: string;
  metaschema?: string;
  executor?: 'oscal-cli'|'oscal-server';
}

export async function evaluateMetapathCommand(fileArg,options: any): Promise<void> {
  options.document = fileArg;
  options.executor = options.server?"oscal-server":'oscal-cli'
  const result = await evaluateMetapathDocument(options);
  console.log(result);
}


export async function evaluateMetapathDocument(options: EvaluateOptions): Promise<string | undefined> {

  if (options.executor === 'oscal-server') {
    try {
      return await evaluateMetapathWithServer(options);
    } catch (error) {
      console.warn("Server evaluation failed. Falling back to CLI evaluation.");
    }
  } 
  options.metaschema = `https://raw.githubusercontent.com/usnistgov/OSCAL/main/src/metaschema/oscal_complete_metaschema.xml`;
  return await evaluateMetapathWithCli(options);

}

async function evaluateMetapathWithServer(options: EvaluateOptions): Promise<string | undefined> {
  try {
    const client = await getServerClient();
    const { response, error ,data} = await client.GET('/query', {

      params: { 
        query: { 
          document: resolveUri(`${options.document.trim()}`),
          expression: options.expression
        } 
      },
      parseAs:"blob",
      headers: { Accept: 'text/xml' }
    });

    if (!response.ok) {
      console.error(error?.error);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!data) {
      console.error("Data not found");
      throw new Error(`HTTP error! missing data!`);
    }

    const result = await data.text();
    return result;
  } catch (error) {
    console.error('Error during server evaluation:', error);
    throw error;
  }
}

async function evaluateMetapathWithCli(options: EvaluateOptions): Promise<string | undefined> {
  const args = [
    `-e "${options.expression}"`,
    `-m ${options.metaschema}`,
    `-i ${options.document}`
  ];

  try {
    const command = "metaschema metapath eval";
    const [result, errors] = await executeOscalCliCommand(command, args);
    console.log(result)
    if (errors) console.error(errors);
    return parseMetaPathFromOutput(result);
  } catch (error) {
    console.error("Error evaluating metapath with CLI", error);
    return undefined;
  }
}

function parseMetaPathFromOutput(output: string): string {
  const lines = output.split('\n').filter(line => line.trim() !== '').filter(x=>x.includes("#"));
  console.log(lines);
  return lines.pop() || "";
}
export async function evaluateMetapath(options: {
  document: any;
  expression: string;
  metaschema?: string;
  server?: boolean;
}): Promise<string | undefined> {
  if(options.server){
    return await evaluateMetapathWithFileUpload(options) 
  }else{
    return await evaluateMetapathWithCli(options)
  }
}
async function evaluateMetapathWithFileUpload(options: {
  document: any;
  expression: string;
  metaschema?: string;
}): Promise<string | undefined> {
  try {
    const client = await getServerClient();
    const { response, error, data } = await client.POST('/query', {
      body: options.document, // Remove JSON.stringify since client will handle it
      params: {
        query: {
          expression: options.expression
        }
      },
      parseAs: "text", // Changed from "blob" since we expect text/sarif
      headers: { Accept: 'text/xml' } // Changed to json since server returns SARIF
    });

    if (!response.ok) {
      console.error(error?.error);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!data) {
      console.error("Data not found");
      throw new Error(`HTTP error! missing data!`);
    }

    // Since we get SARIF back, parse it and extract the result
    const sarifData = JSON.parse(data);
    return parseMetaPathFromOutput(sarifData);
  } catch (error) {
    console.error('Error during direct document evaluation:', error);
    throw error;
  }
}