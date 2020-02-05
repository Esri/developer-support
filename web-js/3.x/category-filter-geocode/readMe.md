# Single output from World Geocoding Service

## About
This sample will show how to return the results of one locator from the World Geocoding Service.
## ArcGIS Online World Geocode
The [ArcGIS Online World Geocoding Service](https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm) is a composite geocoding serivice which means that it will contain multiple address locators. In turn, when consumed in an application it will return numerous addresses based on the matches of multiple locators.

## Prerequisites
In order to determine which locator you would like to use, we need to make a rest call to see which locators are returned. In the [findAddressCandidates](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm) REST request add outFields=*. This will return the Loc_Name (locator name).

```html
Example:
http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=380+New+York+Street%2C+Redlands%2C+CA+92373&category=&outFields=*&forStorage=false&f=pjson

```
In this example, [Category filtering](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm) selects the point address locator from the World Geocoding Service. This only returns one candidate from the point address locator.

## Usage notes:
This shows how to implement category filtering for the addressToLocations method.

```javascript
  function locate() {
    var address = {
      SingleLine: dom.byId("address").value
    };
//Setting the category parameter for the addressToLocations method
      var params = {
        address: address,
        categories: ["Point Address"],
        outFields: ["*"]
      };
locator.addressToLocations(params);
  }
```
[Live sample](http://esri.github.io/developer-support/web-js/category-filter-geocode/geocode_LocName.html)
