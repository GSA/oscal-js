Feature: OSCAL Operations with Multiple Executors

  Scenario Outline: Detect OSCAL document type
    Given I have an OSCAL document "ssp.xml"
    When I detect the document type
    Then the document type should be "ssp"

  Scenario Outline: Check OSCAL tool installation
    When I check if "<tool>" is installed
    Then I should receive a boolean result
    Examples:
      | tool         |
      | oscal-cli    |
      | oscal-server |

  # Scenario Outline: Install OSCAL tool
  #   When I install "<tool>"
  #   Then "<tool>" should be installed
  #   Examples:
  #     | tool         |
  #     | oscal-cli    |
  #     | oscal-server |

  Scenario Outline: Execute OSCAL CLI command
    Given I have an OSCAL document "ssp.xml"
    When I execute the OSCAL CLI command "validate" on the document
    Then I should receive the execution result

  Scenario Outline: Convert OSCAL document from XML to JSON
    Given I have an OSCAL document "ssp.xml"
    When I convert the document to JSON using "<executor>"
    Then I should receive the conversion result
    And conversion result is a json
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

  Scenario Outline: Convert OSCAL document from XML to YAML
    Given I have an OSCAL document "ssp.xml"
    When I convert the document to YAML using "<executor>"
    Then I should receive the conversion result
    And conversion result is a yaml
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

  Scenario Outline: Get sarif output for invalid XML
    Given I have an OSCAL document "invalid-ssp.xml"
    When I validate with sarif output on the document using "<executor>"
    Then I should receive the sarif output
    And we should have errors in the sarif output
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

  Scenario Outline: Get sarif output for valid XML
    Given I have an OSCAL document "ssp.xml"
    When I validate with sarif output on the document using "<executor>"
    Then I should receive the sarif output
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

  Scenario Outline: Get sarif output for valid JSON
    Given I have an OSCAL document "profile.json"
    When I validate with sarif output on the document using "<executor>"
    Then I should receive the sarif output
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

  Scenario Outline: Get sarif output for valid XML with metaschema extensions
    Given I have an OSCAL document "<oscal_document>"
    And I have a Metaschema extensions document "fedramp-external-constraints.xml"
    When I validate with metaschema extensions and sarif output on the document using "<executor>"
    Then I should receive the sarif output
    Examples:
      | executor     | oscal_document|
      | oscal-cli    | ssp.xml|
      | oscal-server |invalid-|

  Scenario Outline: Get sarif output for invalid XML with metaschema extensions
    Given I have an OSCAL document "invalid-ssp.xml"
    And I have a Metaschema extensions document "fedramp-external-constraints.xml"
    When I validate with metaschema extensions and sarif output on the document using "<executor>"
    Then I should receive the sarif output
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

  Scenario Outline: Validate JavaScript object inline
    Given I have an OSCAL document "profile.json"
    When I validate with imported validate function using "<executor>"
    Then I should receive a validation object
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

  Scenario Outline: Convert JavaScript object inline
    Given I have an OSCAL document "profile.xml"
    And I want an OSCAL document "converted-profile.json"
    When I convert it with imported convert function using "<executor>"
    Then I should receive a valid json object
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

  Scenario Outline: Resolve an XML profile
    Given I have an OSCAL document "profile.xml"
    And I want to resolve the profile
    When I resolve it with imported resolve function using "<executor>"
    Then the resolved profile should be valid
    Examples:
      | executor     |
      | oscal-cli    |
      | oscal-server |

