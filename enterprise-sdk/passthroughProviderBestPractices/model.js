"use strict";

/**
 * Generic ArcGIS Enterprise SDK Custom Data Feeds pass-through provider model.js
 *
 * Purpose:
 * - Capture ArcGIS FeatureServer query parameters from req.query.
 * - Read provider configuration from service parameters.
 * - Translate ArcGIS query parameters into a remote API query.
 * - Let the remote API handle filtering, sorting, and pagination when possible.
 * - Normalize the remote response into GeoJSON.
 * - Return GeoJSON with CDF metadata, exceededTransferLimit, and filtersApplied.
 *
 * This is intentionally written as a best-practices template.
 * Replace the REMOTE_* functions with logic specific to your remote data source.
 */

const _ = require("lodash");

function Model(koop) {}

/**
 * Main CDF entry point.
 */
Model.prototype.getData = async function getData(req, callback) {
  try {
    const serviceParams = getServiceParameters(req);

    const queryContext = parseArcGISRequest(req, serviceParams);

    const remoteRequest = buildRemoteRequest(queryContext);

    const remoteResponse = await executeRemoteRequest(remoteRequest);

    const geojson = normalizeRemoteResponseToGeoJSON(remoteResponse, queryContext);

    callback(null, geojson);
  } catch (err) {
    callback(err);
  }
};

module.exports = Model;

/**
 * ArcGIS Enterprise 11.5+ best practice:
 * Use service parameters instead of deprecated host/id route parameters.
 *
 * Define these values in cdconfig.json under serviceParameters, then read
 * the configured values from the request at runtime.
 *
 * Example service parameters:
 * - remoteUrl: https://data.lacity.org
 * - datasetId: 2nrs-mtv8
 * - layerName: City Data
 * - description: Optional layer description
 * - geometryType: Point
 * - idField: OBJECTID
 * - maxRecordCount: 2000
 */
function getServiceParameters(req) {
  /**
   * Depending on the CDF provider implementation and request path,
   * service parameters may be exposed in different locations.
   *
   * Keep this lookup defensive so the template is easier to adapt.
   */
  const source =
    req.serviceParameters ||
    _.get(req, "koop.serviceParameters") ||
    _.get(req, "params.serviceParameters") ||
    req.query ||
    {};

  const remoteUrl =
    source.remoteUrl ||
    source.remoteURL ||
    source.url ||
    source.baseUrl;

  const datasetId =
    source.datasetId ||
    source.datasetID ||
    source.dataset ||
    source.viewId ||
    source.uid;

  const layerName = source.layerName || "Remote Pass-through Layer";

  const description =
    source.description ||
    "Example pass-through provider using remote filtering and pagination.";

  const geometryType = source.geometryType || "Point";

  const idField = source.idField || "OBJECTID";

  const maxRecordCount = toInteger(source.maxRecordCount, 2000);

  if (!remoteUrl) {
    throw new Error("Missing required service parameter: remoteUrl");
  }

  if (!datasetId) {
    throw new Error("Missing required service parameter: datasetId");
  }

  return {
    remoteUrl: stripTrailingSlash(remoteUrl),
    datasetId,
    layerName,
    description,
    geometryType,
    idField,
    maxRecordCount
  };
}

/**
 * Best practice 1:
 * Capture ArcGIS request parameters and normalize them into a provider-friendly object.
 */
function parseArcGISRequest(req, serviceParams) {
  const q = req.query || {};

  const resultOffset = toInteger(q.resultOffset, 0);

  // Use the client-requested count when present.
  // Keep this aligned with the service's maxRecordCount.
  const resultRecordCount = Math.min(
    toInteger(q.resultRecordCount, serviceParams.maxRecordCount),
    serviceParams.maxRecordCount
  );

  // Request one extra row from the remote source so we can determine
  // whether there are additional records beyond this page.
  const remoteLimit = resultRecordCount + 1;

  return {
    serviceParams,

    where: q.where || "1=1",
    geometry: q.geometry,
    geometryType: q.geometryType,
    spatialRel: q.spatialRel,
    outFields: parseOutFields(q.outFields),
    objectIds: parseObjectIds(q.objectIds),
    orderByFields: q.orderByFields,
    returnGeometry: q.returnGeometry !== "false",
    returnCountOnly: q.returnCountOnly === "true",
    returnIdsOnly: q.returnIdsOnly === "true",
    resultOffset,
    resultRecordCount,
    remoteLimit,

    // Useful for metadata and diagnostics.
    requestedFormat: q.f || "json",
    rawQuery: q
  };
}

/**
 * Best practice 2:
 * Translate ArcGIS query params into the remote API's query language.
 *
 * Replace this with the specific API contract for your source:
 * - Socrata SODA
 * - SQL-backed API
 * - REST endpoint
 * - NoSQL endpoint
 * - Vendor API
 */
function buildRemoteRequest(ctx) {
  const { serviceParams } = ctx;

  /**
   * Example only.
   *
   * For a Socrata SODA 3 style endpoint:
   * remoteUrl = https://data.lacity.org
   * datasetId = 2nrs-mtv8
   *
   * Result:
   * https://data.lacity.org/api/v3/views/2nrs-mtv8/query.geojson
   */
  const baseUrl = `${serviceParams.remoteUrl}/api/v3/views/${serviceParams.datasetId}/query.geojson`;

  const url = new URL(baseUrl);

  /**
   * Example translation layer.
   *
   * The exact parameter names below are placeholders.
   * Your remote API may use:
   * - $limit / $offset
   * - limit / offset
   * - page / pageSize
   * - where / filter
   * - sql
   * - bbox
   */

  url.searchParams.set("limit", String(ctx.remoteLimit));
  url.searchParams.set("offset", String(ctx.resultOffset));

  if (ctx.orderByFields) {
    url.searchParams.set("orderBy", translateOrderBy(ctx.orderByFields));
  }

  if (ctx.where && ctx.where !== "1=1") {
    url.searchParams.set("where", translateWhereClause(ctx.where));
  }

  if (ctx.geometry) {
    const remoteSpatialFilter = translateGeometryFilter({
      geometry: ctx.geometry,
      geometryType: ctx.geometryType,
      spatialRel: ctx.spatialRel
    });

    if (remoteSpatialFilter) {
      url.searchParams.set("bbox", remoteSpatialFilter);
    }
  }

  if (ctx.objectIds && ctx.objectIds.length > 0) {
    url.searchParams.set("ids", ctx.objectIds.join(","));
  }

  const headers = buildAuthHeaders();

  return {
    url: url.toString(),
    headers,
    context: ctx
  };
}

/**
 * Best practice 2:
 * Call the remote data source and validate the response.
 */
async function executeRemoteRequest(remoteRequest) {
  const resp = await fetch(remoteRequest.url, {
    method: "GET",
    headers: remoteRequest.headers
  });

  if (!resp.ok) {
    const body = await safeReadText(resp);

    throw new Error(
      [
        "Remote data source request failed.",
        `Status: ${resp.status} ${resp.statusText}`,
        `URL: ${remoteRequest.url}`,
        `Body: ${body}`
      ].join(" ")
    );
  }

  const json = await resp.json();

  if (!json) {
    throw new Error("Remote data source returned an empty response.");
  }

  return json;
}

/**
 * Best practice 3 and 4:
 * Handle special ArcGIS request behavior and return normalized GeoJSON.
 */
function normalizeRemoteResponseToGeoJSON(remoteResponse, ctx) {
  /**
   * Special case: returnCountOnly=true
   *
   * Ideally, send a true count-only request to the remote source.
   * If the remote source cannot return counts, you may need an alternative
   * strategy depending on the API.
   */
  if (ctx.returnCountOnly) {
    return buildCountOnlyResponse(remoteResponse, ctx);
  }

  /**
   * Special case: returnIdsOnly=true
   *
   * Ideally, ask the remote source only for IDs.
   * If the remote source returns features, extract IDs here.
   */
  if (ctx.returnIdsOnly) {
    return buildIdsOnlyResponse(remoteResponse, ctx);
  }

  /**
   * Convert the remote response to a FeatureCollection.
   *
   * If the remote API already returns GeoJSON, validate it.
   * If it returns JSON rows, map those rows into GeoJSON features.
   */
  let geojson = coerceToFeatureCollection(remoteResponse);

  /**
   * Pagination:
   * We requested resultRecordCount + 1.
   * If we received the extra row, remove it before returning to the client
   * and set exceededTransferLimit=true.
   */
  const exceededTransferLimit = geojson.features.length > ctx.resultRecordCount;

  if (exceededTransferLimit) {
    geojson.features = geojson.features.slice(0, ctx.resultRecordCount);
  }

  /**
   * Normalize features:
   * - Ensure valid geometry.
   * - Ensure stable numeric OBJECTID.
   * - Remove unsupported/problematic fields.
   * - Honor returnGeometry=false.
   * - Honor outFields when practical.
   */
  geojson.features = geojson.features
    .filter(isSupportedFeature)
    .map((feature, index) => normalizeFeature(feature, ctx, index));

  if (!ctx.returnGeometry) {
    geojson.features = geojson.features.map((feature) => {
      delete feature.geometry;
      return feature;
    });
  }

  if (ctx.outFields && !ctx.outFields.includes("*")) {
    geojson.features = geojson.features.map((feature) => {
      feature.properties = pickOutFields(feature.properties, ctx.outFields, ctx.serviceParams.idField);
      return feature;
    });
  }

  /**
   * CDF metadata:
   *
   * idField should be a stable numeric field from the remote data source.
   * Do not rely on array index if the remote dataset supports a real numeric ID.
   */
  geojson.metadata = buildMetadata(ctx, {
    filtersApplied: {
      where: Boolean(ctx.where && ctx.where !== "1=1"),
      geometry: Boolean(ctx.geometry),
      objectIds: Boolean(ctx.objectIds && ctx.objectIds.length > 0),
      pagination: true,
      orderBy: Boolean(ctx.orderByFields),
      outFields: Boolean(ctx.outFields && !ctx.outFields.includes("*"))
    }
  });

  /**
   * FeatureServer-style flag used by ArcGIS clients to know whether they
   * should request the next page with a larger resultOffset.
   */
  geojson.exceededTransferLimit = exceededTransferLimit;

  return geojson;
}

/**
 * Build metadata from service parameters.
 */
function buildMetadata(ctx, options = {}) {
  const serviceParams = ctx.serviceParams;

  return {
    name: serviceParams.layerName,
    description: serviceParams.description,
    geometryType: serviceParams.geometryType,
    idField: serviceParams.idField,
    maxRecordCount: serviceParams.maxRecordCount,
    filtersApplied: options.filtersApplied || {}
  };
}

/**
 * Build auth headers without hard-coding secrets.
 */
function buildAuthHeaders() {
  const headers = {};

  const apiKey = process.env.REMOTE_API_KEY;
  const apiSecret = process.env.REMOTE_API_SECRET;
  const bearerToken = process.env.REMOTE_BEARER_TOKEN;

  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  } else if (apiKey && apiSecret) {
    headers.Authorization =
      "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  }

  headers.Accept = "application/json, application/geo+json";

  return headers;
}

/**
 * Count-only response.
 *
 * Replace this with the remote API's true count response when available.
 */
function buildCountOnlyResponse(remoteResponse, ctx) {
  const count =
    _.get(remoteResponse, "properties.count") ||
    _.get(remoteResponse, "count") ||
    _.get(remoteResponse, "features.length") ||
    0;

  return {
    type: "FeatureCollection",
    features: [],
    count,
    metadata: buildMetadata(ctx, {
      filtersApplied: {
        returnCountOnly: true,
        where: Boolean(ctx.where && ctx.where !== "1=1"),
        geometry: Boolean(ctx.geometry)
      }
    })
  };
}

/**
 * IDs-only response.
 *
 * Replace OBJECTID extraction with the real ID field from your remote data source.
 */
function buildIdsOnlyResponse(remoteResponse, ctx) {
  const geojson = coerceToFeatureCollection(remoteResponse);
  const idField = ctx.serviceParams.idField;

  const objectIds = geojson.features
    .map((feature, index) => {
      const props = feature.properties || {};
      return toInteger(
        props[idField] ||
          props.OBJECTID ||
          props.objectid ||
          props.id ||
          ctx.resultOffset + index + 1,
        null
      );
    })
    .filter((id) => Number.isInteger(id));

  return {
    type: "FeatureCollection",
    features: [],
    objectIds,
    metadata: buildMetadata(ctx, {
      filtersApplied: {
        returnIdsOnly: true,
        where: Boolean(ctx.where && ctx.where !== "1=1"),
        geometry: Boolean(ctx.geometry)
      }
    })
  };
}

/**
 * Convert remote response into GeoJSON FeatureCollection.
 *
 * This handles:
 * - APIs that already return FeatureCollection
 * - APIs that return arrays of records
 *
 * Replace this with source-specific mapping.
 */
function coerceToFeatureCollection(remoteResponse) {
  if (remoteResponse.type === "FeatureCollection" && Array.isArray(remoteResponse.features)) {
    return remoteResponse;
  }

  if (Array.isArray(remoteResponse)) {
    return {
      type: "FeatureCollection",
      features: remoteResponse.map(rowToFeature)
    };
  }

  if (Array.isArray(remoteResponse.data)) {
    return {
      type: "FeatureCollection",
      features: remoteResponse.data.map(rowToFeature)
    };
  }

  throw new Error("Remote response could not be converted to a GeoJSON FeatureCollection.");
}

/**
 * Example JSON row to GeoJSON feature conversion.
 * Replace longitude/latitude field names with your source's schema.
 */
function rowToFeature(row) {
  const lon = Number(row.longitude || row.lon || row.x);
  const lat = Number(row.latitude || row.lat || row.y);

  return {
    type: "Feature",
    geometry: Number.isFinite(lon) && Number.isFinite(lat)
      ? {
          type: "Point",
          coordinates: [lon, lat]
        }
      : null,
    properties: {
      ...row
    }
  };
}

/**
 * Validate supported feature geometry.
 *
 * This example only allows points.
 * Expand this for LineString, Polygon, MultiPoint, etc. if your provider supports them.
 */
function isSupportedFeature(feature) {
  if (!feature || feature.type !== "Feature") {
    return false;
  }

  const geometry = feature.geometry;

  if (!geometry) {
    return false;
  }

  if (geometry.type !== "Point") {
    return false;
  }

  const coords = geometry.coordinates;

  return (
    Array.isArray(coords) &&
    coords.length >= 2 &&
    Number.isFinite(Number(coords[0])) &&
    Number.isFinite(Number(coords[1]))
  );
}

/**
 * Normalize one GeoJSON feature.
 */
function normalizeFeature(feature, ctx, index) {
  const props = feature.properties || {};
  const idField = ctx.serviceParams.idField;

  feature.geometry.coordinates = [
    Number(feature.geometry.coordinates[0]),
    Number(feature.geometry.coordinates[1])
  ];

  /**
   * Best practice:
   * Use a stable numeric ID from the remote data source.
   *
   * Fallback to resultOffset + index + 1 only as a demonstration.
   * For production, prefer a true numeric source ID.
   */
  const sourceId =
    props[idField] ||
    props.OBJECTID ||
    props.objectid ||
    props.id ||
    props.source_id ||
    ctx.resultOffset + index + 1;

  props[idField] = toInteger(sourceId, ctx.resultOffset + index + 1);

  /**
   * If the configured idField is not OBJECTID, it can still be useful to
   * also expose OBJECTID for clients or test workflows expecting that field.
   */
  if (idField !== "OBJECTID" && !props.OBJECTID) {
    props.OBJECTID = props[idField];
  }

  /**
   * Remove fields that can cause ugly or invalid field names in ArcGIS clients.
   */
  for (const key of Object.keys(props)) {
    if (
      key.startsWith(":") ||
      key.includes(".") ||
      key.includes(" ") ||
      key.length > 64
    ) {
      const safeKey = sanitizeFieldName(key);

      if (!props[safeKey]) {
        props[safeKey] = props[key];
      }

      delete props[key];
    }
  }

  feature.properties = props;

  return feature;
}

/**
 * Keep only requested outFields plus the configured id field.
 */
function pickOutFields(properties, outFields, idField) {
  const result = {};

  if (Object.prototype.hasOwnProperty.call(properties, idField)) {
    result[idField] = properties[idField];
  }

  if (Object.prototype.hasOwnProperty.call(properties, "OBJECTID")) {
    result.OBJECTID = properties.OBJECTID;
  }

  for (const field of outFields) {
    if (Object.prototype.hasOwnProperty.call(properties, field)) {
      result[field] = properties[field];
    }
  }

  return result;
}

/**
 * Placeholder where-clause translator.
 *
 * Production providers should carefully translate only supported operators.
 * Avoid directly injecting client SQL into a remote API.
 */
function translateWhereClause(where) {
  return where;
}

/**
 * Placeholder orderBy translator.
 */
function translateOrderBy(orderByFields) {
  return orderByFields;
}

/**
 * Placeholder spatial filter translator.
 *
 * Example:
 * ArcGIS geometry envelope:
 * {
 *   xmin, ymin, xmax, ymax, spatialReference
 * }
 *
 * Remote bbox:
 * xmin,ymin,xmax,ymax
 */
function translateGeometryFilter({ geometry }) {
  if (!geometry) {
    return null;
  }

  let parsed = geometry;

  if (typeof geometry === "string") {
    try {
      parsed = JSON.parse(geometry);
    } catch {
      return null;
    }
  }

  const xmin = Number(parsed.xmin);
  const ymin = Number(parsed.ymin);
  const xmax = Number(parsed.xmax);
  const ymax = Number(parsed.ymax);

  if (
    Number.isFinite(xmin) &&
    Number.isFinite(ymin) &&
    Number.isFinite(xmax) &&
    Number.isFinite(ymax)
  ) {
    return `${xmin},${ymin},${xmax},${ymax}`;
  }

  return null;
}

function parseOutFields(outFields) {
  if (!outFields || outFields === "*") {
    return ["*"];
  }

  return String(outFields)
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
}

function parseObjectIds(objectIds) {
  if (!objectIds) {
    return [];
  }

  return String(objectIds)
    .split(",")
    .map((id) => toInteger(id, null))
    .filter((id) => Number.isInteger(id));
}

function toInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : fallback;
}

function sanitizeFieldName(name) {
  return String(name)
    .replace(/^:+/, "")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 64);
}

function stripTrailingSlash(value) {
  return String(value).replace(/\/+$/, "");
}

async function safeReadText(resp) {
  try {
    return await resp.text();
  } catch {
    return "";
  }
}
