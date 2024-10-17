import { executeOscalCliCommand } from './env.js';
import { detectOscalDocumentType } from './utils.js';
import { getServerClient } from './server.js';

interface EvaluateOptions {
  document: string;
  expression: string;
  metaschema?: string;
  server?: boolean;
}

export async function evaluateMetapathCommand(fileArg,options: EvaluateOptions): Promise<void> {
  options.document = fileArg;
  const result = await evaluateMetapath(options);
  console.log(result);
}

export async function evaluateMetapath(options: EvaluateOptions): Promise<string | undefined> {
  options.metaschema = `https://raw.githubusercontent.com/usnistgov/OSCAL/main/src/metaschema/oscal_complete_metaschema.xml`;
  const executor = options.server? 'oscal-server':'oscal-cli';

  if (executor === 'oscal-server') {
    try {
      return await evaluateMetapathWithServer(options);
    } catch (error) {
      console.warn("Server evaluation failed. Falling back to CLI evaluation.");
      return await evaluateMetapathWithCli(options);
    }
  } else {
    return await evaluateMetapathWithCli(options);
  }
}

async function evaluateMetapathWithServer(options: EvaluateOptions): Promise<string | undefined> {
  try {
    const client = await getServerClient();
    const { response, error ,data} = await client.GET('/query', {

      params: { 
        query: { 
          document: `${options.document.trim()}`,
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
    return parseMetaPathFromOutput(result);
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
    if (errors) console.error(errors);
    return parseMetaPathFromOutput(result);
  } catch (error) {
    console.error("Error evaluating metapath with CLI", error);
    return undefined;
  }
}

function parseMetaPathFromOutput(output: string): string {
  const lines = output.split('\n').filter(line => line.trim() !== '');
  return lines.pop() || "";
}