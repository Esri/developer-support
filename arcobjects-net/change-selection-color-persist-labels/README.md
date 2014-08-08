#Change selection color and persist labels

This code is a proof of concept for two things (1) How to interject in ArcGIS Drawing process and draw polygons on the screen (2) How make the selection color of polygon with fill symbol which don't overlap labels. 
In ArcMap, there is a option to change the symbol of polygon selection but it overlaps labels because these selected polygons are drawn at GeoSelection stage which a over the top of labelling phase (esriViewGraphics).
If one draws the fill symbol polygon at geography phase they don't over lap labels. 
     
Caveats: This will lead to decrease in performance as with each selection, a partial refresh for geography phase is also required. There might be scope to optimize this process.
     
Author: Shriram Bhutada
     
Note: please note this is a proof of concept code and have to be used with utmost care because any developer error in active view events can lead to system crash as these events are fired after each user interaction.
     
[Documentation on IActiveViewEvents::AfterDraw event](http://help.arcgis.com/en/sdk/10.0/arcobjects_net/componenthelp/index.html#//00120000019m000000)

## Features

* Uses IFeatureCursor
* Uses IDisplay
* Uses IActiveView:PartialRefresh
* Uses ISelectionSet



