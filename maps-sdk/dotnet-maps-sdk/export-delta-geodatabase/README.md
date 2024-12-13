# Exporting Delta Geodatabase

## Background
This sample demonstrates how to export a delta geodatabase using the ArcGIS Maps SDK for .NET

This app is based on the same sample link below but with an added function to export a delta geodatabase and display the user's edited features.

Link:

    https://developers.arcgis.com/net/wpf/sample-code/edit-and-sync-features/

## Usage notes

Use this app for editing and synchronizing features on a mobile geodatabase while also having the option to see the edited features in a delta geodatabase.

API Reference Links:

    https://developers.arcgis.com/net/api-reference/api/netfx/Esri.ArcGISRuntime/Esri.ArcGISRuntime.Tasks.Offline.GenerateGeodatabaseJob.html
    https://developers.arcgis.com/net/api-reference/api/netfx/Esri.ArcGISRuntime/Esri.ArcGISRuntime.Tasks.Offline.GenerateGeodatabaseParameters.html
    https://developers.arcgis.com/net/api-reference/api/netfx/Esri.ArcGISRuntime/Esri.ArcGISRuntime.Tasks.Offline.GeodatabaseSyncTask.html
    https://developers.arcgis.com/net/api-reference/api/netfx/Esri.ArcGISRuntime/Esri.ArcGISRuntime.Tasks.Offline.GeodatabaseSyncTask.ExportDeltaAsync.html
    https://developers.arcgis.com/net/api-reference/api/netfx/Esri.ArcGISRuntime/Esri.ArcGISRuntime.Tasks.Offline.SyncGeodatabaseJob.html
    https://developers.arcgis.com/net/api-reference/api/netfx/Esri.ArcGISRuntime/Esri.ArcGISRuntime.Tasks.Offline.SyncGeodatabaseParameters.html
    https://developers.arcgis.com/net/api-reference/api/netfx/Esri.ArcGISRuntime/Esri.ArcGISRuntime.Tasks.Offline.SyncLayerOption.html

## How to setup

1. Open the project solution file (.sln) with Visual Studio 2022.
2. Build and run the application.

    When you launch the app, you can update features and export your changes to a delta geodatabase. Reload the geodatabase to synchonize the edits.

```csharp
Geodatabase geodatabase = await Geodatabase.OpenAsync(_gdbPath);
_ = await GeodatabaseSyncTask.ExportDeltaAsync(geodatabase, _deltaGDBPath);
```