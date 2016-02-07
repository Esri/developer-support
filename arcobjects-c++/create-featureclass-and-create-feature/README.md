# How to create a feature class and add a spatial feature to it
This code sample shows how to use ArcObjects for C++ (ATL) to create a new feature class, and add a brand new feature to it. 
In the case of this code sample, the type of feature class created is a shapefile, and the feature created is a polyline from an IPointCollection. 
This sample is based on the "Create a shapefile from a text file with XY values" sample in the ArcObjects for Cross Platform C++ online documentation.
Author: Sami E.

[Documentation](http://help.arcgis.com/en/sdk/10.0/arcobjects_cpp/conceptualhelp/index.html#/Create_a_shapefile_from_a_text_file_with_XY_values/000100000019000000/)


## Features
* Uses IWorkspaceFactoryPtr
* Uses ISpatialReferenceFactory4Ptr
* Uses IFieldsPtr
* Uses IFeatureWorkspacePtr
* Uses IFeatureClassPtr
