# seeEditInfo — ArcGIS Enterprise SOE for Editor Tracking Inspection

## Overview

`seeEditInfo` is an **ArcGIS Enterprise Server Object Extension (SOE)** for MapServer services.  
It provides a reliable way to **retrieve editor-tracking information** (creator, creation date, editor, edit date) for any feature in a feature service **without requiring an external REST request** from the client.

### Why this SOE exists

In the ArcGIS Enterprise .NET SDK (10.9.1–11.5), the interfaces:

- `IEditorTrackingInfo`
- `IEditorTrackingInfo2`
- `IDatasetEditInfo`

**always return null inside SOEs/SOIs**.

However, ArcGIS Server *does* expose editor-tracking metadata through each FeatureServer layer’s REST endpoint under:


This SOE bridges the gap by:

1. Discovering its **own SOE URL** using `IServerEnvironmentEx.Properties`.
2. Reconstructing the corresponding **FeatureServer layer URL**.
3. Fetching the layer’s `editFieldsInfo` JSON.
4. Using the returned field names to read actual editor-tracking values directly from the MapServer’s feature class.

This works consistently across **ArcGIS Enterprise 11.1, 11.2, 11.3, 11.4, 11.5**.

---

## Features

- Correctly discovers the SOE’s request URL at runtime.
- Works in secured, federated, and non-federated Enterprise deployments.
- No client-side changes needed.
- Uses FeatureServer metadata to obtain correct tracking field names.
- Reads values from the MapServer datasource (feature class).
- Returns clean JSON responses such as:

```json
{
  "layerId": 0,
  "objectId": 17,
  "editFields": {
    "creationDateField": "CREATED_DATE",
    "creatorField": "CREATED_BY",
    "editDateField": "LAST_EDITED_DATE",
    "editorField": "LAST_EDITED_BY"
  },
  "creator": "jsmith",
  "creationDate": 1695422838170,
  "editor": "adoe",
  "editDate": 1701031181253
}
```
How It Works (Technical Flow)

User calls:

/arcgis/rest/services/<Service>/MapServer/exts/seeEditInfo/logEditInfo


SOE discovers its MapServer URL from:

IServerEnvironmentEx.Properties


looking specifically for entries containing:

/MapServer/exts/<SOEName>


SOE converts its MapServer URL to the correct FeatureServer URL:

MapServer → FeatureServer


SOE requests:

FeatureServer/<layerId>?f=pjson


to get editFieldsInfo.

SOE loads the feature from the MapServer datasource:

var fc = da.GetDataSource(mapName, layerId) as IFeatureClass;
var feature = fc.GetFeature(objectId);


SOE returns all editor-tracking values as JSON.
