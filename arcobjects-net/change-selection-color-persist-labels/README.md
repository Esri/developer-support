# Change selection color and persist labels

This code is a proof of concept for two things (1) How to interject in ArcGIS Drawing process and draw polygons on the screen (2) How to make the selection color not to overlap labels when using fill symbol polygon.  
In ArcMap, there is a option to change the symbol of polygon selection to a fill symbol but it overlaps labels because these selected polygons are drawn at GeoSelection stage which a over the top of labelling phase (esriViewGraphics).
If one draws the fill symbol polygon at geography phase they don't over lap labels. 
     
Caveats: This will lead to decrease in performance as with each selection, a partial refresh for geography phase is  required. There might be scope to optimize this process.
     
Author: Shriram Bhutada
     
Note: please note this is a proof of concept code and have to be used with utmost care because any developer error in active view events can lead to system crash as these events are fired after each user interaction.
     
[Documentation on IActiveViewEvents::AfterDraw event](http://help.arcgis.com/en/sdk/10.0/arcobjects_net/componenthelp/index.html#//00120000019m000000)

## Features

* Uses IFeatureCursor
* Uses IDisplay
* Uses IActiveView:PartialRefresh
* Uses ISelectionSet

![selection output](https://raw.githubusercontent.com/Esri/global-support-repository/master/repository-images/ArcMapSelection.png?token=5691765__eyJzY29wZSI6IlJhd0Jsb2I6RXNyaS9nbG9iYWwtc3VwcG9ydC1yZXBvc2l0b3J5L21hc3Rlci9yZXBvc2l0b3J5LWltYWdlcy9BcmNNYXBTZWxlY3Rpb24ucG5nIiwiZXhwaXJlcyI6MTQwODEyMTkzNn0%3D--43c4d5c1670f49a8ab6287b956914bab0aa3ce4d)


