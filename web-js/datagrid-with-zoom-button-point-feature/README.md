# DataGrid with Zoom Button Using Point Features
--------------------------------------------------------------------------
# Use Case

This sample shows how to use the data from a point geometry feature layer to a Dojo DataGrid. In addition to this, there is a zoom button for each of the records in the DataGrid. Essentially, when the zoom button is selected the map zooms to the appropriate feature.

[Live Sample](http://esri.github.io/developer-support/web-js/datagrid-with-zoom-button-point-feature/index.html)

# Resources
[DataGrid With Zoom Button Sample](https://developers.arcgis.com/javascript/jssamples/fl_zoomgrid.html)

Please note that above resource uses polygon geometries

# About the Sample
* Set selection symbol that is appropriate to [point geometry](https://developers.arcgis.com/javascript/jsapi/symbol-amd.html).

```javascript

//create a symbol to display point geometry
         var highlightSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
             new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1),
             new Color([0, 255, 0, 0.25]));
```

* Re-center the map to the selected feature using Map class [centerAndZoom() method](https://developers.arcgis.com/javascript/jsapi/map.html#centerandzoom) or [centerAt() method](https://developers.arcgis.com/javascript/jsapi/map.html#centerat).

```javascript
//center at the selected feature on the map from the row in the data grid
function zoomRow(id) {
            statesLayer.clearSelection();
            var query = new Query();
            query.objectIds = [id];
            statesLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(features) {
                //re-centre map to zoom to the selected feature
                map.centerAt(features[0].geometry); //using centerAt()
                //map.centerAndZoom(features[0].geometry, 14); //using centerAndZoom()
            });
        }

```
