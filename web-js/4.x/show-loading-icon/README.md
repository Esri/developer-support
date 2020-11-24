# Show Loading Icon

## About

For layers with a large number of features and details, sometimes it might take a bit while for them to be fully drawn on the view. This sample shows how to display a loading icon to indicate whether the view is updating. 

## How It Works

1. Create a CSS loader class for the loading icon.
```css
    .loader {
      position: absolute;
      top: 50%;
      left: 50%;
      border: 20px solid #f3f3f3;
      border-radius: 50%;
      border-top: 20px solid blue;
      border-right: 20px solid green;
      border-bottom: 20px solid red;
      width: 60px;
      height: 60px;
      -webkit-animation: spin 2s linear infinite;
      animation: spin 2s linear infinite;
    }

    @-webkit-keyframes spin {
      0% {
        -webkit-transform: rotate(0deg);
      }

      100% {
        -webkit-transform: rotate(360deg);
      }
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }
```

2. Place a loader in the HTML body. 
```html
<body>
  <div id="viewDiv">
    <div class="loader" id="loader_0"></div>
  </div>
</body>
```

3. Use the watchUtils class to watch the value of view.updating. Show the loader if view.updating is true, and hide if false.

```javascript
      watchUtils.whenTrue(view, "updating", function (evt) {
        $("#loader_0").show();
      });

      watchUtils.whenFalse(view, "updating", function (evt) {
        $("#loader_0").hide();
      });
```

## Related Documentation


- [How TO - CSS Loader](https://www.w3schools.com/howto/howto_css_loader.asp)
- [jQuery Selectors](https://www.w3schools.com/jquery/jquery_selectors.asp)
- [jQuery Effects - Hide and Show](https://www.w3schools.com/jquery/jquery_hide_show.asp)
- [watchUtils.whenTrue](https://developers.arcgis.com/javascript/latest/api-reference/esri-core-watchUtils.html#whenTrue)
- [watchUtils.whenFalse](https://developers.arcgis.com/javascript/latest/api-reference/esri-core-watchUtils.html#whenFalse)
- [MapView.updating](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#updating)



## [Live Sample](https://esri.github.io/developer-support/web-js/4.x/show-loading-icon/)
