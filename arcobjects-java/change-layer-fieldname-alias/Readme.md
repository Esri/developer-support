#Change Layer Fieldname Alias
## Use case
You want to change fieldname alias to match that of your new convention for all your layers.  This will iterate through all fields in the first layer in the MXD and update field alias as long as they match a certain condition.

##Instructions
* On line 17 select the map document in which you want to change the fieldname alias in your specific map document.
*  Lines 36 through 40 look for field names that match a criteria and replace the alias with an updated one.

##Things to know:
* [Interface ILayerFields](http://resources.arcgis.com/en/help/arcobjects-java/api/arcobjects/com/esri/arcgis/carto/ILayerFields.html)
* [Interface IFieldInfo](http://resources.arcgis.com/en/help/arcobjects-java/api/arcobjects/com/esri/arcgis/geodatabase/IFieldInfo.html)
* [Interface ILayer](http://resources.arcgis.com/en/help/arcobjects-java/api/arcobjects/com/esri/arcgis/carto/ILayer.html)

######Authors
* Doug Carroll with [original script](https://github.com/Esri/developer-support/blob/gh-pages/arcobjects-net/change-layer-fieldname-alias/ChangeFieldAlias.cs)
* Alexander Nohe
