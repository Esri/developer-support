This sample is a conversion of Multiple Attribute Inspector sample from Legacy to AMD.
The online sample https://developers.arcgis.com/javascript/jssamples/ed_multipleAttrInspector.html is in Legacy style.
I made efforts to convert this sample to AMD for one of my user.
This uses multiple feature layers and attribute inspector for each layer. You can edit popup content on multiple layers on the map.

Please mind changing "objectid" in line 175 according to the field name in your particular service.
So in most of the cases [evt.graphic.attributes.objectid] would be [evt.graphic.attributes.OBJECTID] since "OBJECTID" is in capital
letters for most of the FeatureLayers unless you are using specific field for unique Ids.

Also this sample has Editing features functionality so this will open Attribute Inspector editable window when you create a feature.
Thanks,
Akshay H.

[Live Sample](http://esri.github.io/developer-support/web-js/multiple-attribute-inspector-AMD/multipleAttrInspectorAMD.html)
