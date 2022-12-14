# ma-plugin-identify

## Introduction
This plugin allow the user to identify elements on the map.

## Depecdencies
1. ma-plugin-ol-map

## Settings
### Settings schema
```json
{
    "definitions": {
        "Layer": {
            "type": "object",
            "properties": {
                "id": { "type": "integer" },
                "alias": { "type": "string" },
                "layerName": { "type": "string" },
                "tolerance": { "type": "integer" },
                "move": { "type": "boolean" },
                "geometryField": {
					"$ref": "#/definitions/Field"
                },
                "nameField": {
					"$ref": "#/definitions/Field"
                },
                "idField": {
                    "$ref": "#/definitions/Field"
                },
                "fields": {
					"type": "array",
					"items": {
						"$ref": "#/definitions/Field"
					}
                },
                "datasource": {
                    "$ref": "#/definitions/Datasource"
                }                
            },
            "required": ["id", "layerName", "idField", "nameField", "geometryField"]
        },
        "Field": {
            "type": "object",
            "properties": {
                "id": { "type": "integer" },
                "fieldName": { "type": "string" },
                "dataType": {
                    "type": "string",
                    "enum": ["STRING", "DOUBLE", "GEOMETRY"]
                },
                "alias": { "type": "string" },
                "isBasic": { "type": "boolean"}
            },
            "required": ["id", "fieldName", "dataType", "alias"]
        },
        "Datasource": {
            "type": "object",
            "properties": {
                "id": { "type": "integer" }
            },
            "required": ["id"]
        }
    },
    "type": "object",
    "properties": {
        "tolerance": { "type": "integer" },
        "layers": {
            "title": "Layers",
			"type": "array",
			"items": {
				"$ref": "#/definitions/Layer"
			}
        }
    }
}
```

### Example settings object
```json

{
  "tolerance": 10,
  "move": false,
  "layers": [
    {
      "id": 1,
      "alias": "US Boundaries",
      "layerName": "topp:states",
      "tolerance": 10,
      "geometryField": {
        "id": "6",
        "fieldName": "the_geom",
        "dataType": "GEOMETRY"
      },
      "nameField": {
        "id": "1",
        "fieldName": "STATE_NAME",
        "dataType": "STRING",
        "alias": "Name"
      },
      "idField": {
        "id": "1",
        "fieldName": "STATE_NAME",
        "dataType": "STRING",
        "alias": "Name"
      },
      "datasource": {
        "id": 2
      },
      "fields": [
        {
          "id": "1",
          "fieldName": "STATE_NAME",
          "dataType": "STRING",
          "alias": "Name",
          "isBasic": true
        },
        {
          "id": "2",
          "fieldName": "STATE_FIPS",
          "dataType": "STRING",
          "alias": "FIPS",
          "isBasic": true
        },
        {
          "id": "3",
          "fieldName": "SUB_REGION",
          "dataType": "STRING",
          "alias": "Region"
        },
        {
          "id": "4",
          "fieldName": "LAND_KM",
          "dataType": "DOUBLE",
          "alias": "Land"
        },
        {
          "id": "5",
          "fieldName": "WATER_KM",
          "dataType": "DOUBLE",
          "alias": "Water"
        }
      ]
    }
  ]
}

```

### Settings object explanation

- **tolerance: Integer** 
	- A number that specify the bounding box around the clicked point in pixels.
- **move: Boolean** 
	- Determine whether popup location should be updated when the selected feature changes, or stay fixed at the user's clicked location.
- **layers: Array<Layer>**
    - An array of type "Layer".
    - Specify the identifiable layers.
- **Layer: Object**
    - id [mandatory]: integer, specify layer id.
    - alias [mandatory]: string, specify layer display name.
    - layerName [mandatory]: string, specify layer name.
    - tolerance [optional]: integer, override global tolerance.
    - nameField [mandatory]: Object<Field> the display field of the layer.
    - idField [mandatory]: Object<Field> the id field of the layer.
    - geometryField [mandatory]: Object<Field> the geometry field of the layer.
    - fields [mandatory]: Array<Field>, the fields that will be displayed for the layer, fields with "basicInfo" is true will appear in basic view, and all fields will appear in the more info view.
    - datasource [mandatory]: Object<Datasource>, layer's datasource.
- **Field: Object**
    - id [mandatory]: integer, specify field id.
    - fieldName [mandatory]: string, specify field name.
    - dataType [mandatory]: string, field datatype, on of ["STRING", "DOUBLE", "GEOMETRY"].
    - alias [mandatory]: string, field display name.
    - isBasic [optional]: boolean, if true this field's value will appear in basic view.
- **Datasource: Object**
    - id[mandatory]: integer, datasource id.#   m a - p l u g i n - i d e n t i f y  
 