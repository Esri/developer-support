Using EsriRequest setPreCallback function.
1. This sample demonstrates how to add a parameter to a request before it is sent out to server.
2. In this case FindAddressCandidate uses countryCode to restrict the results given back from the geocode to specified country.
3.  Each find address candidate request will look like following.

http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=London&f=json&outSR=%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D&maxLocations=6&countryCode=USA

E.g Try Searching for London you will get the geocoder to locate at London Ohio, USA and not London, GBR.

Thanks,
Akshay H

[Live Sample](http://esri.github.io/developer-support/web-js/Using-setRequestPreCallback-function/PreCallback_findAddressCandidates.html)
