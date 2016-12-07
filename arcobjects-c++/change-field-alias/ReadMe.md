#Change Layer Fieldname Alias
## Use case
You want to change fieldname alias to match that of your new convention for all your layers.  This will iterate through all fields in the first layer in the MXD and update field alias as long as they match a certain condition.

##Instructions
* On line 17 select the map document in which you want to change the fieldname alias in your specific map document.
*  Lines 37 through 47 look for field names that match a criteria and replace the alias with an updated one.

##Things to know:
* [Interface ILayerFields](http://resources.arcgis.com/en/help/arcobjects-cpp/componenthelp/index.html#//00050000073z000000)
* [Interface IFieldInfo](http://resources.arcgis.com/en/help/arcobjects-cpp/componenthelp/index.html#//000s00000356000000)
* [Interface ILayer](http://resources.arcgis.com/en/help/arcobjects-cpp/componenthelp/index.html#//0005000006z1000000)

######Authors
* Doug Carroll with [original script](https://github.com/Esri/developer-support/blob/gh-pages/arcobjects-net/change-layer-fieldname-alias/ChangeFieldAlias.cs)
* Alexander Nohe
