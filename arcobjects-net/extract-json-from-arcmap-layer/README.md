# Extract JSON from ArcMap Layers

Proof of concept ArcObject and WPF sample to generate JSON representations of layers contained in an ArcMap project.
This code works with simple renderers, unique value renderers and class break renderers.
This sample offers an easy way to construct complicated JSON needed to create and symbolize Dynamic Layers within an ArcGIS API web mapping application.
 Accompanying this sample is a required toolbox needed
to convert ArcGIS files from the MXD type to an MSD type.  Since the ArcMap toolbox is binary (not GitHub friendly), the needed toolbox can be download from the below link.

[`arcpy.mapping.ConvertToMSD()`](http://resources.arcgis.com/en/help/main/10.2/index.html#//00s300000034000000)

## Features

* Convert ArcMap Layers to JSON
* Create JSON based renderers needed to display Dynamic Layers in web applications
* Convert MXD to MSD
* Contains ArcObjects to call a Geoprocessing tool
* Shows ArcObjects in a nice WPF form
