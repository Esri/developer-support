# How to both load WMTSLayer and ArcGISTiledMapServiceLayer together as basemap reference

## About


![Alt text](https://github.com/goldenlimit/developer-support/blob/wmtslayerJS/repository-images/WMTSLayerwithTiledLayer.JPG "Load WMTSLayer and ArcGISTiledMapServiceLayer together")

[Live Sample](http://goldenlimit.github.io/wmts-layer-with-tiledmapservice-layer/index.html)

ArcGIS JavaScript provides [WMTSLayer](https://developers.arcgis.com/javascript/3/jsapi/wmtslayer-amd.html) & [WMTSLayerInfo](https://developers.arcgis.com/javascript/3/jsapi/wmtslayerinfo-amd.html) to help users create a layer based on the OGC Web Map Tile Service layer.

Currently, we have a sample on JavaScript API page to show how to load [WMTSLayer using resource info](https://developers.arcgis.com/javascript/3/jssamples/layers_wmtslayerresourceinfo.html). However, there isn't any code or sample to show how to load both WMTSLayer and ArcGISTiledMapServiceLayer together as a mashup basemap layer. 

You may think: "Oh this is easy just add both layers on the mapview and it should work..." :expressionless:

Well, if that's the easy case, we don't need to create this sample... :sweat_smile:

This sample shows how to load both OGC Map and Esri's normal tiled mapservice together as a hybrid basemap reference.


<<<<<<< HEAD
## Usage Notes
Normally we can directly setup the proxy to load the WMTSLayer, like this way:
=======
![Alt text](https://github.com/goldenlimit/developer-support/blob/wmtslayerJS/repository-images/WMTSLayerwithTiledLayer.JPG "Load WMTSLayer and ArcGISTiledMapServiceLayer together")

[Live Sample](http://goldenlimit.github.io/wmts-layer-with-tiledmapservice-layer/index.html)
>>>>>>> origin/wmtslayerJS

```javascript
esriConfig.defaults.io.corsEnabledServers.push("YOUR WMTSLayer/application domain);
esriConfig.defaults.io.proxyUrl = "Yourproxy path";
```

However, proxy will automatically access the GetCapabilities file without passing those TileInfo and resourceInfo that we need to load for WMTSLayer to match with ArcGISTiledMapServiceLayer. This sample shows how to bypass proxy and correctly load WMTSLayer with ArcGISTiledMapServiceLayer's scheme.

The default behavior of a WMTSLayer is to execute a WMTS GetCapabilities request, which requires using a proxy page. If resourceInfo is specified a GetCapabilities request is not executed and no proxy page is required. For more information, please check our [WMTSLayer API reference](https://developers.arcgis.com/javascript/3/jsapi/wmtslayer-amd.html#wmtslayer1)


## How it works:

1. Use ArcGIS JavaScript API with [WMTSLayer](https://developers.arcgis.com/javascript/3/jsapi/wmtslayer-amd.html) & [WMTSLayerInfo](https://developers.arcgis.com/javascript/3/jsapi/wmtslayerinfo-amd.html) to restrict the OGC Layer renderer. We want to make sure that the WMTSLayer renderer style is followed by tiled map service layer's scheme, so that WMTSLayer will perfectly match with ArcGISTiledMapServiceLayer. Only in this way, both maps can display the overlay perfectly.

<br>

2. Add [TileInfo](https://developers.arcgis.com/javascript/3/jsapi/tileinfo-amd.html) Class and basically copy from your REST endpoint of your tiled map service tileinfo. For example,<b> [this REST endpoint](http://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer?f=pjson). </b>

	Then, you need to copy all tileInfo Object value from the above json file, then change the syntax so that it suits for JavaScript, here is the snippet of code to show:  

```javascript
     var tileInfo = new TileInfo({
              "dpi": 96,
              "format": "image/jpeg",
              "compressionQuality": 0,
              "spatialReference": new SpatialReference({
                "wkid": 4326
              }),
              "rows": 270,
              "cols": 270,
              "origin": {
                "x": -180,
                "y": 90
              },
              "lods": [{
                         "level": "EPSG:4326:0",
                         "resolution": 0.6651572231538215,
                         "scale": 279541132.0143589
                     },
                     {
                         "level": "EPSG:4326:1",
                         "resolution": 0.33257861157691077,
                         "scale": 139770566.00717944
                     },
                     {
                         "level": "EPSG:4326:2",
                         "resolution": 0.16628930578845538,
                         "scale": 69885283.00358972
                     }
                     ... ...
                     ]
        });
```

<<<<<<< HEAD
3. Setup the initial Extent so that prepare for the WMTSLayerInfo Object. Also, you need to STUDY the WMTSLayer XML in order to put the right parameters into the WMTSLayerInfo, for example, in the sample, we reference all those parameters based on this [wmts-getcapabilities.xml](http://v2.suite.opengeo.org/geoserver/gwc/service/wmts/?SERVICE=WMTS&REQUEST=GetCapabilities):
=======
3. Setup the initial Extent so that prepare for the WMTSLayerInfo Object. Also, you need to STUDY the WMTSLayer XML in order to put the right parameters into the WMTSLayerInfo, for exmaple, in the sample, we reference all those parameters based on this [wmts-getcapabilities.xml](http://v2.suite.opengeo.org/geoserver/gwc/service/wmts/?SERVICE=WMTS&REQUEST=GetCapabilities):
>>>>>>> origin/wmtslayerJS

	*	identifier
	*	tileMatrixSet
	*	format
	*	style


```javascript
 var tileExtent = new Extent(-61.19, -11.299, 81.64, 49.45, new SpatialReference({
          wkid: 4326
            })); 
          
        var layerInfo = new WMTSLayerInfo({
           tileInfo: tileInfo,
           initialExtent: tileExtent,
           fullExtent: tileExtent,
           identifier: "opengeo:countries",
           tileMatrixSet: "EPSG:4326",
           format: "jpeg",
           style: "_null"
        });  
```
<br>

4. The last step to prepare the WMTSLayer is creating a [WMTSResourceInfo](https://developers.arcgis.com/javascript/3/jsapi/wmtslayer-amd.html#wmtslayer1) Object in order to pass as an options when creating WMTSLayer Object

```javascript
var WMTSResourceInfo = {
          version: "1.0.0",
          layerInfos: [layerInfo],
          copyright: "Put copyright for the WMTSLayer."
        };
        
        var options = {
          serviceMode: "KVP",
          layerInfo: layerInfo,
          resourceInfo: WMTSResourceInfo
        };      
                 
       var worldWMTSLayer = new WMTSLayer("http://suite.opengeo.org/geoserver/gwc/service/wmts", options);
```

## Resources

* [ArcGIS for JavaScript API Resource Center](https://developers.arcgis.com/javascript/3/jshelp/)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)