# Create Buffer Based on Attributes

## RETIREMENT NOTICE
This sample currently uses a retired version of the ArcGIS Maps SDK for JavaScript (4.17).

There is a new version of this sample (see [here](https://github.com/Esri/developer-support/tree/master/maps-sdk/javascript-maps-sdk/buffer-based-on-attributes)).

If you would like to learn more about retired versions of this product, visit the [ArcGIS Maps SDK for JavaScript Product Life Cycle page](https://support.esri.com/en-us/products/arcgis-maps-sdk-for-javascript/life-cycle). 

## About

This sample shows how to use an attribute value as the distance when generating buffers.

## How It Works

1. Query the layer to be buffered. Add the result geometries and attributes (distances) to two arrays respectively. The query can be either server-side or client-side.

```javascript
        result.features.forEach((feature) => {
          geometries.push(feature.geometry);
          distances.push(feature.attributes.pop2000 / 10000);
        });
```

2. Pass the geometries, distances, and other parameters into the geodesicBuffer() method, which will return the result buffers as an array of Polygon. 

```javascript
        var buffer = geometryEngine.geodesicBuffer(
          geometries,
          distances,
          "kilometers",
          true
        );
```

## Related Documentation

- [geometryEngine.geodesicBuffer()](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#geodesicBuffer)
- [Query a feature layer](https://developers.arcgis.com/labs/javascript/query-a-feature-layer/)
- [Sample Code: GeometryEngine - geodesic buffers](https://developers.arcgis.com/javascript/latest/sample-code/ge-geodesicbuffer/index.html)

## Live Samples

- [Acquire Buffer Distances from a Server-Side Query](https://esri.github.io/developer-support/web-js/4.x/buffer-based-on-attributes/query_attributes_from_server_side.html)
- [Acquire Buffer Distances from a Client-Side Query](https://esri.github.io/developer-support/web-js/4.x/buffer-based-on-attributes/query_attributes_from_client_side.html)
