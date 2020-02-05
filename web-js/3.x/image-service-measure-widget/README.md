# How to implement ImageServiceMeasure widget

## About

ArcGIS JavaScript provides an ImageServiceMeasure widget from v3.14. However, there isn't any practical sample to show how to use this widget. Plus, the current [online documentation](https://developers.arcgis.com/javascript/jsapi/imageservicemeasure-amd.html) for this widget is not addressed correctly. And we already logged an enhancement bug [ENH-000094580 Incomplete documentation for ImageServiceMeasure widget]


This sample shows how to use this widget correctly


![Alt text](https://github.com/goldenlimit/developer-support/blob/imageWidgetJS/web-js/image-service-measure-widget/screenshot.JPG "ImageServiceMeasure widget")

[Live Sample](https://goldenlimit.github.io/image-service-measure-widget/index.html)


## Usage Notes

In order to appropriately running this widget, it is better to startup the widget after the imageService layer loaded. 


## How it works:

The following snippets highlight the important portions of how to initialize the widget.

This widget contains an instance of the [ImageServiceMeasureToolbar](https://developers.arcgis.com/javascript/jsapi/imageservicemeasuretool-amd.html) in the [measureToolbar property](https://developers.arcgis.com/javascript/jsapi/imageservicemeasure-amd.html#measuretoolbar). This property exposes the methods and events available in the ImageServiceMeasureToolbar to an instance of this widget so you can work with the result of the measure operation programmatically.

Constrcut an ImageServiceMeasure widget needs two parts, one is ImageServiceMeasureTool:

```javascript
require([
  "esri/map", "esri/dijit/ImageServiceMeasure", "esri/toolbars/ImageServiceMeasureTool", ... 
], function(Map, ImageServiceMeasure, ImageServiceMeasureTool, ... ) {
  var map = new Map( ... );
  var imageMeasureTool = new ImageServiceMeasureTool({
    map: map,
    layer: imageServiceLayer
  },"ism");
});
```

The other part is ImageServiceMeasure:

```javascript
var ism = new ImageServiceMeasure({
    layer: imageServiceLayer,
    lineSymbol: sls,
    map: map
}, "ism");
ism.startup();
```
## Resources

* [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Anyone and everyone is welcome to contribute.