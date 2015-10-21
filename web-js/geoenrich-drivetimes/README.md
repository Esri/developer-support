#Geoenrich Drive Time Areas - ArcGIS API for JavaScript 

Did you know that Esri's geoenrichment service has built in support for Network analysis and Geocoding?  
These capabilities are directly included in the service.  
In addition, the service is designed to expand your data collection to include geographically 
correct content providing new insights involving Market Potential, Spending, Population and Age 
and many other demographic datapoints.  This sample
shows you how to click on an area of interest and return back 5,10 and 15 minute drive times which include 
Key Global Facts data revealing population statistics .ie total population, total population of females
 and total population of males.

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)

[PopupTemplate Class](https://developers.arcgis.com/javascript/jsapi/popuptemplate.html)

[smartMapping for createClassedColorRenderer and createColorRenderer](https://developers.arcgis.com/javascript/jsapi/esri.renderers.smartmapping-amd.html)

[HTTP requests](https://developers.arcgis.com/javascript/jsapi/esri.request-amd.html)

## Features

* Shows how to craft geoenrichment HTTP requests to fetch Key Global Fact data inside drive time areas 
* Uses smart mapping to easily make nice looking maps
* Shows how to configure a popup in a meaningful way given a Geoerichment response


NOTE: This sample should include OAuth Functionality (named user or application pattern).  
Currently, it does not and relies on a hard coded token with a fallback being the JSAPI Identity Manager prompt. 

[Live Sample](http://esri.github.io/developer-support/web-js/geoenrich-drivetimes/index.html)
