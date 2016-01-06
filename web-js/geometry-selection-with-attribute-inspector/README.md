## Attribute Inspector interacts with different geometry selections by using ArcGIS API for JavaScript

![Alt text](https://github.com/goldenlimit/developer-support/blob/AttributeSelectionJS/repository-images/geometry-selection-with-attribute-inspector.png "Screenshot of the sample code")

This is a sample that shows how to use Attribute Inspector ("esri/dijit/AttributeInspector") to work with different geometry for example, point, extent and envelope to editing feature attributes from feature service.

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)
[AttributeInspector ](https://developers.arcgis.com/javascript/jsapi/attributeinspector-amd.html)

## How to use this sample application 

This snippet code basically show two major ways that how to trigger Attribute Inspector. One way is query the click point on map, and the other way is draw geometry on map to query the features within the selection.

1. Click features on the map to trigger the attribute inspector

2. Choose one of the tools from "Draw tool" panel to create a graphic on map and attribute inspector will pop up

##Extended based on the sample
This sample is extended based on this sample [Using the attribute inspector](https://developers.arcgis.com/javascript/jssamples/ed_attribute_inspector.html)


## Features

* Shows how to use query task to return feature's geometry to populate on Attribute Inspector
* Create a tolerance for querying point when actual geometry point is on map, due to the fact that mouse click is required to fall directly on the line or point in order for a result to be returned. To makes things easier for users, you can build a “tolerance” envelope around the clicked point.

## References
[Esri blog - Querying points and lines on click with the ArcGIS JavaScript API](http://blogs.esri.com/esri/arcgis/2009/01/15/querying-points-and-lines-on-click-with-the-arcgis-javascript-api/)

NOTE: Feel free to update to this repo!

**EXPLICIT: The demo server within this sample is not intended for use for anything other than testing!**

[Live Sample](http://esri.github.io/developer-support/web-js/geometry-selection-with-attribute-inspector/index.html)

