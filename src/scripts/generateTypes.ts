import { compile, compileFromFile } from 'json-schema-to-typescript';
import fs from 'fs/promises';

interface Schema {
    $id?: string;
    $ref?: string;
    definitions?: Record<string, any>;
    oneOf?: Array<{
        properties: Record<string, any>;
        required?: string[];
    }>;
    [key: string]: any;
}

interface SchemaDefinition {
    $id: string;
    // Add other properties as needed
}

interface SchemaObject {
    definitions: {
        [key: string]: SchemaDefinition;
    };
    // Add other properties as needed
}

function findConflictingDefinitions(schema: SchemaObject): void {
    const definitions = schema.definitions;
    const groupedDefinitions: { [key: string]: SchemaDefinition[] } = {};

    // Group definitions by the part after the colon in $id
    for (const [key, def] of Object.entries(definitions)) {
        if (def.$id) {
            const name = def.$id.split(':').pop() || '';
            if (!groupedDefinitions[name]) {
                groupedDefinitions[name] = [];
            }
            groupedDefinitions[name].push(def);
        }
    }

    // Find and print conflicting definitions
    for (const [name, defs] of Object.entries(groupedDefinitions)) {
        if (defs.length > 1) {
            const namespaces = new Set(defs.map(def => def.$id.split(':')[0]));
            if (namespaces.size > 1) {
                console.log(`Conflicting definitions for "${name}":`);
                defs.forEach(def => console.log(`  - ${def.$id}`));
                console.log();
            }
        }
    }
    return JSON.parse(JSON.stringify(schema));
}

function transformSchema(schema: Schema): Schema {
    function processObject(obj: any): any {
        if (typeof obj !== 'object' || obj === null) return obj;

        // Process $id
        if (obj.$id && typeof obj.$id === 'string') {
            obj.$id = obj.$id.replace(/#(assembly_)?(field_)?(oscal-complete-?)?(oscal-[a-zA-Z-]+[_:])?/, '#');
        }

        // Process $ref
        if (obj.$ref && typeof obj.$ref === 'string') {
            obj.$ref = obj.$ref.replace(/#(assembly_)?(field_)?(oscal-complete-?)?(oscal-[a-zA-Z-]+[_:])?/, '#');
            // Ensure references include #/definitions/
            if (obj.$ref.startsWith('#') && !obj.$ref.startsWith('#/definitions/')) {
                obj.$ref = obj.$ref.replace('#', '#/definitions/');
            }
        }

        // Fix for #json-schema-directive
        if (obj.$ref === '#json-schema-directive') {
            delete obj.$ref;
            obj.type = 'string';
            obj.format = 'uri';
        }

        // Process all properties recursively
        for (let key in obj) {
            const newKey = key.replace(/^(field_)?(oscal-complete-)?(oscal-[a-zA-Z-]+[_:])?/, '');
            obj[newKey] = processObject(obj[key]);
            if (newKey !== key) {
                delete obj[key];
            }
        }

        return obj;
    }

    schema = processObject(schema);

    // Process root elements
    if (schema.oneOf) {
        schema.oneOf = schema.oneOf.map(item => {
            const properties = item.properties;
            const newProperties: Record<string, any> = {};
            for (let key in properties) {
                if (key === '$schema') {
                    newProperties[key] = properties[key];
                } else {
                    const newKey = key.replace(/^(field_)?(oscal-complete-)?(oscal-[a-zA-Z-]+:)?/, '');
                    newProperties[newKey] = properties[key];
                }
            }
            item.properties = newProperties;
            if (item.required) {
                item.required = item.required.map(req => req.replace(/^(field_)?(oscal-complete-)?(oscal-[a-zA-Z-]+:)?/, ''));
            }
            return item;
        });
    }

    // Final pass to catch any remaining references
    const schemaString = JSON.stringify(schema);
    const updatedSchemaString = schemaString
        .replace(/#(assembly_)?(field_)?(oscal-complete-?)?(oscal-[a-zA-Z-]+[_:])?/g, '#')
        .replace(/(?<!^|[{,]"\s*)(field_)?(oscal-complete-)?(oscal-[a-zA-Z-]+[_:])?/g, '')
        .replace(/"#([^/])/g, '"#/definitions/$1'); // Ensure all internal references include #/definitions/

    return JSON.parse(updatedSchemaString);
}

// Read and parse the JSON file
fs.readFile('./src/schema/oscal.complete.json', 'utf8')
    .then(JSON.parse)
    // .then(findConflictingDefinitions)
    // .then(transformSchema)
    // .then(ts => {
    //     return fs.writeFile('oscal.complete.json', JSON.stringify(ts, null, 2))
    //         .then(() => ts);
    // })
    .then(schema => compile(schema, 'OSCAL', { bannerComment: '' }))
    .then(ts => fs.writeFile('./index.d.ts', ts))
    // .catch(error => console.error('Error:', error));