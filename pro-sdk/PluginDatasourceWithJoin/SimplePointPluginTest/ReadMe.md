## SimplePointPluginTest

<!-- TODO: Write a brief abstract explaining this sample -->
This project is based off of the SimplePointPlugin project from the Community Samples but extends it to add data joining functionality:
* https://github.com/Esri/arcgis-pro-sdk-community-samples/tree/master/Plugin/SimplePointPluginTest

SimplePointPluginTest implements a custom plugin datasource for reading csv files.  SimplePointPluginTest is an add-in that allows to access the custom datasource.  SimplePointPlugin contains the actual custom plugin datasource implementation to access csv data from within ArcGIS Pro. This project modifies the SimplePointPluginTest to allow for the plugin datasource data to be joined to file geodatabase data and then for updates to plugin datasource's underlying data (in this case the csv file) to be reflected in the feature layer's Attribute Table.
  

<!-- TODO: Fill this section below with metadata about this sample-->
```
Language:              C#
Subject:               Geodatabase
Contributor:           ArcGIS Pro SDK Team, arcgisprosdk@esri.com, with modifications from Chris K
Organization:          Esri, https://www.esri.com
Date:                  12/31/2025
ArcGIS Pro:            3.6
Visual Studio:         2022
.NET Target Framework: net8.0-windows
```

## Resources

[Community Sample Resources](https://github.com/Esri/arcgis-pro-sdk-community-samples#resources)

### Samples Data

* The sample data is already included in this project inside the \SimplePointPluginTest\SimplePointData\SimplePointJoinTest folder. This sample requires the SimplePointJoinTest ArcGIS Pro project as it contains data referenced in the add-in's C# code.

## How to use the sample
<!-- TODO: Explain how this sample can be used. To use images in this section, create the image file in your sample project's screenshots folder. Use relative url to link to this image using this syntax: ![My sample Image](FacePage/SampleImage.png) -->
1. This solution is using the **RBush NuGet**.  If needed, you can install the NuGet from the "NuGet Package Manager Console" by using this script: "Install-Package RBush".
2. After downloading or cloning this project, place the PluginDatasourceWithJoin folder in your C:\ directory as this location is relied on in the code by default.
3. If you wish to place the PluginDatasourceWithJoin folder in a directory other than C:\, you will need to update the csvPath on line 38 of the JoinWithPluginDatasource.cs file.
4. Open the SimplePointJoinTest ArcGIS Pro Project located in the C:\PluginDatasourceWithJoin\SimplePointPluginTest\SimplePointData\SimplePointJoinTest folder.
5. On the Add-In tab in the Ribbon there will be a group called Simple Point Plugin with two buttons, JoinWithPluginDatasource and RemovePluginDatasource.
6. Click the JoinWithPluginDatasource button.
7. A MessageBox will appear showing the location of the tree_inspections.csv file.
8. Navigate to this folder in File Explorer and open the tree_inspections.csv file in an editor.
9. Also, notice that a join has been created adding the fields from the CSV file (via Plugin Datasource) to the fields from the FileGeodatabaseTable table. 
10. In the tree_inspections CSV file, add a new field (column) and populate it for the single record in the file.
11. Save the CSV file.
12. Click the RemovePluginDatasource button. This removes the join and the plugin datasource from the map.
13. Click the JoinWithPluginDatasource button again. This creates a new plugin datasource with the update CSV data and joins it to the FileGeodatabaseTable table.
14. The FileGeodatabaseTable Table pane will update and the fields that were added to the CSV file will now be displayed in the joined plugin datasource data.  
  

<!-- End -->

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://esri.github.io/arcgis-pro-sdk/images/ArcGISPro.png"  alt="ArcGIS Pro SDK for Microsoft .NET Framework" height = "20" width = "20" align="top"  >
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[Home](https://github.com/Esri/arcgis-pro-sdk/wiki) | <a href="https://pro.arcgis.com/en/pro-app/latest/sdk/api-reference" target="_blank">API Reference</a> | [Requirements](https://github.com/Esri/arcgis-pro-sdk/wiki#requirements) | [Download](https://github.com/Esri/arcgis-pro-sdk/wiki#installing-arcgis-pro-sdk-for-net) | <a href="https://github.com/esri/arcgis-pro-sdk-community-samples" target="_blank">Samples</a>
