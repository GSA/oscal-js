Feature: OSCAL CLI Wrapper

  Scenario: Detect OSCAL document type
    Given I have an OSCAL document "ssp.xml"
    When I detect the document type
    Then the document type should be "ssp"

  Scenario: Check OSCAL CLI installation
    When I check if OSCAL CLI is installed
    Then I should receive a boolean result

  Scenario: Install OSCAL CLI
    Given OSCAL CLI is not installed
    When I install OSCAL CLI
    Then OSCAL CLI should be installed

  Scenario: Execute OSCAL CLI command
    Given I have an OSCAL document "ssp.xml"
    When I execute the OSCAL CLI command "ssp validate" on the document
    Then I should receive the execution result

  Scenario: Convert OSCAL document from XML to JSON
    Given I have an OSCAL document "ssp.xml"
    When I convert the document to JSON
    Then I should receive the conversion result