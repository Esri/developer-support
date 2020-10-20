# Display Query Results in FeatureTable

## About

This sample generates a circle on a mouse click and selects the features in the FeatureLayer that intersect with the circle. The attributes of the selected features will then be displayed in a [FeatureTable](https://developers.arcgis.com/javascript/3/jsapi/featuretable-amd.html).

## How It Works

1. Create an attribute table using the FeatureTable class.

```javascript
var myFeatureTable = new FeatureTable(
  {
    featureLayer: myFeatureLayer,
    map: map,
    showFeatureCount: false,
    outFields: ["objectid", "type", "admn_class"],
  },
  "myTableNode"
);
```

2. Add a Circle on the map and call [Graphic.setGeometry()](https://developers.arcgis.com/javascript/3/jsapi/graphic-amd.html#setgeometry) each time the map has been clicked.

3) Select the features using [FeatureLayer.selectFeatures()](https://developers.arcgis.com/javascript/3/jsapi/featurelayer-amd.html#selectfeatures).

4) Create an array that includes the selected features' object ids, and pass this array into [FeatureTable.filterRecordsByIds()](https://developers.arcgis.com/javascript/3/jsapi/featuretable-amd.html#filterrecordsbyids) so that only the select features are displayed on the attribute table.

```javascript
map.on("click", function (evt) {
  let circle = new Circle({
    center: evt.mapPoint,
    radius: 400,
  });
  graphics.setGeometry(circle);

  query = new Query();
  query.where = "1=1";
  query.returnGeometry = false;
  query.geometry = circle;

  myFeatureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (
    features
  ) {
    let objectIds = [];
    features.forEach((feature) => {
      objectIds.push(feature.attributes.objectid);
    });
    myFeatureTable.filterRecordsByIds(objectIds);
  });
});
```

## [Live Sample](https://esri.github.io/developer-support/web-js/3.x/display-query-results-in-FeatureTable/)
