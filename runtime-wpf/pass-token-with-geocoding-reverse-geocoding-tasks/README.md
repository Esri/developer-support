## Pass token to locator task for geocoding and reverse geocoding 

This sample code is a demo on how to pass token to geocoding and reverse geocoding service on AGOL. This is a requirement if one want to store the geometry. "According to ArcGIS REST API, 
"Applications are contractually prohibited from storing the results of single geocode transactions. This restriction applies to the Find, findAddressCandidates, 
and reverseGeocode methods. However, by passing the forStorage parameter with value "true" in a geocode request, a client application is allowed to store the results."
   
     
Author: Shriram Bhutada
     
    
[forStorage](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find.htm)

