# Symbolize features with an arrow symbol

This is an ArcMap add-in button that shows how to symbolize the features in a feature class using a black arrow symbol. It also shows how to create a polyline without having to use IPointCollection. Instead, you create a new polyline object, and assign IPoints to its FromPoint and ToPoint Properties. One the polyline has been created, you use ArrowMarkerSymbolClass and SimpleLineDecorationElementClass to symbolize the ends of the polyline with a black arrow marker symbol.

Author: Sami E.

[Documentation on ISimpleLineDecorationElement Interface]
(http://resources.arcgis.com/en/help/arcobjects-net/componenthelp/index.html#//001w0000030r000000)

## Features

*Uses ICartographicLineSymbol 
*Uses IArrowMarkerSymbol 
*Uses ISimpleMarkerSymbol
*Uses ISimpleRenderer 
*Uses IGeoFeatureLayer 



