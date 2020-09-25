# Create a FeatureLayer Based on Current Location

## About

The ArcGIS API for JavaScript 4.x provides an out-of-the-box [Locate widget](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Locate.html) that animates the [View](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html) to the user's current location. This sample shows how to display the user's current location on the map using the Geolocation API and FeatureLayer instead of the Locate widget.  

## How It Works

1. Acquire the user's current location using the getCurrentPosition() method.

```javascript
      view.when(() => {
        navigator.geolocation.getCurrentPosition(showPosition);
      });
```

2. Create a point Graphic based on the result from getCurrentPosition().

```javascript
        var pointGraphic = new Graphic({
          geometry: {
            type: "point",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
```

3. Create a FeatureLayer based on the point Graphic if you need to label the location point.

```javascript
        var layer = new FeatureLayer({
          source: [pointGraphic],
          fields: [{
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid"
          }],
          objectIdField: "ObjectID",
          title: "Located Point",
          popupEnabled: false,
          labelingInfo: {
            labelExpressionInfo: {
              expression: "'You Are Here'"
            },
            labelPlacement: "below-center"
          }
        });
```

## Related Documentation


- [Geolocation Object](https://www.w3schools.com/JSREF/api_geolocation.asp)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [FeatureLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html)
- [Graphic](https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html)
- [Locate Widget](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Locate.html)
- [Sample Code: Locate Widget](https://developers.arcgis.com/javascript/latest/sample-code/widgets-locate/index.html)


## [Live Sample](https://esri.github.io/developer-support/web-js/4.x/current-location-FeatureLayer/)
