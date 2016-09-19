#Custom Identity Manager

[Live Sample](http://esri.github.io/developer-support/web-js/custom-identity-manager/index.html)

##About

This sample shows the creation of a custom identity manager using the [esri/request](https://developers.arcgis.com/javascript/3/jsapi/esri.request-amd.html) and [esri/IdentityManager](https://developers.arcgis.com/javascript/3/jsapi/identitymanager-amd.html) classes to load a secured ArcGIS.com web map.

While this sample uses a beta version of Esri's [Calcite Bootstrap](http://esri.github.io/calcite-maps/samples/index.html) framework, the logic can be implemented with various other frameworks.

##Usage Notes

The sign-in form has an input for the secured ArcGIS.com web map id you'd like to display.  Replace the default value with your own web map id.  To obtain the ID, navigate to the details page for the web map. The web map's ID is the value at the end of the URL of the details page. For example, for the Topographic map with the details URL [http://www.arcgis.com/home/item.html?id=d5e02a0c1f2b4ec399823fdd3c2fdebd](http://www.arcgis.com/home/item.html?id=d5e02a0c1f2b4ec399823fdd3c2fdebd), the ID is d5e02a0c1f2b4ec399823fdd3c2fdebd.  For more information, please see the [Working with Web Maps](https://developers.arcgis.com/javascript/3/jshelp/intro_webmap.html) documentation.

When deploying, be sure to change the referrer on line 38 to the web server's domain:

```javascript
  referer: "<web server domain>"
```

##How it works:
The following snippets highlight the important portions of the code.

```javascript
//generate a token based on username and password
var requestHandle = esriRequest({
  url: "https://www.arcgis.com/sharing/rest/generateToken",
  content: {
    request: "generateToken",
    username: usrVal,
    password: pwdVal,
    //when deploying, change referrer to web server's domain
    referer: "http://esri.github.io/",
    f: "json"
  },
  handleAs: "json",
}, {
  usePost: true
});

requestHandle.then(requestSucceeded, requestFailed);

//if succeeds, register token
function requestSucceeded(evt) {
  console.log(evt);

  IdentityManager.registerToken({
    expires: evt.expires,
    server: "http://www.arcgis.com/sharing/rest",
    ssl: evt.ssl,
    token: evt.token,
    userId: usrVal
  });
  return usePortal();
}

//load the secured resource
function usePortal() {
  arcgisUtils.createMap(webMapVal, "mapViewDiv");
}
```
