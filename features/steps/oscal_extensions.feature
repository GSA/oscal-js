Feature: OSCAL Document Constraints

@constraints
Scenario: Validating an OSCAL document with metaschema constraints
  Given I have an OSCAL document "profile.json"
  And I have an Metaschema extensions document "oscal-external-constraints.xml"
  When I validate with imported validate function
  Then I should receive a validation object
  And the validation result should be valid

@constraints
Scenario: Validating an OSCAL document with metaschema constraints
  Given I have an OSCAL document "ssp.xml"
  And I have an Metaschema extensions document "oscal-external-constraints.xml"
  And I have a second Metaschema extensions document "fedramp-external-constraints.xml"
  When I validate with imported validate function
  Then I should receive a validation object
  And the validation result should be valid

@constraints
Scenario: Validating an OSCAL document with metaschema constraints
  Given I have an Metaschema extensions document "oscal-external-constraints.xml"
  And I have an Metaschema extensions document "fedramp-external-constraints.xml"
  When I look for a constraint by ID "<constraint_id>"
  Then I should Find a node in the constraint file

 Examples:
      | constraint_id |
      | OSCAL-CON-001 |
      | OSCAL-CON-002 |
      | OSCAL-CON-003 |
      | FED-CON-001   |
      | FED-CON-002   |
      | FED-CON-003   |
      | PROF-CON-001  |
      | PROF-CON-002  |
      | SSP-CON-001   |
      | SSP-CON-002   |