#ArcGIS API for JavaScript Zoom to Feature via Dropdown

This is a sample app that creates a dropdown of features that when selected, are zoomed to, and a pop is shown.

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)



[expand()](https://developers.arcgis.com/javascript/jsapi/extent-amd.html#expand)



## Features

* written in AMD
* A <select> DOM element is populated with features from a featureLayer to create a dropdown
* When a feature is selected, the map zooms out to the initial extent, then in to the feature
* To control the extent after the map zooms in, the method feature.geometry.getExtent().expand() is used to find the extent of the feature, and then zoom out a specified amount.
* The selected feature's symbology is changed
* The feature's popup is programatically displayed
* uses version 3.10 of the JS API, but should be able to be upgraded conveniently. 

NOTE: Feel free to update to this repo, especially if you are aware of any methods to make the zooming smoother!
