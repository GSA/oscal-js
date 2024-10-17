# OSCAL npm package

The OSCAL npm package is a command-line interface tool and wrapper for working with OSCAL (Open Security Controls Assessment Language) documents. It provides an easy way to install, update, and use the Java-based OSCAL CLI and OSCAL Server tools.

## Key Features

- Serves as a wrapper around the Java-based OSCAL CLI and OSCAL Server
- Provides an npm-based installation method for OSCAL CLI and OSCAL Server
- Offers functionality to validate, convert, resolve, and scaffold OSCAL documents
- Allows easy version management and switching between OSCAL CLI versions

## Installation

To use the OSCAL npm package, follow these steps:

1. Install the package globally:

```
npm install oscal -g
```

2. This will install the OSCAL npm package, which will then download and set up the latest version of the OSCAL CLI and OSCAL Server tools.

## Usage

The OSCAL npm package provides the following commands:

### Validate

To validate an OSCAL document:

```
oscal validate -f <path_to_oscal_document>
oscal validate -f <path_to_oscal_document> -e fedramp
```

### Convert

To convert an OSCAL document between XML, JSON, and YAML formats:

```
oscal convert -f <path_to_input_file> -o <path_to_output_file>
```

### Resolve

To resolve an OSCAL profile:

```
oscal resolve -i <paths> -o <path_to_output_directory>
```

### Scaffold

To scaffold an OSCAL package:

```
oscal scaffold -o <path_to_output>
```

### Server

To start the OSCAL Server:

```
oscal server start
```

### Version Management

To switch to or install a specific OSCAL CLI version:

```
oscal use <version>
```

## Using OSCAL Functions in Code

You can also use OSCAL functions directly in your JavaScript or TypeScript code:

```javascript
import { validate, fedrampValidationOptions } from 'oscal';

const document = {
  // Your OSCAL JSON document here
};

async function validateDocument() {
  try {
    const result = await validate(document, fedrampValidationOptions);
    if (result.isValid) {
      console.log('The document is valid.');
    } else {
      console.log('The document is invalid. Errors:');
      result.errors?.forEach(error => console.log(error));
    }
  } catch (error) {
    console.error('An error occurred during validation:', error);
  }
}

validateDocument();
```

## Dependencies

The OSCAL npm package relies on the following key dependencies:

- commander: For parsing command-line arguments
- xml2js: For parsing and converting XML
- inquirer: For interactive prompts
- cucumber: For running tests
- java: For running oscal-cli and oscal-server

## Contributing

Contributions to the OSCAL npm package are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

The OSCAL npm package is open-source software licensed under the MIT License.

[![Cucumber Report](https://github.com/GSA/oscal-js/actions/workflows/cucumber-report.yaml/badge.svg)](https://github.com/GSA/oscal-js/actions/workflows/cucumber-tests.yaml)