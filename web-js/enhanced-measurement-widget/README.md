#Enhanced Measurement Widget
![This is where an GIF should be. Sorry you can't see it. Try using Chrome](EnhancedMeasurementWidget.gif "Application Demo")

##About
This widget subclasses the default Measurement Widget included in the JavaScript API. It measures the distance of each line segment drawn with the distance and area tools using the currently selected distance unit. These distances are displayed in the map as text symbols. The text symbols are added to a separate graphics layer and can use a user defined text symbol via a method included in the widget. The idea for this widget came from a several questions from customers asking how to recreate functionality found in the WebADF API.

##Usage notes:
Due to a bug with the base Measurement widget I reported when developing this widget, the EnhancedMeasure widget requires the use of version 3.15 of the ArcGIS Javascript API or higher. The following code snippets show how to use the widget in your application

Configure the dojo loader to pull from the widget's location:
```html
<script type="text/javascript">
    var dojoConfig = {
        packages: [{
            name: "application",
            location: "<path to the widget>"
        }]
    };
</script>

```
Include the widget in your require statement:
```javascript
require([
	"esri/map",
	"application/js/EnhancedMeasure"
], function(Map, SelectByAtt){

```
Create an html element to attach the widget to:
```html
<div id="enhancedMeasure"></div>
```

Instantiate the widget and call the startup method. As this widget extends the Measurement widget any of the methods and constructor options available in the base widget are available to the EnhancedMeasure widget.
```javascript
var measurement = new EnhancedMeasure({
	map: map,
	symbolFont: textSymbol 
}, dom.byId("measure"));
measurement.startup();
```
Constructor:<br/>
SelectByAtt(options, "Html Element Id")<br/>
options = {<br/>
	symbolFont: TextSymbol object<br/>
	map: Map object - required (inherited from Measurement.js)<br/>
	advancedLocationUnits: Boolean (inherited from Measurement.js)<br/>
	defaultAreaUnit: Units enum (inherited from Measurement.js)<br/>
	geometry: Point, Line, or Polygon object (inherited from Measurement.js)<br/>
	lineSymbol: SimpleLineSymbol object (inherited from Measurement.js)<br/>
	pointSymbol: MarkerSymbolObject (inherited from Measurement.js)<br/>
}<br/>

Methods:<br/>
setFontObject() - Change the TextSymbol used to label line segements<br/>
clearResult() - Remove the measurement graphics and results (inherited from Measurement.js)<br/>
destroy() - Destroy the widget (inherited from Measurement.js)<br/>
getTool() - Returns the current toolName and unitName (inherited from Measurement.js)<br/>
getUnit() - Returns the current measurment unit of the active tool (inherited from Measurement.js)<br/>
hide() - Hide the widget (inherited from Measurement.js)<br/>
hideTool(toolName string) - Hides the specified tool (inherited from Measurement.js)<br/>
measure(Geometry object) - Measure the input geometry (inherited from Measurement.js)<br/>
setTool(toolName string, Boolean) - Activate or deactivate the tool (inherited from Measurement.js)<br/>
show() - Makes the widget visible (inherited from Measurement.js)<br/>
startup() - Create the widget (inherited from Measurement.js)<br/>
