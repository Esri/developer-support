# How to set the symbol of feature selection

IFeatureSelection provides the capability of accessing the feature selection properties and selected features, including Selection symbol (or color), Selection buffer distance, Selection set, etc. 

[Documentation: IFeatureSelection] 
(http://resources.arcgis.com/en/help/arcobjects-net/componenthelp/index.html#//0012000004ww000000)


## Features
* This sample is an ArcMap Add-in. It is to demonstrate how to set the feature selection symbol against a certain layer (i.e., the first layer loaded in ArcMap) 
* This sample can only work with Polygon feature layer. If you need to set selection symbol of a point layer, or line layer, you need to redefine ISymbol used in IFeatureSelection.SelectionSymbol based on the geometry type of the layer.