Feature: OSCAL validate object

@lib
Scenario: Validating an OSCAL definition against AJV with inline function
  Given I have an example OSCAL definition "control"  
  And I have an example OSCAL object "control"  
  When I validate with imported validateDefinition function
  Then I should receive a validation object
  And the validation result should be valid
