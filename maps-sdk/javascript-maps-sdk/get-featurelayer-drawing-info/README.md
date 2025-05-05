# Get Feature Layer's drawingInfo

## About

This tool allows the user to obtain the drawingInfo of their FeatureLayer.

## How It Works

Find the ArcGIS Online portal item ID for a feature layer. Paste it into the input and select "+ Set layer". The item's drawingInfo will appear under the results.

This tool is useful when the service-level drawingInfo is different than the item-level drawingInfo.

### Using geometryService.project()

1. Create a featureLayer with associated portalID

```javascript
const mapElement = document.querySelector("arcgis-map");
var map = mapElement.map;
...
  var featureLayer = new FeatureLayer({
      portalItem: {
          id: val,
      },
  });
  mapElement.addLayer(featureLayer);
...
```

2. Wait for featureLayer class to be created, then obtain the drawingInfo

```javascript
featureLayer.when(() => {
...
    JSON.stringify(
      featureLayer.toJSON().layerDefinition.drawingInfo
    )
...
});
```

3. (OPTIONAL) Add API key to grant access to secured ArcGIS Online services

```javascript
esriConfig.apiKey = "API KEY GOES HERE";
```

## Related Documentation

- [FeatureLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html)

## Live Samples
https://esri.github.io/developer-support/maps-sdk/javascript-maps-sdk/get-featurelayer-drawing-info