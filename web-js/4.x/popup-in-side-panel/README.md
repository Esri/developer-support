# Popup in Side Panel

## About

This sample shows how to display popups on a side panel using the [Feature](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Feature.html) widget.

## How It Works

1. Set view.popup.autoOpenEnabled to false to indicates to the Popup that it needs to disallow the click event propagation.

```javascript
var view = new MapView({
  // ...
  popup: {
    autoOpenEnabled: false,
  },
  // ...
});
```

2. Create symbols for the selected features.

```javascript
var polygonSymbol = {
  type: "simple-fill",
  style: "none",
  outline: {
    color: "cyan",
    width: 2,
  },
};

var lineSymbol = {
  type: "simple-line",
  color: "cyan",
  width: 2,
};

var pointSymbol = {
  type: "simple-marker",
  outline: {
    color: "cyan",
    width: 2,
  },
};
```

3. In view.when(), create a default graphic for when the application starts and provide the graphic to a new instance of a Feature widget.

```javascript
const graphic = {
  popupTemplate: {
    content: "Click features to show details...",
  },
};

const feature = new Feature({
  container: "sidePanel",
  graphic: graphic,
  map: view.map,
  spatialReference: view.spatialReference,
});
```

4. Listen for the click event on the View.
* Perform a hitTest on the View.
* Get the first result graphic that has a popupTemplate.
* Update the graphic of the Feature widget on click with the result.
* Set appropiate symbol for the result graphic.

```javascript
view.on("click", function (event) {
  view.graphics = [];
  // Perform a hitTest on the View
  view.hitTest(event).then(function (event) {
    // Make sure graphic has a popupTemplate
    let results = event.results.filter(function (result) {
      return result.graphic.layer.popupTemplate;
    });
    let result = results[0];
    // Update the graphic of the Feature widget
    // on click with the result
    if (result) {
      feature.graphic = result.graphic;
      let geometryType = result.graphic.geometry.type;
      if (geometryType == "polygon") {
        result.graphic.symbol = polygonSymbol;
      } else if (geometryType == "polyline") {
        result.graphic.symbol = lineSymbol;
      } else if (geometryType == "point") {
        result.graphic.symbol = pointSymbol;
      }
      view.graphics.add(result.graphic);
    } else {
      feature.graphic = graphic;
    }
  });
});
```

## Related Documentation

- [Feature widget](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Feature.html)
- [Sample Code: Feature widget - Query graphics from multiple layerViews](https://developers.arcgis.com/javascript/latest/sample-code/widgets-feature-multiplelayers/index.html)
- [Sample Code: Feature widget in a side panel](https://developers.arcgis.com/javascript/latest/sample-code/widgets-feature-sidepanel/index.html)
- [Sample Code: Feature Widget](https://developers.arcgis.com/javascript/latest/sample-code/widgets-feature/index.html)

## [Live Sample](https://esri.github.io/developer-support/web-js/4.x/popup-in-side-panel/)
