#Extract JSON from ArcMap Layers

Proof of concept ArcObject and WPF sample to generate JSON representations of layers contained in an ArcMap project.
This code works with simple renderers, unique value renderers and class break renderers.
This sample offers an easy way to construct complicated JSON needed to create and symbolize Dynamic Layers within an ArcGIS API web mapping application.
 Accompanying this sample is a required toolbox needed
to convert ArcGIS files from the MXD type to an MSD type.  Since the ArcMap toolbox is binary (not GitHub friendly), the needed toolbox can be download from the below link.

[Toolbox to convert MXD to MSD](http://ess.maps.arcgis.com/home/item.html?id=2467871513044597a6a64c9d9d025627)


## Features

* Convert ArcMap Layers to JSON
* Create JSON based renderers needed to display Dynamic Layers in web applications
* Convert MXD to MSD
* Contains ArcObjects to call a Geoprocessing tool
* Shows ArcObjects in a nice WPF form

Note: Remember you will need to place the toolbox located [here](http://ess.maps.arcgis.com/home/item.html?id=2467871513044597a6a64c9d9d025627) inside your visual studio project


