import inquirer from "inquirer";
import OpenAI from "openai";
import { oscalSchema } from "./schema/oscal.complete.js";
import { OscalDefinition, OscalDefinitions, validateDefinition } from "./validate.js";
import $RefParser from "@apidevtools/json-schema-ref-parser";

export async function getOpenAIKey(): Promise<string> {
  const openaiKey = process.env.OPENAI_KEY;

  if (openaiKey) {
    return openaiKey;
  } else {
    console.log("inquiring");
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Please enter your OpenAI API key:',
      },
    ]);
    return answers.apiKey;
  }
}

export interface GenerateOptions {
  prompt?: string;
  type?: string;
}

export async function generateOSCALDocument(options: GenerateOptions) {
  let { prompt } = options;
  let type = options.type as OscalDefinition;

  // Use inquirer to get missing information
  if (!type) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select the OSCAL type:',
        choices: OscalDefinitions,
      },
    ]);
    type = answer.type as keyof typeof oscalSchema.definitions;
  }

  if (!prompt) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'prompt',
        message: 'Describe your OSCAL item:',
      },
    ]);
    prompt = answer.prompt;
  }

  console.log(`Generating ${type} in JSON format`);

  try {
    const apiKey = await getOpenAIKey();

    // Set up OpenAI API configuration
    const openAi = new OpenAI({
      apiKey: apiKey,
    });

    // Load the schema file
    if (!oscalSchema.definitions[type]) {
      console.log(`Invalid type: ${type}`);
      return;
    }

    // Use $RefParser to dereference the schema
    let dereferencedSchema;
    try {
      dereferencedSchema = await $RefParser.dereference(oscalSchema,{mutateInputSchema:false,dereference:{circular:'ignore'}});
    } catch (err) {
      console.error('Error dereferencing schema:', err);
      return;
    }

    const validate = (data: any) => validateDefinition(type as any, data);

    let isValid = false;
    let generatedContent: any;
    let attempts = 0;
    let lastErrors: any[] = [];
    while (!isValid && attempts < 10) {
      attempts++;
      console.log(`Attempt ${attempts} of 10`);

      // Create the prompt with the dereferenced schema included
console.log(JSON.stringify(dereferencedSchema.definitions[type]))
      const fullPrompt = `
Here is the dereferenced OSCAL ${type} schema:

${JSON.stringify(dereferencedSchema.definitions[type], null, 2)}

Please generate an OSCAL ${type} in JSON format that adheres to this schema, with the following content: ${prompt}

${lastErrors.length > 0 ? `The previous attempt had the following errors, please fix them:\n${JSON.stringify(lastErrors, null, 2)}` : ''}

Make sure the generated document strictly follows the provided schema. Only output the fully qualified JSON content, in markdown format.
`;

      // Call the OpenAI API to generate the document
      const response = await openAi.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: fullPrompt }],
      });

      const content = response.choices[0]?.message?.content || '';

      // Extract JSON content from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json|markdown)?\s*([\s\S]*?)\s*```/);
      const jsonContent = jsonMatch ? jsonMatch[1].trim() : content.trim();

      // Try to parse the content as JSON
      try {
        generatedContent = JSON.parse(jsonContent);

        // Validate the generated content
        const { isValid: valid, errors } = validate(generatedContent);
        if (valid) {
          isValid = true;
          console.log("\nGenerated valid OSCAL document:");
          console.log(JSON.stringify(generatedContent, null, 2));
        } else {
          console.log("\nGenerated content is not valid. Errors:", errors);
          lastErrors = errors as any;
        }
      } catch (error) {
        console.log("\nError parsing generated content:", error);
        console.log("Raw content:", jsonContent);
        lastErrors = [{ message: "Failed to parse JSON content" }];
      }
    }

    if (!isValid) {
      console.log("Failed to generate a valid OSCAL document after 10 attempts.");
    }

  } catch (error) {
    console.error('Error generating OSCAL document:', error);
  }
}