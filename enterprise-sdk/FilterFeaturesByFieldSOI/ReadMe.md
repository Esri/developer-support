---
order: 14
---

# .NET Filter Features By Field SOI

This sample illustrates how to develop an SOI to apply certain field value restrictions on the [Export Map](https://developers.arcgis.com/rest/services-reference/export-map.htm), [Identify](https://developers.arcgis.com/rest/services-reference/identify-map-service-.htm), and [Find](https://developers.arcgis.com/rest/services-reference/find.htm) REST operations of a map service. It contains a sample SOIs called FilterFeaturesByFieldSOI. The FilterFeaturesByField SOI uses the ExportMap operation's "layerDefs" parameter to filter the displayed features by attribute field.

>*Note* : This sample SOI is only applicable to map services published from ArcGIS Pro to a 10.8 or later versions of ArcGIS Server. See [what's new in the ArcGIS REST API at 10.8](https://developers.arcgis.com/rest/services-reference/what-s-new.htm).

Deploying the SOI from the .soe file (`..\bin\Release\NetFilterFeaturesByFieldSOI_ent.soe`) does not require you to open Visual Studio. However, you can load the project (`..\NetFilterFeaturesByFieldSOI.csproj`) in Visual Studio to debug, modify, and recompile the SOI code.

## Features

* Preprocess REST requests
* Layer Definitions

## Sample data

This instruction uses the SampleWorldCities service as the sample service to test with the SOI.

## Instructions

### Deploy the SOIs

1. Log in to ArcGIS Server Manager and click the ***Site*** tab.
2. Click ***Extensions***.
3. Click ***Add Extension***.
4. Click ***Choose File*** and choose the ***NetFilterFeaturesByFieldSOI_ent.soe*** file (`..\bin\Release\NetFilterFeaturesByFieldSOI_ent.soe` or `..\bin\Debug\NetFilterFeaturesByFieldSOI_ent.soe`).
5. Click ***Add***.

### Enable the FilterFeaturesByField SOI on a map service

1. Navigate to the SampleWorldCities map service in ArcGIS Server Manager.
3. Select ***.NET FilterFeaturesByField SOI*** in the ***Available Interceptors*** box and click the right arrow button to move it to ***Enabled Interceptors***.
4. Click the ***Save and Restart*** button to restart the service.

### Test the SpatialFilter SOI

1. Open a browser and navigate to the REST services endpoint of the SampleWorldCities map service (URL: `http://<serverdomain>/<webadaptorname>/rest/services/SampleWorldCities/MapServer`).
2. Scroll to the bottom of the above page and click ***Export Map*** in ***Supported Extensions***.

   This leads you to the following URL:

   ```
   http://<serverdomain>/<webadaptorname>/rest/services/SampleWorldCities/MapServer/export?bbox=-103.80966151584494,-40.27311509271942,74.63649935920162,66.70933645099878
   ```
   
   The exported image shows the map with only feature that have a population (POP) over 500000. Alternatively, try to view this map service in ***ArcGIS JavaScript*** or ***ArcGIS Online Map Viewer*** and you should see similar result. (If the ***ArcGIS JavaScript*** or ***ArcGIS Online Map Viewer*** page appear blank at first, refresh the page or check sharing settings.)

3. You can play around the ***Export Map***, ***Identify*** and ***Find*** operations to observe the SOI's effects.
