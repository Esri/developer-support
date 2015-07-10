INTRODUCTION:
a. This sample is a conversion of Multiple Attribute Inspector sample from Legacy to AMD.
b. The online sample https://developers.arcgis.com/javascript/jssamples/ed_multipleAttrInspector.html is in Legacy style.
c. This uses multiple feature layers and attribute inspector for each layer. You can edit popup content on multiple layers on the map.
d. *** The original sample uses editor widget but this sample is more for the people who does not want a editing functionality but
	  just want to implement multiple attribute inspector.
e. I have also added for the functionality to save and delete the feature along with change in attributes.
f. Please don't go rouge and delete all the features as the services are used by many online samples.

*** Please mind changing "objectid" in line 175 according to the field name in your particular service.
	So in most of the cases [evt.graphic.attributes.objectid] would be [evt.graphic.attributes.OBJECTID] since "OBJECTID" is in capital
	letters for most of the FeatureLayers unless you are using specific field for unique Ids.

Thanks,
Akshay H.

*** IMPORTANT

[Live Sample](http://esri.github.io/developer-support/web-js/multiple-attribute-inspector-save-noedt/MultipleAttributeInspector_AMD_save.html)
