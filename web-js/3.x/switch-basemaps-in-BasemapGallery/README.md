# Switch Maps in BasemapGallery

## About
This sample shows how to switch the basemaps in a [BasemapGallery](https://developers.arcgis.com/javascript/3/jsapi/basemapgallery-amd.html) with a button click. The BasemapGallery includes two basemaps in light theme  ("light_1" & "light_2") during initialization. By clicking the "switch" button, we can replace the light basemaps with two dark basemaps ("dark_1" & "dark_2") and vice versa.

## How It Works
1. The Light() function replaces the dark basemaps with the light basemaps for the BasemapGallery widget. 
a. Call remove() to remove the dark basemaps;
b. Call add() to add the light basemaps;
c. Call select() to set the default basemap. 
```javascript
      function Light() {
        basemapGallery.remove("dark_1");
        basemapGallery.remove("dark_2");
        basemapGallery.add(light_1);
        basemapGallery.add(light_2);
        basemapGallery.select("light_1");
        x = "light";
      }
```

2. The Dark() function does the opposite.
```javascript
      function Dark() {
        basemapGallery.remove("light_1");
        basemapGallery.remove("light_2");
        basemapGallery.add(dark_1);
        basemapGallery.add(dark_2);
        basemapGallery.select("dark_1");
        x = "dark";
      }
```

3. The "x" variable records the current basemap theme: light or dark. When clicking on the switch button, whether to call Light() or Dark() is determined by the value of "x.
```javascript
      var button = document.getElementById("button");
      if (button) {
        button.addEventListener("click", function() {
          if (x == "light") {
            Dark();
          } else if (x == "dark") {
            Light();
          }
        });
      }
```
## Related Documentation
- [BasemapGallery](https://developers.arcgis.com/javascript/3/jsapi/basemapgallery-amd.html)
- [Basemap](https://developers.arcgis.com/javascript/3/jsapi/basemap-amd.html)
- [BasemapLayer](https://developers.arcgis.com/javascript/3/jsapi/basemaplayer-amd.html)


## [Live Sample](https://esri.github.io/developer-support/web-js/3.x/switch-basemaps-in-BasemapGallery/)

