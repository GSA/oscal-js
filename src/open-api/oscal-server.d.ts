/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check the health of the server
         * @description Returns the health status of the server and the number of active workers
         */
        get: operations["healthCheck"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Validate remote OSCAL document */
        get: operations["validate"];
        put?: never;
        /** Validate uploaded OSCAL document */
        post: operations["validateUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Resolve OSCAL local document */
        get: operations["resolve"];
        put?: never;
        /** Resolve uploaded OSCAL document */
        post: operations["resolveUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/convert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Convert OSCAL document */
        get: operations["convert"];
        put?: never;
        /** Convert uploaded OSCAL document */
        post: operations["convertUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/query": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Query OSCAL document */
        get: operations["query"];
        put?: never;
        /** Query uploaded OSCAL document */
        post: operations["queryUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        HealthResponse: {
            /** @enum {string} */
            status?: "healthy" | "unhealthy";
            /** @description The number of currently active workers */
            activeWorkers?: number;
        };
        SarifResponse: {
            version?: string;
            runs?: Record<string, never>[];
        };
        Error: {
            error?: string;
        };
    };
    responses: {
        /** @description Successful SARIF response */
        SarifResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["SarifResponse"];
            };
        };
        /** @description Successful OSCAL response */
        OscalResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": string;
                "text/xml": string;
                "text/yaml": string;
            };
        };
        /** @description Bad request */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Internal server error */
        InternalServerError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    healthCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful health check response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
            500: components["responses"]["InternalServerError"];
        };
    };
    validate: {
        parameters: {
            query: {
                /**
                 * @description URI of an OSCAL document to validate
                 * @example https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/content/ssp-all-VALID.xml
                 */
                document: string;
                /**
                 * @description URIs of metaschema extension modules to load
                 * @example [
                 *       "https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/fedramp-external-constraints.xml",
                 *       "https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/fedramp-external-constraints.xml"
                 *     ]
                 */
                constraint?: string[];
                /**
                 * @description URIs of metaschema extension modules to load
                 * @example disable-schema
                 */
                flags?: ("disable-schema" | "disable-constraint")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["SarifResponse"];
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalServerError"];
        };
    };
    validateUpload: {
        parameters: {
            query?: {
                /**
                 * @description URIs of metaschema extension modules to load
                 * @example [
                 *       "https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/fedramp-external-constraints.xml",
                 *       "https://raw.githubusercontent.com/GSA/fedramp-automation/refs/heads/develop/src/validations/constraints/fedramp-external-constraints.xml"
                 *     ]
                 */
                constraint?: string[];
                /**
                 * @description URIs of metaschema extension modules to load
                 * @example disable-schema
                 */
                flags?: ("disable-schema" | "disable-constraint")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            200: components["responses"]["SarifResponse"];
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalServerError"];
        };
    };
    resolve: {
        parameters: {
            query: {
                /**
                 * @description Absolute Path of the local OSCAL document to resolve
                 * @example [
                 *       "/Users/esper/fedramp-automation/dist/content/rev5/baselines/json/FedRAMP_rev5_HIGH-baseline_profile.json"
                 *     ]
                 */
                document: string;
                /**
                 * @description Specify the format of the response
                 * @example json
                 */
                format?: "json" | "yaml" | "xml";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["OscalResponse"];
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalServerError"];
        };
    };
    resolveUpload: {
        parameters: {
            query?: {
                /**
                 * @description Specify the format of the response
                 * @example json
                 */
                format?: "json" | "yaml" | "xml";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            200: components["responses"]["OscalResponse"];
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalServerError"];
        };
    };
    convert: {
        parameters: {
            query: {
                /** @description URI of the remote OSCAL document to convert */
                document: string;
                /**
                 * @description Specify the format of the response
                 * @example json
                 */
                format?: "json" | "yaml" | "xml";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["OscalResponse"];
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalServerError"];
        };
    };
    convertUpload: {
        parameters: {
            query?: {
                /**
                 * @description Specify the format of the response
                 * @example json
                 */
                format?: "json" | "yaml" | "xml";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            200: components["responses"]["OscalResponse"];
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalServerError"];
        };
    };
    query: {
        parameters: {
            query: {
                /**
                 * @description URI of the remote OSCAL document to convert
                 * @example https://raw.githubusercontent.com/wandmagic/fedramp-automation/refs/heads/develop/src/validations/constraints/content/ssp-all-VALID.xml
                 */
                document: string;
                /**
                 * @description metapath expression to query oscal document
                 * @example //user
                 */
                expression?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["OscalResponse"];
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalServerError"];
        };
    };
    queryUpload: {
        parameters: {
            query: {
                /**
                 * @description metapath expression to query oscal document
                 * @example //user
                 */
                expression: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            200: components["responses"]["OscalResponse"];
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalServerError"];
        };
    };
}
