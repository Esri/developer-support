## Get Better Geoprocessing Tool Error Messages

<!-- TODO: Write a brief abstract explaining this sample -->
This sample demonstrates how to get better Geoprocessing tool error messages by using the event handling built into the Geoprocessing.ExecuteToolAsync() method.

<!-- TODO: Fill this section below with metadata about this sample-->
```
Language:				C#
Subject:				Framework
Date:					08/20/2024
ArcGIS Pro:				3.3
Visual Studio:			2022
.NET Target Framework:	8.0
```

## Resources

* [API Reference online](https://pro.arcgis.com/en/pro-app/sdk/api-reference)
* <a href="https://pro.arcgis.com/en/pro-app/sdk/" target="_blank">ArcGIS Pro SDK for .NET (pro.arcgis.com)</a>
* [arcgis-pro-sdk-community-samples](https://github.com/Esri/arcgis-pro-sdk-community-samples)
* [ArcGIS Pro DAML ID Reference](https://github.com/Esri/arcgis-pro-sdk/wiki/ArcGIS-Pro-DAML-ID-Reference)
* [FAQ](https://github.com/Esri/arcgis-pro-sdk/wiki/FAQ)

### Sample Data

* No additional data is required.

<!-- TODO: Explain how this sample can be used. To use images in this section, create the image file in your sample project's screenshots folder. Use relative url to link to this image using this syntax: ![My sample Image](FacePage/SampleImage.png) -->
## How to use the sample

1. Open the project in Visual Studio, click the Build menu, and then select Build Solution.
1. Click the Start button to run the project and open ArcGIS Pro.
1. Select the "Start without a template" option in ArcGIS Pro.
1. Click the Add-in tab.
1. Click the "Get GP Tool Error Message" button.
1. The geoprocessing tool will attempt to run, then a pop-up window will appear displaying a more detailed error message.
1. Line 52 catches the thrown error message and the subsequent code passes it to the pop-up window.
1. If the event handler workflow is not used, then the geoprocessing tool will only show an error code and no message.

<!-- End -->
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://esri.github.io/arcgis-pro-sdk/images/ArcGISPro.png"  alt="ArcGIS Pro SDK for Microsoft .NET Framework" height = "20" width = "20" align="top"  >
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[Home](https://github.com/Esri/arcgis-pro-sdk/wiki) | <a href="https://pro.arcgis.com/en/pro-app/sdk/api-reference" target="_blank">API Reference</a> | [Requirements](https://github.com/Esri/arcgis-pro-sdk/wiki#requirements) | [Download](https://github.com/Esri/arcgis-pro-sdk/wiki#installing-arcgis-pro-sdk-for-net) | <a href="https://github.com/esri/arcgis-pro-sdk-community-samples" target="_blank">Samples</a>
