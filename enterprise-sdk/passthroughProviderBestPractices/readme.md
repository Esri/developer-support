\# ArcGIS Enterprise SDK Custom Data Feeds Pass-Through Provider Template



This `model.js` template demonstrates a best-practice pattern for building an ArcGIS Enterprise SDK Custom Data Feeds pass-through provider.



A pass-through provider acts as a translation layer between ArcGIS clients and a remote data source. Instead of loading an entire remote dataset into memory and filtering locally, the provider captures incoming ArcGIS FeatureServer query parameters, translates them into the remote API’s supported query syntax, retrieves only the requested records, and returns a normalized GeoJSON response.



This template is intended for ArcGIS Enterprise 11.5 and later, where `host` and `id` route parameters are deprecated in favor of `serviceParameters`.



\## Purpose



The purpose of this template is to show how a Custom Data Feeds provider can:



1\. Read reusable service configuration from `serviceParameters`.

2\. Capture ArcGIS FeatureServer query parameters from `req.query`.

3\. Translate those parameters into a remote API request.

4\. Send the request to the remote data source.

5\. Handle pagination, counts, ID-only requests, geometry filters, attribute filters, and output fields.

6\. Normalize the remote response into GeoJSON.

7\. Return GeoJSON with CDF metadata, `filtersApplied`, and `exceededTransferLimit`.



This template is not tied to one specific remote API. The example URL structure uses a Socrata SODA 3-style endpoint, but the same pattern can be adapted for SQL APIs, REST services, NoSQL APIs, vendor APIs, or other JSON/GeoJSON endpoints.



\## Why use a pass-through provider?



A pass-through provider is useful when the remote data source already supports filtering, sorting, spatial queries, or pagination.



Instead of having the Custom Data Feeds provider request all records and then filter them locally, the provider should translate ArcGIS query parameters into equivalent remote API parameters. This improves performance, reduces memory usage, and allows ArcGIS clients such as Map Viewer, ArcGIS Pro, the Data tab, and custom applications to page through large datasets.



\## ArcGIS Enterprise 11.5+ service parameter pattern



At ArcGIS Enterprise 11.5, `host` and `id` route parameters are deprecated for Custom Data Feeds providers. This template uses `serviceParameters` instead.



The recommended pattern is to read reusable provider inputs from service parameters rather than from the URL route.



Example service parameter values:



\- `remoteUrl`

\- `datasetId`

\- `layerName`

\- `description`

\- `geometryType`

\- `idField`

\- `maxRecordCount`



This makes the provider easier to reuse because publishers can configure the remote URL, dataset ID, layer name, ID field, geometry type, and record limits without modifying the provider code.



\## Example service parameters



Add a `serviceParameters` section to `cdconfig.json` similar to the following:



{

&#x20; "serviceParameters": \[

&#x20;   {

&#x20;     "key": "remoteUrl",

&#x20;     "label": "Remote API Base URL",

&#x20;     "description": "Base URL for the remote data source, for example https://data.lacity.org."

&#x20;   },

&#x20;   {

&#x20;     "key": "datasetId",

&#x20;     "label": "Dataset ID",

&#x20;     "description": "Remote dataset identifier used to build the query URL."

&#x20;   },

&#x20;   {

&#x20;     "key": "layerName",

&#x20;     "label": "Layer Name",

&#x20;     "description": "Display name used in the custom data feature service metadata."

&#x20;   },

&#x20;   {

&#x20;     "key": "description",

&#x20;     "label": "Description",

&#x20;     "description": "Description used in the custom data feature service metadata."

&#x20;   },

&#x20;   {

&#x20;     "key": "geometryType",

&#x20;     "label": "Geometry Type",

&#x20;     "description": "Geometry type exposed by the provider, for example Point."

&#x20;   },

&#x20;   {

&#x20;     "key": "idField",

&#x20;     "label": "ID Field",

&#x20;     "description": "Stable numeric ID field used by the custom data feature service."

&#x20;   },

&#x20;   {

&#x20;     "key": "maxRecordCount",

&#x20;     "label": "Max Record Count",

&#x20;     "description": "Maximum number of records returned per request."

&#x20;   }

&#x20; ]

}



\## Recommended service parameter values



Example values for a Socrata-style provider:



remoteUrl: https://data.lacity.org

datasetId: 2nrs-mtv8

layerName: City Data

description: Remote city dataset served through Custom Data Feeds

geometryType: Point

idField: OBJECTID

maxRecordCount: 2000



\## Template workflow



The provider follows this workflow:



ArcGIS client request

&#x20;       |

&#x20;       v

Capture req.query parameters

&#x20;       |

&#x20;       v

Read serviceParameters

&#x20;       |

&#x20;       v

Translate ArcGIS query into remote API query

&#x20;       |

&#x20;       v

Request data from remote source

&#x20;       |

&#x20;       v

Validate remote response

&#x20;       |

&#x20;       v

Normalize response to GeoJSON

&#x20;       |

&#x20;       v

Apply CDF metadata

&#x20;       |

&#x20;       v

Return FeatureCollection to ArcGIS client



\## Best practice 1: Capture ArcGIS query parameters



ArcGIS clients send FeatureServer-style query parameters to the provider. The template captures these parameters in `parseArcGISRequest()`.



Common parameters include:



where

geometry

geometryType

spatialRel

outFields

objectIds

orderByFields

returnGeometry

returnCountOnly

returnIdsOnly

resultOffset

resultRecordCount

f



The provider normalizes these values into a query context object so the rest of the code can work with predictable values.



\## Best practice 2: Build a remote API request



The `buildRemoteRequest()` function converts the ArcGIS query context into the remote API’s query syntax.



For example, ArcGIS pagination parameters:



resultOffset

resultRecordCount



may become remote API parameters such as:



offset

limit



The exact remote parameter names should be changed to match the target API.



\## Best practice 3: Use resultRecordCount + 1 for pagination



To determine whether more records exist, the provider requests one more record than the client asked for.



Example:



Client requests: 2000 records

Provider requests from remote API: 2001 records



If the remote API returns 2001 records, the provider removes the extra record before returning the response and sets:



geojson.exceededTransferLimit = true;



This tells the ArcGIS client that additional records are available. The client can then make another request with a larger `resultOffset`.



\## Best practice 4: Handle special query modes



ArcGIS clients may make requests that are not standard feature queries.



The template includes support for:



returnCountOnly=true

returnIdsOnly=true

returnGeometry=false

outFields

objectIds



\### Count-only requests



When `returnCountOnly=true`, the provider should ideally send a count-only request to the remote API.



\### IDs-only requests



When `returnIdsOnly=true`, the provider should return object IDs instead of full features.



\### Geometry-free requests



When `returnGeometry=false`, the provider removes geometry from the returned features.



\### Output fields



When `outFields` is provided, the provider limits returned attributes to the requested fields plus the configured ID field.



\## Best practice 5: Return valid GeoJSON



The provider must return a GeoJSON `FeatureCollection`.



The template accepts either:



1\. A remote response that is already GeoJSON.

2\. An array of JSON records.

3\. A JSON object with a `data` array.



For non-GeoJSON APIs, update the `rowToFeature()` function so it maps the remote schema into valid GeoJSON features.



Example feature structure:



{

&#x20; "type": "Feature",

&#x20; "geometry": {

&#x20;   "type": "Point",

&#x20;   "coordinates": \[-118.2437, 34.0522]

&#x20; },

&#x20; "properties": {

&#x20;   "OBJECTID": 1,

&#x20;   "name": "Example feature"

&#x20; }

}



\## Best practice 6: Use a stable numeric ID field



ArcGIS clients need a stable numeric ID field for selection, querying, paging, and object ID workflows.



The template uses the configured service parameter:



idField



By default, this is:



OBJECTID



The provider attempts to populate this field from an existing remote ID. If one does not exist, it falls back to a generated value using the offset and feature index.



For production use, prefer a real stable numeric ID from the remote data source.



\## Best practice 7: Sanitize problematic fields



Some remote APIs return field names that are not ideal for ArcGIS clients.



Examples:



:id

:created\_at

field.with.dots

field with spaces

very\_long\_field\_names



The template sanitizes these fields by converting unsupported characters to underscores and trimming long names.



This helps avoid awkward or problematic fields in ArcGIS clients.



\## Best practice 8: Include CDF metadata



The returned GeoJSON should include a `metadata` object.



Example metadata:



{

&#x20; "name": "Remote Pass-through Layer",

&#x20; "description": "Example pass-through provider using remote filtering and pagination.",

&#x20; "geometryType": "Point",

&#x20; "idField": "OBJECTID",

&#x20; "maxRecordCount": 2000,

&#x20; "filtersApplied": {

&#x20;   "where": true,

&#x20;   "geometry": false,

&#x20;   "objectIds": false,

&#x20;   "pagination": true,

&#x20;   "orderBy": false,

&#x20;   "outFields": true

&#x20; }

}



\## Best practice 9: Report filtersApplied truthfully



The `filtersApplied` metadata should describe which filters the provider actually handled.



For example, only set:



where: true



if the provider successfully translated the ArcGIS `where` clause into a remote API filter.



Only set:



geometry: true



if the provider translated and applied the spatial filter against the remote API.



This is important because it communicates whether filtering occurred remotely or whether additional local filtering may still be needed.



\## Best practice 10: Do not hard-code credentials



The template reads authentication values from environment variables.



Example environment variables:



REMOTE\_API\_KEY

REMOTE\_API\_SECRET

REMOTE\_BEARER\_TOKEN



Supported authentication examples:



Bearer token

Basic authentication

No authentication



Do not hard-code API keys, tokens, usernames, or passwords in `model.js`.



\## Files to customize



The main areas expected to be customized are:



getServiceParameters()

buildRemoteRequest()

translateWhereClause()

translateOrderBy()

translateGeometryFilter()

rowToFeature()

isSupportedFeature()

normalizeFeature()

buildAuthHeaders()



\## Provider functions



\### getServiceParameters(req)



Reads provider configuration from service parameters.



Use this to configure:



remoteUrl

datasetId

layerName

description

geometryType

idField

maxRecordCount



\### parseArcGISRequest(req, serviceParams)



Reads ArcGIS query parameters and creates a normalized query context.



\### buildRemoteRequest(ctx)



Builds the remote API URL and request headers.



\### executeRemoteRequest(remoteRequest)



Sends the request to the remote API and validates the response.



\### normalizeRemoteResponseToGeoJSON(remoteResponse, ctx)



Handles query modes, pagination, feature normalization, metadata, and final GeoJSON output.



\### coerceToFeatureCollection(remoteResponse)



Converts a remote response into a GeoJSON `FeatureCollection`.



\### normalizeFeature(feature, ctx, index)



Normalizes geometry, ID fields, and attributes for each feature.



\## Pagination behavior



The template uses this logic:



remoteLimit = resultRecordCount + 1



Then after receiving the response:



exceededTransferLimit = geojson.features.length > resultRecordCount



If `exceededTransferLimit` is true, the provider removes the extra feature before returning the response.



This allows ArcGIS clients to manage paging by sending the next request with a larger `resultOffset`.



\## Example request flow



A client may send a request like:



/query?where=1%3D1\&resultOffset=0\&resultRecordCount=2000\&outFields=\*\&f=json



The provider translates that into a remote request such as:



https://data.lacity.org/api/v3/views/2nrs-mtv8/query.geojson?limit=2001\&offset=0



If the remote source returns 2001 records, the provider returns 2000 features and sets:



{

&#x20; "exceededTransferLimit": true

}



The client can then request:



/query?where=1%3D1\&resultOffset=2000\&resultRecordCount=2000\&outFields=\*\&f=json



\## Production notes



Before using this template in production:



1\. Replace the example remote URL pattern with the actual remote API endpoint.

2\. Implement safe translation for `where` clauses.

3\. Implement spatial filter translation for the target API.

4\. Use a real stable numeric ID field from the remote source.

5\. Confirm that `returnCountOnly` uses an efficient remote count endpoint if available.

6\. Confirm that `returnIdsOnly` uses an efficient remote ID endpoint if available.

7\. Validate field names and field types against the expected ArcGIS client behavior.

8\. Move secrets into environment variables or a secure configuration system.

9\. Test with Map Viewer, the Data tab, ArcGIS Pro, and any target custom applications.

10\. Confirm large dataset behavior with pagination.



\## Important limitations



This template is intentionally generic. It does not fully implement translation for every ArcGIS SQL expression, every spatial relationship, or every remote API pagination style.



The following functions are placeholders and should be customized:



translateWhereClause()

translateOrderBy()

translateGeometryFilter()



Avoid directly injecting ArcGIS SQL into a remote API unless the remote API safely supports that syntax. In production, translate only the operators and fields that your provider explicitly supports.



\## Summary



This template provides a reusable starting point for ArcGIS Enterprise SDK Custom Data Feeds pass-through providers. It demonstrates how to structure a provider that reads service parameters, translates ArcGIS FeatureServer query parameters, delegates filtering and pagination to a remote data source, and returns normalized GeoJSON with the metadata ArcGIS clients expect.



The main goal is to make the provider scalable, reusable, and aligned with ArcGIS Enterprise 11.5+ service parameter practices.

