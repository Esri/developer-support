# Enable Popups on a ArcGISDynamicMapServiceLayer
-------------------------------------------------------------------------------------

## Use Case
This sample shows how to enable popups with a ArcGISDynamicMapServiceLayer. This is just one of the possibilities to enable popups.

[ArcGISDynamicMapServiceLayer Popups Live Sample](http://esri.github.io/developer-support/web-js/dynamic-layer-popups/)

## About the sample
First thing we want to use the InfoTemplate class to define the information that will be added to the popup.

```javascript
var popupTemplate = new InfoTemplate();
           popupTemplate.title = "<b>${AREANAME}<b/>"
               //Format the content as an HTML string. You will need to add entries for each attribute you wish to show.
           popupTemplate.content = "<b>City Name:</b> ${AREANAME} <br />" +
               "<b>Classification:</b> ${CLASS} <br />" +
               "<b>State:</b> ${ST} <br />" +
               "<b>Population:</b> ${POP2000}";
```

Next we want to use the identify task to retrieve information about the features in layer 0 of the Dynamic Map Service

```javascript
var identifyTask = new IdentifyTask("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer");
           var identifyParams = new IdentifyParameters();
           identifyParams = new IdentifyParameters();
           identifyParams.tolerance = 3;
           identifyParams.returnGeometry = true;
           identifyParams.layerIds = [0];
```

We will store the features returned by the identifyTask in an array, loop through those features in the feature set, and set the infoTemplate property for each feature to the popupTemplate that was created.

```javascript
              identifyTask.execute(identifyParams, function(results) {
                  var features = [];
                  //clear the features that are currently displayed in the info window
                  map.infoWindow.clearFeatures();
                  for (var i = 0; i < results.length; i++) {
                      results[i].feature.setInfoTemplate(popupTemplate);
                      //push the feature to the features array
                      features.push(results[i].feature);
                  }
                  //call the setFeatures function
                  setFeatures(features, evt.mapPoint);
              });
```

Next we'll check to see if any of the the features were returned. If so, lets display the infoWindow.

```javascript
          function setFeatures(features, point) {

              if (features.length > 0) {
                  //populate the infoWindow with the selected features
                  map.infoWindow.setFeatures(features);
                  //display the infoWindow where the map was clicked
                  map.infoWindow.show(point);
              }
              //if not, hide the infoWindow
              else {
                  map.infoWindow.hide();
              }
          }
```
