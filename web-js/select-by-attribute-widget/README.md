#Select by Attributes Widget

##About
This widget attempts to recreate ArcMap's select by attributes tool as accurately as possible within a JavaScript application. This widget only works with feature layers and these must be passed to the widget's constructor as an array.

[Select by Attribute Widget Sample](https://dl.dropboxusercontent.com/u/79881075/SelectByAtt/index.html)

##Usage notes:
The following code snippets show how to use the widget in your application

Configure the dojo loader to pull from the widget's location:
```html
<script type="text/javascript">
    var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
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
	"application/js/AttributeSelection"
], function(Map, SelectByAtt){

```
Create an html element to attach the widget to:
```html
<div id="attributeSelection"></div>
```

Instantiate the widget and call the startup method once the feature layers have been added to the map:
```javascript
map.on("layers-add-result", function () {
	myWidget = new SelectByAtt({
		map: map,
		layers: [layer1, layer2]
	}, "attributeSelection");
	myWidget.startup();
});

##Constructor
SelectByAtt(options, "Html Element Id")
options = {
	map: <Map object>
	layers: <FeatureLayer []>
}

##Properties:
String currentAttribute = The currently selected attribute.
FeatureSet currentResults = The results of the most recent query.
FeatureLayer[] layers = The list of feature layers used by the widget.
Map map = The map object the widget is associated with.
String[] queryList = The list of saved queries.

##Methods:
applyQuery() - Submits the query but does not close the widget.
addLayers(FeatureLayer[]) - Adds the pushes the feature layers in the array onto the current layer list.
clearQuery() - Clears the query text field of the widget.
getHelp() - Opens an SQL syntax reference document in a new browser tab.
hide() - Hides the widget.
loadQuery() - Load the most recent saved query from memory and adds it to the query area. Clicking this button again will load the second most recent query, etc.
removeLayers(FeatureLayer[]) - Removes the feature layers in the array from the current layer list.
saveQuery() - Pushes the current query to the widget's query array.
show() - Makes the widget visible.
submitQuery() - Submits the current query and closes the widget.
verifyQuery() - Checks to see if the current query is valid.