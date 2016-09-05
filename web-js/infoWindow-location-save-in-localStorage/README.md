# Center the map based on last infoWindow location 

## About

ArcGIS JavaScript provides infoTemplate to transform [Graphic.attributes](https://developers.arcgis.com/javascript/jsapi/graphic-amd.html#attributes) into an HTML representation. However, there isn't any practical sample to show how Esri JavaScript API can based on infoWindow's location to dynamically center map in browser. 

This sample shows how to dynamically change map center based on the last open infoWindow's location.


![Alt text](https://github.com/goldenlimit/developer-support/blob/localStorage/web-js/infoWindow-location-save-in-localStorage/infoWindow_localStorage.png "InfoWindow location in localStorage")

[Live Sample](https://goldenlimit.github.io/infoWindow-location-save-in-localStorage/index.html)


## Usage Notes

This sample is experimental and may not work on all browsers. Visit [caniuse.com](https://caniuse.com/) to determine if the web storage capabilities used in this sample are available for your browser.


## How it works:

This sample uses HTML5 Web Storage, often called local storage. Use a feature layer that enable infoTemplate to allow infoWindow popup when click features on the map. 

Add an event handler when infoWindow is visible. Then convert the infoWinodw location from Web Mercator to latitude and longitude point:

```javascript
map.infoWindow.on("show", function(){
            var infowindowPointX = map.infoWindow.location.x;
            var infowindowPointy = map.infoWindow.location.y;
            var infowindowPoint = webMercatorUtils.xyToLngLat(infowindowPointX,infowindowPointy);
            window.localStorage.setItem("infoWindowLocation",dojo.toJson(infowindowPoint));
            console.log(infowindowPoint);
        });
```

When the application loads, it checks local storage to see if there is a stored location capture from infoWindow in previous session with the key "infoWindowLocation". Values are stored in local storage as strings, so we need to conver this value to JSON, since [Esri JavaScript Point](https://developers.arcgis.com/javascript/jsapi/point-amd.html#point3) object allow JSON object.
```javascript
if (window.localStorage.getItem("infoWindowLocation")){
            console.log('Find InfoWindowLocation from local storage' + window.localStorage.getItem("infoWindowLocation"));
            var centerPoint = new Point(JSON.parse(window.localStorage.getItem("infoWindowLocation"))[0], JSON.parse(window.localStorage.getItem("infoWindowLocation"))[1]);
            map.centerAt(centerPoint);
            featureLayer.on("load", displayMapCenter);
        }; 
```


## Resources

* [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
* [Local storage - experimental](https://developers.arcgis.com/javascript/jssamples/exp_localstorage.html)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)

