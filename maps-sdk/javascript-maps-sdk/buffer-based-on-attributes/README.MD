# Create Buffer Based on Attributes

## About

This sample shows how to use an attribute value as the distance when generating buffers.

This sample is a modification of an [older sample](https://github.com/Esri/developer-support/tree/master/web-js/4.x/buffer-based-on-attributes). These modifications include:
- Migration from version 4.17 to 4.32
- Implementation of [Map components](https://developers.arcgis.com/javascript/latest/references/map-components/)
- [Module loading via CDN](https://developers.arcgis.com/javascript/latest/get-started-cdn/#module-loading-via-cdn)
- Replacing the deprecated geometryEngine classes with [geometry operators](https://developers.arcgis.com/javascript/latest/spatial-analysis/intro-geometry-operators/)

## How It Works

1. Query the layer to be buffered. Add the result geometries and attributes (distances) to two arrays respectively. The query can be either server-side or client-side.

```javascript
result.features.forEach((feature) => {
  geometries.push(feature.geometry);
  distances.push(feature.attributes.pop2000 / 10000);
});
```

2. Verify that geodesicBufferOperator.isLoaded() returns true. If not, load it.

```javascript
if (!geodesicBufferOperator.isLoaded()) {
  await geodesicBufferOperator.load();
}
```

3. Pass the geometries, distances, and other parameters into the geodesicBufferOperator.executeMany() method, which will return the result buffers as an array of Polygon. 

```javascript
var buffer = geodesicBufferOperator.executeMany(
  geometries,
  distances,
  {
    unit: "kilometers",
    union: true
  }
);
```

## Related Documentation

- [geodesicBufferOperator.executeMany()](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-operators-geodesicBufferOperator.html#executeMany)
- [Query a feature layer](https://developers.arcgis.com/javascript/latest/tutorials/query-a-feature-layer-sql/)

## Live Samples

- [Acquire Buffer Distances from a Server-Side Query](https://esri.github.io/developer-support/maps-sdk/javascript-maps-sdk/buffer-based-on-attributes/query_attributes_from_server_side.html)
- [Acquire Buffer Distances from a Client-Side Query](https://esri.github.io/developer-support/maps-sdk/javascript-maps-sdk/buffer-based-on-attributes/query_attributes_from_client_side.html)
