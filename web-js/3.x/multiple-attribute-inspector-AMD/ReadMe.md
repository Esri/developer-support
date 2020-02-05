# Multiple Attribute Inspector - AMD
-----------------------------------------------------------------------------------------------------
## Use Case
The [Multiple Attribute Inspector](https://developers.arcgis.com/javascript/jssamples/ed_multipleAttrInspector.html) sample is converted from Legacy to AMD. In addition to this, we are using the new [on style events](http://blogs.esri.com/esri/supportcenter/2014/09/29/javascript-events-advocating-for-on-style-event-programming/).

In this sample, the attribute inspector for the existing features are in 'read only' mode. For the newly created features, the attribute inspector will be in read/write mode, and allow us to modify the attributes. 

[Live Sample](http://esri.github.io/developer-support/web-js/multiple-attribute-inspector-AMD/multipleAttrInspectorAMD.html)
## Resources
[More information about the Attribute Inspector](https://developers.arcgis.com/javascript/jsapi/attributeinspector-amd.html)

[Another attribute inspector sample](https://developers.arcgis.com/javascript/jssamples/ed_attribute_inspector.html)


## About the Sample
Display the read-only infoWindow when we click on a feature by setting the 'isEditable' fieldInfo specification to false

Please keep in mind that "objectid" in line 166 of the html is associated with the field name in your particular service. So in most of the cases [evt.graphic.attributes.objectid] would be [evt.graphic.attributes.OBJECTID] since "OBJECTID" is in capital letters for most of the FeatureLayers unless you are using a specific field for unique Ids.
```javascript
               array.forEach(layers, function(layer) {
                   //This is an example of using the new on style events
                   layer.on("click", function(evt) {
                       if (map.infoWindow.isShowing) {
                           map.infoWindow.hide();
                       }
                       var layerInfos = [{
                           'featureLayer': layer,
                           'isEditable': false,
                           'showDeleteButton': false
                       }]
                       var attInspector = new AttributeInspector({
                           layerInfos: layerInfos
                       }, domConstruct.create("div"));
                       //line 166
                       query.objectIds = [evt.graphic.attributes.objectid];
                       layer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(features) {
                           map.infoWindow.setTitle("");
                           map.infoWindow.setContent(attInspector.domNode);
                           map.infoWindow.resize(310, 165);
                           map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
                       });
                   });
               });
```


When we add new features, the 'isEditable' fieldInfo specification is set to true. This means we can edit the attributes.

```javascript

                  var layerInfos = [{
                      'featureLayer': selectedTemplate.featureLayer,
                      'isEditable': true
                  }];

var attInspector = new AttributeInspector({
                       layerInfos: layerInfos
                   }, domConstruct.create("div"));

```
