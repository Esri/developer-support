# Update the Default Color of the Sketch Widget

## About

This sample demonstrates how to change the default color of the drawing tool in the Sketch widget and how to update the highlight color for drawing symbols in 2D.

## How It Works

Select a symbol to draw in the Sketch widget, the custom color is applied to the drawing symbols and the highlight is also updated with a custom color.

1. Use `SketchViewModel` class to change the default color of the Sketch Widget.

```javascript
const sketchViewModel = new SketchViewModel({
  view: view,
  layer: graphicsLayer,
});
```

2. Create a pointSymbol, polylineSymbol, and polygonSymbol, and specify a color for each symbol. Override the default drawing symbology using `pointSymbol`, `polylineSymbol`, and `polygonSymbol` properties.

```javascript
const sketchViewModel = new SketchViewModel({
  view: view,
  layer: graphicsLayer,
  pointSymbol: pointSymbol,
  polygonSymbol: polygonSymbol,
  polylineSymbol: polylineSymbol,
});
```

3. To update the highlight for the drawing symbol, use `highlightOptions` property of the MapView to update a color.

```javascript
const view = new MapView({
  container: "viewDiv",
  map: map,
  zoom: 5,
  center: [90, 45],
  highlightOptions: {
    color: [255, 255, 0, 1],
    haloOpacity: 0.9,
    fillOpacity: 0.2,
  },
});
```

4. To remove the highlight, you can use the code snippet below to disable it on the drawing symbol.

```javascript
defaultUpdateOptions: {
              highlightOptions: {
                enabled: false,
              },
            },
```

## Related Documentation

- https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polylineSymbol
- https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polygonSymbol
- https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#pointSymbol
- https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#highlightOptions

## Live Sample

https://esri.github.io/developer-support/web-js/4.x/update-sketch-widget-color-and-highlight
