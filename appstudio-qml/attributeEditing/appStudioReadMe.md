#Attribute Editing in AppStudio

##Background
This sample demonstrates how to add a add features to the map using the "add" button.  

When we click on a feature, attributes can be edited in a Dialog Box.

##Usage notes:

Create a button to add features to the map
```javascript
            Button{
                id: add
                text: "add"
                onClicked: {
                    console.log("Previously " + addButtonClicked)
                    addButtonClicked = "add item"
                    console.log("Now " + addButtonClicked)
                }
            }

```

```javascript
TextInput {
      id: valueEdit
      text: string
      color: "black"
      horizontalAlignment: Text.AlignHCenter
      //removes the : for the label
      onAccepted: {
      var field = nameLabel.text.substring(0, nameLabel.text.length-2);
      console.log(text + " " + field);
      var featureToEdit = featureLayer.featureTable.feature(objectIdToEdit);
      //use the setAttributeValue method to set an attribute fieldname for a given value
      featureToEdit.setAttributeValue(field, text);
      console.log(featureToEdit.attributeValue(field))
      featureServiceTable.updateFeature(objectIdToEdit, featureToEdit);
      console.log(featureLayer.featureTable.feature(objectIdToEdit).attributeValue(field))
      //push the edits to the service
      featureServiceTable.applyFeatureEdits()
}                                   
```


```javascript
function getFields(featureLayer) {
          fieldsModel.clear();
          var fieldsCount = featureLayer.featureTable.fields.length;
          for ( var f = 0; f < fieldsCount; f++ ) {
              var fieldName = featureLayer.featureTable.fields[f].name;

              attrValue = featureLayer.featureTable.feature(hitFeatureId).attributeValue(fieldName);
              if ( fieldName !== "Shape" ) {
                  if (attrValue == null){
                      fieldsModel.append({"name": fieldName, "string": " "});

                      console.log(attrValue);
                  }
                  else {
                      var attrString = attrValue.toString();

                      fieldsModel.append({"name": fieldName, "string": attrString});
                  }


              }
          }
      }

onMousePressed: {
           var tolerance = Qt.platform.os === "ios" || Qt.platform.os === "android" ? 4 : 1;
           //features are found based on the mouse clicked
           var features = featureLayer.findFeatures(mouse.x, mouse.y, tolerance * scaleFactor, 1)
           for ( var i = 0; i < features.length; i++ ) {
               //set the hitFeatureId for the features that we loop through
               hitFeatureId = features[i];
               //set the objectIdToEdit
               objectIdToEdit = hitFeatureId;
               getFields(featureLayer);
               identifyDialog.title = "Object ID: " + hitFeatureId;
               identifyDialog.visible = true;
               if(Qt.platform.os !== "ios" && Qt.platform.os != "android") {
               }
           }
       }
```
