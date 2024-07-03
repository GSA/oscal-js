export const oscalSchema={
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://csrc.nist.gov/ns/oscal/1.0/1.1.2/schema.json",
  "$comment": "OSCAL Unified Model of Models: JSON Schema",
  "type": "object",
  "definitions": {
    "json-schema-directive": {
      "title": "Schema Directive",
      "description": "A JSON Schema directive to bind a specific schema to its document instance.",
      "$id": "#/definitions/json-schema-directive",
      "$ref": "#/definitions/URIReferenceDatatype"
    },
    "Base64Datatype": {
      "description": "Binary data encoded using the Base 64 encoding algorithm as defined by RFC4648.",
      "type": "string",
      "pattern": "^[0-9A-Za-z+/]+={0,2}$",
      "contentEncoding": "base64"
    },
    "BooleanDatatype": {
      "description": "A binary value that is either: true or false.",
      "type": "boolean"
    },
    "DateDatatype": {
      "description": "A string representing a 24-hour period with an optional timezone.",
      "type": "string",
      "pattern": "^(((2000|2400|2800|(19|2[0-9](0[48]|[2468][048]|[13579][26])))-02-29)|(((19|2[0-9])[0-9]{2})-02-(0[1-9]|1[0-9]|2[0-8]))|(((19|2[0-9])[0-9]{2})-(0[13578]|10|12)-(0[1-9]|[12][0-9]|3[01]))|(((19|2[0-9])[0-9]{2})-(0[469]|11)-(0[1-9]|[12][0-9]|30)))(Z|(-((0[0-9]|1[0-2]):00|0[39]:30)|\\+((0[0-9]|1[0-4]):00|(0[34569]|10):30|(0[58]|12):45)))?$"
    },
    "DateTimeWithTimezoneDatatype": {
      "description": "A string representing a point in time with a required timezone.",
      "type": "string",
      "format": "date-time",
      "pattern": "^(((2000|2400|2800|(19|2[0-9](0[48]|[2468][048]|[13579][26])))-02-29)|(((19|2[0-9])[0-9]{2})-02-(0[1-9]|1[0-9]|2[0-8]))|(((19|2[0-9])[0-9]{2})-(0[13578]|10|12)-(0[1-9]|[12][0-9]|3[01]))|(((19|2[0-9])[0-9]{2})-(0[469]|11)-(0[1-9]|[12][0-9]|30)))T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z|(-((0[0-9]|1[0-2]):00|0[39]:30)|\\+((0[0-9]|1[0-4]):00|(0[34569]|10):30|(0[58]|12):45)))$"
    },
    "EmailAddressDatatype": {
      "description": "An email address string formatted according to RFC 6531.",
      "allOf": [
        {
          "$ref": "#/definitions/StringDatatype"
        },
        {
          "type": "string",
          "format": "email",
          "pattern": "^.+@.+$"
        }
      ]
    },
    "IntegerDatatype": {
      "description": "A whole number value.",
      "type": "integer"
    },
    "NonNegativeIntegerDatatype": {
      "description": "An integer value that is equal to or greater than 0.",
      "allOf": [
        {
          "$ref": "#/definitions/IntegerDatatype"
        },
        {
          "type": "number",
          "minimum": 0
        }
      ]
    },
    "PositiveIntegerDatatype": {
      "description": "An integer value that is greater than 0.",
      "allOf": [
        {
          "$ref": "#/definitions/IntegerDatatype"
        },
        {
          "type": "number",
          "minimum": 1
        }
      ]
    },
    "StringDatatype": {
      "description": "A non-empty string with leading and trailing whitespace disallowed. Whitespace is: U+9, U+10, U+32 or [ \n\t]+",
      "type": "string",
      "pattern": "^\\S(.*\\S)?$"
    },
    "TokenDatatype": {
      "description": "A non-colonized name as defined by XML Schema Part 2: Datatypes Second Edition. https://www.w3.org/TR/xmlschema11-2/#NCName.",
      "type": "string",
      "pattern": "^(\\p{L}|_)(\\p{L}|\\p{N}|[.\\-_])*$"
    },
    "URIDatatype": {
      "description": "A universal resource identifier (URI) formatted according to RFC3986.",
      "type": "string",
      "format": "uri",
      "pattern": "^[a-zA-Z][a-zA-Z0-9+\\-.]+:.+$"
    },
    "URIReferenceDatatype": {
      "description": "A URI Reference, either a URI or a relative-reference, formatted according to section 4.1 of RFC3986.",
      "type": "string",
      "format": "uri-reference"
    },
    "UUIDDatatype": {
      "description": "A type 4 ('random' or 'pseudorandom') or type 5 UUID per RFC 4122.",
      "type": "string",
      "pattern": "^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[45][0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$"
    },
    "catalog": {
      "title": "Catalog",
      "description": "A structured, organized collection of control information.",
      "$id": "#/definitions/catalog",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Catalog Universally Unique Identifier",
          "description": "Provides a globally unique means to identify a given catalog instance.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "metadata": {
          "$ref": "#/definitions/metadata"
        },
        "params": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/parameter"
          }
        },
        "controls": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/control"
          }
        },
        "groups": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/group"
          }
        },
        "back-matter": {
          "$ref": "#/definitions/back-matter"
        }
      },
      "required": [
        "uuid",
        "metadata"
      ],
      "additionalProperties": false
    },
    "group": {
      "title": "Control Group",
      "description": "A group of (selected) controls or of groups of controls.",
      "$id": "#/definitions/group",
      "type": "object",
      "properties": {
        "id": {
          "title": "Group Identifier",
          "description": "Identifies the group.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "class": {
          "title": "Group Class",
          "description": "A textual label that provides a sub-type or characterization of the group.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "title": {
          "title": "Group Title",
          "description": "A name to be given to the group for use in display.",
          "type": "string"
        },
        "params": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/parameter"
          }
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "parts": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/part"
          }
        },
        "groups": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/group"
          }
        },
        "insert-controls": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/insert-controls"
          }
        }
      },
      "required": [
        "title"
      ],
      "additionalProperties": false
    },
    "control": {
      "title": "Control",
      "description": "A structured object representing a requirement or guideline, which when implemented will reduce an aspect of risk related to an information system and its information.",
      "$id": "#/definitions/control",
      "type": "object",
      "properties": {
        "id": {
          "title": "Control Identifier",
          "description": "Identifies a control such that it can be referenced in the defining catalog and other OSCAL instances (e.g., profiles).",
          "$ref": "#/definitions/TokenDatatype"
        },
        "class": {
          "title": "Control Class",
          "description": "A textual label that provides a sub-type or characterization of the control.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "title": {
          "title": "Control Title",
          "description": "A name given to the control, which may be used by a tool for display and navigation.",
          "type": "string"
        },
        "params": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/parameter"
          }
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "parts": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/part"
          }
        },
        "controls": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/control"
          }
        }
      },
      "required": [
        "id",
        "title"
      ],
      "additionalProperties": false
    },
    "part": {
      "title": "Part",
      "description": "An annotated, markup-based textual element of a control's or catalog group's definition, or a child of another part.",
      "$id": "#/definitions/part",
      "type": "object",
      "properties": {
        "id": {
          "title": "Part Identifier",
          "description": "A unique identifier for the part.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "name": {
          "title": "Part Name",
          "description": "A textual label that uniquely identifies the part's semantic type, which exists in a value space qualified by the ns.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "ns": {
          "title": "Part Namespace",
          "description": "An optional namespace qualifying the part's name. This allows different organizations to associate distinct semantics with the same name.",
          "$ref": "#/definitions/URIDatatype"
        },
        "class": {
          "title": "Part Class",
          "description": "An optional textual providing a sub-type or characterization of the part's name, or a category to which the part belongs.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "title": {
          "title": "Part Title",
          "description": "An optional name given to the part, which may be used by a tool for display and navigation.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "prose": {
          "title": "Part Text",
          "description": "Permits multiple paragraphs, lists, tables etc.",
          "type": "string"
        },
        "parts": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/part"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    },
    "parameter": {
      "title": "Parameter",
      "description": "Parameters provide a mechanism for the dynamic assignment of value(s) in a control.",
      "$id": "#/definitions/parameter",
      "type": "object",
      "properties": {
        "id": {
          "title": "Parameter Identifier",
          "description": "A unique identifier for the parameter.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "class": {
          "title": "Parameter Class",
          "description": "A textual label that provides a characterization of the type, purpose, use or scope of the parameter.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "depends-on": {
          "title": "Depends on",
          "description": "(deprecated) Another parameter invoking this one. This construct has been deprecated and should not be used.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "label": {
          "title": "Parameter Label",
          "description": "A short, placeholder name for the parameter, which can be used as a substitute for a value if no value is assigned.",
          "type": "string"
        },
        "usage": {
          "title": "Parameter Usage Description",
          "description": "Describes the purpose and use of a parameter.",
          "type": "string"
        },
        "constraints": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/parameter-constraint"
          }
        },
        "guidelines": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/parameter-guideline"
          }
        },
        "values": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/parameter-value"
          }
        },
        "select": {
          "$ref": "#/definitions/parameter-selection"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "id"
      ],
      "additionalProperties": false
    },
    "parameter-constraint": {
      "title": "Constraint",
      "description": "A formal or informal expression of a constraint or test.",
      "$id": "#/definitions/parameter-constraint",
      "type": "object",
      "properties": {
        "description": {
          "title": "Constraint Description",
          "description": "A textual summary of the constraint to be applied.",
          "type": "string"
        },
        "tests": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Parameter Constraint Test",
            "description": "A test expression which is expected to be evaluated by a tool.",
            "type": "object",
            "properties": {
              "expression": {
                "title": "Constraint test Expression",
                "description": "A formal (executable) expression of a constraint.",
                "$ref": "#/definitions/StringDatatype"
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "expression"
            ],
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": false
    },
    "parameter-guideline": {
      "title": "Guideline",
      "description": "A prose statement that provides a recommendation for the use of a parameter.",
      "$id": "#/definitions/parameter-guideline",
      "type": "object",
      "properties": {
        "prose": {
          "title": "Guideline Text",
          "description": "Prose permits multiple paragraphs, lists, tables etc.",
          "type": "string"
        }
      },
      "required": [
        "prose"
      ],
      "additionalProperties": false
    },
    "parameter-value": {
      "title": "Parameter Value",
      "description": "A parameter value or set of values.",
      "$id": "#/definitions/parameter-value",
      "$ref": "#/definitions/StringDatatype"
    },
    "parameter-selection": {
      "title": "Selection",
      "description": "Presenting a choice among alternatives.",
      "$id": "#/definitions/parameter-selection",
      "type": "object",
      "properties": {
        "how-many": {
          "title": "Parameter Cardinality",
          "description": "Describes the number of selections that must occur. Without this setting, only one value should be assumed to be permitted.",
          "allOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "one",
                "one-or-more"
              ]
            }
          ]
        },
        "choice": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Choice",
            "description": "A value selection among several such options.",
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "include-all": {
      "title": "Include All",
      "description": "Include all controls from the imported catalog or profile resources.",
      "$id": "#/definitions/include-all",
      "type": "object",
      "additionalProperties": false
    },
    "metadata": {
      "title": "Document Metadata",
      "description": "Provides information about the containing document, and defines concepts that are shared across the document.",
      "$id": "#/definitions/metadata",
      "type": "object",
      "properties": {
        "title": {
          "title": "Metadata Document Title",
          "description": "A name given to the document, which may be used by a tool for display and navigation.",
          "type": "string"
        },
        "published": {
          "$ref": "#/definitions/published"
        },
        "last-modified": {
          "$ref": "#/definitions/last-modified"
        },
        "version": {
          "$ref": "#/definitions/version"
        },
        "oscal-version": {
          "$ref": "#/definitions/oscal-version"
        },
        "revisions": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Revision History Entry",
            "description": "An entry in a sequential list of revisions to the containing document, expected to be in reverse chronological order (i.e. latest first).",
            "type": "object",
            "properties": {
              "title": {
                "title": "Document Title",
                "description": "A name given to the document revision, which may be used by a tool for display and navigation.",
                "type": "string"
              },
              "published": {
                "$ref": "#/definitions/published"
              },
              "last-modified": {
                "$ref": "#/definitions/last-modified"
              },
              "version": {
                "$ref": "#/definitions/version"
              },
              "oscal-version": {
                "$ref": "#/definitions/oscal-version"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "version"
            ],
            "additionalProperties": false
          }
        },
        "document-ids": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/document-id"
          }
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "roles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Role",
            "description": "Defines a function, which might be assigned to a party in a specific situation.",
            "type": "object",
            "properties": {
              "id": {
                "title": "Role Identifier",
                "description": "A unique identifier for the role.",
                "$ref": "#/definitions/TokenDatatype"
              },
              "title": {
                "title": "Role Title",
                "description": "A name given to the role, which may be used by a tool for display and navigation.",
                "type": "string"
              },
              "short-name": {
                "title": "Role Short Name",
                "description": "A short common name, abbreviation, or acronym for the role.",
                "$ref": "#/definitions/StringDatatype"
              },
              "description": {
                "title": "Role Description",
                "description": "A summary of the role's purpose and associated responsibilities.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "id",
              "title"
            ],
            "additionalProperties": false
          }
        },
        "locations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Location",
            "description": "A physical point of presence, which may be associated with people, organizations, or other concepts within the current or linked OSCAL document.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Location Universally Unique Identifier",
                "description": "A unique ID for the location, for reference.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "title": {
                "title": "Location Title",
                "description": "A name given to the location, which may be used by a tool for display and navigation.",
                "type": "string"
              },
              "address": {
                "$ref": "#/definitions/address"
              },
              "email-addresses": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/email-address"
                }
              },
              "telephone-numbers": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/telephone-number"
                }
              },
              "urls": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "title": "Location URL",
                  "description": "The uniform resource locator (URL) for a web site or other resource associated with the location.",
                  "$ref": "#/definitions/URIDatatype"
                }
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "uuid"
            ],
            "additionalProperties": false
          }
        },
        "parties": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Party",
            "description": "An organization or person, which may be associated with roles or other concepts within the current or linked OSCAL document.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Party Universally Unique Identifier",
                "description": "A unique identifier for the party.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "type": {
                "title": "Party Type",
                "description": "A category describing the kind of party the object describes.",
                "allOf": [
                  {
                    "$ref": "#/definitions/StringDatatype"
                  },
                  {
                    "enum": [
                      "person",
                      "organization"
                    ]
                  }
                ]
              },
              "name": {
                "title": "Party Name",
                "description": "The full name of the party. This is typically the legal name associated with the party.",
                "$ref": "#/definitions/StringDatatype"
              },
              "short-name": {
                "title": "Party Short Name",
                "description": "A short common name, abbreviation, or acronym for the party.",
                "$ref": "#/definitions/StringDatatype"
              },
              "external-ids": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "title": "Party External Identifier",
                  "description": "An identifier for a person or organization using a designated scheme. e.g. an Open Researcher and Contributor ID (ORCID).",
                  "type": "object",
                  "properties": {
                    "scheme": {
                      "title": "External Identifier Schema",
                      "description": "Indicates the type of external identifier.",
                      "anyOf": [
                        {
                          "$ref": "#/definitions/URIDatatype"
                        },
                        {
                          "enum": [
                            "http://orcid.org/"
                          ]
                        }
                      ]
                    },
                    "id": {
                      "$ref": "#/definitions/StringDatatype"
                    }
                  },
                  "required": [
                    "id",
                    "scheme"
                  ],
                  "additionalProperties": false
                }
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "email-addresses": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/email-address"
                }
              },
              "telephone-numbers": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/telephone-number"
                }
              },
              "addresses": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/address"
                }
              },
              "location-uuids": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/location-uuid"
                }
              },
              "member-of-organizations": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "title": "Organizational Affiliation",
                  "description": "A reference to another party by UUID, typically an organization, that this subject is associated with.",
                  "$ref": "#/definitions/UUIDDatatype"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "uuid",
              "type"
            ],
            "additionalProperties": false
          }
        },
        "responsible-parties": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-party"
          }
        },
        "actions": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/action"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "title",
        "last-modified",
        "version",
        "oscal-version"
      ],
      "additionalProperties": false
    },
    "location-uuid": {
      "title": "Location Universally Unique Identifier Reference",
      "description": "Reference to a location by UUID.",
      "$id": "#/definitions/location-uuid",
      "$ref": "#/definitions/UUIDDatatype"
    },
    "party-uuid": {
      "title": "Party Universally Unique Identifier Reference",
      "description": "Reference to a party by UUID.",
      "$id": "#/definitions/party-uuid",
      "$ref": "#/definitions/UUIDDatatype"
    },
    "role-id": {
      "title": "Role Identifier Reference",
      "description": "Reference to a role by UUID.",
      "$id": "#/definitions/role-id",
      "$ref": "#/definitions/TokenDatatype"
    },
    "back-matter": {
      "title": "Back matter",
      "description": "A collection of resources that may be referenced from within the OSCAL document instance.",
      "$id": "#/definitions/back-matter",
      "type": "object",
      "properties": {
        "resources": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Resource",
            "description": "A resource associated with content in the containing document instance. A resource may be directly included in the document using base64 encoding or may point to one or more equivalent internet resources.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Resource Universally Unique Identifier",
                "description": "A unique identifier for a resource.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "title": {
                "title": "Resource Title",
                "description": "An optional name given to the resource, which may be used by a tool for display and navigation.",
                "type": "string"
              },
              "description": {
                "title": "Resource Description",
                "description": "An optional short summary of the resource used to indicate the purpose of the resource.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "document-ids": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/document-id"
                }
              },
              "citation": {
                "title": "Citation",
                "description": "An optional citation consisting of end note text using structured markup.",
                "type": "object",
                "properties": {
                  "text": {
                    "title": "Citation Text",
                    "description": "A line of citation text.",
                    "type": "string"
                  },
                  "props": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/property"
                    }
                  },
                  "links": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/link"
                    }
                  }
                },
                "required": [
                  "text"
                ],
                "additionalProperties": false
              },
              "rlinks": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "title": "Resource link",
                  "description": "A URL-based pointer to an external resource with an optional hash for verification and change detection.",
                  "type": "object",
                  "properties": {
                    "href": {
                      "title": "Resource Hypertext Reference",
                      "description": "A resolvable URL pointing to the referenced resource.",
                      "$ref": "#/definitions/URIReferenceDatatype"
                    },
                    "media-type": {
                      "title": "Resource Media Type",
                      "description": "A label that indicates the nature of a resource, as a data serialization or format.",
                      "$ref": "#/definitions/StringDatatype"
                    },
                    "hashes": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/hash"
                      }
                    }
                  },
                  "required": [
                    "href"
                  ],
                  "additionalProperties": false
                }
              },
              "base64": {
                "title": "Base64",
                "description": "A resource encoded using the Base64 alphabet defined by RFC 2045.",
                "type": "object",
                "properties": {
                  "filename": {
                    "title": "Resource Base64 File Name",
                    "description": "Name of the file before it was encoded as Base64 to be embedded in a resource. This is the name that will be assigned to the file when the file is decoded.",
                    "$ref": "#/definitions/TokenDatatype"
                  },
                  "media-type": {
                    "title": "Resource Base64 Media Type",
                    "description": "A label that indicates the nature of a resource, as a data serialization or format.",
                    "$ref": "#/definitions/StringDatatype"
                  },
                  "value": {
                    "$ref": "#/definitions/Base64Datatype"
                  }
                },
                "required": [
                  "value"
                ],
                "additionalProperties": false
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "uuid"
            ],
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": false
    },
    "property": {
      "title": "Property",
      "description": "An attribute, characteristic, or quality of the containing object expressed as a namespace qualified name/value pair.",
      "$id": "#/definitions/property",
      "type": "object",
      "properties": {
        "name": {
          "title": "Property Name",
          "description": "A textual label, within a namespace, that uniquely identifies a specific attribute, characteristic, or quality of the property's containing object.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "uuid": {
          "title": "Property Universally Unique Identifier",
          "description": "A unique identifier for a property.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "ns": {
          "title": "Property Namespace",
          "description": "A namespace qualifying the property's name. This allows different organizations to associate distinct semantics with the same name.",
          "$ref": "#/definitions/URIDatatype"
        },
        "value": {
          "title": "Property Value",
          "description": "Indicates the value of the attribute, characteristic, or quality.",
          "$ref": "#/definitions/StringDatatype"
        },
        "class": {
          "title": "Property Class",
          "description": "A textual label that provides a sub-type or characterization of the property's name.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "group": {
          "title": "Property Group",
          "description": "An identifier for relating distinct sets of properties.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "name",
        "value"
      ],
      "additionalProperties": false
    },
    "link": {
      "title": "Link",
      "description": "A reference to a local or remote resource, that has a specific relation to the containing object.",
      "$id": "#/definitions/link",
      "type": "object",
      "properties": {
        "href": {
          "title": "Hypertext Reference",
          "description": "A resolvable URL reference to a resource.",
          "$ref": "#/definitions/URIReferenceDatatype"
        },
        "rel": {
          "title": "Link Relation Type",
          "description": "Describes the type of relationship provided by the link's hypertext reference. This can be an indicator of the link's purpose.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "reference"
              ]
            }
          ]
        },
        "media-type": {
          "title": "Media Type",
          "description": "A label that indicates the nature of a resource, as a data serialization or format.",
          "$ref": "#/definitions/StringDatatype"
        },
        "resource-fragment": {
          "title": "Resource Fragment",
          "description": "In case where the href points to a back-matter/resource, this value will indicate the URI fragment to append to any rlink associated with the resource. This value MUST be URI encoded.",
          "$ref": "#/definitions/StringDatatype"
        },
        "text": {
          "title": "Link Text",
          "description": "A textual label to associate with the link, which may be used for presentation in a tool.",
          "type": "string"
        }
      },
      "required": [
        "href"
      ],
      "additionalProperties": false
    },
    "responsible-party": {
      "title": "Responsible Party",
      "description": "A reference to a set of persons and/or organizations that have responsibility for performing the referenced role in the context of the containing object.",
      "$id": "#/definitions/responsible-party",
      "type": "object",
      "properties": {
        "role-id": {
          "title": "Responsible Role Id",
          "description": "A reference to a role performed by a party.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "party-uuids": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/party-uuid"
          }
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "role-id",
        "party-uuids"
      ],
      "additionalProperties": false
    },
    "action": {
      "title": "Action",
      "description": "An action applied by a role within a given party to the content.",
      "$id": "#/definitions/action",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Action Universally Unique Identifier",
          "description": "A unique identifier that can be used to reference this defined action elsewhere in an OSCAL document. A UUID should be consistently used for a given location across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "date": {
          "title": "Action Occurrence Date",
          "description": "The date and time when the action occurred.",
          "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
        },
        "type": {
          "title": "Action Type",
          "description": "The type of action documented by the assembly, such as an approval.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "system": {
          "title": "Action Type System",
          "description": "Specifies the action type system used.",
          "$ref": "#/definitions/URIDatatype"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "responsible-parties": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-party"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "type",
        "system"
      ],
      "additionalProperties": false
    },
    "responsible-role": {
      "title": "Responsible Role",
      "description": "A reference to a role with responsibility for performing a function relative to the containing object, optionally associated with a set of persons and/or organizations that perform that role.",
      "$id": "#/definitions/responsible-role",
      "type": "object",
      "properties": {
        "role-id": {
          "title": "Responsible Role ID",
          "description": "A human-oriented identifier reference to a role performed.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "party-uuids": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/party-uuid"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "role-id"
      ],
      "additionalProperties": false
    },
    "hash": {
      "title": "Hash",
      "description": "A representation of a cryptographic digest generated over a resource using a specified hash algorithm.",
      "$id": "#/definitions/hash",
      "type": "object",
      "properties": {
        "algorithm": {
          "title": "Hash algorithm",
          "description": "The digest method by which a hash is derived.",
          "anyOf": [
            {
              "$ref": "#/definitions/StringDatatype"
            },
            {
              "enum": [
                "SHA-224",
                "SHA-256",
                "SHA-384",
                "SHA-512",
                "SHA3-224",
                "SHA3-256",
                "SHA3-384",
                "SHA3-512"
              ]
            }
          ]
        },
        "value": {
          "$ref": "#/definitions/StringDatatype"
        }
      },
      "required": [
        "value",
        "algorithm"
      ],
      "additionalProperties": false
    },
    "remarks": {
      "title": "Remarks",
      "description": "Additional commentary about the containing object.",
      "$id": "#/definitions/remarks",
      "type": "string"
    },
    "published": {
      "title": "Publication Timestamp",
      "description": "The date and time the document was last made available.",
      "$id": "#/definitions/published",
      "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
    },
    "last-modified": {
      "title": "Last Modified Timestamp",
      "description": "The date and time the document was last stored for later retrieval.",
      "$id": "#/definitions/last-modified",
      "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
    },
    "version": {
      "title": "Document Version",
      "description": "Used to distinguish a specific revision of an OSCAL document from other previous and future versions.",
      "$id": "#/definitions/version",
      "$ref": "#/definitions/StringDatatype"
    },
    "oscal-version": {
      "title": "OSCAL Version",
      "description": "The OSCAL model version the document was authored against and will conform to as valid.",
      "$id": "#/definitions/oscal-version",
      "$ref": "#/definitions/StringDatatype"
    },
    "email-address": {
      "title": "Email Address",
      "description": "An email address as defined by RFC 5322 Section 3.4.1.",
      "$id": "#/definitions/email-address",
      "$ref": "#/definitions/EmailAddressDatatype"
    },
    "telephone-number": {
      "title": "Telephone Number",
      "description": "A telephone service number as defined by ITU-T E.164.",
      "$id": "#/definitions/telephone-number",
      "type": "object",
      "properties": {
        "type": {
          "title": "type flag",
          "description": "Indicates the type of phone number.",
          "anyOf": [
            {
              "$ref": "#/definitions/StringDatatype"
            },
            {
              "enum": [
                "home",
                "office",
                "mobile"
              ]
            }
          ]
        },
        "number": {
          "$ref": "#/definitions/StringDatatype"
        }
      },
      "required": [
        "number"
      ],
      "additionalProperties": false
    },
    "address": {
      "title": "Address",
      "description": "A postal address for the location.",
      "$id": "#/definitions/address",
      "type": "object",
      "properties": {
        "type": {
          "title": "Address Type",
          "description": "Indicates the type of address.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "home",
                "work"
              ]
            }
          ]
        },
        "addr-lines": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/addr-line"
          }
        },
        "city": {
          "title": "City",
          "description": "City, town or geographical region for the mailing address.",
          "$ref": "#/definitions/StringDatatype"
        },
        "state": {
          "title": "State Or Region",
          "description": "State, province or analogous geographical region for a mailing address.",
          "$ref": "#/definitions/StringDatatype"
        },
        "postal-code": {
          "title": "Postal Code",
          "description": "Postal or ZIP code for mailing address.",
          "$ref": "#/definitions/StringDatatype"
        },
        "country": {
          "title": "Country Code",
          "description": "The ISO 3166-1 alpha-2 country code for the mailing address.",
          "$ref": "#/definitions/StringDatatype"
        }
      },
      "additionalProperties": false
    },
    "addr-line": {
      "title": "Address line",
      "description": "A single line of an address.",
      "$id": "#/definitions/addr-line",
      "$ref": "#/definitions/StringDatatype"
    },
    "document-id": {
      "title": "Document Identifier",
      "description": "A document identifier qualified by an identifier scheme.",
      "$id": "#/definitions/document-id",
      "type": "object",
      "properties": {
        "scheme": {
          "title": "Document Identification Scheme",
          "description": "Qualifies the kind of document identifier using a URI. If the scheme is not provided the value of the element will be interpreted as a string of characters.",
          "anyOf": [
            {
              "$ref": "#/definitions/URIDatatype"
            },
            {
              "enum": [
                "http://www.doi.org/"
              ]
            }
          ]
        },
        "identifier": {
          "$ref": "#/definitions/StringDatatype"
        }
      },
      "required": [
        "identifier"
      ],
      "additionalProperties": false
    },
    "profile": {
      "title": "Profile",
      "description": "Each OSCAL profile is defined by a profile element.",
      "$id": "#/definitions/profile",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Profile Universally Unique Identifier",
          "description": "Provides a globally unique means to identify a given profile instance.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "metadata": {
          "$ref": "#/definitions/metadata"
        },
        "imports": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/import"
          }
        },
        "merge": {
          "$ref": "#/definitions/merge"
        },
        "modify": {
          "$ref": "#/definitions/modify"
        },
        "back-matter": {
          "$ref": "#/definitions/back-matter"
        }
      },
      "required": [
        "uuid",
        "metadata",
        "imports"
      ],
      "additionalProperties": false
    },
    "import": {
      "title": "Import Resource",
      "description": "Designates a referenced source catalog or profile that provides a source of control information for use in creating a new overlay or baseline.",
      "$id": "#/definitions/import",
      "type": "object",
      "properties": {
        "href": {
          "title": "Catalog or Profile Reference",
          "description": "A resolvable URL reference to the base catalog or profile that this profile is tailoring.",
          "$ref": "#/definitions/URIReferenceDatatype"
        },
        "include-all": {
          "$ref": "#/definitions/include-all"
        },
        "include-controls": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/select-profile-control-by-id"
          }
        },
        "exclude-controls": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/select-profile-control-by-id"
          }
        }
      },
      "required": [
        "href"
      ],
      "additionalProperties": false
    },
    "merge": {
      "title": "Merge Controls",
      "description": "Provides structuring directives that instruct how controls are organized after profile resolution.",
      "$id": "#/definitions/merge",
      "type": "object",
      "properties": {
        "combine": {
          "title": "Combination Rule",
          "description": "A Combine element defines how to resolve duplicate instances of the same control (e.g., controls with the same ID).",
          "type": "object",
          "properties": {
            "method": {
              "title": "Combination Method",
              "description": "Declare how clashing controls should be handled.",
              "allOf": [
                {
                  "$ref": "#/definitions/StringDatatype"
                },
                {
                  "enum": [
                    "use-first",
                    "merge",
                    "keep"
                  ]
                }
              ]
            }
          },
          "additionalProperties": false
        },
        "flat": {
          "title": "Flat Without Grouping",
          "description": "Directs that controls appear without any grouping structure.",
          "type": "object",
          "additionalProperties": false
        },
        "as-is": {
          "title": "Group As-Is",
          "description": "Indicates that the controls selected should retain their original grouping as defined in the import source.",
          "$ref": "#/definitions/BooleanDatatype"
        },
        "custom": {
          "title": "Custom Grouping",
          "description": "Provides an alternate grouping structure that selected controls will be placed in.",
          "type": "object",
          "properties": {
            "groups": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/group"
              }
            },
            "insert-controls": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/insert-controls"
              }
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "modify": {
      "title": "Modify Controls",
      "description": "Set parameters or amend controls in resolution.",
      "$id": "#/definitions/modify",
      "type": "object",
      "properties": {
        "set-parameters": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Modify Parameter Setting",
            "description": "A parameter setting, to be propagated to points of insertion.",
            "type": "object",
            "properties": {
              "param-id": {
                "title": "Modify Parameter ID",
                "description": "An identifier for the parameter.",
                "$ref": "#/definitions/TokenDatatype"
              },
              "class": {
                "title": "Modify Parameter Class",
                "description": "A textual label that provides a characterization of the parameter.",
                "$ref": "#/definitions/TokenDatatype"
              },
              "depends-on": {
                "title": "Modify Depends On",
                "description": "**(deprecated)** Another parameter invoking this one. This construct has been deprecated and should not be used.",
                "$ref": "#/definitions/TokenDatatype"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "label": {
                "title": "Modify Parameter Label",
                "description": "A short, placeholder name for the parameter, which can be used as a substitute for a value if no value is assigned.",
                "type": "string"
              },
              "usage": {
                "title": "Modify Parameter Usage Description",
                "description": "Describes the purpose and use of a parameter.",
                "type": "string"
              },
              "constraints": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/parameter-constraint"
                }
              },
              "guidelines": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/parameter-guideline"
                }
              },
              "values": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/parameter-value"
                }
              },
              "select": {
                "$ref": "#/definitions/parameter-selection"
              }
            },
            "required": [
              "param-id"
            ],
            "additionalProperties": false
          }
        },
        "alters": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Alteration",
            "description": "Specifies changes to be made to an included control when a profile is resolved.",
            "type": "object",
            "properties": {
              "control-id": {
                "title": "Alter Control Identifier Reference",
                "description": "A reference to a control with a corresponding id value. When referencing an externally defined control, the Control Identifier Reference must be used in the context of the external / imported OSCAL instance (e.g., uri-reference).",
                "$ref": "#/definitions/TokenDatatype"
              },
              "removes": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "title": "Removal",
                  "description": "Specifies objects to be removed from a control based on specific aspects of the object that must all match.",
                  "type": "object",
                  "properties": {
                    "by-name": {
                      "title": "Removal Reference by (assigned) name",
                      "description": "Identify items remove by matching their assigned name.",
                      "$ref": "#/definitions/TokenDatatype"
                    },
                    "by-class": {
                      "title": "Removal Reference by class",
                      "description": "Identify items to remove by matching their class.",
                      "$ref": "#/definitions/TokenDatatype"
                    },
                    "by-id": {
                      "title": "Removal Reference by ID",
                      "description": "Identify items to remove indicated by their id.",
                      "$ref": "#/definitions/TokenDatatype"
                    },
                    "by-item-name": {
                      "title": "Item Name Reference",
                      "description": "Identify items to remove by the name of the item's information object name, e.g. title or prop.",
                      "allOf": [
                        {
                          "$ref": "#/definitions/TokenDatatype"
                        },
                        {
                          "enum": [
                            "param",
                            "prop",
                            "link",
                            "part",
                            "mapping",
                            "map"
                          ]
                        }
                      ]
                    },
                    "by-ns": {
                      "title": "Item Namespace Reference",
                      "description": "Identify items to remove by the item's ns, which is the namespace associated with a part, or prop.",
                      "$ref": "#/definitions/TokenDatatype"
                    }
                  },
                  "additionalProperties": false
                }
              },
              "adds": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "title": "Addition",
                  "description": "Specifies contents to be added into controls, in resolution.",
                  "type": "object",
                  "properties": {
                    "position": {
                      "title": "Position",
                      "description": "Where to add the new content with respect to the targeted element (beside it or inside it).",
                      "allOf": [
                        {
                          "$ref": "#/definitions/TokenDatatype"
                        },
                        {
                          "enum": [
                            "before",
                            "after",
                            "starting",
                            "ending"
                          ]
                        }
                      ]
                    },
                    "by-id": {
                      "title": "Addition Reference by ID",
                      "description": "Target location of the addition.",
                      "$ref": "#/definitions/TokenDatatype"
                    },
                    "title": {
                      "title": "Addition Title Change",
                      "description": "A name given to the control, which may be used by a tool for display and navigation.",
                      "type": "string"
                    },
                    "params": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/parameter"
                      }
                    },
                    "props": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/property"
                      }
                    },
                    "links": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/link"
                      }
                    },
                    "parts": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/part"
                      }
                    }
                  },
                  "additionalProperties": false
                }
              }
            },
            "required": [
              "control-id"
            ],
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": false
    },
    "insert-controls": {
      "title": "Insert Controls",
      "description": "Specifies which controls to use in the containing context.",
      "$id": "#/definitions/insert-controls",
      "type": "object",
      "properties": {
        "order": {
          "title": "Order",
          "description": "A designation of how a selection of controls in a profile is to be ordered.",
          "allOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "keep",
                "ascending",
                "descending"
              ]
            }
          ]
        },
        "include-all": {
          "$ref": "#/definitions/include-all"
        },
        "include-controls": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/select-control-by-id"
          }
        },
        "exclude-controls": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/select-control-by-id"
          }
        }
      },
      "additionalProperties": false
    },
    "select-control-by-id": {
      "title": "Select Control",
      "description": "Used to select a control for inclusion/exclusion based on one or more control identifiers. A set of statement identifiers can be used to target the inclusion/exclusion to only specific control statements providing more granularity over the specific statements that are within the asessment scope.",
      "$id": "#/definitions/select-control-by-id",
      "type": "object",
      "properties": {
        "control-id": {
          "title": "Control Identifier Reference",
          "description": "A reference to a control with a corresponding id value. When referencing an externally defined control, the Control Identifier Reference must be used in the context of the external / imported OSCAL instance (e.g., uri-reference).",
          "$ref": "#/definitions/TokenDatatype"
        },
        "statement-ids": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Include Specific Statements",
            "description": "Used to constrain the selection to only specificity identified statements.",
            "$ref": "#/definitions/TokenDatatype"
          }
        }
      },
      "required": [
        "control-id"
      ],
      "additionalProperties": false
    },
    "select-profile-control-by-id" : 
    { "title" : "Select Control",
     "description" : "Select a control or controls from an imported control set.",
     "$id" : "#/definitions/select-profile-control-by-id",
     "type" : "object",
     "properties" : 
     { "with-child-controls" : 
      { "title" : "Include Contained Controls with Control",
       "description" : "When a control is included, whether its child (dependent) controls are also included.",
       "allOf" : 
       [ 
        { "$ref" : "#/definitions/TokenDatatype" },
        
        { "enum" : 
         [ "yes",
          "no" ] } ] },
      "with-ids" : 
      { "type" : "array",
       "minItems" : 1,
       "items" : 
       { "$ref" : "#/definitions/with-id" } },
      "matching" : 
      { "type" : "array",
       "minItems" : 1,
       "items" : 
       { "$ref" : "#/definitions/matching" } } }},
    "with-id": {
      "title": "Match Controls by Identifier",
      "description": "Selecting a control by its ID given as a literal.",
      "$id": "#/definitions/with-id",
      "$ref": "#/definitions/TokenDatatype"
    },
    "matching": {
      "title": "Match Controls by Pattern",
      "description": "Selecting a set of controls by matching their IDs with a wildcard pattern.",
      "$id": "#/definitions/matching",
      "type": "object",
      "properties": {
        "pattern": {
          "title": "Pattern",
          "description": "A glob expression matching the IDs of one or more controls to be selected.",
          "$ref": "#/definitions/StringDatatype"
        }
      },
      "additionalProperties": false
    },
    "component-definition": {
      "title": "Component Definition",
      "description": "A collection of component descriptions, which may optionally be grouped by capability.",
      "$id": "#/definitions/component-definition",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Component Definition Universally Unique Identifier",
          "description": "Provides a globally unique means to identify a given component definition instance.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "metadata": {
          "$ref": "#/definitions/metadata"
        },
        "import-component-definitions": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/import-component-definition"
          }
        },
        "components": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/defined-component"
          }
        },
        "capabilities": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/capability"
          }
        },
        "back-matter": {
          "$ref": "#/definitions/back-matter"
        }
      },
      "required": [
        "uuid",
        "metadata"
      ],
      "additionalProperties": false
    },
    "import-component-definition": {
      "title": "Import Component Definition",
      "description": "Loads a component definition from another resource.",
      "$id": "#/definitions/import-component-definition",
      "type": "object",
      "properties": {
        "href": {
          "title": "Hyperlink Reference",
          "description": "A link to a resource that defines a set of components and/or capabilities to import into this collection.",
          "$ref": "#/definitions/URIReferenceDatatype"
        }
      },
      "required": [
        "href"
      ],
      "additionalProperties": false
    },
    "defined-component": {
      "title": "Defined Component",
      "description": "A defined component that can be part of an implemented system.",
      "$id": "#/definitions/defined-component",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Defined Component Identifier",
          "description": "Provides a globally unique means to identify a given component.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "type": {
          "title": "Defined Component Type",
          "description": "A category describing the purpose of the component.",
          "anyOf": [
            {
              "$ref": "#/definitions/StringDatatype"
            },
            {
              "enum": [
                "interconnection",
                "software",
                "hardware",
                "service",
                "policy",
                "physical",
                "process-procedure",
                "plan",
                "guidance",
                "standard",
                "validation"
              ]
            }
          ]
        },
        "title": {
          "title": "Defined Component Title",
          "description": "A human readable name for the component.",
          "type": "string"
        },
        "description": {
          "title": "Defined Component Description",
          "description": "A description of the component, including information about its function.",
          "type": "string"
        },
        "purpose": {
          "title": "Defined Component Purpose",
          "description": "A summary of the technological or business purpose of the component.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "responsible-roles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-role"
          }
        },
        "protocols": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/protocol"
          }
        },
        "control-implementations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/control-implementation"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "type",
        "title",
        "description"
      ],
      "additionalProperties": false
    },
    "capability": {
      "title": "Capability",
      "description": "A grouping of other components and/or capabilities.",
      "$id": "#/definitions/capability",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Capability Identifier",
          "description": "Provides a globally unique means to identify a given capability.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "name": {
          "title": "Capability Name",
          "description": "The capability's human-readable name.",
          "$ref": "#/definitions/StringDatatype"
        },
        "description": {
          "title": "Capability Description",
          "description": "A summary of the capability.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "incorporates-components": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/incorporates-component"
          }
        },
        "control-implementations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/control-implementation"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "name",
        "description"
      ],
      "additionalProperties": false
    },
    "incorporates-component": {
      "title": "Incorporates Component",
      "description": "The collection of components comprising this capability.",
      "$id": "#/definitions/incorporates-component",
      "type": "object",
      "properties": {
        "component-uuid": {
          "title": "incorporating Component Reference",
          "description": "A machine-oriented identifier reference to a component.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "description": {
          "title": "incorporating Component Description",
          "description": "A description of the component, including information about its function.",
          "type": "string"
        }
      },
      "required": [
        "component-uuid",
        "description"
      ],
      "additionalProperties": false
    },
    "control-implementation": {
      "title": "SSP Control Implementation",
      "description": "Describes how the system satisfies a set of controls.",
      "$id": "#/definitions/control-implementation",
      "type": "object",
      "properties": {
        "description": {
          "title": "SSP Control Implementation Description",
          "description": "A statement describing important things to know about how this set of control satisfaction documentation is approached.",
          "type": "string"
        },
        "set-parameters": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/set-parameter"
          }
        },
        "implemented-requirements": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/implemented-requirement"
          }
        }
      },
      "required": [
        "description",
        "implemented-requirements"
      ],
      "additionalProperties": false
    },
    "implemented-requirement": {
      "title": "Control-based Requirement",
      "description": "Describes how the system satisfies the requirements of an individual control.",
      "$id": "#/definitions/implemented-requirement",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Control Requirement Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this control requirement elsewhere in this or other OSCAL instances. The locally defined UUID of the control requirement can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "control-id": {
          "title": "Implemented Control Identifier Reference",
          "description": "A reference to a control with a corresponding id value. When referencing an externally defined control, the Control Identifier Reference must be used in the context of the external / imported OSCAL instance (e.g., uri-reference).",
          "$ref": "#/definitions/TokenDatatype"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "set-parameters": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/set-parameter"
          }
        },
        "responsible-roles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-role"
          }
        },
        "statements": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/statement"
          }
        },
        "by-components": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/by-component"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "control-id"
      ],
      "additionalProperties": false
    },
    "statement": {
      "title": "Specific Control Statement",
      "description": "Identifies which statements within a control are addressed.",
      "$id": "#/definitions/statement",
      "type": "object",
      "properties": {
        "statement-id": {
          "title": "Control Statement Reference",
          "description": "A human-oriented identifier reference to a control statement.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "uuid": {
          "title": "Control Statement Reference Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this control statement elsewhere in this or other OSCAL instances. The UUID of the control statement in the source OSCAL instance is sufficient to reference the data item locally or globally (e.g., in an imported OSCAL instance).",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "responsible-roles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-role"
          }
        },
        "by-components": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/by-component"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "statement-id",
        "uuid"
      ],
      "additionalProperties": false
    },
    "system-component": {
      "title": "Component",
      "description": "A defined component that can be part of an implemented system.",
      "$id": "#/definitions/system-component",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Component Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this component elsewhere in this or other OSCAL instances. The locally defined UUID of the component can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "type": {
          "title": "Component Type",
          "description": "A category describing the purpose of the component.",
          "anyOf": [
            {
              "$ref": "#/definitions/StringDatatype"
            },
            {
              "enum": [
                "this-system",
                "system",
                "interconnection",
                "software",
                "hardware",
                "service",
                "policy",
                "physical",
                "process-procedure",
                "plan",
                "guidance",
                "standard",
                "validation",
                "network"
              ]
            }
          ]
        },
        "title": {
          "title": "Component Title",
          "description": "A human readable name for the system component.",
          "type": "string"
        },
        "description": {
          "title": "Component Description",
          "description": "A description of the component, including information about its function.",
          "type": "string"
        },
        "purpose": {
          "title": "Purpose",
          "description": "A summary of the technological or business purpose of the component.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "status": {
          "title": "Operating Status",
          "description": "Describes the operational status of the system component.",
          "type": "object",
          "properties": {
            "state": {
              "title": "Operating State",
              "description": "The operational status.",
              "allOf": [
                {
                  "$ref": "#/definitions/TokenDatatype"
                },
                {
                  "enum": [
                    "under-development",
                    "operational",
                    "disposition",
                    "other"
                  ]
                }
              ]
            },
            "remarks": {
              "$ref": "#/definitions/remarks"
            }
          },
          "required": [
            "state"
          ],
          "additionalProperties": false
        },
        "responsible-roles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-role"
          }
        },
        "protocols": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/protocol"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "type",
        "title",
        "description",
        "status"
      ],
      "additionalProperties": false
    },
    "protocol": {
      "title": "Service Protocol Information",
      "description": "Information about the protocol used to provide a service.",
      "$id": "#/definitions/protocol",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Service Protocol Information Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this service protocol information elsewhere in this or other OSCAL instances. The locally defined UUID of the service protocol can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "name": {
          "title": "Protocol Name",
          "description": "The common name of the protocol, which should be the appropriate \"service name\" from the IANA Service Name and Transport Protocol Port Number Registry.",
          "$ref": "#/definitions/StringDatatype"
        },
        "title": {
          "title": "Protocol Title",
          "description": "A human readable name for the protocol (e.g., Transport Layer Security).",
          "type": "string"
        },
        "port-ranges": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/port-range"
          }
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    },
    "port-range": {
      "title": "Port Range",
      "description": "Where applicable this is the IPv4 port range on which the service operates.",
      "$id": "#/definitions/port-range",
      "type": "object",
      "properties": {
        "start": {
          "title": "Start",
          "description": "Indicates the starting port number in a port range",
          "$ref": "#/definitions/NonNegativeIntegerDatatype"
        },
        "end": {
          "title": "End",
          "description": "Indicates the ending port number in a port range",
          "$ref": "#/definitions/NonNegativeIntegerDatatype"
        },
        "transport": {
          "title": "Transport",
          "description": "Indicates the transport type.",
          "allOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "TCP",
                "UDP"
              ]
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "implementation-status": {
      "title": "Implementation Status",
      "description": "Indicates the degree to which the a given control is implemented.",
      "$id": "#/definitions/implementation-status",
      "type": "object",
      "properties": {
        "state": {
          "title": "Implementation State",
          "description": "Identifies the implementation status of the control or control objective.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "implemented",
                "partial",
                "planned",
                "alternative",
                "not-applicable"
              ]
            }
          ]
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "state"
      ],
      "additionalProperties": false
    },
    "system-user": {
      "title": "System User",
      "description": "A type of user that interacts with the system based on an associated role.",
      "$id": "#/definitions/system-user",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "User Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this user class elsewhere in this or other OSCAL instances. The locally defined UUID of the system user can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "title": {
          "title": "User Title",
          "description": "A name given to the user, which may be used by a tool for display and navigation.",
          "type": "string"
        },
        "short-name": {
          "title": "User Short Name",
          "description": "A short common name, abbreviation, or acronym for the user.",
          "$ref": "#/definitions/StringDatatype"
        },
        "description": {
          "title": "User Description",
          "description": "A summary of the user's purpose within the system.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "role-ids": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/role-id"
          }
        },
        "authorized-privileges": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/authorized-privilege"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid"
      ],
      "additionalProperties": false
    },
    "authorized-privilege": {
      "title": "Privilege",
      "description": "Identifies a specific system privilege held by the user, along with an associated description and/or rationale for the privilege.",
      "$id": "#/definitions/authorized-privilege",
      "type": "object",
      "properties": {
        "title": {
          "title": "Privilege Title",
          "description": "A human readable name for the privilege.",
          "type": "string"
        },
        "description": {
          "title": "Privilege Description",
          "description": "A summary of the privilege's purpose within the system.",
          "type": "string"
        },
        "functions-performed": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/function-performed"
          }
        }
      },
      "required": [
        "title",
        "functions-performed"
      ],
      "additionalProperties": false
    },
    "function-performed": {
      "title": "Functions Performed",
      "description": "Describes a function performed for a given authorized privilege by this user class.",
      "$id": "#/definitions/function-performed",
      "$ref": "#/definitions/StringDatatype"
    },
    "inventory-item": {
      "title": "Inventory Item",
      "description": "A single managed inventory item within the system.",
      "$id": "#/definitions/inventory-item",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Inventory Item Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this inventory item elsewhere in this or other OSCAL instances. The locally defined UUID of the inventory item can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "description": {
          "title": "Inventory Item Description",
          "description": "A summary of the inventory item stating its purpose within the system.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "responsible-parties": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-party"
          }
        },
        "implemented-components": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Implemented Component",
            "description": "The set of components that are implemented in a given system inventory item.",
            "type": "object",
            "properties": {
              "component-uuid": {
                "title": "Implemented Component Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to a component that is implemented as part of an inventory item.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "responsible-parties": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/responsible-party"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "component-uuid"
            ],
            "additionalProperties": false
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "description"
      ],
      "additionalProperties": false
    },
    "set-parameter": {
      "title": "Set Parameter Value",
      "description": "Identifies the parameter that will be set by the enclosed value.",
      "$id": "#/definitions/set-parameter",
      "type": "object",
      "properties": {
        "param-id": {
          "title": "Set Parameter ID",
          "description": "A human-oriented reference to a parameter within a control, who's catalog has been imported into the current implementation context.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "values": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Param Value",
            "description": "A parameter value or set of values.",
            "$ref": "#/definitions/StringDatatype"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "param-id",
        "values"
      ],
      "additionalProperties": false
    },
    "system-id": {
      "title": "System Identification",
      "description": "A human-oriented, globally unique identifier with cross-instance scope that can be used to reference this system identification property elsewhere in this or other OSCAL instances. When referencing an externally defined system identification, the system identification must be used in the context of the external / imported OSCAL instance (e.g., uri-reference). This string should be assigned per-subject, which means it should be consistently used to identify the same system across revisions of the document.",
      "$id": "#/definitions/system-id",
      "type": "object",
      "properties": {
        "identifier-type": {
          "title": "Identification System Type",
          "description": "Identifies the identification system from which the provided identifier was assigned.",
          "anyOf": [
            {
              "$ref": "#/definitions/URIDatatype"
            },
            {
              "enum": [
                "https://fedramp.gov",
                "http://fedramp.gov/ns/oscal",
                "https://ietf.org/rfc/rfc4122",
                "http://ietf.org/rfc/rfc4122"
              ]
            }
          ]
        },
        "id": {
          "$ref": "#/definitions/StringDatatype"
        }
      },
      "required": [
        "id"
      ],
      "additionalProperties": false
    },
    "system-security-plan": {
      "title": "System Security Plan (SSP)",
      "description": "A system security plan, such as those described in NIST SP 800-18.",
      "$id": "#/definitions/system-security-plan",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "System Security Plan Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this system security plan (SSP) elsewhere in this or other OSCAL instances. The locally defined UUID of the SSP can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance).This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "metadata": {
          "$ref": "#/definitions/metadata"
        },
        "import-profile": {
          "$ref": "#/definitions/import-profile"
        },
        "system-characteristics": {
          "$ref": "#/definitions/system-characteristics"
        },
        "system-implementation": {
          "$ref": "#/definitions/system-implementation"
        },
        "control-implementation": {
          "$ref": "#/definitions/control-implementation"
        },
        "back-matter": {
          "$ref": "#/definitions/back-matter"
        }
      },
      "required": [
        "uuid",
        "metadata",
        "import-profile",
        "system-characteristics",
        "system-implementation",
        "control-implementation"
      ],
      "additionalProperties": false
    },
    "import-profile": {
      "title": "Import Profile",
      "description": "Used to import the OSCAL profile representing the system's control baseline.",
      "$id": "#/definitions/import-profile",
      "type": "object",
      "properties": {
        "href": {
          "title": "Profile Reference",
          "description": "A resolvable URL reference to the profile or catalog to use as the system's control baseline.",
          "$ref": "#/definitions/URIReferenceDatatype"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "href"
      ],
      "additionalProperties": false
    },
    "system-characteristics": {
      "title": "System Characteristics",
      "description": "Contains the characteristics of the system, such as its name, purpose, and security impact level.",
      "$id": "#/definitions/system-characteristics",
      "type": "object",
      "properties": {
        "system-ids": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/system-id"
          }
        },
        "system-name": {
          "title": "System Name - Full",
          "description": "The full name of the system.",
          "$ref": "#/definitions/StringDatatype"
        },
        "system-name-short": {
          "title": "System Name - Short",
          "description": "A short name for the system, such as an acronym, that is suitable for display in a data table or summary list.",
          "$ref": "#/definitions/StringDatatype"
        },
        "description": {
          "title": "System Description",
          "description": "A summary of the system.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "date-authorized": {
          "$ref": "#/definitions/date-authorized"
        },
        "security-sensitivity-level": {
          "title": "Security Sensitivity Level",
          "description": "The overall information system sensitivity categorization, such as defined by FIPS-199.",
          "$ref": "#/definitions/StringDatatype"
        },
        "system-information": {
          "$ref": "#/definitions/system-information"
        },
        "security-impact-level": {
          "$ref": "#/definitions/security-impact-level"
        },
        "status": {
          "$ref": "#/definitions/status"
        },
        "authorization-boundary": {
          "$ref": "#/definitions/authorization-boundary"
        },
        "network-architecture": {
          "$ref": "#/definitions/network-architecture"
        },
        "data-flow": {
          "$ref": "#/definitions/data-flow"
        },
        "responsible-parties": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-party"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "system-ids",
        "system-name",
        "description",
        "system-information",
        "status",
        "authorization-boundary"
      ],
      "additionalProperties": false
    },
    "system-information": {
      "title": "System Information",
      "description": "Contains details about all information types that are stored, processed, or transmitted by the system, such as privacy information, and those defined in NIST SP 800-60.",
      "$id": "#/definitions/system-information",
      "type": "object",
      "properties": {
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "information-types": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Information Type",
            "description": "Contains details about one information type that is stored, processed, or transmitted by the system, such as privacy information, and those defined in NIST SP 800-60.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Information Type Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this information type elsewhere in this or other OSCAL instances. The locally defined UUID of the information type can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "title": {
                "title": "information type title",
                "description": "A human readable name for the information type. This title should be meaningful within the context of the system.",
                "type": "string"
              },
              "description": {
                "title": "Information Type Description",
                "description": "A summary of how this information type is used within the system.",
                "type": "string"
              },
              "categorizations": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "title": "Information Type Categorization",
                  "description": "A set of information type identifiers qualified by the given identification system used, such as NIST SP 800-60.",
                  "type": "object",
                  "properties": {
                    "system": {
                      "title": "Information Type Identification System",
                      "description": "Specifies the information type identification system used.",
                      "anyOf": [
                        {
                          "$ref": "#/definitions/URIDatatype"
                        },
                        {
                          "enum": [
                            "http://doi.org/10.6028/NIST.SP.800-60v2r1"
                          ]
                        }
                      ]
                    },
                    "information-type-ids": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "title": "Information Type Systematized Identifier",
                        "description": "A human-oriented, globally unique identifier qualified by the given identification system used, such as NIST SP 800-60. This identifier has cross-instance scope and can be used to reference this system elsewhere in this or other OSCAL instances. This id should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                        "$ref": "#/definitions/StringDatatype"
                      }
                    }
                  },
                  "required": [
                    "system"
                  ],
                  "additionalProperties": false
                }
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "confidentiality-impact": {
                "$ref": "#/definitions/impact"
              },
              "integrity-impact": {
                "$ref": "#/definitions/impact"
              },
              "availability-impact": {
                "$ref": "#/definitions/impact"
              }
            },
            "required": [
              "title",
              "description"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "information-types"
      ],
      "additionalProperties": false
    },
    "impact": {
      "title": "Impact Level",
      "description": "The expected level of impact resulting from the described information.",
      "$id": "#/definitions/impact",
      "type": "object",
      "properties": {
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "base": {
          "$ref": "#/definitions/base"
        },
        "selected": {
          "$ref": "#/definitions/selected"
        },
        "adjustment-justification": {
          "$ref": "#/definitions/adjustment-justification"
        }
      },
      "required": [
        "base"
      ],
      "additionalProperties": false
    },
    "base": {
      "title": "Base Level (Confidentiality, Integrity, or Availability)",
      "description": "The prescribed base (Confidentiality, Integrity, or Availability) security impact level.",
      "$id": "#/definitions/base",
      "$ref": "#/definitions/StringDatatype"
    },
    "selected": {
      "title": "Selected Level (Confidentiality, Integrity, or Availability)",
      "description": "The selected (Confidentiality, Integrity, or Availability) security impact level.",
      "$id": "#/definitions/selected",
      "$ref": "#/definitions/StringDatatype"
    },
    "adjustment-justification": {
      "title": "Adjustment Justification",
      "description": "If the selected security level is different from the base security level, this contains the justification for the change.",
      "$id": "#/definitions/adjustment-justification",
      "type": "string"
    },
    "security-impact-level": {
      "title": "Security Impact Level",
      "description": "The overall level of expected impact resulting from unauthorized disclosure, modification, or loss of access to information.",
      "$id": "#/definitions/security-impact-level",
      "type": "object",
      "properties": {
        "security-objective-confidentiality": {
          "title": "Security Objective: Confidentiality",
          "description": "A target-level of confidentiality for the system, based on the sensitivity of information within the system.",
          "$ref": "#/definitions/StringDatatype"
        },
        "security-objective-integrity": {
          "title": "Security Objective: Integrity",
          "description": "A target-level of integrity for the system, based on the sensitivity of information within the system.",
          "$ref": "#/definitions/StringDatatype"
        },
        "security-objective-availability": {
          "title": "Security Objective: Availability",
          "description": "A target-level of availability for the system, based on the sensitivity of information within the system.",
          "$ref": "#/definitions/StringDatatype"
        }
      },
      "required": [
        "security-objective-confidentiality",
        "security-objective-integrity",
        "security-objective-availability"
      ],
      "additionalProperties": false
    },
    "status": {
      "title": "Status",
      "description": "Describes the operational status of the system.",
      "$id": "#/definitions/status",
      "type": "object",
      "properties": {
        "state": {
          "title": "State",
          "description": "The current operating status.",
          "allOf": [
            {
              "$ref": "#/definitions/StringDatatype"
            },
            {
              "enum": [
                "operational",
                "under-development",
                "under-major-modification",
                "disposition",
                "other"
              ]
            }
          ]
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "state"
      ],
      "additionalProperties": false
    },
    "date-authorized": {
      "title": "System Authorization Date",
      "description": "The date the system received its authorization.",
      "$id": "#/definitions/date-authorized",
      "$ref": "#/definitions/DateDatatype"
    },
    "authorization-boundary": {
      "title": "Authorization Boundary",
      "description": "A description of this system's authorization boundary, optionally supplemented by diagrams that illustrate the authorization boundary.",
      "$id": "#/definitions/authorization-boundary",
      "type": "object",
      "properties": {
        "description": {
          "title": "Authorization Boundary Description",
          "description": "A summary of the system's authorization boundary.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "diagrams": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/diagram"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "description"
      ],
      "additionalProperties": false
    },
    "diagram": {
      "title": "Diagram",
      "description": "A graphic that provides a visual representation the system, or some aspect of it.",
      "$id": "#/definitions/diagram",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Diagram ID",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this diagram elsewhere in this or other OSCAL instances. The locally defined UUID of the diagram can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "description": {
          "title": "Diagram Description",
          "description": "A summary of the diagram.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "caption": {
          "title": "Caption",
          "description": "A brief caption to annotate the diagram.",
          "type": "string"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid"
      ],
      "additionalProperties": false
    },
    "network-architecture": {
      "title": "Network Architecture",
      "description": "A description of the system's network architecture, optionally supplemented by diagrams that illustrate the network architecture.",
      "$id": "#/definitions/network-architecture",
      "type": "object",
      "properties": {
        "description": {
          "title": "Network Architecture Description",
          "description": "A summary of the system's network architecture.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "diagrams": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/diagram"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "description"
      ],
      "additionalProperties": false
    },
    "data-flow": {
      "title": "Data Flow",
      "description": "A description of the logical flow of information within the system and across its boundaries, optionally supplemented by diagrams that illustrate these flows.",
      "$id": "#/definitions/data-flow",
      "type": "object",
      "properties": {
        "description": {
          "title": "Data Flow Description",
          "description": "A summary of the system's data flow.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "diagrams": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/diagram"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "description"
      ],
      "additionalProperties": false
    },
    "system-implementation": {
      "title": "System Implementation",
      "description": "Provides information as to how the system is implemented.",
      "$id": "#/definitions/system-implementation",
      "type": "object",
      "properties": {
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "leveraged-authorizations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Leveraged Authorization",
            "description": "A description of another authorized system from which this system inherits capabilities that satisfy security requirements. Another term for this concept is a common control provider.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Leveraged Authorization Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope and can be used to reference this leveraged authorization elsewhere in this or other OSCAL instances. The locally defined UUID of the leveraged authorization can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "title": {
                "title": "title field",
                "description": "A human readable name for the leveraged authorization in the context of the system.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "party-uuid": {
                "title": "party-uuid field",
                "description": "A machine-oriented identifier reference to the party that manages the leveraged system.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "date-authorized": {
                "$ref": "#/definitions/date-authorized"
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "uuid",
              "title",
              "party-uuid",
              "date-authorized"
            ],
            "additionalProperties": false
          }
        },
        "users": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/system-user"
          }
        },
        "components": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/system-component"
          }
        },
        "inventory-items": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/inventory-item"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "users",
        "components"
      ],
      "additionalProperties": false
    },
    "by-component": {
      "title": "Component Control Implementation",
      "description": "Defines how the referenced component implements a set of controls.",
      "$id": "#/definitions/by-component",
      "type": "object",
      "properties": {
        "component-uuid": {
          "title": "By Component Universally Unique Identifier Reference",
          "description": "A machine-oriented identifier reference to the component that is implemeting a given control.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "uuid": {
          "title": "By-Component Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this by-component entry elsewhere in this or other OSCAL instances. The locally defined UUID of the by-component entry can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "description": {
          "title": "Control Implementation Description",
          "description": "An implementation statement that describes how a control or a control statement is implemented within the referenced system component.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "set-parameters": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/set-parameter"
          }
        },
        "implementation-status": {
          "$ref": "#/definitions/implementation-status"
        },
        "export": {
          "title": "Export",
          "description": "Identifies content intended for external consumption, such as with leveraged organizations.",
          "type": "object",
          "properties": {
            "description": {
              "title": "Control Implementation Export Description",
              "description": "An implementation statement that describes the aspects of the control or control statement implementation that can be available to another system leveraging this system.",
              "type": "string"
            },
            "props": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/property"
              }
            },
            "links": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/link"
              }
            },
            "provided": {
              "type": "array",
              "minItems": 1,
              "items": {
                "title": "Provided Control Implementation",
                "description": "Describes a capability which may be inherited by a leveraging system.",
                "type": "object",
                "properties": {
                  "uuid": {
                    "title": "Provided Universally Unique Identifier",
                    "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this provided entry elsewhere in this or other OSCAL instances. The locally defined UUID of the provided entry can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                    "$ref": "#/definitions/UUIDDatatype"
                  },
                  "description": {
                    "title": "Provided Control Implementation Description",
                    "description": "An implementation statement that describes the aspects of the control or control statement implementation that can be provided to another system leveraging this system.",
                    "type": "string"
                  },
                  "props": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/property"
                    }
                  },
                  "links": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/link"
                    }
                  },
                  "responsible-roles": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/responsible-role"
                    }
                  },
                  "remarks": {
                    "$ref": "#/definitions/remarks"
                  }
                },
                "required": [
                  "uuid",
                  "description"
                ],
                "additionalProperties": false
              }
            },
            "responsibilities": {
              "type": "array",
              "minItems": 1,
              "items": {
                "title": "Control Implementation Responsibility",
                "description": "Describes a control implementation responsibility imposed on a leveraging system.",
                "type": "object",
                "properties": {
                  "uuid": {
                    "title": "Responsibility Universally Unique Identifier",
                    "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this responsibility elsewhere in this or other OSCAL instances. The locally defined UUID of the responsibility can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                    "$ref": "#/definitions/UUIDDatatype"
                  },
                  "provided-uuid": {
                    "title": "Control Implementation Provided UUID",
                    "description": "A machine-oriented identifier reference to an inherited control implementation that a leveraging system is inheriting from a leveraged system.",
                    "$ref": "#/definitions/UUIDDatatype"
                  },
                  "description": {
                    "title": "Control Implementation Responsibility Description",
                    "description": "An implementation statement that describes the aspects of the control or control statement implementation that a leveraging system must implement to satisfy the control provided by a leveraged system.",
                    "type": "string"
                  },
                  "props": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/property"
                    }
                  },
                  "links": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/link"
                    }
                  },
                  "responsible-roles": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/responsible-role"
                    }
                  },
                  "remarks": {
                    "$ref": "#/definitions/remarks"
                  }
                },
                "required": [
                  "uuid",
                  "description"
                ],
                "additionalProperties": false
              }
            },
            "remarks": {
              "$ref": "#/definitions/remarks"
            }
          },
          "additionalProperties": false
        },
        "inherited": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Inherited Control Implementation",
            "description": "Describes a control implementation inherited by a leveraging system.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Inherited Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this inherited entry elsewhere in this or other OSCAL instances. The locally defined UUID of the inherited control implementation can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "provided-uuid": {
                "title": "Provided UUID",
                "description": "A machine-oriented identifier reference to an inherited control implementation that a leveraging system is inheriting from a leveraged system.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "description": {
                "title": "Inherited Control Implementation Description",
                "description": "An implementation statement that describes the aspects of a control or control statement implementation that a leveraging system is inheriting from a leveraged system.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "responsible-roles": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/responsible-role"
                }
              }
            },
            "required": [
              "uuid",
              "description"
            ],
            "additionalProperties": false
          }
        },
        "satisfied": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Satisfied Control Implementation Responsibility",
            "description": "Describes how this system satisfies a responsibility imposed by a leveraged system.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Satisfied Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this satisfied control implementation entry elsewhere in this or other OSCAL instances. The locally defined UUID of the control implementation can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "responsibility-uuid": {
                "title": "Responsibility UUID",
                "description": "A machine-oriented identifier reference to a control implementation that satisfies a responsibility imposed by a leveraged system.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "description": {
                "title": "Satisfied Control Implementation Responsibility Description",
                "description": "An implementation statement that describes the aspects of a control or control statement implementation that a leveraging system is implementing based on a requirement from a leveraged system.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "responsible-roles": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/responsible-role"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "uuid",
              "description"
            ],
            "additionalProperties": false
          }
        },
        "responsible-roles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-role"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "component-uuid",
        "uuid",
        "description"
      ],
      "additionalProperties": false
    },
    "assessment-plan": {
      "title": "Security Assessment Plan (SAP)",
      "description": "An assessment plan, such as those provided by a FedRAMP assessor.",
      "$id": "#/definitions/assessment-plan",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Assessment Plan Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment plan in this or other OSCAL instances. The locally defined UUID of the assessment plan can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "metadata": {
          "$ref": "#/definitions/metadata"
        },
        "import-ssp": {
          "$ref": "#/definitions/import-ssp"
        },
        "local-definitions": {
          "title": "Assessment Plan Local Definitions",
          "description": "Used to define data objects that are used in the assessment plan, that do not appear in the referenced SSP.",
          "type": "object",
          "properties": {
            "components": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/system-component"
              }
            },
            "inventory-items": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/inventory-item"
              }
            },
            "users": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/system-user"
              }
            },
            "objectives-and-methods": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/local-objective"
              }
            },
            "activities": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/activity"
              }
            },
            "remarks": {
              "$ref": "#/definitions/remarks"
            }
          },
          "additionalProperties": false
        },
        "terms-and-conditions": {
          "title": "Assessment Plan Terms and Conditions",
          "description": "Used to define various terms and conditions under which an assessment, described by the plan, can be performed. Each child part defines a different type of term or condition.",
          "type": "object",
          "properties": {
            "parts": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/assessment-part"
              }
            }
          },
          "additionalProperties": false
        },
        "reviewed-controls": {
          "$ref": "#/definitions/reviewed-controls"
        },
        "assessment-subjects": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/assessment-subject"
          }
        },
        "assessment-assets": {
          "$ref": "#/definitions/assessment-assets"
        },
        "tasks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/task"
          }
        },
        "back-matter": {
          "$ref": "#/definitions/back-matter"
        }
      },
      "required": [
        "uuid",
        "metadata",
        "import-ssp",
        "reviewed-controls"
      ],
      "additionalProperties": false
    },
    "import-ssp": {
      "title": "Import System Security Plan",
      "description": "Used by the assessment plan and POA&M to import information about the system.",
      "$id": "#/definitions/import-ssp",
      "type": "object",
      "properties": {
        "href": {
          "title": "System Security Plan Reference",
          "description": "A resolvable URL reference to the system security plan for the system being assessed.",
          "$ref": "#/definitions/URIReferenceDatatype"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "href"
      ],
      "additionalProperties": false
    },
    "local-objective": {
      "title": "Assessment-Specific Control Objective",
      "description": "A local definition of a control objective for this assessment. Uses catalog syntax for control objective and assessment actions.",
      "$id": "#/definitions/local-objective",
      "type": "object",
      "properties": {
        "control-id": {
          "title": "Assessment-Specific Control Identifier Reference",
          "description": "A reference to a control with a corresponding id value. When referencing an externally defined control, the Control Identifier Reference must be used in the context of the external / imported OSCAL instance (e.g., uri-reference).",
          "$ref": "#/definitions/TokenDatatype"
        },
        "description": {
          "title": "Objective Description",
          "description": "A human-readable description of this control objective.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "parts": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/part"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "control-id",
        "parts"
      ],
      "additionalProperties": false
    },
    "assessment-method": {
      "title": "Assessment Method",
      "description": "A local definition of a control objective. Uses catalog syntax for control objective and assessment activities.",
      "$id": "#/definitions/assessment-method",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Assessment Method Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment method elsewhere in this or other OSCAL instances. The locally defined UUID of the assessment method can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "description": {
          "title": "Assessment Method Description",
          "description": "A human-readable description of this assessment method.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "part": {
          "$ref": "#/definitions/assessment-part"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "part"
      ],
      "additionalProperties": false
    },
    "activity": {
      "title": "Activity",
      "description": "Identifies an assessment or related process that can be performed. In the assessment plan, this is an intended activity which may be associated with an assessment task. In the assessment results, this an activity that was actually performed as part of an assessment.",
      "$id": "#/definitions/activity",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Assessment Activity Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment activity elsewhere in this or other OSCAL instances. The locally defined UUID of the activity can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "title": {
          "title": "Included Activity Title",
          "description": "The title for this included activity.",
          "type": "string"
        },
        "description": {
          "title": "Included Activity Description",
          "description": "A human-readable description of this included activity.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "steps": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Step",
            "description": "Identifies an individual step in a series of steps related to an activity, such as an assessment test or examination procedure.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Step Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this step elsewhere in this or other OSCAL instances. The locally defined UUID of the step (in a series of steps) can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "title": {
                "title": "Step Title",
                "description": "The title for this step.",
                "type": "string"
              },
              "description": {
                "title": "Step Description",
                "description": "A human-readable description of this step.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "reviewed-controls": {
                "$ref": "#/definitions/reviewed-controls"
              },
              "responsible-roles": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/responsible-role"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "uuid",
              "description"
            ],
            "additionalProperties": false
          }
        },
        "related-controls": {
          "$ref": "#/definitions/reviewed-controls"
        },
        "responsible-roles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-role"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "description"
      ],
      "additionalProperties": false
    },
    "task": {
      "title": "Task",
      "description": "Represents a scheduled event or milestone, which may be associated with a series of assessment actions.",
      "$id": "#/definitions/task",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Task Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this task elsewhere in this or other OSCAL instances. The locally defined UUID of the task can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "type": {
          "title": "Task Type",
          "description": "The type of task.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "milestone",
                "action"
              ]
            }
          ]
        },
        "title": {
          "title": "Task Title",
          "description": "The title for this task.",
          "type": "string"
        },
        "description": {
          "title": "Task Description",
          "description": "A human-readable description of this task.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "timing": {
          "title": "Event Timing",
          "description": "The timing under which the task is intended to occur.",
          "type": "object",
          "properties": {
            "on-date": {
              "title": "Task On Date Condition",
              "description": "The task is intended to occur on the specified date.",
              "type": "object",
              "properties": {
                "date": {
                  "title": "Task DateTime",
                  "description": "The task must occur on the specified date.",
                  "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
                }
              },
              "required": [
                "date"
              ],
              "additionalProperties": false
            },
            "within-date-range": {
              "title": "Task On Date Range Condition",
              "description": "The task is intended to occur within the specified date range.",
              "type": "object",
              "properties": {
                "start": {
                  "title": "Task Start Date Condition",
                  "description": "The task must occur on or after the specified date.",
                  "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
                },
                "end": {
                  "title": "Task End Date Condition",
                  "description": "The task must occur on or before the specified date.",
                  "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
                }
              },
              "required": [
                "start",
                "end"
              ],
              "additionalProperties": false
            },
            "at-frequency": {
              "title": "Task Frequency Condition",
              "description": "The task is intended to occur at the specified frequency.",
              "type": "object",
              "properties": {
                "period": {
                  "title": "Task Period",
                  "description": "The task must occur after the specified period has elapsed.",
                  "$ref": "#/definitions/PositiveIntegerDatatype"
                },
                "unit": {
                  "title": "Task Time Unit",
                  "description": "The unit of time for the period.",
                  "allOf": [
                    {
                      "$ref": "#/definitions/StringDatatype"
                    },
                    {
                      "enum": [
                        "seconds",
                        "minutes",
                        "hours",
                        "days",
                        "months",
                        "years"
                      ]
                    }
                  ]
                }
              },
              "required": [
                "period",
                "unit"
              ],
              "additionalProperties": false
            }
          },
          "additionalProperties": false
        },
        "dependencies": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Task Dependency",
            "description": "Used to indicate that a task is dependent on another task.",
            "type": "object",
            "properties": {
              "task-uuid": {
                "title": "Dependent Task Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to a unique task.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "task-uuid"
            ],
            "additionalProperties": false
          }
        },
        "tasks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/task"
          }
        },
        "associated-activities": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Associated Activity",
            "description": "Identifies an individual activity to be performed as part of a task.",
            "type": "object",
            "properties": {
              "activity-uuid": {
                "title": "Activity Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to an activity defined in the list of activities.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "responsible-roles": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/responsible-role"
                }
              },
              "subjects": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/assessment-subject"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "activity-uuid",
              "subjects"
            ],
            "additionalProperties": false
          }
        },
        "subjects": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/assessment-subject"
          }
        },
        "responsible-roles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-role"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "type",
        "title"
      ],
      "additionalProperties": false
    },
    "reviewed-controls": {
      "title": "Reviewed Controls and Control Objectives",
      "description": "Identifies the controls being assessed and their control objectives.",
      "$id": "#/definitions/reviewed-controls",
      "type": "object",
      "properties": {
        "description": {
          "title": "Control Objective Description",
          "description": "A human-readable description of control objectives.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "control-selections": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Assessed Controls",
            "description": "Identifies the controls being assessed. In the assessment plan, these are the planned controls. In the assessment results, these are the actual controls, and reflects any changes from the plan.",
            "type": "object",
            "properties": {
              "description": {
                "title": "Assessed Controls Description",
                "description": "A human-readable description of in-scope controls specified for assessment.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "include-all": {
                "$ref": "#/definitions/include-all"
              },
              "include-controls": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/select-control-by-id"
                }
              },
              "exclude-controls": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/select-control-by-id"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "additionalProperties": false
          }
        },
        "control-objective-selections": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Referenced Control Objectives",
            "description": "Identifies the control objectives of the assessment. In the assessment plan, these are the planned objectives. In the assessment results, these are the assessed objectives, and reflects any changes from the plan.",
            "type": "object",
            "properties": {
              "description": {
                "title": "Control Objectives Description",
                "description": "A human-readable description of this collection of control objectives.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "include-all": {
                "$ref": "#/definitions/include-all"
              },
              "include-objectives": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/select-objective-by-id"
                }
              },
              "exclude-objectives": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/select-objective-by-id"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "additionalProperties": false
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "control-selections"
      ],
      "additionalProperties": false
    },
    "select-objective-by-id": {
      "title": "Select Objective",
      "description": "Used to select a control objective for inclusion/exclusion based on the control objective's identifier.",
      "$id": "#/definitions/select-objective-by-id",
      "type": "object",
      "properties": {
        "objective-id": {
          "title": "Objective ID",
          "description": "Points to an assessment objective.",
          "$ref": "#/definitions/TokenDatatype"
        }
      },
      "required": [
        "objective-id"
      ],
      "additionalProperties": false
    },
    "assessment-subject-placeholder": {
      "title": "Assessment Subject Placeholder",
      "description": "Used when the assessment subjects will be determined as part of one or more other assessment activities. These assessment subjects will be recorded in the assessment results in the assessment log.",
      "$id": "#/definitions/assessment-subject-placeholder",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Assessment Subject Placeholder Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier for a set of assessment subjects that will be identified by a task or an activity that is part of a task. The locally defined UUID of the assessment subject placeholder can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "description": {
          "title": "Assessment Subject Placeholder Description",
          "description": "A human-readable description of intent of this assessment subject placeholder.",
          "type": "string"
        },
        "sources": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Assessment Subject Source",
            "description": "Assessment subjects will be identified while conducting the referenced activity-instance.",
            "type": "object",
            "properties": {
              "task-uuid": {
                "title": "Task Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference (in this or other OSCAL instances) an assessment activity to be performed as part of the event. The locally defined UUID of the task can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              }
            },
            "required": [
              "task-uuid"
            ],
            "additionalProperties": false
          }
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "sources"
      ],
      "additionalProperties": false
    },
    "assessment-subject": {
      "title": "Subject of Assessment",
      "description": "Identifies system elements being assessed, such as components, inventory items, and locations. In the assessment plan, this identifies a planned assessment subject. In the assessment results this is an actual assessment subject, and reflects any changes from the plan. exactly what will be the focus of this assessment. Any subjects not identified in this way are out-of-scope.",
      "$id": "#/definitions/assessment-subject",
      "type": "object",
      "properties": {
        "type": {
          "title": "Subject Type",
          "description": "Indicates the type of assessment subject, such as a component, inventory, item, location, or party represented by this selection statement.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "component",
                "inventory-item",
                "location",
                "party",
                "user"
              ]
            }
          ]
        },
        "description": {
          "title": "Include Subjects Description",
          "description": "A human-readable description of the collection of subjects being included in this assessment.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "include-all": {
          "$ref": "#/definitions/include-all"
        },
        "include-subjects": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/select-subject-by-id"
          }
        },
        "exclude-subjects": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/select-subject-by-id"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": false
    },
    "select-subject-by-id": {
      "title": "Select Assessment Subject",
      "description": "Identifies a set of assessment subjects to include/exclude by UUID.",
      "$id": "#/definitions/select-subject-by-id",
      "type": "object",
      "properties": {
        "subject-uuid": {
          "title": "Subject Universally Unique Identifier Reference By Id",
          "description": "A machine-oriented identifier reference to a component, inventory-item, location, party, user, or resource using it's UUID.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "type": {
          "title": "Subject Universally Unique Identifier Reference Type By Id",
          "description": "Used to indicate the type of object pointed to by the uuid-ref within a subject.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "component",
                "inventory-item",
                "location",
                "party",
                "user",
                "resource"
              ]
            }
          ]
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "subject-uuid",
        "type"
      ],
      "additionalProperties": false
    },
    "subject-reference": {
      "title": "Identifies the Subject",
      "description": "A human-oriented identifier reference to a resource. Use type to indicate whether the identified resource is a component, inventory item, location, user, or something else.",
      "$id": "#/definitions/subject-reference",
      "type": "object",
      "properties": {
        "subject-uuid": {
          "title": "Subject Universally Unique Identifier Reference",
          "description": "A machine-oriented identifier reference to a component, inventory-item, location, party, user, or resource using it's UUID.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "type": {
          "title": "Subject Universally Unique Identifier Reference Type",
          "description": "Used to indicate the type of object pointed to by the uuid-ref within a subject.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "component",
                "inventory-item",
                "location",
                "party",
                "user",
                "resource"
              ]
            }
          ]
        },
        "title": {
          "title": "Subject Reference Title",
          "description": "The title or name for the referenced subject.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "subject-uuid",
        "type"
      ],
      "additionalProperties": false
    },
    "assessment-assets": {
      "title": "Assessment Assets",
      "description": "Identifies the assets used to perform this assessment, such as the assessment team, scanning tools, and assumptions.",
      "$id": "#/definitions/assessment-assets",
      "type": "object",
      "properties": {
        "components": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/system-component"
          }
        },
        "assessment-platforms": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Assessment Platform",
            "description": "Used to represent the toolset used to perform aspects of the assessment.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Assessment Platform Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment platform elsewhere in this or other OSCAL instances. The locally defined UUID of the assessment platform can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "title": {
                "title": "Assessment Platform Title",
                "description": "The title or name for the assessment platform.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "uses-components": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "title": "Uses Component",
                  "description": "The set of components that are used by the assessment platform.",
                  "type": "object",
                  "properties": {
                    "component-uuid": {
                      "title": "Component Universally Unique Identifier Reference",
                      "description": "A machine-oriented identifier reference to a component that is implemented as part of an inventory item.",
                      "$ref": "#/definitions/UUIDDatatype"
                    },
                    "props": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/property"
                      }
                    },
                    "links": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/link"
                      }
                    },
                    "responsible-parties": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/responsible-party"
                      }
                    },
                    "remarks": {
                      "$ref": "#/definitions/remarks"
                    }
                  },
                  "required": [
                    "component-uuid"
                  ],
                  "additionalProperties": false
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "uuid"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "assessment-platforms"
      ],
      "additionalProperties": false
    },
    "finding-target": {
      "title": "Finding Target Objective Status",
      "description": "Captures an assessor's conclusions regarding the degree to which an objective is satisfied.",
      "$id": "#/definitions/finding-target",
      "type": "object",
      "properties": {
        "type": {
          "title": "Finding Target Type",
          "description": "Identifies the type of the target.",
          "allOf": [
            {
              "$ref": "#/definitions/StringDatatype"
            },
            {
              "enum": [
                "statement-id",
                "objective-id"
              ]
            }
          ]
        },
        "target-id": {
          "title": "Finding Target Identifier Reference",
          "description": "A machine-oriented identifier reference for a specific target qualified by the type.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "title": {
          "title": "Objective Status Title",
          "description": "The title for this objective status.",
          "type": "string"
        },
        "description": {
          "title": "Objective Status Description",
          "description": "A human-readable description of the assessor's conclusions regarding the degree to which an objective is satisfied.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "status": {
          "title": "Objective Status",
          "description": "A determination of if the objective is satisfied or not within a given system.",
          "type": "object",
          "properties": {
            "state": {
              "title": "Objective Status State",
              "description": "An indication as to whether the objective is satisfied or not.",
              "allOf": [
                {
                  "$ref": "#/definitions/TokenDatatype"
                },
                {
                  "enum": [
                    "satisfied",
                    "not-satisfied"
                  ]
                }
              ]
            },
            "reason": {
              "title": "Objective Status Reason",
              "description": "The reason the objective was given it's status.",
              "anyOf": [
                {
                  "$ref": "#/definitions/TokenDatatype"
                },
                {
                  "enum": [
                    "pass",
                    "fail",
                    "other"
                  ]
                }
              ]
            },
            "remarks": {
              "$ref": "#/definitions/remarks"
            }
          },
          "required": [
            "state"
          ],
          "additionalProperties": false
        },
        "implementation-status": {
          "$ref": "#/definitions/implementation-status"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "type",
        "target-id",
        "status"
      ],
      "additionalProperties": false
    },
    "finding": {
      "title": "Finding",
      "description": "Describes an individual finding.",
      "$id": "#/definitions/finding",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Finding Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this finding in this or other OSCAL instances. The locally defined UUID of the finding can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "title": {
          "title": "Finding Title",
          "description": "The title for this finding.",
          "type": "string"
        },
        "description": {
          "title": "Finding Description",
          "description": "A human-readable description of this finding.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "origins": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/origin"
          }
        },
        "target": {
          "$ref": "#/definitions/finding-target"
        },
        "implementation-statement-uuid": {
          "title": "Implementation Statement UUID",
          "description": "A machine-oriented identifier reference to the implementation statement in the SSP to which this finding is related.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "related-observations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Finding Related Observation",
            "description": "Relates the finding to a set of referenced observations that were used to determine the finding.",
            "type": "object",
            "properties": {
              "observation-uuid": {
                "title": "Finding Related Observation Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to an observation defined in the list of observations.",
                "$ref": "#/definitions/UUIDDatatype"
              }
            },
            "required": [
              "observation-uuid"
            ],
            "additionalProperties": false
          }
        },
        "related-risks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Finding Associated Risk",
            "description": "Relates the finding to a set of referenced risks that were used to determine the finding.",
            "type": "object",
            "properties": {
              "risk-uuid": {
                "title": "Finding Risk Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to a risk defined in the list of risks.",
                "$ref": "#/definitions/UUIDDatatype"
              }
            },
            "required": [
              "risk-uuid"
            ],
            "additionalProperties": false
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "title",
        "description",
        "target"
      ],
      "additionalProperties": false
    },
    "observation": {
      "title": "Observation",
      "description": "Describes an individual observation.",
      "$id": "#/definitions/observation",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Observation Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this observation elsewhere in this or other OSCAL instances. The locally defined UUID of the observation can be used to reference the data item locally or globally (e.g., in an imorted OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "title": {
          "title": "Observation Title",
          "description": "The title for this observation.",
          "type": "string"
        },
        "description": {
          "title": "Observation Description",
          "description": "A human-readable description of this assessment observation.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "methods": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Observation Method",
            "description": "Identifies how the observation was made.",
            "anyOf": [
              {
                "$ref": "#/definitions/StringDatatype"
              },
              {
                "enum": [
                  "EXAMINE",
                  "INTERVIEW",
                  "TEST",
                  "UNKNOWN"
                ]
              }
            ]
          }
        },
        "types": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Observation Type",
            "description": "Identifies the nature of the observation. More than one may be used to further qualify and enable filtering.",
            "anyOf": [
              {
                "$ref": "#/definitions/TokenDatatype"
              },
              {
                "enum": [
                  "ssp-statement-issue",
                  "control-objective",
                  "mitigation",
                  "finding",
                  "historic"
                ]
              }
            ]
          }
        },
        "origins": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/origin"
          }
        },
        "subjects": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/subject-reference"
          }
        },
        "relevant-evidence": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Relevant Evidence",
            "description": "Links this observation to relevant evidence.",
            "type": "object",
            "properties": {
              "href": {
                "title": "Relevant Evidence Reference",
                "description": "A resolvable URL reference to relevant evidence.",
                "$ref": "#/definitions/URIReferenceDatatype"
              },
              "description": {
                "title": "Relevant Evidence Description",
                "description": "A human-readable description of this evidence.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "description"
            ],
            "additionalProperties": false
          }
        },
        "collected": {
          "title": "Collected Field",
          "description": "Date/time stamp identifying when the finding information was collected.",
          "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
        },
        "expires": {
          "title": "Expires Field",
          "description": "Date/time identifying when the finding information is out-of-date and no longer valid. Typically used with continuous assessment scenarios.",
          "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "description",
        "methods",
        "collected"
      ],
      "additionalProperties": false
    },
    "origin": {
      "title": "Origin",
      "description": "Identifies the source of the finding, such as a tool, interviewed person, or activity.",
      "$id": "#/definitions/origin",
      "type": "object",
      "properties": {
        "actors": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/origin-actor"
          }
        },
        "related-tasks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/related-task"
          }
        }
      },
      "required": [
        "actors"
      ],
      "additionalProperties": false
    },
    "origin-actor": {
      "title": "Originating Actor",
      "description": "The actor that produces an observation, a finding, or a risk. One or more actor type can be used to specify a person that is using a tool.",
      "$id": "#/definitions/origin-actor",
      "type": "object",
      "properties": {
        "type": {
          "title": "Actor Type",
          "description": "The kind of actor.",
          "allOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "tool",
                "assessment-platform",
                "party"
              ]
            }
          ]
        },
        "actor-uuid": {
          "title": "Origin Actor Universally Unique Identifier Reference",
          "description": "A machine-oriented identifier reference to the tool or person based on the associated type.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "role-id": {
          "title": "Origin Actor Role",
          "description": "For a party, this can optionally be used to specify the role the actor was performing.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        }
      },
      "required": [
        "type",
        "actor-uuid"
      ],
      "additionalProperties": false
    },
    "related-task": {
      "title": "Task Reference",
      "description": "Identifies an individual task for which the containing object is a consequence of.",
      "$id": "#/definitions/related-task",
      "type": "object",
      "properties": {
        "task-uuid": {
          "title": "Task Universally Unique Identifier Reference",
          "description": "A machine-oriented identifier reference to a unique task.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "responsible-parties": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/responsible-party"
          }
        },
        "subjects": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/assessment-subject"
          }
        },
        "identified-subject": {
          "title": "Identified Subject",
          "description": "Used to detail assessment subjects that were identfied by this task.",
          "type": "object",
          "properties": {
            "subject-placeholder-uuid": {
              "title": "Assessment Subject Placeholder Universally Unique Identifier Reference",
              "description": "A machine-oriented identifier reference to a unique assessment subject placeholder defined by this task.",
              "$ref": "#/definitions/UUIDDatatype"
            },
            "subjects": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/assessment-subject"
              }
            }
          },
          "required": [
            "subject-placeholder-uuid",
            "subjects"
          ],
          "additionalProperties": false
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "task-uuid"
      ],
      "additionalProperties": false
    },
    "threat-id": {
      "title": "Threat ID",
      "description": "A pointer, by ID, to an externally-defined threat.",
      "$id": "#/definitions/threat-id",
      "type": "object",
      "properties": {
        "system": {
          "title": "Threat Type Identification System",
          "description": "Specifies the source of the threat information.",
          "anyOf": [
            {
              "$ref": "#/definitions/URIDatatype"
            },
            {
              "enum": [
                "http://fedramp.gov",
                "http://fedramp.gov/ns/oscal"
              ]
            }
          ]
        },
        "href": {
          "title": "Threat Information Resource Reference",
          "description": "An optional location for the threat data, from which this ID originates.",
          "$ref": "#/definitions/URIReferenceDatatype"
        },
        "id": {
          "$ref": "#/definitions/URIDatatype"
        }
      },
      "required": [
        "id",
        "system"
      ],
      "additionalProperties": false
    },
    "risk": {
      "title": "Identified Risk",
      "description": "An identified risk.",
      "$id": "#/definitions/risk",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Risk Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this risk elsewhere in this or other OSCAL instances. The locally defined UUID of the risk can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "title": {
          "title": "Risk Title",
          "description": "The title for this risk.",
          "type": "string"
        },
        "description": {
          "title": "Risk Description",
          "description": "A human-readable summary of the identified risk, to include a statement of how the risk impacts the system.",
          "type": "string"
        },
        "statement": {
          "title": "Risk Statement",
          "description": "An summary of impact for how the risk affects the system.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "status": {
          "$ref": "#/definitions/risk-status"
        },
        "origins": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/origin"
          }
        },
        "threat-ids": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/threat-id"
          }
        },
        "characterizations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/characterization"
          }
        },
        "mitigating-factors": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Mitigating Factor",
            "description": "Describes an existing mitigating factor that may affect the overall determination of the risk, with an optional link to an implementation statement in the SSP.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Mitigating Factor Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this mitigating factor elsewhere in this or other OSCAL instances. The locally defined UUID of the mitigating factor can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "implementation-uuid": {
                "title": "Implementation UUID",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this implementation statement elsewhere in this or other OSCAL instancess. The locally defined UUID of the implementation statement can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "description": {
                "title": "Mitigating Factor Description",
                "description": "A human-readable description of this mitigating factor.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "subjects": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/subject-reference"
                }
              }
            },
            "required": [
              "uuid",
              "description"
            ],
            "additionalProperties": false
          }
        },
        "deadline": {
          "title": "Risk Resolution Deadline",
          "description": "The date/time by which the risk must be resolved.",
          "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
        },
        "remediations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/response"
          }
        },
        "risk-log": {
          "title": "Risk Log",
          "description": "A log of all risk-related tasks taken.",
          "type": "object",
          "properties": {
            "entries": {
              "type": "array",
              "minItems": 1,
              "items": {
                "title": "Risk Log Entry",
                "description": "Identifies an individual risk response that occurred as part of managing an identified risk.",
                "type": "object",
                "properties": {
                  "uuid": {
                    "title": "Risk Log Entry Universally Unique Identifier",
                    "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this risk log entry elsewhere in this or other OSCAL instances. The locally defined UUID of the risk log entry can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                    "$ref": "#/definitions/UUIDDatatype"
                  },
                  "title": {
                    "title": "Rist Title",
                    "description": "The title for this risk log entry.",
                    "type": "string"
                  },
                  "description": {
                    "title": "Risk Task Description",
                    "description": "A human-readable description of what was done regarding the risk.",
                    "type": "string"
                  },
                  "start": {
                    "title": "Rist Event Start",
                    "description": "Identifies the start date and time of the event.",
                    "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
                  },
                  "end": {
                    "title": "Risk Event End",
                    "description": "Identifies the end date and time of the event. If the event is a point in time, the start and end will be the same date and time.",
                    "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
                  },
                  "props": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/property"
                    }
                  },
                  "links": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/link"
                    }
                  },
                  "logged-by": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/logged-by"
                    }
                  },
                  "status-change": {
                    "$ref": "#/definitions/risk-status"
                  },
                  "related-responses": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "title": "Risk Response Reference",
                      "description": "Identifies an individual risk response that this log entry is for.",
                      "type": "object",
                      "properties": {
                        "response-uuid": {
                          "title": "Response Universally Unique Identifier Reference",
                          "description": "A machine-oriented identifier reference to a unique risk response.",
                          "$ref": "#/definitions/UUIDDatatype"
                        },
                        "props": {
                          "type": "array",
                          "minItems": 1,
                          "items": {
                            "$ref": "#/definitions/property"
                          }
                        },
                        "links": {
                          "type": "array",
                          "minItems": 1,
                          "items": {
                            "$ref": "#/definitions/link"
                          }
                        },
                        "related-tasks": {
                          "type": "array",
                          "minItems": 1,
                          "items": {
                            "$ref": "#/definitions/related-task"
                          }
                        },
                        "remarks": {
                          "$ref": "#/definitions/remarks"
                        }
                      },
                      "required": [
                        "response-uuid"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "remarks": {
                    "$ref": "#/definitions/remarks"
                  }
                },
                "required": [
                  "uuid",
                  "start"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "entries"
          ],
          "additionalProperties": false
        },
        "related-observations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Related Observation",
            "description": "Relates the finding to a set of referenced observations that were used to determine the finding.",
            "type": "object",
            "properties": {
              "observation-uuid": {
                "title": "Observation Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to an observation defined in the list of observations.",
                "$ref": "#/definitions/UUIDDatatype"
              }
            },
            "required": [
              "observation-uuid"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "uuid",
        "title",
        "description",
        "statement",
        "status"
      ],
      "additionalProperties": false
    },
    "logged-by": {
      "title": "Logged By",
      "description": "Used to indicate who created a log entry in what role.",
      "$id": "#/definitions/logged-by",
      "type": "object",
      "properties": {
        "party-uuid": {
          "title": "Party UUID Reference",
          "description": "A machine-oriented identifier reference to the party who is making the log entry.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "role-id": {
          "title": "Actor Role",
          "description": "A point to the role-id of the role in which the party is making the log entry.",
          "$ref": "#/definitions/TokenDatatype"
        }
      },
      "required": [
        "party-uuid"
      ],
      "additionalProperties": false
    },
    "risk-status": {
      "title": "Risk Status",
      "description": "Describes the status of the associated risk.",
      "$id": "#/definitions/risk-status",
      "anyOf": [
        {
          "$ref": "#/definitions/TokenDatatype"
        },
        {
          "enum": [
            "open",
            "investigating",
            "remediating",
            "deviation-requested",
            "deviation-approved",
            "closed"
          ]
        }
      ]
    },
    "characterization": {
      "title": "Characterization",
      "description": "A collection of descriptive data about the containing object from a specific origin.",
      "$id": "#/definitions/characterization",
      "type": "object",
      "properties": {
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "origin": {
          "$ref": "#/definitions/origin"
        },
        "facets": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Facet",
            "description": "An individual characteristic that is part of a larger set produced by the same actor.",
            "type": "object",
            "properties": {
              "name": {
                "title": "Facet Name",
                "description": "The name of the risk metric within the specified system.",
                "$ref": "#/definitions/TokenDatatype"
              },
              "system": {
                "title": "Naming System",
                "description": "Specifies the naming system under which this risk metric is organized, which allows for the same names to be used in different systems controlled by different parties. This avoids the potential of a name clash.",
                "anyOf": [
                  {
                    "$ref": "#/definitions/URIDatatype"
                  },
                  {
                    "enum": [
                      "http://fedramp.gov",
                      "http://fedramp.gov/ns/oscal",
                      "http://csrc.nist.gov/ns/oscal",
                      "http://csrc.nist.gov/ns/oscal/unknown",
                      "http://cve.mitre.org",
                      "http://www.first.org/cvss/v2.0",
                      "http://www.first.org/cvss/v3.0",
                      "http://www.first.org/cvss/v3.1"
                    ]
                  }
                ]
              },
              "value": {
                "title": "Facet Value",
                "description": "Indicates the value of the facet.",
                "$ref": "#/definitions/StringDatatype"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "name",
              "system",
              "value"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "origin",
        "facets"
      ],
      "additionalProperties": false
    },
    "response": {
      "title": "Risk Response",
      "description": "Describes either recommended or an actual plan for addressing the risk.",
      "$id": "#/definitions/response",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Remediation Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this remediation elsewhere in this or other OSCAL instances. The locally defined UUID of the risk response can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "lifecycle": {
          "title": "Remediation Intent",
          "description": "Identifies whether this is a recommendation, such as from an assessor or tool, or an actual plan accepted by the system owner.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "recommendation",
                "planned",
                "completed"
              ]
            }
          ]
        },
        "title": {
          "title": "Response Title",
          "description": "The title for this response activity.",
          "type": "string"
        },
        "description": {
          "title": "Response Description",
          "description": "A human-readable description of this response plan.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "origins": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/origin"
          }
        },
        "required-assets": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Required Asset",
            "description": "Identifies an asset required to achieve remediation.",
            "type": "object",
            "properties": {
              "uuid": {
                "title": "Required Universally Unique Identifier",
                "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this required asset elsewhere in this or other OSCAL instances. The locally defined UUID of the asset can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                "$ref": "#/definitions/UUIDDatatype"
              },
              "subjects": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/subject-reference"
                }
              },
              "title": {
                "title": "Title for Required Asset",
                "description": "The title for this required asset.",
                "type": "string"
              },
              "description": {
                "title": "Description of Required Asset",
                "description": "A human-readable description of this required asset.",
                "type": "string"
              },
              "props": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/property"
                }
              },
              "links": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/link"
                }
              },
              "remarks": {
                "$ref": "#/definitions/remarks"
              }
            },
            "required": [
              "uuid",
              "description"
            ],
            "additionalProperties": false
          }
        },
        "tasks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/task"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "lifecycle",
        "title",
        "description"
      ],
      "additionalProperties": false
    },
    "assessment-part": {
      "title": "Assessment Part",
      "description": "A partition of an assessment plan or results or a child of another part.",
      "$id": "#/definitions/assessment-part",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Assessment Part Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this part elsewhere in this or other OSCAL instances. The locally defined UUID of the part can be used to reference the data item locally or globally (e.g., in an ported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "name": {
          "title": "Assessment Part Name",
          "description": "A textual label that uniquely identifies the part's semantic type.",
          "anyOf": [
            {
              "$ref": "#/definitions/TokenDatatype"
            },
            {
              "enum": [
                "asset",
                "method",
                "objective"
              ]
            }
          ]
        },
        "ns": {
          "title": "Assessment Part Namespace",
          "description": "A namespace qualifying the part's name. This allows different organizations to associate distinct semantics with the same name.",
          "$ref": "#/definitions/URIDatatype"
        },
        "class": {
          "title": "Assessment Part Class",
          "description": "A textual label that provides a sub-type or characterization of the part's name. This can be used to further distinguish or discriminate between the semantics of multiple parts of the same control with the same name and ns.",
          "$ref": "#/definitions/TokenDatatype"
        },
        "title": {
          "title": "Assessment Part Title",
          "description": "A name given to the part, which may be used by a tool for display and navigation.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "prose": {
          "title": "Assessment Part Text",
          "description": "Permits multiple paragraphs, lists, tables etc.",
          "type": "string"
        },
        "parts": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/assessment-part"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    },
    "assessment-results": {
      "title": "Security Assessment Results (SAR)",
      "description": "Security assessment results, such as those provided by a FedRAMP assessor in the FedRAMP Security Assessment Report.",
      "$id": "#/definitions/assessment-results",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Assessment Results Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this assessment results instance in this or other OSCAL instances. The locally defined UUID of the assessment result can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "metadata": {
          "$ref": "#/definitions/metadata"
        },
        "import-ap": {
          "$ref": "#/definitions/import-ap"
        },
        "local-definitions": {
          "title": "Assessment Results Local Definitions",
          "description": "Used to define data objects that are used in the assessment plan, that do not appear in the referenced SSP.",
          "type": "object",
          "properties": {
            "objectives-and-methods": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/local-objective"
              }
            },
            "activities": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/activity"
              }
            },
            "remarks": {
              "$ref": "#/definitions/remarks"
            }
          },
          "additionalProperties": false
        },
        "results": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/result"
          }
        },
        "back-matter": {
          "$ref": "#/definitions/back-matter"
        }
      },
      "required": [
        "uuid",
        "metadata",
        "import-ap",
        "results"
      ],
      "additionalProperties": false
    },
    "result": {
      "title": "Assessment Result",
      "description": "Used by the assessment results and POA&M. In the assessment results, this identifies all of the assessment observations and findings, initial and residual risks, deviations, and disposition. In the POA&M, this identifies initial and residual risks, deviations, and disposition.",
      "$id": "#/definitions/result",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "Results Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference this set of results in this or other OSCAL instances. The locally defined UUID of the assessment result can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "title": {
          "title": "Results Title",
          "description": "The title for this set of results.",
          "type": "string"
        },
        "description": {
          "title": "Results Description",
          "description": "A human-readable description of this set of test results.",
          "type": "string"
        },
        "start": {
          "title": "Result start field",
          "description": "Date/time stamp identifying the start of the evidence collection reflected in these results.",
          "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
        },
        "end": {
          "title": "Result end field",
          "description": "Date/time stamp identifying the end of the evidence collection reflected in these results. In a continuous motoring scenario, this may contain the same value as start if appropriate.",
          "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "local-definitions": {
          "title": "Assessment Result Local Definitions",
          "description": "Used to define data objects that are used in the assessment plan, that do not appear in the referenced SSP.",
          "type": "object",
          "properties": {
            "components": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/system-component"
              }
            },
            "inventory-items": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/inventory-item"
              }
            },
            "users": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/system-user"
              }
            },
            "assessment-assets": {
              "$ref": "#/definitions/assessment-assets"
            },
            "tasks": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/task"
              }
            }
          },
          "additionalProperties": false
        },
        "reviewed-controls": {
          "$ref": "#/definitions/reviewed-controls"
        },
        "attestations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Attestation Statements",
            "description": "A set of textual statements, typically written by the assessor.",
            "type": "object",
            "properties": {
              "responsible-parties": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/responsible-party"
                }
              },
              "parts": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/assessment-part"
                }
              }
            },
            "required": [
              "parts"
            ],
            "additionalProperties": false
          }
        },
        "assessment-log": {
          "title": "Assessment Log",
          "description": "A log of all assessment-related actions taken.",
          "type": "object",
          "properties": {
            "entries": {
              "type": "array",
              "minItems": 1,
              "items": {
                "title": "Assessment Log Entry",
                "description": "Identifies the result of an action and/or task that occurred as part of executing an assessment plan or an assessment event that occurred in producing the assessment results.",
                "type": "object",
                "properties": {
                  "uuid": {
                    "title": "Assessment Log Entry Universally Unique Identifier",
                    "description": "A machine-oriented, globally unique identifier with cross-instance scope that can be used to reference an assessment event in this or other OSCAL instances. The locally defined UUID of the assessment log entry can be used to reference the data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
                    "$ref": "#/definitions/UUIDDatatype"
                  },
                  "title": {
                    "title": "Action Title",
                    "description": "The title for this event.",
                    "type": "string"
                  },
                  "description": {
                    "title": "Action Description",
                    "description": "A human-readable description of this event.",
                    "type": "string"
                  },
                  "start": {
                    "title": "Action Start",
                    "description": "Identifies the start date and time of an event.",
                    "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
                  },
                  "end": {
                    "title": "Action End",
                    "description": "Identifies the end date and time of an event. If the event is a point in time, the start and end will be the same date and time.",
                    "$ref": "#/definitions/DateTimeWithTimezoneDatatype"
                  },
                  "props": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/property"
                    }
                  },
                  "links": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/link"
                    }
                  },
                  "logged-by": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/logged-by"
                    }
                  },
                  "related-tasks": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "$ref": "#/definitions/related-task"
                    }
                  },
                  "remarks": {
                    "$ref": "#/definitions/remarks"
                  }
                },
                "required": [
                  "uuid",
                  "start"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "entries"
          ],
          "additionalProperties": false
        },
        "observations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/observation"
          }
        },
        "risks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/risk"
          }
        },
        "findings": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/finding"
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "uuid",
        "title",
        "description",
        "start",
        "reviewed-controls"
      ],
      "additionalProperties": false
    },
    "import-ap": {
      "title": "Import Assessment Plan",
      "description": "Used by assessment-results to import information about the original plan for assessing the system.",
      "$id": "#/definitions/import-ap",
      "type": "object",
      "properties": {
        "href": {
          "title": "Assessment Plan Reference",
          "description": "A resolvable URL reference to the assessment plan governing the assessment activities.",
          "$ref": "#/definitions/URIReferenceDatatype"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "href"
      ],
      "additionalProperties": false
    },
    "plan-of-action-and-milestones": {
      "title": "Plan of Action and Milestones (POA&M)",
      "description": "A plan of action and milestones which identifies initial and residual risks, deviations, and disposition, such as those required by FedRAMP.",
      "$id": "#/definitions/plan-of-action-and-milestones",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "POA&M Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with instancescope that can be used to reference this POA&M instance in this OSCAL instance. This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "metadata": {
          "$ref": "#/definitions/metadata"
        },
        "import-ssp": {
          "$ref": "#/definitions/import-ssp"
        },
        "system-id": {
          "$ref": "#/definitions/system-id"
        },
        "local-definitions": {
          "$ref": "#/definitions/local-definitions"
        },
        "observations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/observation"
          }
        },
        "risks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/risk"
          }
        },
        "findings": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/finding"
          }
        },
        "poam-items": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/poam-item"
          }
        },
        "back-matter": {
          "$ref": "#/definitions/back-matter"
        }
      },
      "required": [
        "uuid",
        "metadata",
        "poam-items"
      ],
      "additionalProperties": false
    },
    "local-definitions": {
      "title": "Local Definitions",
      "description": "Allows components, and inventory-items to be defined within the POA&M for circumstances where no OSCAL-based SSP exists, or is not delivered with the POA&M.",
      "$id": "#/definitions/local-definitions",
      "type": "object",
      "properties": {
        "components": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/system-component"
          }
        },
        "inventory-items": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/inventory-item"
          }
        },
        "assessment-assets": {
          "$ref": "#/definitions/assessment-assets"
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "additionalProperties": false
    },
    "poam-item": {
      "title": "POA&M Item",
      "description": "Describes an individual POA&M item.",
      "$id": "#/definitions/poam-item",
      "type": "object",
      "properties": {
        "uuid": {
          "title": "POA&M Item Universally Unique Identifier",
          "description": "A machine-oriented, globally unique identifier with instance scope that can be used to reference this POA&M item entry in this OSCAL instance. This UUID should be assigned per-subject, which means it should be consistently used to identify the same subject across revisions of the document.",
          "$ref": "#/definitions/UUIDDatatype"
        },
        "title": {
          "title": "POA&M Item Title",
          "description": "The title or name for this POA&M item .",
          "type": "string"
        },
        "description": {
          "title": "POA&M Item Description",
          "description": "A human-readable description of POA&M item.",
          "type": "string"
        },
        "props": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/property"
          }
        },
        "links": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/link"
          }
        },
        "origins": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "POA&M Origin",
            "description": "Identifies the source of the finding, such as a tool or person.",
            "type": "object",
            "properties": {
              "actors": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/origin-actor"
                }
              }
            },
            "required": [
              "actors"
            ],
            "additionalProperties": false
          }
        },
        "related-findings": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Related Finding",
            "description": "Relates the poam-item to referenced finding(s).",
            "type": "object",
            "properties": {
              "finding-uuid": {
                "title": "Finding Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to a finding defined in the list of findings.",
                "$ref": "#/definitions/UUIDDatatype"
              }
            },
            "required": [
              "finding-uuid"
            ],
            "additionalProperties": false
          }
        },
        "related-observations": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Poam Item Finding Related Observation",
            "description": "Relates the poam-item to a set of referenced observations that were used to determine the finding.",
            "type": "object",
            "properties": {
              "observation-uuid": {
                "title": "Related Observation Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to an observation defined in the list of observations.",
                "$ref": "#/definitions/UUIDDatatype"
              }
            },
            "required": [
              "observation-uuid"
            ],
            "additionalProperties": false
          }
        },
        "related-risks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Associated Risk",
            "description": "Relates the finding to a set of referenced risks that were used to determine the finding.",
            "type": "object",
            "properties": {
              "risk-uuid": {
                "title": "Risk Universally Unique Identifier Reference",
                "description": "A machine-oriented identifier reference to a risk defined in the list of risks.",
                "$ref": "#/definitions/UUIDDatatype"
              }
            },
            "required": [
              "risk-uuid"
            ],
            "additionalProperties": false
          }
        },
        "remarks": {
          "$ref": "#/definitions/remarks"
        }
      },
      "required": [
        "title",
        "description"
      ],
      "additionalProperties": false
    }
  },
  "oneOf": [
    {
      "properties": {
        "$schema": {
          "$ref": "#/definitions/json-schema-directive"
        },
        "catalog": {
          "$ref": "#/definitions/catalog"
        }
      },
      "required": [
        "catalog"
      ],
      "additionalProperties": false
    },
    {
      "properties": {
        "$schema": {
          "$ref": "#/definitions/json-schema-directive"
        },
        "profile": {
          "$ref": "#/definitions/profile"
        }
      },
      "required": [
        "profile"
      ],
      "additionalProperties": false
    },
    {
      "properties": {
        "$schema": {
          "$ref": "#/definitions/json-schema-directive"
        },
        "component-definition": {
          "$ref": "#/definitions/component-definition"
        }
      },
      "required": [
        "component-definition"
      ],
      "additionalProperties": false
    },
    {
      "properties": {
        "$schema": {
          "$ref": "#/definitions/json-schema-directive"
        },
        "system-security-plan": {
          "$ref": "#/definitions/system-security-plan"
        }
      },
      "required": [
        "system-security-plan"
      ],
      "additionalProperties": false
    },
    {
      "properties": {
        "$schema": {
          "$ref": "#/definitions/json-schema-directive"
        },
        "assessment-plan": {
          "$ref": "#/definitions/assessment-plan"
        }
      },
      "required": [
        "assessment-plan"
      ],
      "additionalProperties": false
    },
    {
      "properties": {
        "$schema": {
          "$ref": "#/definitions/json-schema-directive"
        },
        "assessment-results": {
          "$ref": "#/definitions/assessment-results"
        }
      },
      "required": [
        "assessment-results"
      ],
      "additionalProperties": false
    },
    {
      "properties": {
        "$schema": {
          "$ref": "#/definitions/json-schema-directive"
        },
        "plan-of-action-and-milestones": {
          "$ref": "#/definitions/plan-of-action-and-milestones"
        }
      },
      "required": [
        "plan-of-action-and-milestones"
      ],
      "additionalProperties": false
    }
  ]
}