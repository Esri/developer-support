# Projection using geometryService and webMercatorUtils

## About

This sample shows how to project between different spatial references using geometryService.project() and webMercatorUtils.geographicToWebMercator()

## How It Works

Select a point on the Equal Earth projection map. The point will then be projected into WGS84 then Web Mercator.

### Using geometryService.project()

1. Define your ProjectParameters

```javascript
var projectParameters = new ProjectParameters();
projectParameters.geometries = [point];
projectParameters.outSpatialReference = outSR;
```

2. Call geometryService.project() which returns a promise of an array of all projected geometries. Obtain the longitude/latitude values from the projected output.

```javascript
geometryService.project(geoServiceURL, projectParameters)
    .then((projectedOutput) => {
        var long = projectedOutput[0].longitude;
        var lat = projectedOutput[0].latitude;
        ...
    });
```

### Using webMercatorUtils.geographicToWebMercator()

3. Convert the output results from geometryService.project() to WebMercator

```javascript
var webMercatorGeometry = webMercatorUtils.geographicToWebMercator(
  projectedOutput[0]
);
```

## Related Documentation

- [geometryService.project()](https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-geometryService.html#project)
- [webMercatorUtils.geographicToWebMercator()](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-support-webMercatorUtils.html#geographicToWebMercator)
- [ProjectParameters] (https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-ProjectParameters.html)

## Live Samples
https://esri.github.io/developer-support/web-js/4.x/projection_geometryService_webMercatorUtils