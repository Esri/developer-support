## Create Layer File from Selected Map Layer

This sample shows how to create a new layer file (*.lyrx) from a layer that is currently selected in the map.

```
Language:              C#
Subject:               Framework
Organization:          Esri, http://www.esri.com
Date:                  07/17/2020
ArcGIS Pro SDK:        2.5.2
Visual Studio:         2017, 2019
.NET Target Framework: 4.8
```

## How to use the sample:
1. Open the Button1.cs file.
2. Change the path on line 26 to a valid file path you would like to save the new layer file to. As is, it will be saved to "C:\\Temp".
3. Change the name you would like to save the layer file as on line 54. As is, it will be saved as "TestFile.lyrx".
4. Build and run the Add-in. This will open ArcGIS Pro.
5. Open a new or existing Project and add a map with at least one layer.
6. Select the layer in the Contents pane that you would like to save as a layer file.
7. Open the Add-In Tab and click the "Create Layer File" button in the "Create Layer File" group.
8. The newly created layer file will be added to the file path specified in step 2.
