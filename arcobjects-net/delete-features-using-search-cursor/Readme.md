# Delete all Features in  a FeatureClass Using a Search Cursor
This C# code sample shows how to delete features using IFeatureClass.Search without opening an edit session in ArcMap. This would be for non-versioned data. Grab the first feature layer in ArcMap's Table of Contents, get a reference to the feature class, create a search cursor and loop through the features to delete them using IFeature.Delete().

Author: Sami E.

[Documentation on Updating features]
(http://resources.arcgis.com/en/help/arcobjects-net/conceptualhelp/#/Updating_features/0001000002rs000000/)

## Features
* Uses IFeatureClass
* Uses IFeature
* Uses IFeatureCursor

