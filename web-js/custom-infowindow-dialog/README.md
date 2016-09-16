#Search Widget 3D

##About
This sample shows the creation of a custom identity manager using the esri/request and esri/IdentityManager classes

 Calcite Bootstrap

[Live Sample](http://esri.github.io/developer-support/web-js/custom-identity-manager/index.html)

##Usage Notes

This sample uses a beta version of Esri's [Calcite Bootstrap](http://esri.github.io/calcite-maps/samples/index.html) framework.


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
    referer: "http://brads.esri.com",
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

function usePortal() {
  arcgisUtils.createMap(webMapVal, "mapViewDiv");
}
```
