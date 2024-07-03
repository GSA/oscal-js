# OSCAL CLI
The OSCAL CLI is a command-line interface tool for working with OSCAL (Open Security Controls Assessment Language) documents. It provides functionality to validate, convert, and scaffold OSCAL documents.
Installation
To use the OSCAL CLI, follow these steps:
Install the dependencies:
```
npm install oscal -g
```

# Usage
The OSCAL CLI provides the following commands:
### Validate
To validate an OSCAL document, use the validate command:
```
oscal validate -f <path_to_oscal_document>

oscal validate -f <path_to_oscal_document> -e fedramp

```
Replace <path_to_oscal_document> with the path to the OSCAL document you want to validate.
### Convert
To convert an OSCAL document between XML and JSON formats, use the convert command:
```
oscal convert -f <path_to_input_file> -o <path_to_output_file>
```
Replace <path_to_input_file> with the path to the input OSCAL document and <path_to_output_file> with the desired path for the converted output file.
### Scaffold
To scaffold an OSCAL package, use the scaffold command:
```
oscal scaffold 
```
Replace <path_to_output_directory> with the path where you want to create the scaffolded OSCAL package.
### Scaffold
To generate an OSCAL item, use the scaffold command:
```
oscal generate -t <oscal type> -p <describe details>
```
### Testing
The OSCAL CLI includes a test suite using Jest. To run the tests, use the following command:
```
npm test
```
### Resolve
To resolve an OSCAL package, use the resolve command:
```
oscal resolve -i <paths>  -o <path_to_output_directory>
```
Replace <paths> with the path paths to the profiles to resolve.
Replace <path_to_output_directory> with the path where you want to create the resolved OSCAL package.

# Dependencies
The OSCAL CLI relies on the following dependencies:

- commander: For parsing command-line arguments
- xml2js: For parsing and converting XML
- inquirer: For interactive prompts
- jest: For running tests
- babel: For transpiling JavaScript code
- java: For running oscal-cli 


# Contributing
Contributions to the OSCAL CLI are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.
License
The OSCAL CLI is open-source software licensed under the MIT License.

[![Cucumber Report](https://github.com/GSA/oscal-js/actions/workflows/cucumber-report.yaml/badge.svg)](https://github.com/GSA/oscal-js/actions/workflows/cucumber-report.yaml)