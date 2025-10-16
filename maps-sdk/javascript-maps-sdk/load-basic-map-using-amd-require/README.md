# Load a basic 2D map using AMD require

## About

Traditionally, require has been the go-to method for asynchronous module loading, adhering to the AMD (Asynchronous Module Definition) specification. Starting in ArcGIS Maps SDK for JavaScript version 4.32, a new way of loading AMD modules via CDN was introduced. For more information on this new approach, please refer to the following resources:
- [Introduction in 4.32](https://developers.arcgis.com/javascript/latest/4.32/#module-loading-via-cdn)
- [Module loading via CDN](https://developers.arcgis.com/javascript/latest/get-started/#cdn)

This sample serves as a template reflecting the structure of applications created in earlier versions. However, it is not the recommended approach for current development. The JavaScript ecosystem is continually evolving, and this feature may become obsolete in future SDK versions. It is advisable to keep your application up-to-date. If you would like to learn more about retired versions of this product, visit the [ArcGIS Maps SDK for JavaScript Product Life Cycle page](https://support.esri.com/en-us/products/arcgis-maps-sdk-for-javascript/life-cycle). 

## Code Snippet

```javascript
require([ "esri/Map", "esri/views/MapView" ], (Map, MapView) =>
{
    const map = new Map(...);
    const view = new MapView(...);
});
```

## Live Samples
- [Load a basic 2D map using AMD require](https://esri.github.io/developer-support/maps-sdk/javascript-maps-sdk/load-basic-map-using-amd-require)