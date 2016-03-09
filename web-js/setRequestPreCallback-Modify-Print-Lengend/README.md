#USING setRequestPreCallback Function

This sample uses [esriRequest.setRequestPreCallback()](https://developers.arcgis.com/javascript/jsapi/esri.request-amd.html#esrirequest.setrequestprecallback)
to modify the parameters that are sent out to print task in Web_Map_as_JSON request and modifies the Legend Layer Name displayed on the print output.

##Requirements
* You will need to [set up a proxy page](http://blogs.esri.com/esri/supportcenter/2015/04/07/setting-up-a-proxy/) in order to get print widget to work.

##Function Highlights and Explanation
* Function Intercepts every request sent to server which includes "execute" (Print Task)
* Grabs the JSON Text from Web_Map_as_JSON
* Converts string to an object using JSON.parse()
* Tweak the layer name inside Layer Definition.
* Convert the object back to JSON String using JSON.stringify()
* Return this to the request that is being sent.
* This will now get sent to the server to get the print output.

##Important Code
```javascript
function myCallbackFunction(ioArgs) {
                // inspect ioArgs to see if we sent execute request
                if (ioArgs.url.indexOf("execute") > -1) {
                    //Store webmapAsJson request in the variable                   
                    var jsontxt = ioArgs.content.Web_Map_as_JSON;
                    //Create a Json object          
                    var tempObj = JSON.parse(jsontxt);
                    //Access the name property to change it.
                    //Make sure you include at least space, Do not keep it empty.
                    tempObj.operationalLayers[1].featureCollection.layers[0].layerDefinition.name = "CHANGED THE LAYER NAME";
                    //Convert Json object to string
                    var modjson = JSON.stringify(tempObj);
                    //assign the string back to WebMapAsJson
                    ioArgs.content.Web_Map_as_JSON = modjson;
                    // don't forget to return ioArgs.
                    return ioArgs;
                } else {
                    return ioArgs;
                }
            } 

```
##[Live Sample](http://esri.github.io/developer-support/web-js/setRequestPreCallback-Modify-Print-Lengend/ModifyPrintLegend_preCallback.html)