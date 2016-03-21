#Web Tiled Layer in the Basemap Gallery widget

##Background
This sample shows how to add a [WebTiledLayer](https://developers.arcgis.com/javascript/jsapi/webtiledlayer-amd.html) to the basemap gallery widget.

What is a Web Tiled Layer? Funny you should ask!
A Web Tiled Layer is non-ArcGIS Server map tiles.
They usually follow a pattern of http://some.domain.com/${level}/${col}/${row}/ where level corresponds to a zoom level, and column and row represent tile column and row, respectively. This pattern is not required, but is the most common one on the web currently.

##Specifics

This sample is using the Open Cycle Web Tiled layer.
```html
Open Cycle Map:
http://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png


```

##Usage notes:

Remember to specify the [type](https://developers.arcgis.com/javascript/jsapi/basemaplayer-amd.html#type) property in the BasemapLayer constructor

```javascript
//Create an array to hold the basemap and basemap layers
var basemaps = [];
           var map1 = new Basemap({
               title: "WTL",
               layers: [
                   new BasemapLayer({
                       url: "http://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                       subDomains: ["a", "b", "c"],
                       copyright: "Open Cycle Map",
                       //specifying the type is required
                       type: "WebTiledLayer"
                   })
               ],
               id: "Open Cycle Map"
           });
           basemaps.push(map1);

```

```javascript
//add the Web Tiled Layer to the BasemapGallery
var gallery = new BasemapGallery({
                 showArcGISBasemaps: true,
                 basemaps: basemaps,
                 map: map
             },
             "basemapGallery");
         gallery.startup();
     });
```
