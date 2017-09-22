# Graphic Extensions
## What are these extension functions for?
These extension functions are for the [Graphic class](https://developers.arcgis.com/android/latest/api-reference/reference/com/esri/arcgisruntime/mapping/view/Graphic.html)

## How do I contribute?
Append your extension to the `GraphicExt.kt` file and then post a short description of the extension function on this page (preferably in the order you added it to the file)

## Functions

### animatePointGraphic(handler: Handler, destination: Point)
Animates a marker to a new location smoothly.  This prevents the marker from jumping to a new location.

Amended for Esri based on this [stack overflow post](https://stackoverflow.com/questions/16338774/show-a-moving-marker-on-the-map)
