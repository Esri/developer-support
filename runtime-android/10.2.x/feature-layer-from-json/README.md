# FeatureLayer from JSON

This sample demonstrates how to construct an ArcGISFeatureLayer from a JSON file stored as an asset using the Esri Android 10.2.x SDK and USFS Surface Ownership Data.

## Details

This sample uses a FeatureSet created from a JSON file stored in assets to construct an ArcGISFeatureLayer: [public ArcGISFeatureLayer (String layerDefinition, FeatureSet featureCollection, ArcGISFeatureLayer.Options layerOption)](https://developers.arcgis.com/android/10-2/api-reference/reference/com/esri/android/map/ags/ArcGISFeatureLayer.html#ArcGISFeatureLayer(java.lang.String, com.esri.core.map.FeatureSet, com.esri.android.map.ags.ArcGISFeatureLayer.Options))

A simple way to create a JSON layerDefinition is to publish a map service with the desired symbology, then issue a request to the individual service layer with the "f=json" parameter appended.

MainActivity:  [../app/src/main/java/com/esri/android/MainActivity.java](app/src/main/java/com/esri/android/MainActivity.java)

US Forest Service Data: https://data.fs.usda.gov/geodata/edw/datasets.php?dsetCategory=boundaries

## Demo of Sample
![FeatureLayer to JSON](../../repository-images/FeatureLayerToJSON.gif)
