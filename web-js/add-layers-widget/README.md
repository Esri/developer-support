#Add Layers Widget

##About
This widget allows users to add layers to the map on the fly. Simply select the appropriate layer type, paste in a url, select the desired layer options and add the layer to the map.

[Live Sample](https://nhaney90.github.io/add-layers-widget/index.html)

##Usage notes:
All layers added to the above sample must use "https". The following code snippets show how to use the widget in your application.

Import the bootstrap.css and addLayers.css stylesheets as well as jquery and bootstrap.js. All of these are needed for the widget to work:
```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" >
<link rel="stylesheet" type="text/css" href="css/AddLayers.css">

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
```

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
	"application/js/AddLayers"
], function(Map, AddLayers){

```
Some layers require the use of a proxy to display. Set the default proxy url to be used in your application:
```javascript
esriConfig.defaults.io.proxyUrl = "<url_to_proxy>"
esriConfig.defaults.io.alwaysUseProxy = false;
```

Create an html element to attach the widget to:
```html
<div id="addLayers"></div>
```

Instantiate the widget and call the startup method once the map has fully loaded:
```javascript
var addLayers = new AddLayers({
	map: map
}, "addLayers");
map.on("layer-add-result", function() {
	addLayers.startup();
});
```

##Supported Layer Types:
ArcGISDynamicMapServiceLayer<br/>
ArcGISTiledMapServiceLayer<br/>
ArcGISImageServiceLayer<br/>
FeatureLayer<br/>
WFSLayer<br/>
WMSLayer<br/>
WMTSLayer<br/>
KMLLayer<br/>
CSVLayer<br/>
GeoRSSLayer

<b>Constructor:</b><br/>
SelectByAtt(options, "Html Element Id")<br/>
options = {<br/>
	map: Map object<br/>
	zoomToLayer: Boolean</br>
}<br/>

<b>Properties:</b><br/>
Map map = The map object the widget is associated with.<br/>
Boolean zoomToLayer = Indicates whether the map will zoom to the full extent of the added layer

<b>Methods:</b><br/>
hide() - Hides the widget.<br/>
show() - Makes the widget visible.<br/>
zoomToLayer(Boolean) - Set the zoom behavior the map when a new layer is added. Note in some cases the map will not be able to zoom to the extent of the layer.
