# Get Polygon Centroids

## About

This sample shows how to acquire polygon centroids from a FeatureLayer and display the centroids on the map.s

## How It Works

1. Query the FeatureLayer with returnCentroid set to true.

```javascript
var query = featureLayer.createQuery();
query.where = "1 = 1";
query.outFields = ["objectid", "state_abbr"];
query.returnCentroid = true;
```

2. Store the query response to Graphics, and load the Graphics into a GraphicsLayer.

```javascript
featureLayer.queryFeatures(query)
  .then(function (response) {
    response.features.forEach(feature => {
      var graphic = new Graphic({
        geometry: feature.geometry.centroid,
        symbol: centroidSymbol,
        attributes: feature.attributes
      });
      graphicsLayer.add(graphic);
    });
```

3. Add the GraphicsLayer to the map.

```javascript
map.add(graphicsLayer);
```

4. If needed, create a FeatureLayer based on the GraphicsLayer.

```javascript
var centroidFeatureLayer = new FeatureLayer({
  source: graphicsLayer.graphics,
  objectIdField: "objectid",
  fields: [
    {
      name: "objectid",
      type: "oid",
    },
    {
      name: "state_abbr",
      type: "string",
    },
  ],
  title: "Centroid FeatureLayer",
});
map.add(centroidFeatureLayer);
```

## Related Documentation

- [Query.returnCentroid](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html#returnCentroid)
- [FeatureLayer.queryFeatures()](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#queryFeatures)
- [GraphicsLayer.add()](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html#add)

## [Live Sample](https://esri.github.io/developer-support/web-js/4.x/get-polygon-centroids/)
