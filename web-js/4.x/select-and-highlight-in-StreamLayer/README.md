# Select and Highlight in StreamLayer

## About

This sample shows how to highlight features that have been clicked in a StreamLayer, and how to keep the highlight when the location of the features got updated.

## How It Works

1. Watch the click event of the view, and call the [hitTest()](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#hitTest) method to acquire the topmost feature.

```javascript
        view.on("click", function (event) {
          view.hitTest(event).then(function (response) {
            // ...
            // ...
            // ...
          });
        });
```

2. If a hit is made on an intersecting feature, check whether the feature comes from the StreamLayer. If so, create a [Query](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html) based on the "TrackID" value of this feature. We will execute this Query on the features with updated location later. For the track-aware stream service in this sample, "TrackID " is the Track ID field to group together all observations of a vehicle to distinguish them from the observations of a nearby vehicle.

```javascript
        view.on("click", function (event) {
          view.hitTest(event).then(function (response) {

            if (response.results.length) {

              var graphic = response.results.filter(function (result) {
                return result.graphic.layer === streamLayer;
              })[0].graphic;

              var query = new Query({
                where: "TrackID = " + graphic.attributes.TrackID,
              });
            }

            // ...

          });
        });
```

3. On the StreamLayerView, call [queryFeatures()](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-StreamLayerView.html#queryFeatures) with the Query created earlier. This will return the features that are currently on the view and where "TrackID" matches the clicked feature. 

```javascript
        view.on("click", function (event) {
          view.hitTest(event).then(function (response) {

            // ...

            view.whenLayerView(streamLayer).then(function (layerView) {
              layerView.watch("updating", function (val) {
                if (!val) {
                  layerView.queryFeatures(query).then(function (results) {
                    layerView.highlight(results.features);
                  });
                }
              });
            });

          });
        });
```


## Related Documentation

- [StreamLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-StreamLayer.html)
- [StreamLayerView.queryFeatures()](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-StreamLayerView.html#queryFeatures)
- [MapView.hitTest()](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#hitTest)
- [Query](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html)


## [Live Sample](https://esri.github.io/developer-support/web-js/4.x/select-and-highlight-in-StreamLayer/)
