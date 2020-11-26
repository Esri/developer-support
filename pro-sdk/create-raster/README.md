## Create Raster

<!-- TODO: Write a brief abstract explaining this sample -->
This sample demonstrates how to create an edited raster file from a blank raster dataset. The workflow has two parts: it first creates and saves a temporary blank raster file of a specified size, it then edits the temporary raster's pixel values, saves the edits to a final raster file, and deletes the temporary raster.

<!-- TODO: Fill this section below with metadata about this sample-->
```
Language:				C#
Subject:				Framework
Date:					11/24/2020
ArcGIS Pro:				2.6
Visual Studio:			2017, 2019
.NET Target Framework:	4.8
```

## Resources

* [API Reference online](https://pro.arcgis.com/en/pro-app/sdk/api-reference)
* <a href="https://pro.arcgis.com/en/pro-app/sdk/" target="_blank">ArcGIS Pro SDK for .NET (pro.arcgis.com)</a>
* [arcgis-pro-sdk-community-samples](https://github.com/Esri/arcgis-pro-sdk-community-samples)
* [ArcGIS Pro DAML ID Reference](https://github.com/Esri/arcgis-pro-sdk/wiki/ArcGIS-Pro-DAML-ID-Reference)
* [FAQ](https://github.com/Esri/arcgis-pro-sdk/wiki/FAQ)

### Sample Data

* A blank raster dataset is included with the project in the "rasters" folder at ".\create-raster\rasters".

<!-- TODO: Explain how this sample can be used. To use images in this section, create the image file in your sample project's screenshots folder. Use relative url to link to this image using this syntax: ![My sample Image](FacePage/SampleImage.png) -->
## How to use the sample

1. Copy the "rasters" folder from the project to the C drive such that C:\rasters exists.
1. Open the project in Visual Studio, click the Build menu, and then select Build Solution.
1. Click the Start button to run the project and open ArcGIS Pro.
1. Select the start without a template option in ArcGIS Pro.
1. Click the Add-in tab.
1. Click the Create Raster Button.
1. This will create a new 50x50 pixel raster with a gradient in the C:\rasters folder.

* Note: The location of the "rasters" folder and the names for the raster dataset and output rasters can be changed in the Button1.cs file.

<!-- End -->
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://esri.github.io/arcgis-pro-sdk/images/ArcGISPro.png"  alt="ArcGIS Pro SDK for Microsoft .NET Framework" height = "20" width = "20" align="top"  >
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[Home](https://github.com/Esri/arcgis-pro-sdk/wiki) | <a href="https://pro.arcgis.com/en/pro-app/sdk/api-reference" target="_blank">API Reference</a> | [Requirements](https://github.com/Esri/arcgis-pro-sdk/wiki#requirements) | [Download](https://github.com/Esri/arcgis-pro-sdk/wiki#installing-arcgis-pro-sdk-for-net) | <a href="https://github.com/esri/arcgis-pro-sdk-community-samples" target="_blank">Samples</a>
