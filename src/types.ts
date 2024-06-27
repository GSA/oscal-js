export type OscalJsonPackage =
  | {
      $schema?: SchemaDirective;
      catalog: Catalog;
    }
  | {
      $schema?: SchemaDirective;
      profile: Profile;
    }
  | {
      $schema?: SchemaDirective;
      "component-definition": ComponentDefinition;
    }
  | {
      $schema?: SchemaDirective;
      "system-security-plan": SystemSecurityPlanSSP;
    }
  | {
      $schema?: SchemaDirective;
      "assessment-plan": SecurityAssessmentPlanSAP;
    }
  | {
      $schema?: SchemaDirective;
      "assessment-results": SecurityAssessmentResultsSAR;
    }
  | {
      $schema?: SchemaDirective;
      "plan-of-action-and-milestones": PlanOfActionAndMilestonesPOAM;
    };
/**
 * A JSON Schema directive to bind a specific schema to its document instance.
 */
export type SchemaDirective = string;
/**
 * Provides a globally unique means to identify a given catalog instance.
 */
export type CatalogUniversallyUniqueIdentifier = string;
/**
 * A name given to the document, which may be used by a tool for display and navigation.
 */
export type MetadataDocumentTitle = string;
/**
 * The date and time the document was last made available.
 */
export type PublicationTimestamp = string;
/**
 * The date and time the document was last stored for later retrieval.
 */
export type LastModifiedTimestamp = string;
/**
 * Used to distinguish a specific revision of an OSCAL document from other previous and future versions.
 */
export type DocumentVersion = string;
/**
 * The OSCAL model version the document was authored against and will conform to as valid.
 */
export type OSCALVersion = string;
/**
 * A name given to the document revision, which may be used by a tool for display and navigation.
 */
export type DocumentTitle = string;
/**
 * A textual label, within a namespace, that uniquely identifies a specific attribute, characteristic, or quality of the property's containing object.
 */
export type PropertyName = string;
/**
 * A unique identifier for a property.
 */
export type PropertyUniversallyUniqueIdentifier = string;
/**
 * A namespace qualifying the property's name. This allows different organizations to associate distinct semantics with the same name.
 */
export type PropertyNamespace = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type PropertyValue = string;
/**
 * A textual label that provides a sub-type or characterization of the property's name.
 */
export type PropertyClass = string;
/**
 * An identifier for relating distinct sets of properties.
 */
export type PropertyGroup = string;
/**
 * Additional commentary about the containing object.
 */
export type Remarks = string;
/**
 * A resolvable URL reference to a resource.
 */
export type HypertextReference = string;
/**
 * Describes the type of relationship provided by the link's hypertext reference. This can be an indicator of the link's purpose.
 */
export type LinkRelationType = TokenDatatype | "reference";
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type TokenDatatype = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type MediaType = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type ResourceFragment = string;
/**
 * A textual label to associate with the link, which may be used for presentation in a tool.
 */
export type LinkText = string;
/**
 * Qualifies the kind of document identifier using a URI. If the scheme is not provided the value of the element will be interpreted as a string of characters.
 */
export type DocumentIdentificationScheme = URIDatatype | "http://www.doi.org/";
/**
 * A universal resource identifier (URI) formatted according to RFC3986.
 */
export type URIDatatype = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type StringDatatype = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type RoleIdentifier = string;
/**
 * A name given to the role, which may be used by a tool for display and navigation.
 */
export type RoleTitle = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type RoleShortName = string;
/**
 * A summary of the role's purpose and associated responsibilities.
 */
export type RoleDescription = string;
/**
 * A unique ID for the location, for reference.
 */
export type LocationUniversallyUniqueIdentifier = string;
/**
 * A name given to the location, which may be used by a tool for display and navigation.
 */
export type LocationTitle = string;
/**
 * Indicates the type of address.
 */
export type AddressType = TokenDatatype | ("home" | "work");
/**
 * A single line of an address.
 */
export type AddressLine = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type City = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type StateOrRegion = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type PostalCode = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type CountryCode = string;
/**
 * An email address as defined by RFC 5322 Section 3.4.1.
 */
export type EmailAddress = StringDatatype & string;
/**
 * Indicates the type of phone number.
 */
export type TypeFlag = StringDatatype | ("home" | "office" | "mobile");
/**
 * A universal resource identifier (URI) formatted according to RFC3986.
 */
export type LocationURL = string;
/**
 * A unique identifier for the party.
 */
export type PartyUniversallyUniqueIdentifier = string;
/**
 * A category describing the kind of party the object describes.
 */
export type PartyType = StringDatatype & ("person" | "organization");
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type PartyName = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type PartyShortName = string;
/**
 * Indicates the type of external identifier.
 */
export type ExternalIdentifierSchema = URIDatatype | "http://orcid.org/";
/**
 * Reference to a location by UUID.
 */
export type LocationUniversallyUniqueIdentifierReference = string;
/**
 * A reference to another party by UUID, typically an organization, that this subject is associated with.
 */
export type OrganizationalAffiliation = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ResponsibleRoleId = string;
/**
 * Reference to a party by UUID.
 */
export type PartyUniversallyUniqueIdentifierReference = string;
/**
 * A unique identifier that can be used to reference this defined action elsewhere in an OSCAL document. A UUID should be consistently used for a given location across revisions of the document.
 */
export type ActionUniversallyUniqueIdentifier = string;
/**
 * The date and time when the action occurred.
 */
export type ActionOccurrenceDate = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ActionType = string;
/**
 * A universal resource identifier (URI) formatted according to RFC3986.
 */
export type ActionTypeSystem = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ParameterIdentifier = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ParameterClass = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type DependsOn = string;
/**
 * A short, placeholder name for the parameter, which can be used as a substitute for a value if no value is assigned.
 */
export type ParameterLabel = string;
/**
 * Describes the purpose and use of a parameter.
 */
export type ParameterUsageDescription = string;
/**
 * A textual summary of the constraint to be applied.
 */
export type ConstraintDescription = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type ConstraintTestExpression = string;
/**
 * Prose permits multiple paragraphs, lists, tables etc.
 */
export type GuidelineText = string;
/**
 * A parameter value or set of values.
 */
export type ParameterValue = string;
/**
 * Describes the number of selections that must occur. Without this setting, only one value should be assumed to be permitted.
 */
export type ParameterCardinality = TokenDatatype & ("one" | "one-or-more");
/**
 * A value selection among several such options.
 */
export type Choice = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ControlIdentifier = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ControlClass = string;
/**
 * A name given to the control, which may be used by a tool for display and navigation.
 */
export type ControlTitle = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type PartIdentifier = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type PartName = string;
/**
 * A universal resource identifier (URI) formatted according to RFC3986.
 */
export type PartNamespace = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type PartClass = string;
/**
 * An optional name given to the part, which may be used by a tool for display and navigation.
 */
export type PartTitle = string;
/**
 * Permits multiple paragraphs, lists, tables etc.
 */
export type PartText = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type GroupIdentifier = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type GroupClass = string;
/**
 * A name to be given to the group for use in display.
 */
export type GroupTitle = string;
/**
 * A designation of how a selection of controls in a profile is to be ordered.
 */
export type Order = TokenDatatype & ("keep" | "ascending" | "descending");
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ControlIdentifierReference = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type IncludeSpecificStatements = string;
/**
 * A unique identifier for a resource.
 */
export type ResourceUniversallyUniqueIdentifier = string;
/**
 * An optional name given to the resource, which may be used by a tool for display and navigation.
 */
export type ResourceTitle = string;
/**
 * An optional short summary of the resource used to indicate the purpose of the resource.
 */
export type ResourceDescription = string;
/**
 * A line of citation text.
 */
export type CitationText = string;
/**
 * A resolvable URL pointing to the referenced resource.
 */
export type ResourceHypertextReference = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type ResourceMediaType = string;
/**
 * The digest method by which a hash is derived.
 */
export type HashAlgorithm =
  | StringDatatype
  | ("SHA-224" | "SHA-256" | "SHA-384" | "SHA-512" | "SHA3-224" | "SHA3-256" | "SHA3-384" | "SHA3-512");
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ResourceBase64FileName = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type ResourceBase64MediaType = string;
/**
 * Binary data encoded using the Base 64 encoding algorithm as defined by RFC4648.
 */
export type Base64Datatype = string;
/**
 * Provides a globally unique means to identify a given profile instance.
 */
export type ProfileUniversallyUniqueIdentifier = string;
/**
 * A resolvable URL reference to the base catalog or profile that this profile is tailoring.
 */
export type CatalogOrProfileReference = string;
/**
 * Declare how clashing controls should be handled.
 */
export type CombinationMethod = StringDatatype & ("use-first" | "merge" | "keep");
/**
 * Indicates that the controls selected should retain their original grouping as defined in the import source.
 */
export type GroupAsIs = boolean;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ModifyParameterID = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ModifyParameterClass = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ModifyDependsOn = string;
/**
 * A short, placeholder name for the parameter, which can be used as a substitute for a value if no value is assigned.
 */
export type ModifyParameterLabel = string;
/**
 * Describes the purpose and use of a parameter.
 */
export type ModifyParameterUsageDescription = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type AlterControlIdentifierReference = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type RemovalReferenceByAssignedName = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type RemovalReferenceByClass = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type RemovalReferenceByID = string;
/**
 * Identify items to remove by the name of the item's information object name, e.g. title or prop.
 */
export type ItemNameReference = TokenDatatype & ("param" | "prop" | "link" | "part" | "mapping" | "map");
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ItemNamespaceReference = string;
/**
 * Where to add the new content with respect to the targeted element (beside it or inside it).
 */
export type Position = TokenDatatype & ("before" | "after" | "starting" | "ending");
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type AdditionReferenceByID = string;
/**
 * A name given to the control, which may be used by a tool for display and navigation.
 */
export type AdditionTitleChange = string;
/**
 * Provides a globally unique means to identify a given component definition instance.
 */
export type ComponentDefinitionUniversallyUniqueIdentifier = string;
/**
 * A link to a resource that defines a set of components and/or capabilities to import into this collection.
 */
export type HyperlinkReference = string;
/**
 * Provides a globally unique means to identify a given component.
 */
export type DefinedComponentIdentifier = string;
/**
 * A category describing the purpose of the component.
 */
export type DefinedComponentType =
  | StringDatatype
  | (
      | "interconnection"
      | "software"
      | "hardware"
      | "service"
      | "policy"
      | "physical"
      | "process-procedure"
      | "plan"
      | "guidance"
      | "standard"
      | "validation"
    );
/**
 * A human readable name for the component.
 */
export type DefinedComponentTitle = string;
/**
 * A description of the component, including information about its function.
 */
export type DefinedComponentDescription = string;
/**
 * A summary of the technological or business purpose of the component.
 */
export type DefinedComponentPurpose = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ResponsibleRoleID = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this service protocol information elsewhere in this or other OSCAL instances. The locally defined UUID of the service protocol can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ServiceProtocolInformationUniversallyUniqueIdentifier = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type ProtocolName = string;
/**
 * A human readable name for the protocol (e.g., Transport Layer Security).
 */
export type ProtocolTitle = string;
/**
 * Indicates the starting port number in a port range
 */
export type Start = IntegerDatatype & number;
/**
 * A whole number value.
 */
export type IntegerDatatype = number;
/**
 * Indicates the ending port number in a port range
 */
export type End = IntegerDatatype & number;
/**
 * Indicates the transport type.
 */
export type Transport = TokenDatatype & ("TCP" | "UDP");
/**
 * A statement describing important things to know about how this set of control satisfaction documentation is approached.
 */
export type SSPControlImplementationDescription = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type SetParameterID = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type ParamValue = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this control requirement elsewhere in this or other OSCAL instances. The locally defined UUID of the control requirement can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ControlRequirementUniversallyUniqueIdentifier = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ImplementedControlIdentifierReference = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ControlStatementReference = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this control statement elsewhere in this or other OSCAL instances. The UUID of the control statement in the source OSCAL instance is sufficient to reference the data item locally or globally (e.g., in an imported OSCAL instance).
 */
export type ControlStatementReferenceUniversallyUniqueIdentifier = string;
/**
 * A machine-oriented identifier reference to the component that is implemeting a given control.
 */
export type ByComponentUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this by-component entry elsewhere in this or other OSCAL instances. The locally defined UUID of the by-component entry can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ByComponentUniversallyUniqueIdentifier = string;
/**
 * An implementation statement that describes how a control or a control statement is implemented within the referenced system component.
 */
export type ControlImplementationDescription = string;
/**
 * Identifies the implementation status of the control or control objective.
 */
export type ImplementationState =
  | TokenDatatype
  | ("implemented" | "partial" | "planned" | "alternative" | "not-applicable");
/**
 * An implementation statement that describes the aspects of the control or control statement implementation that can be available to another system leveraging this system.
 */
export type ControlImplementationExportDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this provided entry elsewhere in this or other OSCAL instances. The locally defined UUID of the provided entry can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ProvidedUniversallyUniqueIdentifier = string;
/**
 * An implementation statement that describes the aspects of the control or control statement implementation that can be provided to another system leveraging this system.
 */
export type ProvidedControlImplementationDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this responsibility elsewhere in this or other OSCAL instances. The locally defined UUID of the responsibility can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ResponsibilityUniversallyUniqueIdentifier = string;
/**
 * A machine-oriented identifier reference to an inherited control implementation that a leveraging system is inheriting from a leveraged system.
 */
export type ControlImplementationProvidedUUID = string;
/**
 * An implementation statement that describes the aspects of the control or control statement implementation that a leveraging system must implement to satisfy the control provided by a leveraged system.
 */
export type ControlImplementationResponsibilityDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this inherited entry elsewhere in this or other OSCAL instances. The locally defined UUID of the inherited control implementation can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type InheritedUniversallyUniqueIdentifier = string;
/**
 * A machine-oriented identifier reference to an inherited control implementation that a leveraging system is inheriting from a leveraged system.
 */
export type ProvidedUUID = string;
/**
 * An implementation statement that describes the aspects of a control or control statement implementation that a leveraging system is inheriting from a leveraged system.
 */
export type InheritedControlImplementationDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this satisfied control implementation entry elsewhere in this or other OSCAL instances. The locally defined UUID of the control implementation can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type SatisfiedUniversallyUniqueIdentifier = string;
/**
 * A machine-oriented identifier reference to a control implementation that satisfies a responsibility imposed by a leveraged system.
 */
export type ResponsibilityUUID = string;
/**
 * An implementation statement that describes the aspects of a control or control statement implementation that a leveraging system is implementing based on a requirement from a leveraged system.
 */
export type SatisfiedControlImplementationResponsibilityDescription = string;
/**
 * Provides a globally unique means to identify a given capability.
 */
export type CapabilityIdentifier = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type CapabilityName = string;
/**
 * A summary of the capability.
 */
export type CapabilityDescription = string;
/**
 * A machine-oriented identifier reference to a component.
 */
export type IncorporatingComponentReference = string;
/**
 * A description of the component, including information about its function.
 */
export type IncorporatingComponentDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this system security plan (SSP) elsewhere in this or other OSCAL instances. The locally defined UUID of the SSP can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance).This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type SystemSecurityPlanUniversallyUniqueIdentifier = string;
/**
 * A resolvable URL reference to the profile or catalog to use as the system's control baseline.
 */
export type ProfileReference = string;
/**
 * Identifies the identification system from which the provided identifier was assigned.
 */
export type IdentificationSystemType =
  | URIDatatype
  | (
      | "https://fedramp.gov"
      | "http://fedramp.gov/ns/oscal"
      | "https://ietf.org/rfc/rfc4122"
      | "http://ietf.org/rfc/rfc4122"
    );
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type SystemNameFull = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type SystemNameShort = string;
/**
 * A summary of the system.
 */
export type SystemDescription = string;
/**
 * The date the system received its authorization.
 */
export type SystemAuthorizationDate = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type SecuritySensitivityLevel = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this information type elsewhere in this or other OSCAL instances. The locally defined UUID of the information type can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type InformationTypeUniversallyUniqueIdentifier = string;
/**
 * A human readable name for the information type. This title should be meaningful within the context of the system.
 */
export type InformationTypeTitle = string;
/**
 * A summary of how this information type is used within the system.
 */
export type InformationTypeDescription = string;
/**
 * Specifies the information type identification system used.
 */
export type InformationTypeIdentificationSystem = URIDatatype | "http://doi.org/10.6028/NIST.SP.800-60v2r1";
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type InformationTypeSystematizedIdentifier = string;
/**
 * The prescribed base (Confidentiality, Integrity, or Availability) security impact level.
 */
export type BaseLevelConfidentialityIntegrityOrAvailability = string;
/**
 * The selected (Confidentiality, Integrity, or Availability) security impact level.
 */
export type SelectedLevelConfidentialityIntegrityOrAvailability = string;
/**
 * If the selected security level is different from the base security level, this contains the justification for the change.
 */
export type AdjustmentJustification = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type SecurityObjectiveConfidentiality = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type SecurityObjectiveIntegrity = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type SecurityObjectiveAvailability = string;
/**
 * The current operating status.
 */
export type State = StringDatatype &
  ("operational" | "under-development" | "under-major-modification" | "disposition" | "other");
/**
 * A summary of the system's authorization boundary.
 */
export type AuthorizationBoundaryDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this diagram elsewhere in this or other OSCAL instances. The locally defined UUID of the diagram can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type DiagramID = string;
/**
 * A summary of the diagram.
 */
export type DiagramDescription = string;
/**
 * A brief caption to annotate the diagram.
 */
export type Caption = string;
/**
 * A summary of the system's network architecture.
 */
export type NetworkArchitectureDescription = string;
/**
 * A summary of the system's data flow.
 */
export type DataFlowDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope and can be used to reference this leveraged authorization elsewhere in this or other OSCAL instances. The locally defined UUID of the leveraged authorization can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type LeveragedAuthorizationUniversallyUniqueIdentifier = string;
/**
 * A human readable name for the leveraged authorization in the context of the system.
 */
export type TitleField = string;
/**
 * A machine-oriented identifier reference to the party that manages the leveraged system.
 */
export type PartyUuidField = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this user class elsewhere in this or other OSCAL instances. The locally defined UUID of the system user can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type UserUniversallyUniqueIdentifier = string;
/**
 * A name given to the user, which may be used by a tool for display and navigation.
 */
export type UserTitle = string;
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type UserShortName = string;
/**
 * A summary of the user's purpose within the system.
 */
export type UserDescription = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type RoleIdentifierReference = string;
/**
 * A human readable name for the privilege.
 */
export type PrivilegeTitle = string;
/**
 * A summary of the privilege's purpose within the system.
 */
export type PrivilegeDescription = string;
/**
 * Describes a function performed for a given authorized privilege by this user class.
 */
export type FunctionsPerformed = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this component elsewhere in this or other OSCAL instances. The locally defined UUID of the component can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ComponentIdentifier = string;
/**
 * A category describing the purpose of the component.
 */
export type ComponentType =
  | StringDatatype
  | (
      | "this-system"
      | "system"
      | "interconnection"
      | "software"
      | "hardware"
      | "service"
      | "policy"
      | "physical"
      | "process-procedure"
      | "plan"
      | "guidance"
      | "standard"
      | "validation"
      | "network"
    );
/**
 * A human readable name for the system component.
 */
export type ComponentTitle = string;
/**
 * A description of the component, including information about its function.
 */
export type ComponentDescription = string;
/**
 * A summary of the technological or business purpose of the component.
 */
export type Purpose = string;
/**
 * The operational status.
 */
export type OperatingState = TokenDatatype & ("under-development" | "operational" | "disposition" | "other");
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this inventory item elsewhere in this or other OSCAL instances. The locally defined UUID of the inventory item can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type InventoryItemUniversallyUniqueIdentifier = string;
/**
 * A summary of the inventory item stating its purpose within the system.
 */
export type InventoryItemDescription = string;
/**
 * A machine-oriented identifier reference to a component that is implemented as part of an inventory item.
 */
export type ImplementedComponentUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment plan in this or other OSCAL instances. The locally defined UUID of the assessment plan can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type AssessmentPlanUniversallyUniqueIdentifier = string;
/**
 * A resolvable URL reference to the system security plan for the system being assessed.
 */
export type SystemSecurityPlanReference = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type AssessmentSpecificControlIdentifierReference = string;
/**
 * A human-readable description of this control objective.
 */
export type ObjectiveDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment activity elsewhere in this or other OSCAL instances. The locally defined UUID of the activity can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type AssessmentActivityUniversallyUniqueIdentifier = string;
/**
 * The title for this included activity.
 */
export type IncludedActivityTitle = string;
/**
 * A human-readable description of this included activity.
 */
export type IncludedActivityDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this step elsewhere in this or other OSCAL instances. The locally defined UUID of the step (in a series of steps) can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type StepUniversallyUniqueIdentifier = string;
/**
 * The title for this step.
 */
export type StepTitle = string;
/**
 * A human-readable description of this step.
 */
export type StepDescription = string;
/**
 * A human-readable description of control objectives.
 */
export type ControlObjectiveDescription = string;
/**
 * A human-readable description of in-scope controls specified for assessment.
 */
export type AssessedControlsDescription = string;
/**
 * A human-readable description of this collection of control objectives.
 */
export type ControlObjectivesDescription = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ObjectiveID = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this part elsewhere in this or other OSCAL instances. The locally defined UUID of the part can be used to reference the data item locally or globally (e.g., in an ported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type AssessmentPartIdentifier = string;
/**
 * A textual label that uniquely identifies the part's semantic type.
 */
export type AssessmentPartName = TokenDatatype | ("asset" | "method" | "objective");
/**
 * A universal resource identifier (URI) formatted according to RFC3986.
 */
export type AssessmentPartNamespace = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type AssessmentPartClass = string;
/**
 * A name given to the part, which may be used by a tool for display and navigation.
 */
export type AssessmentPartTitle = string;
/**
 * Permits multiple paragraphs, lists, tables etc.
 */
export type AssessmentPartText = string;
/**
 * Indicates the type of assessment subject, such as a component, inventory, item, location, or party represented by this selection statement.
 */
export type SubjectType = TokenDatatype | ("component" | "inventory-item" | "location" | "party" | "user");
/**
 * A human-readable description of the collection of subjects being included in this assessment.
 */
export type IncludeSubjectsDescription = string;
/**
 * A machine-oriented identifier reference to a component, inventory-item, location, party, user, or resource using it's UUID.
 */
export type SubjectUniversallyUniqueIdentifierReferenceById = string;
/**
 * Used to indicate the type of object pointed to by the uuid-ref within a subject.
 */
export type SubjectUniversallyUniqueIdentifierReferenceTypeById =
  | TokenDatatype
  | ("component" | "inventory-item" | "location" | "party" | "user" | "resource");
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment platform elsewhere in this or other OSCAL instances. The locally defined UUID of the assessment platform can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type AssessmentPlatformUniversallyUniqueIdentifier = string;
/**
 * The title or name for the assessment platform.
 */
export type AssessmentPlatformTitle = string;
/**
 * A machine-oriented identifier reference to a component that is implemented as part of an inventory item.
 */
export type ComponentUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this task elsewhere in this or other OSCAL instances. The locally defined UUID of the task can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type TaskUniversallyUniqueIdentifier = string;
/**
 * The type of task.
 */
export type TaskType = TokenDatatype | ("milestone" | "action");
/**
 * The title for this task.
 */
export type TaskTitle = string;
/**
 * A human-readable description of this task.
 */
export type TaskDescription = string;
/**
 * The task must occur on the specified date.
 */
export type TaskDateTime = string;
/**
 * The task must occur on or after the specified date.
 */
export type TaskStartDateCondition = string;
/**
 * The task must occur on or before the specified date.
 */
export type TaskEndDateCondition = string;
/**
 * The task must occur after the specified period has elapsed.
 */
export type TaskPeriod = IntegerDatatype & number;
/**
 * The unit of time for the period.
 */
export type TaskTimeUnit = StringDatatype & ("seconds" | "minutes" | "hours" | "days" | "months" | "years");
/**
 * A machine-oriented identifier reference to a unique task.
 */
export type DependentTaskUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented identifier reference to an activity defined in the list of activities.
 */
export type ActivityUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment results instance in this or other OSCAL instances. The locally defined UUID of the assessment result can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type AssessmentResultsUniversallyUniqueIdentifier = string;
/**
 * A resolvable URL reference to the assessment plan governing the assessment activities.
 */
export type AssessmentPlanReference = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this set of results in this or other OSCAL instances. The locally defined UUID of the assessment result can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ResultsUniversallyUniqueIdentifier = string;
/**
 * The title for this set of results.
 */
export type ResultsTitle = string;
/**
 * A human-readable description of this set of test results.
 */
export type ResultsDescription = string;
/**
 * Date/time stamp identifying the start of the evidence collection reflected in these results.
 */
export type ResultStartField = string;
/**
 * Date/time stamp identifying the end of the evidence collection reflected in these results. In a continuous motoring scenario, this may contain the same value as start if appropriate.
 */
export type ResultEndField = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference an assessment event in this or other OSCAL instances. The locally defined UUID of the assessment log entry can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type AssessmentLogEntryUniversallyUniqueIdentifier = string;
/**
 * The title for this event.
 */
export type ActionTitle = string;
/**
 * A human-readable description of this event.
 */
export type ActionDescription = string;
/**
 * Identifies the start date and time of an event.
 */
export type ActionStart = string;
/**
 * Identifies the end date and time of an event. If the event is a point in time, the start and end will be the same date and time.
 */
export type ActionEnd = string;
/**
 * A machine-oriented identifier reference to the party who is making the log entry.
 */
export type PartyUUIDReference = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type ActorRole = string;
/**
 * A machine-oriented identifier reference to a unique task.
 */
export type TaskUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented identifier reference to a unique assessment subject placeholder defined by this task.
 */
export type AssessmentSubjectPlaceholderUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this observation elsewhere in this or other OSCAL instances. The locally defined UUID of the observation can be used to reference the data item locally or globally (e.g., in an imorted OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ObservationUniversallyUniqueIdentifier = string;
/**
 * The title for this observation.
 */
export type ObservationTitle = string;
/**
 * A human-readable description of this assessment observation.
 */
export type ObservationDescription = string;
/**
 * Identifies how the observation was made.
 */
export type ObservationMethod = StringDatatype | ("EXAMINE" | "INTERVIEW" | "TEST" | "UNKNOWN");
/**
 * Identifies the nature of the observation. More than one may be used to further qualify and enable filtering.
 */
export type ObservationType =
  | TokenDatatype
  | ("ssp-statement-issue" | "control-objective" | "mitigation" | "finding" | "historic");
/**
 * The kind of actor.
 */
export type ActorType = TokenDatatype & ("tool" | "assessment-platform" | "party");
/**
 * A machine-oriented identifier reference to the tool or person based on the associated type.
 */
export type OriginActorUniversallyUniqueIdentifierReference = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type OriginActorRole = string;
/**
 * A machine-oriented identifier reference to a component, inventory-item, location, party, user, or resource using it's UUID.
 */
export type SubjectUniversallyUniqueIdentifierReference = string;
/**
 * Used to indicate the type of object pointed to by the uuid-ref within a subject.
 */
export type SubjectUniversallyUniqueIdentifierReferenceType =
  | TokenDatatype
  | ("component" | "inventory-item" | "location" | "party" | "user" | "resource");
/**
 * The title or name for the referenced subject.
 */
export type SubjectReferenceTitle = string;
/**
 * A resolvable URL reference to relevant evidence.
 */
export type RelevantEvidenceReference = string;
/**
 * A human-readable description of this evidence.
 */
export type RelevantEvidenceDescription = string;
/**
 * Date/time stamp identifying when the finding information was collected.
 */
export type CollectedField = string;
/**
 * Date/time identifying when the finding information is out-of-date and no longer valid. Typically used with continuous assessment scenarios.
 */
export type ExpiresField = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this risk elsewhere in this or other OSCAL instances. The locally defined UUID of the risk can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type RiskUniversallyUniqueIdentifier = string;
/**
 * The title for this risk.
 */
export type RiskTitle = string;
/**
 * A human-readable summary of the identified risk, to include a statement of how the risk impacts the system.
 */
export type RiskDescription = string;
/**
 * An summary of impact for how the risk affects the system.
 */
export type RiskStatement = string;
/**
 * Describes the status of the associated risk.
 */
export type RiskStatus =
  | TokenDatatype
  | ("open" | "investigating" | "remediating" | "deviation-requested" | "deviation-approved" | "closed");
/**
 * Specifies the source of the threat information.
 */
export type ThreatTypeIdentificationSystem = URIDatatype | ("http://fedramp.gov" | "http://fedramp.gov/ns/oscal");
/**
 * An optional location for the threat data, from which this ID originates.
 */
export type ThreatInformationResourceReference = string;
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type FacetName = string;
/**
 * Specifies the naming system under which this risk metric is organized, which allows for the same names to be used in different systems controlled by different parties. This avoids the potential of a name clash.
 */
export type NamingSystem =
  | URIDatatype
  | (
      | "http://fedramp.gov"
      | "http://fedramp.gov/ns/oscal"
      | "http://csrc.nist.gov/ns/oscal"
      | "http://csrc.nist.gov/ns/oscal/unknown"
      | "http://cve.mitre.org"
      | "http://www.first.org/cvss/v2.0"
      | "http://www.first.org/cvss/v3.0"
      | "http://www.first.org/cvss/v3.1"
    );
/**
 * A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [
 * 	]+
 */
export type FacetValue = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this mitigating factor elsewhere in this or other OSCAL instances. The locally defined UUID of the mitigating factor can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type MitigatingFactorUniversallyUniqueIdentifier = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this implementation statement elsewhere in this or other OSCAL instancess. The locally defined UUID of the implementation statement can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type ImplementationUUID = string;
/**
 * A human-readable description of this mitigating factor.
 */
export type MitigatingFactorDescription = string;
/**
 * The date/time by which the risk must be resolved.
 */
export type RiskResolutionDeadline = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this remediation elsewhere in this or other OSCAL instances. The locally defined UUID of the risk response can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type RemediationUniversallyUniqueIdentifier = string;
/**
 * Identifies whether this is a recommendation, such as from an assessor or tool, or an actual plan accepted by the system owner.
 */
export type RemediationIntent = TokenDatatype | ("recommendation" | "planned" | "completed");
/**
 * The title for this response activity.
 */
export type ResponseTitle = string;
/**
 * A human-readable description of this response plan.
 */
export type ResponseDescription = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this required asset elsewhere in this or other OSCAL instances. The locally defined UUID of the asset can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type RequiredUniversallyUniqueIdentifier = string;
/**
 * The title for this required asset.
 */
export type TitleForRequiredAsset = string;
/**
 * A human-readable description of this required asset.
 */
export type DescriptionOfRequiredAsset = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this risk log entry elsewhere in this or other OSCAL instances. The locally defined UUID of the risk log entry can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type RiskLogEntryUniversallyUniqueIdentifier = string;
/**
 * The title for this risk log entry.
 */
export type RistTitle = string;
/**
 * A human-readable description of what was done regarding the risk.
 */
export type RiskTaskDescription = string;
/**
 * Identifies the start date and time of the event.
 */
export type RistEventStart = string;
/**
 * Identifies the end date and time of the event. If the event is a point in time, the start and end will be the same date and time.
 */
export type RiskEventEnd = string;
/**
 * A machine-oriented identifier reference to a unique risk response.
 */
export type ResponseUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented identifier reference to an observation defined in the list of observations.
 */
export type ObservationUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this finding in this or other OSCAL instances. The locally defined UUID of the finding can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type FindingUniversallyUniqueIdentifier = string;
/**
 * The title for this finding.
 */
export type FindingTitle = string;
/**
 * A human-readable description of this finding.
 */
export type FindingDescription = string;
/**
 * Identifies the type of the target.
 */
export type FindingTargetType = StringDatatype & ("statement-id" | "objective-id");
/**
 * A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.
 */
export type FindingTargetIdentifierReference = string;
/**
 * The title for this objective status.
 */
export type ObjectiveStatusTitle = string;
/**
 * A human-readable description of the assessor's conclusions regarding the degree to which an objective is satisfied.
 */
export type ObjectiveStatusDescription = string;
/**
 * An indication as to whether the objective is satisfied or not.
 */
export type ObjectiveStatusState = TokenDatatype & ("satisfied" | "not-satisfied");
/**
 * The reason the objective was given it's status.
 */
export type ObjectiveStatusReason = TokenDatatype | ("pass" | "fail" | "other");
/**
 * A machine-oriented identifier reference to the implementation statement in the SSP to which this finding is related.
 */
export type ImplementationStatementUUID = string;
/**
 * A machine-oriented identifier reference to an observation defined in the list of observations.
 */
export type FindingRelatedObservationUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented identifier reference to a risk defined in the list of risks.
 */
export type FindingRiskUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented, globally unique identifier with instancescope that can be used to reference this POA&M instance in this OSCAL instance. This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type POAMUniversallyUniqueIdentifier = string;
/**
 * A machine-oriented, globally unique identifier with instance scope that can be used to reference this POA&M item entry in this OSCAL instance. This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.
 */
export type POAMItemUniversallyUniqueIdentifier = string;
/**
 * The title or name for this POA&M item .
 */
export type POAMItemTitle = string;
/**
 * A human-readable description of POA&M item.
 */
export type POAMItemDescription = string;
/**
 * A machine-oriented identifier reference to a finding defined in the list of findings.
 */
export type FindingUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented identifier reference to an observation defined in the list of observations.
 */
export type RelatedObservationUniversallyUniqueIdentifierReference = string;
/**
 * A machine-oriented identifier reference to a risk defined in the list of risks.
 */
export type RiskUniversallyUniqueIdentifierReference = string;

/**
 * A structured, organized collection of control information.
 */
export interface Catalog {
  uuid: CatalogUniversallyUniqueIdentifier;
  metadata: DocumentMetadata;
  /**
   * @minItems 1
   */
  params?: [Parameter, ...Parameter[]];
  /**
   * @minItems 1
   */
  controls?: [Control, ...Control[]];
  /**
   * @minItems 1
   */
  groups?: [ControlGroup, ...ControlGroup[]];
  "back-matter"?: BackMatter;
}
/**
 * Provides information about the containing document, and defines concepts that are shared across the document.
 */
export interface DocumentMetadata {
  title: MetadataDocumentTitle;
  published?: PublicationTimestamp;
  "last-modified": LastModifiedTimestamp;
  version: DocumentVersion;
  "oscal-version": OSCALVersion;
  /**
   * @minItems 1
   */
  revisions?: [RevisionHistoryEntry, ...RevisionHistoryEntry[]];
  /**
   * @minItems 1
   */
  "document-ids"?: [DocumentIdentifier, ...DocumentIdentifier[]];
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  roles?: [Role, ...Role[]];
  /**
   * @minItems 1
   */
  locations?: [Location, ...Location[]];
  /**
   * @minItems 1
   */
  parties?: [Party, ...Party[]];
  /**
   * @minItems 1
   */
  "responsible-parties"?: [ResponsibleParty, ...ResponsibleParty[]];
  /**
   * @minItems 1
   */
  actions?: [Action, ...Action[]];
  remarks?: Remarks;
}
/**
 * An entry in a sequential list of revisions to the containing document, expected to be in reverse chronological order (i.e. latest first).
 */
export interface RevisionHistoryEntry {
  title?: DocumentTitle;
  published?: PublicationTimestamp;
  "last-modified"?: LastModifiedTimestamp;
  version: DocumentVersion;
  "oscal-version"?: OSCALVersion;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * An attribute, characteristic, or quality of the containing object expressed as a namespace qualified name/value pair.
 */
export interface Property {
  name: PropertyName;
  uuid?: PropertyUniversallyUniqueIdentifier;
  ns?: PropertyNamespace;
  value: PropertyValue;
  class?: PropertyClass;
  group?: PropertyGroup;
  remarks?: Remarks;
}
/**
 * A reference to a local or remote resource, that has a specific relation to the containing object.
 */
export interface Link {
  href: HypertextReference;
  rel?: LinkRelationType;
  "media-type"?: MediaType;
  "resource-fragment"?: ResourceFragment;
  text?: LinkText;
}
/**
 * A document identifier qualified by an identifier scheme.
 */
export interface DocumentIdentifier {
  scheme?: DocumentIdentificationScheme;
  identifier: StringDatatype;
}
/**
 * Defines a function, which might be assigned to a party in a specific situation.
 */
export interface Role {
  id: RoleIdentifier;
  title: RoleTitle;
  "short-name"?: RoleShortName;
  description?: RoleDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * A physical point of presence, which may be associated with people, organizations, or other concepts within the current or linked OSCAL document.
 */
export interface Location {
  uuid: LocationUniversallyUniqueIdentifier;
  title?: LocationTitle;
  address?: Address;
  /**
   * @minItems 1
   */
  "email-addresses"?: [EmailAddress, ...EmailAddress[]];
  /**
   * @minItems 1
   */
  "telephone-numbers"?: [TelephoneNumber, ...TelephoneNumber[]];
  /**
   * @minItems 1
   */
  urls?: [LocationURL, ...LocationURL[]];
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * A postal address for the location.
 */
export interface Address {
  type?: AddressType;
  /**
   * @minItems 1
   */
  "addr-lines"?: [AddressLine, ...AddressLine[]];
  city?: City;
  state?: StateOrRegion;
  "postal-code"?: PostalCode;
  country?: CountryCode;
}
/**
 * A telephone service number as defined by ITU-T E.164.
 */
export interface TelephoneNumber {
  type?: TypeFlag;
  number: StringDatatype;
}
/**
 * An organization or person, which may be associated with roles or other concepts within the current or linked OSCAL document.
 */
export interface Party {
  uuid: PartyUniversallyUniqueIdentifier;
  type: PartyType;
  name?: PartyName;
  "short-name"?: PartyShortName;
  /**
   * @minItems 1
   */
  "external-ids"?: [PartyExternalIdentifier, ...PartyExternalIdentifier[]];
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "email-addresses"?: [EmailAddress, ...EmailAddress[]];
  /**
   * @minItems 1
   */
  "telephone-numbers"?: [TelephoneNumber, ...TelephoneNumber[]];
  /**
   * @minItems 1
   */
  addresses?: [Address, ...Address[]];
  /**
   * @minItems 1
   */
  "location-uuids"?: [LocationUniversallyUniqueIdentifierReference, ...LocationUniversallyUniqueIdentifierReference[]];
  /**
   * @minItems 1
   */
  "member-of-organizations"?: [OrganizationalAffiliation, ...OrganizationalAffiliation[]];
  remarks?: Remarks;
}
/**
 * An identifier for a person or organization using a designated scheme. e.g. an Open Researcher and Contributor ID (ORCID).
 */
export interface PartyExternalIdentifier {
  scheme: ExternalIdentifierSchema;
  id: StringDatatype;
}
/**
 * A reference to a set of persons and/or organizations that have responsibility for performing the referenced role in the context of the containing object.
 */
export interface ResponsibleParty {
  "role-id": ResponsibleRoleId;
  /**
   * @minItems 1
   */
  "party-uuids": [PartyUniversallyUniqueIdentifierReference, ...PartyUniversallyUniqueIdentifierReference[]];
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * An action applied by a role within a given party to the content.
 */
export interface Action {
  uuid: ActionUniversallyUniqueIdentifier;
  date?: ActionOccurrenceDate;
  type: ActionType;
  system: ActionTypeSystem;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-parties"?: [ResponsibleParty, ...ResponsibleParty[]];
  remarks?: Remarks;
}
/**
 * Parameters provide a mechanism for the dynamic assignment of value(s) in a control.
 */
export interface Parameter {
  id: ParameterIdentifier;
  class?: ParameterClass;
  "depends-on"?: DependsOn;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  label?: ParameterLabel;
  usage?: ParameterUsageDescription;
  /**
   * @minItems 1
   */
  constraints?: [Constraint, ...Constraint[]];
  /**
   * @minItems 1
   */
  guidelines?: [Guideline, ...Guideline[]];
  /**
   * @minItems 1
   */
  values?: [ParameterValue, ...ParameterValue[]];
  select?: Selection;
  remarks?: Remarks;
}
/**
 * A formal or informal expression of a constraint or test.
 */
export interface Constraint {
  description?: ConstraintDescription;
  /**
   * @minItems 1
   */
  tests?: [ParameterConstraintTest, ...ParameterConstraintTest[]];
}
/**
 * A test expression which is expected to be evaluated by a tool.
 */
export interface ParameterConstraintTest {
  expression: ConstraintTestExpression;
  remarks?: Remarks;
}
/**
 * A prose statement that provides a recommendation for the use of a parameter.
 */
export interface Guideline {
  prose: GuidelineText;
}
/**
 * Presenting a choice among alternatives.
 */
export interface Selection {
  "how-many"?: ParameterCardinality;
  /**
   * @minItems 1
   */
  choice?: [Choice, ...Choice[]];
}
/**
 * A structured object representing a requirement or guideline, which when implemented will reduce an aspect of risk related to an information system and its information.
 */
export interface Control {
  id: ControlIdentifier;
  class?: ControlClass;
  title: ControlTitle;
  /**
   * @minItems 1
   */
  params?: [Parameter, ...Parameter[]];
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  parts?: [Part, ...Part[]];
  /**
   * @minItems 1
   */
  controls?: [Control, ...Control[]];
}
/**
 * An annotated, markup-based textual element of a control's or catalog group's definition, or a child of another part.
 */
export interface Part {
  id?: PartIdentifier;
  name: PartName;
  ns?: PartNamespace;
  class?: PartClass;
  title?: PartTitle;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  prose?: PartText;
  /**
   * @minItems 1
   */
  parts?: [Part, ...Part[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
}
/**
 * A group of (selected) controls or of groups of controls.
 */
export interface ControlGroup {
  id?: GroupIdentifier;
  class?: GroupClass;
  title: GroupTitle;
  /**
   * @minItems 1
   */
  params?: [Parameter, ...Parameter[]];
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  parts?: [Part, ...Part[]];
  /**
   * @minItems 1
   */
  groups?: [ControlGroup, ...ControlGroup[]];
  /**
   * @minItems 1
   */
  "insert-controls"?: [InsertControls, ...InsertControls[]];
}
/**
 * Specifies which controls to use in the containing context.
 */
export interface InsertControls {
  order?: Order;
  "include-all"?: IncludeAll;
  /**
   * @minItems 1
   */
  "include-controls"?: [SelectControl, ...SelectControl[]];
  /**
   * @minItems 1
   */
  "exclude-controls"?: [SelectControl, ...SelectControl[]];
}
/**
 * Include all controls from the imported catalog or profile resources.
 */
export interface IncludeAll {}
/**
 * Used to select a control for inclusion/exclusion based on one or more control identifiers. A set of statement identifiers can be used to target the inclusion/exclusion to only specific control statements providing more granularity over the specific statements that are within the asessment scope.
 */
export interface SelectControl {
  "control-id": ControlIdentifierReference;
  /**
   * @minItems 1
   */
  "statement-ids"?: [IncludeSpecificStatements, ...IncludeSpecificStatements[]];
}
/**
 * A collection of resources that may be referenced from within the OSCAL document instance.
 */
export interface BackMatter {
  /**
   * @minItems 1
   */
  resources?: [Resource, ...Resource[]];
}
/**
 * A resource associated with content in the containing document instance. A resource may be directly included in the document using base64 encoding or may point to one or more equivalent internet resources.
 */
export interface Resource {
  uuid: ResourceUniversallyUniqueIdentifier;
  title?: ResourceTitle;
  description?: ResourceDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  "document-ids"?: [DocumentIdentifier, ...DocumentIdentifier[]];
  citation?: Citation;
  /**
   * @minItems 1
   */
  rlinks?: [ResourceLink, ...ResourceLink[]];
  base64?: Base64;
  remarks?: Remarks;
}
/**
 * An optional citation consisting of end note text using structured markup.
 */
export interface Citation {
  text: CitationText;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
}
/**
 * A URL-based pointer to an external resource with an optional hash for verification and change detection.
 */
export interface ResourceLink {
  href: ResourceHypertextReference;
  "media-type"?: ResourceMediaType;
  /**
   * @minItems 1
   */
  hashes?: [Hash, ...Hash[]];
}
/**
 * A representation of a cryptographic digest generated over a resource using a specified hash algorithm.
 */
export interface Hash {
  algorithm: HashAlgorithm;
  value: StringDatatype;
}
/**
 * A resource encoded using the Base64 alphabet defined by RFC 2045.
 */
export interface Base64 {
  filename?: ResourceBase64FileName;
  "media-type"?: ResourceBase64MediaType;
  value: Base64Datatype;
}
/**
 * Each OSCAL profile is defined by a profile element.
 */
export interface Profile {
  uuid: ProfileUniversallyUniqueIdentifier;
  metadata: DocumentMetadata;
  /**
   * @minItems 1
   */
  imports: [ImportResource, ...ImportResource[]];
  merge?: MergeControls;
  modify?: ModifyControls;
  "back-matter"?: BackMatter;
}
/**
 * Designates a referenced source catalog or profile that provides a source of control information for use in creating a new overlay or baseline.
 */
export interface ImportResource {
  href: CatalogOrProfileReference;
  "include-all"?: IncludeAll;
  /**
   * @minItems 1
   */
  "include-controls"?: [SelectControl, ...SelectControl[]];
  /**
   * @minItems 1
   */
  "exclude-controls"?: [SelectControl, ...SelectControl[]];
}
/**
 * Provides structuring directives that instruct how controls are organized after profile resolution.
 */
export interface MergeControls {
  combine?: CombinationRule;
  flat?: FlatWithoutGrouping;
  "as-is"?: GroupAsIs;
  custom?: CustomGrouping;
}
/**
 * A Combine element defines how to resolve duplicate instances of the same control (e.g., controls with the same ID).
 */
export interface CombinationRule {
  method?: CombinationMethod;
}
/**
 * Directs that controls appear without any grouping structure.
 */
export interface FlatWithoutGrouping {}
/**
 * Provides an alternate grouping structure that selected controls will be placed in.
 */
export interface CustomGrouping {
  /**
   * @minItems 1
   */
  groups?: [ControlGroup, ...ControlGroup[]];
  /**
   * @minItems 1
   */
  "insert-controls"?: [InsertControls, ...InsertControls[]];
}
/**
 * Set parameters or amend controls in resolution.
 */
export interface ModifyControls {
  /**
   * @minItems 1
   */
  "set-parameters"?: [ModifyParameterSetting, ...ModifyParameterSetting[]];
  /**
   * @minItems 1
   */
  alters?: [Alteration, ...Alteration[]];
}
/**
 * A parameter setting, to be propagated to points of insertion.
 */
export interface ModifyParameterSetting {
  "param-id": ModifyParameterID;
  class?: ModifyParameterClass;
  "depends-on"?: ModifyDependsOn;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  label?: ModifyParameterLabel;
  usage?: ModifyParameterUsageDescription;
  /**
   * @minItems 1
   */
  constraints?: [Constraint, ...Constraint[]];
  /**
   * @minItems 1
   */
  guidelines?: [Guideline, ...Guideline[]];
  /**
   * @minItems 1
   */
  values?: [ParameterValue, ...ParameterValue[]];
  select?: Selection;
}
/**
 * Specifies changes to be made to an included control when a profile is resolved.
 */
export interface Alteration {
  "control-id": AlterControlIdentifierReference;
  /**
   * @minItems 1
   */
  removes?: [Removal, ...Removal[]];
  /**
   * @minItems 1
   */
  adds?: [Addition, ...Addition[]];
}
/**
 * Specifies objects to be removed from a control based on specific aspects of the object that must all match.
 */
export interface Removal {
  "by-name"?: RemovalReferenceByAssignedName;
  "by-class"?: RemovalReferenceByClass;
  "by-id"?: RemovalReferenceByID;
  "by-item-name"?: ItemNameReference;
  "by-ns"?: ItemNamespaceReference;
}
/**
 * Specifies contents to be added into controls, in resolution.
 */
export interface Addition {
  position?: Position;
  "by-id"?: AdditionReferenceByID;
  title?: AdditionTitleChange;
  /**
   * @minItems 1
   */
  params?: [Parameter, ...Parameter[]];
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  parts?: [Part, ...Part[]];
}
/**
 * A collection of component descriptions, which may optionally be grouped by capability.
 */
export interface ComponentDefinition {
  uuid: ComponentDefinitionUniversallyUniqueIdentifier;
  metadata: DocumentMetadata;
  /**
   * @minItems 1
   */
  "import-component-definitions"?: [ImportComponentDefinition, ...ImportComponentDefinition[]];
  /**
   * @minItems 1
   */
  components?: [DefinedComponent, ...DefinedComponent[]];
  /**
   * @minItems 1
   */
  capabilities?: [Capability, ...Capability[]];
  "back-matter"?: BackMatter;
}
/**
 * Loads a component definition from another resource.
 */
export interface ImportComponentDefinition {
  href: HyperlinkReference;
}
/**
 * A defined component that can be part of an implemented system.
 */
export interface DefinedComponent {
  uuid: DefinedComponentIdentifier;
  type: DefinedComponentType;
  title: DefinedComponentTitle;
  description: DefinedComponentDescription;
  purpose?: DefinedComponentPurpose;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  /**
   * @minItems 1
   */
  protocols?: [ServiceProtocolInformation, ...ServiceProtocolInformation[]];
  /**
   * @minItems 1
   */
  "control-implementations"?: [SSPControlImplementation, ...SSPControlImplementation[]];
  remarks?: Remarks;
}
/**
 * A reference to a role with responsibility for performing a function relative to the containing object, optionally associated with a set of persons and/or organizations that perform that role.
 */
export interface ResponsibleRole {
  "role-id": ResponsibleRoleID;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "party-uuids"?: [PartyUniversallyUniqueIdentifierReference, ...PartyUniversallyUniqueIdentifierReference[]];
  remarks?: Remarks;
}
/**
 * Information about the protocol used to provide a service.
 */
export interface ServiceProtocolInformation {
  uuid?: ServiceProtocolInformationUniversallyUniqueIdentifier;
  name: ProtocolName;
  title?: ProtocolTitle;
  /**
   * @minItems 1
   */
  "port-ranges"?: [PortRange, ...PortRange[]];
}
/**
 * Where applicable this is the IPv4 port range on which the service operates.
 */
export interface PortRange {
  start?: Start;
  end?: End;
  transport?: Transport;
}
/**
 * Describes how the system satisfies a set of controls.
 */
export interface SSPControlImplementation {
  description: SSPControlImplementationDescription;
  /**
   * @minItems 1
   */
  "set-parameters"?: [SetParameterValue, ...SetParameterValue[]];
  /**
   * @minItems 1
   */
  "implemented-requirements": [ControlBasedRequirement, ...ControlBasedRequirement[]];
}
/**
 * Identifies the parameter that will be set by the enclosed value.
 */
export interface SetParameterValue {
  "param-id": SetParameterID;
  /**
   * @minItems 1
   */
  values: [ParamValue, ...ParamValue[]];
  remarks?: Remarks;
}
/**
 * Describes how the system satisfies the requirements of an individual control.
 */
export interface ControlBasedRequirement {
  uuid: ControlRequirementUniversallyUniqueIdentifier;
  "control-id": ImplementedControlIdentifierReference;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "set-parameters"?: [SetParameterValue, ...SetParameterValue[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  /**
   * @minItems 1
   */
  statements?: [SpecificControlStatement, ...SpecificControlStatement[]];
  /**
   * @minItems 1
   */
  "by-components"?: [ComponentControlImplementation, ...ComponentControlImplementation[]];
  remarks?: Remarks;
}
/**
 * Identifies which statements within a control are addressed.
 */
export interface SpecificControlStatement {
  "statement-id": ControlStatementReference;
  uuid: ControlStatementReferenceUniversallyUniqueIdentifier;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  /**
   * @minItems 1
   */
  "by-components"?: [ComponentControlImplementation, ...ComponentControlImplementation[]];
  remarks?: Remarks;
}
/**
 * Defines how the referenced component implements a set of controls.
 */
export interface ComponentControlImplementation {
  "component-uuid": ByComponentUniversallyUniqueIdentifierReference;
  uuid: ByComponentUniversallyUniqueIdentifier;
  description: ControlImplementationDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "set-parameters"?: [SetParameterValue, ...SetParameterValue[]];
  "implementation-status"?: ImplementationStatus;
  export?: Export;
  /**
   * @minItems 1
   */
  inherited?: [InheritedControlImplementation, ...InheritedControlImplementation[]];
  /**
   * @minItems 1
   */
  satisfied?: [SatisfiedControlImplementationResponsibility, ...SatisfiedControlImplementationResponsibility[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  remarks?: Remarks;
}
/**
 * Indicates the degree to which the a given control is implemented.
 */
export interface ImplementationStatus {
  state: ImplementationState;
  remarks?: Remarks;
}
/**
 * Identifies content intended for external consumption, such as with leveraged organizations.
 */
export interface Export {
  description?: ControlImplementationExportDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  provided?: [ProvidedControlImplementation, ...ProvidedControlImplementation[]];
  /**
   * @minItems 1
   */
  responsibilities?: [ControlImplementationResponsibility, ...ControlImplementationResponsibility[]];
  remarks?: Remarks;
}
/**
 * Describes a capability which may be inherited by a leveraging system.
 */
export interface ProvidedControlImplementation {
  uuid: ProvidedUniversallyUniqueIdentifier;
  description: ProvidedControlImplementationDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  remarks?: Remarks;
}
/**
 * Describes a control implementation responsibility imposed on a leveraging system.
 */
export interface ControlImplementationResponsibility {
  uuid: ResponsibilityUniversallyUniqueIdentifier;
  "provided-uuid"?: ControlImplementationProvidedUUID;
  description: ControlImplementationResponsibilityDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  remarks?: Remarks;
}
/**
 * Describes a control implementation inherited by a leveraging system.
 */
export interface InheritedControlImplementation {
  uuid: InheritedUniversallyUniqueIdentifier;
  "provided-uuid"?: ProvidedUUID;
  description: InheritedControlImplementationDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
}
/**
 * Describes how this system satisfies a responsibility imposed by a leveraged system.
 */
export interface SatisfiedControlImplementationResponsibility {
  uuid: SatisfiedUniversallyUniqueIdentifier;
  "responsibility-uuid"?: ResponsibilityUUID;
  description: SatisfiedControlImplementationResponsibilityDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  remarks?: Remarks;
}
/**
 * A grouping of other components and/or capabilities.
 */
export interface Capability {
  uuid: CapabilityIdentifier;
  name: CapabilityName;
  description: CapabilityDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "incorporates-components"?: [IncorporatesComponent, ...IncorporatesComponent[]];
  /**
   * @minItems 1
   */
  "control-implementations"?: [SSPControlImplementation, ...SSPControlImplementation[]];
  remarks?: Remarks;
}
/**
 * The collection of components comprising this capability.
 */
export interface IncorporatesComponent {
  "component-uuid": IncorporatingComponentReference;
  description: IncorporatingComponentDescription;
}
/**
 * A system security plan, such as those described in NIST SP 800-18.
 */
export interface SystemSecurityPlanSSP {
  uuid: SystemSecurityPlanUniversallyUniqueIdentifier;
  metadata: DocumentMetadata;
  "import-profile": ImportProfile;
  "system-characteristics": SystemCharacteristics;
  "system-implementation": SystemImplementation;
  "control-implementation": SSPControlImplementation;
  "back-matter"?: BackMatter;
}
/**
 * Used to import the OSCAL profile representing the system's control baseline.
 */
export interface ImportProfile {
  href: ProfileReference;
  remarks?: Remarks;
}
/**
 * Contains the characteristics of the system, such as its name, purpose, and security impact level.
 */
export interface SystemCharacteristics {
  /**
   * @minItems 1
   */
  "system-ids": [SystemIdentification, ...SystemIdentification[]];
  "system-name": SystemNameFull;
  "system-name-short"?: SystemNameShort;
  description: SystemDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  "date-authorized"?: SystemAuthorizationDate;
  "security-sensitivity-level"?: SecuritySensitivityLevel;
  "system-information": SystemInformation;
  "security-impact-level"?: SecurityImpactLevel;
  status: Status;
  "authorization-boundary": AuthorizationBoundary;
  "network-architecture"?: NetworkArchitecture;
  "data-flow"?: DataFlow;
  /**
   * @minItems 1
   */
  "responsible-parties"?: [ResponsibleParty, ...ResponsibleParty[]];
  remarks?: Remarks;
}
/**
 * A human-oriented, globally unique identifier with cross-instance scope that can be used to reference this system identification property elsewhere in this or other OSCAL instances. When referencing an externally defined system identification, the system identification must be used in the context of the external / imported OSCAL instance (e.g., uri-reference). This string should be assigned per-subject, which means it should be consistently used to identify the same system across revisions of the document.
 */
export interface SystemIdentification {
  "identifier-type"?: IdentificationSystemType;
  id: StringDatatype;
}
/**
 * Contains details about all information types that are stored, processed, or transmitted by the system, such as privacy information, and those defined in NIST SP 800-60.
 */
export interface SystemInformation {
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "information-types": [InformationType, ...InformationType[]];
}
/**
 * Contains details about one information type that is stored, processed, or transmitted by the system, such as privacy information, and those defined in NIST SP 800-60.
 */
export interface InformationType {
  uuid?: InformationTypeUniversallyUniqueIdentifier;
  title: InformationTypeTitle;
  description: InformationTypeDescription;
  /**
   * @minItems 1
   */
  categorizations?: [InformationTypeCategorization, ...InformationTypeCategorization[]];
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  "confidentiality-impact"?: ImpactLevel;
  "integrity-impact"?: ImpactLevel;
  "availability-impact"?: ImpactLevel;
}
/**
 * A set of information type identifiers qualified by the given identification system used, such as NIST SP 800-60.
 */
export interface InformationTypeCategorization {
  system: InformationTypeIdentificationSystem;
  /**
   * @minItems 1
   */
  "information-type-ids"?: [InformationTypeSystematizedIdentifier, ...InformationTypeSystematizedIdentifier[]];
}
/**
 * The expected level of impact resulting from the described information.
 */
export interface ImpactLevel {
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  base: BaseLevelConfidentialityIntegrityOrAvailability;
  selected?: SelectedLevelConfidentialityIntegrityOrAvailability;
  "adjustment-justification"?: AdjustmentJustification;
}
/**
 * The overall level of expected impact resulting from unauthorized disclosure, modification, or loss of access to information.
 */
export interface SecurityImpactLevel {
  "security-objective-confidentiality": SecurityObjectiveConfidentiality;
  "security-objective-integrity": SecurityObjectiveIntegrity;
  "security-objective-availability": SecurityObjectiveAvailability;
}
/**
 * Describes the operational status of the system.
 */
export interface Status {
  state: State;
  remarks?: Remarks;
}
/**
 * A description of this system's authorization boundary, optionally supplemented by diagrams that illustrate the authorization boundary.
 */
export interface AuthorizationBoundary {
  description: AuthorizationBoundaryDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  diagrams?: [Diagram, ...Diagram[]];
  remarks?: Remarks;
}
/**
 * A graphic that provides a visual representation the system, or some aspect of it.
 */
export interface Diagram {
  uuid: DiagramID;
  description?: DiagramDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  caption?: Caption;
  remarks?: Remarks;
}
/**
 * A description of the system's network architecture, optionally supplemented by diagrams that illustrate the network architecture.
 */
export interface NetworkArchitecture {
  description: NetworkArchitectureDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  diagrams?: [Diagram, ...Diagram[]];
  remarks?: Remarks;
}
/**
 * A description of the logical flow of information within the system and across its boundaries, optionally supplemented by diagrams that illustrate these flows.
 */
export interface DataFlow {
  description: DataFlowDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  diagrams?: [Diagram, ...Diagram[]];
  remarks?: Remarks;
}
/**
 * Provides information as to how the system is implemented.
 */
export interface SystemImplementation {
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "leveraged-authorizations"?: [LeveragedAuthorization, ...LeveragedAuthorization[]];
  /**
   * @minItems 1
   */
  users: [SystemUser, ...SystemUser[]];
  /**
   * @minItems 1
   */
  components: [Component, ...Component[]];
  /**
   * @minItems 1
   */
  "inventory-items"?: [InventoryItem, ...InventoryItem[]];
  remarks?: Remarks;
}
/**
 * A description of another authorized system from which this system inherits capabilities that satisfy security requirements. Another term for this concept is a common control provider.
 */
export interface LeveragedAuthorization {
  uuid: LeveragedAuthorizationUniversallyUniqueIdentifier;
  title: TitleField;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  "party-uuid": PartyUuidField;
  "date-authorized": SystemAuthorizationDate;
  remarks?: Remarks;
}
/**
 * A type of user that interacts with the system based on an associated role.
 */
export interface SystemUser {
  uuid: UserUniversallyUniqueIdentifier;
  title?: UserTitle;
  "short-name"?: UserShortName;
  description?: UserDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "role-ids"?: [RoleIdentifierReference, ...RoleIdentifierReference[]];
  /**
   * @minItems 1
   */
  "authorized-privileges"?: [Privilege, ...Privilege[]];
  remarks?: Remarks;
}
/**
 * Identifies a specific system privilege held by the user, along with an associated description and/or rationale for the privilege.
 */
export interface Privilege {
  title: PrivilegeTitle;
  description?: PrivilegeDescription;
  /**
   * @minItems 1
   */
  "functions-performed": [FunctionsPerformed, ...FunctionsPerformed[]];
}
/**
 * A defined component that can be part of an implemented system.
 */
export interface Component {
  uuid: ComponentIdentifier;
  type: ComponentType;
  title: ComponentTitle;
  description: ComponentDescription;
  purpose?: Purpose;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  status: OperatingStatus;
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  /**
   * @minItems 1
   */
  protocols?: [ServiceProtocolInformation, ...ServiceProtocolInformation[]];
  remarks?: Remarks;
}
/**
 * Describes the operational status of the system component.
 */
export interface OperatingStatus {
  state: OperatingState;
  remarks?: Remarks;
}
/**
 * A single managed inventory item within the system.
 */
export interface InventoryItem {
  uuid: InventoryItemUniversallyUniqueIdentifier;
  description: InventoryItemDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-parties"?: [ResponsibleParty, ...ResponsibleParty[]];
  /**
   * @minItems 1
   */
  "implemented-components"?: [ImplementedComponent, ...ImplementedComponent[]];
  remarks?: Remarks;
}
/**
 * The set of components that are implemented in a given system inventory item.
 */
export interface ImplementedComponent {
  "component-uuid": ImplementedComponentUniversallyUniqueIdentifierReference;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-parties"?: [ResponsibleParty, ...ResponsibleParty[]];
  remarks?: Remarks;
}
/**
 * An assessment plan, such as those provided by a FedRAMP assessor.
 */
export interface SecurityAssessmentPlanSAP {
  uuid: AssessmentPlanUniversallyUniqueIdentifier;
  metadata: DocumentMetadata;
  "import-ssp": ImportSystemSecurityPlan;
  "local-definitions"?: AssessmentPlanLocalDefinitions;
  "terms-and-conditions"?: AssessmentPlanTermsAndConditions;
  "reviewed-controls": ReviewedControlsAndControlObjectives;
  /**
   * @minItems 1
   */
  "assessment-subjects"?: [SubjectOfAssessment, ...SubjectOfAssessment[]];
  "assessment-assets"?: AssessmentAssets;
  /**
   * @minItems 1
   */
  tasks?: [Task, ...Task[]];
  "back-matter"?: BackMatter;
}
/**
 * Used by the assessment plan and POA&M to import information about the system.
 */
export interface ImportSystemSecurityPlan {
  href: SystemSecurityPlanReference;
  remarks?: Remarks;
}
/**
 * Used to define data objects that are used in the assessment plan, that do not appear in the referenced SSP.
 */
export interface AssessmentPlanLocalDefinitions {
  /**
   * @minItems 1
   */
  components?: [Component, ...Component[]];
  /**
   * @minItems 1
   */
  "inventory-items"?: [InventoryItem, ...InventoryItem[]];
  /**
   * @minItems 1
   */
  users?: [SystemUser, ...SystemUser[]];
  /**
   * @minItems 1
   */
  "objectives-and-methods"?: [AssessmentSpecificControlObjective, ...AssessmentSpecificControlObjective[]];
  /**
   * @minItems 1
   */
  activities?: [Activity, ...Activity[]];
  remarks?: Remarks;
}
/**
 * A local definition of a control objective for this assessment. Uses catalog syntax for control objective and assessment actions.
 */
export interface AssessmentSpecificControlObjective {
  "control-id": AssessmentSpecificControlIdentifierReference;
  description?: ObjectiveDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  parts: [Part, ...Part[]];
  remarks?: Remarks;
}
/**
 * Identifies an assessment or related process that can be performed. In the assessment plan, this is an intended activity which may be associated with an assessment task. In the assessment results, this an activity that was actually performed as part of an assessment.
 */
export interface Activity {
  uuid: AssessmentActivityUniversallyUniqueIdentifier;
  title?: IncludedActivityTitle;
  description: IncludedActivityDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  steps?: [Step, ...Step[]];
  "related-controls"?: ReviewedControlsAndControlObjectives;
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  remarks?: Remarks;
}
/**
 * Identifies an individual step in a series of steps related to an activity, such as an assessment test or examination procedure.
 */
export interface Step {
  uuid: StepUniversallyUniqueIdentifier;
  title?: StepTitle;
  description: StepDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  "reviewed-controls"?: ReviewedControlsAndControlObjectives;
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  remarks?: Remarks;
}
/**
 * Identifies the controls being assessed and their control objectives.
 */
export interface ReviewedControlsAndControlObjectives {
  description?: ControlObjectiveDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "control-selections": [AssessedControls, ...AssessedControls[]];
  /**
   * @minItems 1
   */
  "control-objective-selections"?: [ReferencedControlObjectives, ...ReferencedControlObjectives[]];
  remarks?: Remarks;
}
/**
 * Identifies the controls being assessed. In the assessment plan, these are the planned controls. In the assessment results, these are the actual controls, and reflects any changes from the plan.
 */
export interface AssessedControls {
  description?: AssessedControlsDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  "include-all"?: IncludeAll;
  /**
   * @minItems 1
   */
  "include-controls"?: [SelectControl, ...SelectControl[]];
  /**
   * @minItems 1
   */
  "exclude-controls"?: [SelectControl, ...SelectControl[]];
  remarks?: Remarks;
}
/**
 * Identifies the control objectives of the assessment. In the assessment plan, these are the planned objectives. In the assessment results, these are the assessed objectives, and reflects any changes from the plan.
 */
export interface ReferencedControlObjectives {
  description?: ControlObjectivesDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  "include-all"?: IncludeAll;
  /**
   * @minItems 1
   */
  "include-objectives"?: [SelectObjective, ...SelectObjective[]];
  /**
   * @minItems 1
   */
  "exclude-objectives"?: [SelectObjective, ...SelectObjective[]];
  remarks?: Remarks;
}
/**
 * Used to select a control objective for inclusion/exclusion based on the control objective's identifier.
 */
export interface SelectObjective {
  "objective-id": ObjectiveID;
}
/**
 * Used to define various terms and conditions under which an assessment, described by the plan, can be performed. Each child part defines a different type of term or condition.
 */
export interface AssessmentPlanTermsAndConditions {
  /**
   * @minItems 1
   */
  parts?: [AssessmentPart, ...AssessmentPart[]];
}
/**
 * A partition of an assessment plan or results or a child of another part.
 */
export interface AssessmentPart {
  uuid?: AssessmentPartIdentifier;
  name: AssessmentPartName;
  ns?: AssessmentPartNamespace;
  class?: AssessmentPartClass;
  title?: AssessmentPartTitle;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  prose?: AssessmentPartText;
  /**
   * @minItems 1
   */
  parts?: [AssessmentPart, ...AssessmentPart[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
}
/**
 * Identifies system elements being assessed, such as components, inventory items, and locations. In the assessment plan, this identifies a planned assessment subject. In the assessment results this is an actual assessment subject, and reflects any changes from the plan. exactly what will be the focus of this assessment. Any subjects not identified in this way are out-of-scope.
 */
export interface SubjectOfAssessment {
  type: SubjectType;
  description?: IncludeSubjectsDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  "include-all"?: IncludeAll;
  /**
   * @minItems 1
   */
  "include-subjects"?: [SelectAssessmentSubject, ...SelectAssessmentSubject[]];
  /**
   * @minItems 1
   */
  "exclude-subjects"?: [SelectAssessmentSubject, ...SelectAssessmentSubject[]];
  remarks?: Remarks;
}
/**
 * Identifies a set of assessment subjects to include/exclude by UUID.
 */
export interface SelectAssessmentSubject {
  "subject-uuid": SubjectUniversallyUniqueIdentifierReferenceById;
  type: SubjectUniversallyUniqueIdentifierReferenceTypeById;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * Identifies the assets used to perform this assessment, such as the assessment team, scanning tools, and assumptions.
 */
export interface AssessmentAssets {
  /**
   * @minItems 1
   */
  components?: [Component, ...Component[]];
  /**
   * @minItems 1
   */
  "assessment-platforms": [AssessmentPlatform, ...AssessmentPlatform[]];
}
/**
 * Used to represent the toolset used to perform aspects of the assessment.
 */
export interface AssessmentPlatform {
  uuid: AssessmentPlatformUniversallyUniqueIdentifier;
  title?: AssessmentPlatformTitle;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "uses-components"?: [UsesComponent, ...UsesComponent[]];
  remarks?: Remarks;
}
/**
 * The set of components that are used by the assessment platform.
 */
export interface UsesComponent {
  "component-uuid": ComponentUniversallyUniqueIdentifierReference;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-parties"?: [ResponsibleParty, ...ResponsibleParty[]];
  remarks?: Remarks;
}
/**
 * Represents a scheduled event or milestone, which may be associated with a series of assessment actions.
 */
export interface Task {
  uuid: TaskUniversallyUniqueIdentifier;
  type: TaskType;
  title: TaskTitle;
  description?: TaskDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  timing?: EventTiming;
  /**
   * @minItems 1
   */
  dependencies?: [TaskDependency, ...TaskDependency[]];
  /**
   * @minItems 1
   */
  tasks?: [Task, ...Task[]];
  /**
   * @minItems 1
   */
  "associated-activities"?: [AssociatedActivity, ...AssociatedActivity[]];
  /**
   * @minItems 1
   */
  subjects?: [SubjectOfAssessment, ...SubjectOfAssessment[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  remarks?: Remarks;
}
/**
 * The timing under which the task is intended to occur.
 */
export interface EventTiming {
  "on-date"?: TaskOnDateCondition;
  "within-date-range"?: TaskOnDateRangeCondition;
  "at-frequency"?: TaskFrequencyCondition;
}
/**
 * The task is intended to occur on the specified date.
 */
export interface TaskOnDateCondition {
  date: TaskDateTime;
}
/**
 * The task is intended to occur within the specified date range.
 */
export interface TaskOnDateRangeCondition {
  start: TaskStartDateCondition;
  end: TaskEndDateCondition;
}
/**
 * The task is intended to occur at the specified frequency.
 */
export interface TaskFrequencyCondition {
  period: TaskPeriod;
  unit: TaskTimeUnit;
}
/**
 * Used to indicate that a task is dependent on another task.
 */
export interface TaskDependency {
  "task-uuid": DependentTaskUniversallyUniqueIdentifierReference;
  remarks?: Remarks;
}
/**
 * Identifies an individual activity to be performed as part of a task.
 */
export interface AssociatedActivity {
  "activity-uuid": ActivityUniversallyUniqueIdentifierReference;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-roles"?: [ResponsibleRole, ...ResponsibleRole[]];
  /**
   * @minItems 1
   */
  subjects: [SubjectOfAssessment, ...SubjectOfAssessment[]];
  remarks?: Remarks;
}
/**
 * Security assessment results, such as those provided by a FedRAMP assessor in the FedRAMP Security Assessment Report.
 */
export interface SecurityAssessmentResultsSAR {
  uuid: AssessmentResultsUniversallyUniqueIdentifier;
  metadata: DocumentMetadata;
  "import-ap": ImportAssessmentPlan;
  "local-definitions"?: AssessmentResultsLocalDefinitions;
  /**
   * @minItems 1
   */
  results: [AssessmentResult, ...AssessmentResult[]];
  "back-matter"?: BackMatter;
}
/**
 * Used by assessment-results to import information about the original plan for assessing the system.
 */
export interface ImportAssessmentPlan {
  href: AssessmentPlanReference;
  remarks?: Remarks;
}
/**
 * Used to define data objects that are used in the assessment plan, that do not appear in the referenced SSP.
 */
export interface AssessmentResultsLocalDefinitions {
  /**
   * @minItems 1
   */
  "objectives-and-methods"?: [AssessmentSpecificControlObjective, ...AssessmentSpecificControlObjective[]];
  /**
   * @minItems 1
   */
  activities?: [Activity, ...Activity[]];
  remarks?: Remarks;
}
/**
 * Used by the assessment results and POA&M. In the assessment results, this identifies all of the assessment observations and findings, initial and residual risks, deviations, and disposition. In the POA&M, this identifies initial and residual risks, deviations, and disposition.
 */
export interface AssessmentResult {
  uuid: ResultsUniversallyUniqueIdentifier;
  title: ResultsTitle;
  description: ResultsDescription;
  start: ResultStartField;
  end?: ResultEndField;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  "local-definitions"?: AssessmentResultLocalDefinitions;
  "reviewed-controls": ReviewedControlsAndControlObjectives;
  /**
   * @minItems 1
   */
  attestations?: [AttestationStatements, ...AttestationStatements[]];
  "assessment-log"?: AssessmentLog;
  /**
   * @minItems 1
   */
  observations?: [Observation, ...Observation[]];
  /**
   * @minItems 1
   */
  risks?: [IdentifiedRisk, ...IdentifiedRisk[]];
  /**
   * @minItems 1
   */
  findings?: [Finding, ...Finding[]];
  remarks?: Remarks;
}
/**
 * Used to define data objects that are used in the assessment plan, that do not appear in the referenced SSP.
 */
export interface AssessmentResultLocalDefinitions {
  /**
   * @minItems 1
   */
  components?: [Component, ...Component[]];
  /**
   * @minItems 1
   */
  "inventory-items"?: [InventoryItem, ...InventoryItem[]];
  /**
   * @minItems 1
   */
  users?: [SystemUser, ...SystemUser[]];
  "assessment-assets"?: AssessmentAssets;
  /**
   * @minItems 1
   */
  tasks?: [Task, ...Task[]];
}
/**
 * A set of textual statements, typically written by the assessor.
 */
export interface AttestationStatements {
  /**
   * @minItems 1
   */
  "responsible-parties"?: [ResponsibleParty, ...ResponsibleParty[]];
  /**
   * @minItems 1
   */
  parts: [AssessmentPart, ...AssessmentPart[]];
}
/**
 * A log of all assessment-related actions taken.
 */
export interface AssessmentLog {
  /**
   * @minItems 1
   */
  entries: [AssessmentLogEntry, ...AssessmentLogEntry[]];
}
/**
 * Identifies the result of an action and/or task that occurred as part of executing an assessment plan or an assessment event that occurred in producing the assessment results.
 */
export interface AssessmentLogEntry {
  uuid: AssessmentLogEntryUniversallyUniqueIdentifier;
  title?: ActionTitle;
  description?: ActionDescription;
  start: ActionStart;
  end?: ActionEnd;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "logged-by"?: [LoggedBy, ...LoggedBy[]];
  /**
   * @minItems 1
   */
  "related-tasks"?: [TaskReference, ...TaskReference[]];
  remarks?: Remarks;
}
/**
 * Used to indicate who created a log entry in what role.
 */
export interface LoggedBy {
  "party-uuid": PartyUUIDReference;
  "role-id"?: ActorRole;
}
/**
 * Identifies an individual task for which the containing object is a consequence of.
 */
export interface TaskReference {
  "task-uuid": TaskUniversallyUniqueIdentifierReference;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "responsible-parties"?: [ResponsibleParty, ...ResponsibleParty[]];
  /**
   * @minItems 1
   */
  subjects?: [SubjectOfAssessment, ...SubjectOfAssessment[]];
  "identified-subject"?: IdentifiedSubject;
  remarks?: Remarks;
}
/**
 * Used to detail assessment subjects that were identfied by this task.
 */
export interface IdentifiedSubject {
  "subject-placeholder-uuid": AssessmentSubjectPlaceholderUniversallyUniqueIdentifierReference;
  /**
   * @minItems 1
   */
  subjects: [SubjectOfAssessment, ...SubjectOfAssessment[]];
}
/**
 * Describes an individual observation.
 */
export interface Observation {
  uuid: ObservationUniversallyUniqueIdentifier;
  title?: ObservationTitle;
  description: ObservationDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  methods: [ObservationMethod, ...ObservationMethod[]];
  /**
   * @minItems 1
   */
  types?: [ObservationType, ...ObservationType[]];
  /**
   * @minItems 1
   */
  origins?: [Origin, ...Origin[]];
  /**
   * @minItems 1
   */
  subjects?: [IdentifiesTheSubject, ...IdentifiesTheSubject[]];
  /**
   * @minItems 1
   */
  "relevant-evidence"?: [RelevantEvidence, ...RelevantEvidence[]];
  collected: CollectedField;
  expires?: ExpiresField;
  remarks?: Remarks;
}
/**
 * Identifies the source of the finding, such as a tool, interviewed person, or activity.
 */
export interface Origin {
  /**
   * @minItems 1
   */
  actors: [OriginatingActor, ...OriginatingActor[]];
  /**
   * @minItems 1
   */
  "related-tasks"?: [TaskReference, ...TaskReference[]];
}
/**
 * The actor that produces an observation, a finding, or a risk. One or more actor type can be used to specify a person that is using a tool.
 */
export interface OriginatingActor {
  type: ActorType;
  "actor-uuid": OriginActorUniversallyUniqueIdentifierReference;
  "role-id"?: OriginActorRole;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
}
/**
 * A human-oriented identifier reference to a resource. Use type to indicate whether the identified resource is a component, inventory item, location, user, or something else.
 */
export interface IdentifiesTheSubject {
  "subject-uuid": SubjectUniversallyUniqueIdentifierReference;
  type: SubjectUniversallyUniqueIdentifierReferenceType;
  title?: SubjectReferenceTitle;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * Links this observation to relevant evidence.
 */
export interface RelevantEvidence {
  href?: RelevantEvidenceReference;
  description: RelevantEvidenceDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * An identified risk.
 */
export interface IdentifiedRisk {
  uuid: RiskUniversallyUniqueIdentifier;
  title: RiskTitle;
  description: RiskDescription;
  statement: RiskStatement;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  status: RiskStatus;
  /**
   * @minItems 1
   */
  origins?: [Origin, ...Origin[]];
  /**
   * @minItems 1
   */
  "threat-ids"?: [ThreatID, ...ThreatID[]];
  /**
   * @minItems 1
   */
  characterizations?: [Characterization, ...Characterization[]];
  /**
   * @minItems 1
   */
  "mitigating-factors"?: [MitigatingFactor, ...MitigatingFactor[]];
  deadline?: RiskResolutionDeadline;
  /**
   * @minItems 1
   */
  remediations?: [RiskResponse, ...RiskResponse[]];
  "risk-log"?: RiskLog;
  /**
   * @minItems 1
   */
  "related-observations"?: [RelatedObservation, ...RelatedObservation[]];
}
/**
 * A pointer, by ID, to an externally-defined threat.
 */
export interface ThreatID {
  system: ThreatTypeIdentificationSystem;
  href?: ThreatInformationResourceReference;
  id: URIDatatype;
}
/**
 * A collection of descriptive data about the containing object from a specific origin.
 */
export interface Characterization {
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  origin: Origin;
  /**
   * @minItems 1
   */
  facets: [Facet, ...Facet[]];
}
/**
 * An individual characteristic that is part of a larger set produced by the same actor.
 */
export interface Facet {
  name: FacetName;
  system: NamingSystem;
  value: FacetValue;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * Describes an existing mitigating factor that may affect the overall determination of the risk, with an optional link to an implementation statement in the SSP.
 */
export interface MitigatingFactor {
  uuid: MitigatingFactorUniversallyUniqueIdentifier;
  "implementation-uuid"?: ImplementationUUID;
  description: MitigatingFactorDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  subjects?: [IdentifiesTheSubject, ...IdentifiesTheSubject[]];
}
/**
 * Describes either recommended or an actual plan for addressing the risk.
 */
export interface RiskResponse {
  uuid: RemediationUniversallyUniqueIdentifier;
  lifecycle: RemediationIntent;
  title: ResponseTitle;
  description: ResponseDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  origins?: [Origin, ...Origin[]];
  /**
   * @minItems 1
   */
  "required-assets"?: [RequiredAsset, ...RequiredAsset[]];
  /**
   * @minItems 1
   */
  tasks?: [Task, ...Task[]];
  remarks?: Remarks;
}
/**
 * Identifies an asset required to achieve remediation.
 */
export interface RequiredAsset {
  uuid: RequiredUniversallyUniqueIdentifier;
  /**
   * @minItems 1
   */
  subjects?: [IdentifiesTheSubject, ...IdentifiesTheSubject[]];
  title?: TitleForRequiredAsset;
  description: DescriptionOfRequiredAsset;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  remarks?: Remarks;
}
/**
 * A log of all risk-related tasks taken.
 */
export interface RiskLog {
  /**
   * @minItems 1
   */
  entries: [RiskLogEntry, ...RiskLogEntry[]];
}
/**
 * Identifies an individual risk response that occurred as part of managing an identified risk.
 */
export interface RiskLogEntry {
  uuid: RiskLogEntryUniversallyUniqueIdentifier;
  title?: RistTitle;
  description?: RiskTaskDescription;
  start: RistEventStart;
  end?: RiskEventEnd;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "logged-by"?: [LoggedBy, ...LoggedBy[]];
  "status-change"?: RiskStatus;
  /**
   * @minItems 1
   */
  "related-responses"?: [RiskResponseReference, ...RiskResponseReference[]];
  remarks?: Remarks;
}
/**
 * Identifies an individual risk response that this log entry is for.
 */
export interface RiskResponseReference {
  "response-uuid": ResponseUniversallyUniqueIdentifierReference;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  "related-tasks"?: [TaskReference, ...TaskReference[]];
  remarks?: Remarks;
}
/**
 * Relates the finding to a set of referenced observations that were used to determine the finding.
 */
export interface RelatedObservation {
  "observation-uuid": ObservationUniversallyUniqueIdentifierReference;
}
/**
 * Describes an individual finding.
 */
export interface Finding {
  uuid: FindingUniversallyUniqueIdentifier;
  title: FindingTitle;
  description: FindingDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  origins?: [Origin, ...Origin[]];
  target: FindingTargetObjectiveStatus;
  "implementation-statement-uuid"?: ImplementationStatementUUID;
  /**
   * @minItems 1
   */
  "related-observations"?: [FindingRelatedObservation, ...FindingRelatedObservation[]];
  /**
   * @minItems 1
   */
  "related-risks"?: [FindingAssociatedRisk, ...FindingAssociatedRisk[]];
  remarks?: Remarks;
}
/**
 * Captures an assessor's conclusions regarding the degree to which an objective is satisfied.
 */
export interface FindingTargetObjectiveStatus {
  type: FindingTargetType;
  "target-id": FindingTargetIdentifierReference;
  title?: ObjectiveStatusTitle;
  description?: ObjectiveStatusDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  status: ObjectiveStatus;
  "implementation-status"?: ImplementationStatus;
  remarks?: Remarks;
}
/**
 * A determination of if the objective is satisfied or not within a given system.
 */
export interface ObjectiveStatus {
  state: ObjectiveStatusState;
  reason?: ObjectiveStatusReason;
  remarks?: Remarks;
}
/**
 * Relates the finding to a set of referenced observations that were used to determine the finding.
 */
export interface FindingRelatedObservation {
  "observation-uuid": FindingRelatedObservationUniversallyUniqueIdentifierReference;
}
/**
 * Relates the finding to a set of referenced risks that were used to determine the finding.
 */
export interface FindingAssociatedRisk {
  "risk-uuid": FindingRiskUniversallyUniqueIdentifierReference;
}
/**
 * A plan of action and milestones which identifies initial and residual risks, deviations, and disposition, such as those required by FedRAMP.
 */
export interface PlanOfActionAndMilestonesPOAM {
  uuid: POAMUniversallyUniqueIdentifier;
  metadata: DocumentMetadata;
  "import-ssp"?: ImportSystemSecurityPlan;
  "system-id"?: SystemIdentification;
  "local-definitions"?: LocalDefinitions;
  /**
   * @minItems 1
   */
  observations?: [Observation, ...Observation[]];
  /**
   * @minItems 1
   */
  risks?: [IdentifiedRisk, ...IdentifiedRisk[]];
  /**
   * @minItems 1
   */
  findings?: [Finding, ...Finding[]];
  /**
   * @minItems 1
   */
  "poam-items": [POAMItem, ...POAMItem[]];
  "back-matter"?: BackMatter;
}
/**
 * Allows components, and inventory-items to be defined within the POA&M for circumstances where no OSCAL-based SSP exists, or is not delivered with the POA&M.
 */
export interface LocalDefinitions {
  /**
   * @minItems 1
   */
  components?: [Component, ...Component[]];
  /**
   * @minItems 1
   */
  "inventory-items"?: [InventoryItem, ...InventoryItem[]];
  "assessment-assets"?: AssessmentAssets;
  remarks?: Remarks;
}
/**
 * Describes an individual POA&M item.
 */
export interface POAMItem {
  uuid?: POAMItemUniversallyUniqueIdentifier;
  title: POAMItemTitle;
  description: POAMItemDescription;
  /**
   * @minItems 1
   */
  props?: [Property, ...Property[]];
  /**
   * @minItems 1
   */
  links?: [Link, ...Link[]];
  /**
   * @minItems 1
   */
  origins?: [POAMOrigin, ...POAMOrigin[]];
  /**
   * @minItems 1
   */
  "related-findings"?: [RelatedFinding, ...RelatedFinding[]];
  /**
   * @minItems 1
   */
  "related-observations"?: [PoamItemFindingRelatedObservation, ...PoamItemFindingRelatedObservation[]];
  /**
   * @minItems 1
   */
  "related-risks"?: [AssociatedRisk, ...AssociatedRisk[]];
  remarks?: Remarks;
}
/**
 * Identifies the source of the finding, such as a tool or person.
 */
export interface POAMOrigin {
  /**
   * @minItems 1
   */
  actors: [OriginatingActor, ...OriginatingActor[]];
}
/**
 * Relates the poam-item to referenced finding(s).
 */
export interface RelatedFinding {
  "finding-uuid": FindingUniversallyUniqueIdentifierReference;
}
/**
 * Relates the poam-item to a set of referenced observations that were used to determine the finding.
 */
export interface PoamItemFindingRelatedObservation {
  "observation-uuid": RelatedObservationUniversallyUniqueIdentifierReference;
}
/**
 * Relates the finding to a set of referenced risks that were used to determine the finding.
 */
export interface AssociatedRisk {
  "risk-uuid": RiskUniversallyUniqueIdentifierReference;
}
