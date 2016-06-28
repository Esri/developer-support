# Static Maps API - ArcGIS

This class allow you to add static images using a print service. By default ArcGIS Online **free service** is used but you can also add an ArcGIS Server service.

```javascript
require([
    "esriES/staticmap",
    "dojo/domReady!"
], function(StaticMap) {
    staticMap = new StaticMap();

    var options={
        basemap: "streets",
        zoom: 5,
        address: "Balcon de Europa, Nerja",
        size: [400, 300],
        markers:[
            {
                latitude: 36.744426,
                longitude: -3.875497,
                color: "orange",
                yoffset: 10
            },
            {
                latitude: 36.745053,
                longitude : -3.877257,
                color: "purple"
            }
        ],
        format: "JPG"
    };

    staticMap.getImage(options).then(function(imageURL){
        // Print the image
    });

});
```

Parameters:

Param| Type | Default value | Summary
--- | --- | --- | ---
basemap|string|topo|Allowed: satellite, topo, light-gray, dark-gray, streets, hybrid, oceans, national-geographic, osm
zoom|int|5|Allowed: from 1 to 15
latitude|double|40.432781|Allowed: -90 <= x >= 90 (map center)
longitude|double|-3.626666|Allowed: 180 <r= x >= 180 (map center)
address|string|None|This uses the single address API (no credits consuming) (map center)
markers|array of markers objects|None|Bellow you will find another table with the description
size|array of int|[300,300]|Any
format|string|PNG32|Allowed: PDF, PNG32, PNG8, JPG, GIF, EPS, SVG, SVG2

To center the map you must use: *address* **OR** *latitude and longitude*, never both.

Markers properties:

Param| Type | Default value | Summary
--- | --- | --- | ---
latitude|double|None|Allowed: -90 <= x >= 90
longitude|double|None|Allowed: 180 <r= x >= 180
color|string|None|Available at this time: orange|purple
xoffset|int|0|X Offset of the marker
yoffset|int|0|Y Offset of the marker

## Configure dojoConfig

You need to configure dojoConfig like this:
```javascript
var dojoConfig = (function(){
    var base = location.href.split("/");
    base.pop();
    base = base.join("/");
    return {
        async: true,
        isDebug: true,
        packages:[{
            name: 'esriES', location: base + '/js'
        }]
    };
})();
```

In order to make it work. You can check the [demo](http://esri-es.github.io/Static-Maps-API-ArcGIS/) and [code here](https://github.com/esri-es/Static-Maps-API-ArcGIS/blob/master/index.html).

## Setup a different print service

If you want to use your own ArcGIS Server instance you can do it like this:

```javascript
require([
    "esriES/staticmap",
    "dojo/domReady!"
], function(StaticMap) {
    staticMap = new StaticMap({
        printService: "http://<your-domain>/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    });
    ...
});
```
# Browser support

It should work at any browser.

# Related project
You can find a script written in Node.js inside the repo [Static-Map-Service-ArcGIS](https://github.com/esri-es/Static-Map-Service-ArcGIS) that you can use to load static maps if you are not planning to use the [ArcGIS Javascript API](js.arcgis.com).
