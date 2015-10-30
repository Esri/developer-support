//------------------------------------------------------------------------------

import QtQuick 2.3
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1
import QtPositioning 5.3

import ArcGIS.AppFramework 1.0
import ArcGIS.AppFramework.Controls 1.0
import ArcGIS.AppFramework.Runtime 1.0
import ArcGIS.AppFramework.Runtime.Controls 1.0
import QtQuick.Dialogs 1.2
import QtQuick.Controls.Styles 1.2


//------------------------------------------------------------------------------

App {
    id: app
    width: 640
    height: 480

    property string featureServiceURL : app.info.propertyValue("featureServiceURL","");
    property var objectIdToEdit
    property string addButtonClicked: "no item"
    property string selectButtonClicked: "no item"
    property var foundFeatureIds: null
    property var selectedFeatureId: null
    property var featureIds: null
    property int hitFeatureId
    property variant attrValue
    property real scaleFactor: System.displayScaleFactor

    Graphic {
        id: selectedGraphic
        geometry: Point {
            x: 0
            y: 0
            spatialReference: {"wkid":102100}
        }
    }


    GeodatabaseAttachment {
        id: featureAttachment
    }
    property alias theFeatureAttachment: featureAttachment


    Rectangle {
        id: titleRect


        anchors {
            left: parent.left
            right: parent.right
            top: parent.top
        }

        height: titleText.paintedHeight + titleText.anchors.margins * 2
        color: app.info.propertyValue("titleBackgroundColor", "darkblue")

        Text {
            id: titleText

            anchors {
                left: parent.left
                right: parent.right
                top: parent.top

            }

            text: app.info.title
            color: app.info.propertyValue("titleTextColor", "white")
            font {
                pointSize: 22
            }
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            maximumLineCount: 2
            elide: Text.ElideRight
            horizontalAlignment: Text.AlignHCenter
        }
    }

    Map {
        id: map

        anchors {
            left: parent.left
            right: parent.right
            top: titleRect.bottom
            bottom: parent.bottom
        }

        extent: envelopeInitalExtent


        wrapAroundEnabled: true
        rotationByPinchingEnabled: true
        magnifierOnPressAndHoldEnabled: true
        mapPanningByMagnifierEnabled: true
        zoomByPinchingEnabled: true

        positionDisplay {
            positionSource: PositionSource {
            }
        }
        //set the Envelope for the extent
        Envelope {
            id: envelopeInitalExtent
            xMax: -13630134.691272736
            yMax: 4554320.7069897875
            xMin: -13647294.804122735
            yMin: 4535211.44991852
            spatialReference: map.spatialReference

        }

        ArcGISTiledMapServiceLayer {
            url: app.info.propertyValue("basemapServiceUrl", "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer")
        }


        //Create a feature service table from a feature service
        GeodatabaseFeatureServiceTable {
            id: featureServiceTable
            url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0"

        }

        //when the user clicks on the map, add feature to the feature layer with the mouse coordinates as geometry, and predefined attributes

        Column{
            anchors.left: parent
            spacing: parent.width/17


            Button{
                id: add
                text: "add"

                onClicked: {
                    console.log("Previously " + addButtonClicked)
                    addButtonClicked = "add item"
                    console.log("Now " + addButtonClicked)
                }
            }
            Button{
                id: select
                text: "select"
                onClicked: {
                    console.log("Previously " + selectButtonClicked)
                    selectButtonClicked = "select item"
                    console.log("Now " + selectButtonClicked)
                }
            }

        }

        Query {
            id: selectFeatureQuery
            where: "1=1"
            returnGeometry: true
            spatialRelationship: Enums.SpatialRelationshipTouches

        }


        //Create a feature service table from a feature service
        FeatureLayer {
            id: featureLayer
            featureTable: featureServiceTable




            function hitTestFeatures(x,y) {
                var tolerance = Qt.platform.os === "ios" || Qt.platform.os === "android" ? 4 : 1;

                var featureIds = featureLayer.findFeatures(x, y, tolerance * scaleFactor, 1);

                if (featureIds.length > 0) {
                    selectedFeatureId = featureIds[0];
                    selectedFeature = featureTable.feature(selectedFeatureId);
                    selectFeature(selectedFeatureId);
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

        // Dialog for results
        Dialog {
            id: identifyDialog
            title: "Features"
            modality: Qt.ApplicationModal
            visible: false
            height: 350
            width: 350

            contentItem: Rectangle {
                id: dialogRectangle
                color: "lightgrey"

                anchors.fill: parent
                Column {
                    id: column
                    anchors {
                        fill: parent

                    }
                    clip: true

                    Repeater {
                        model: fieldsModel

                        clip: true
                        Row {
                            id: row
                            Label {
                                id: nameLabel
                                text: name + ": "
                                color: "black"
                                horizontalAlignment: Text.AlignHCenter

                            }

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
                                    //featureToEdit.geometry = newPoint;
                                    console.log("hgadfjladfjkl" + objectIdToEdit);
                                    //use the setAttributeValue to set an attribute fieldname for a given value
                                    //here we are using featureToEdit var which is the featureLayer and the featureTable from the feature co
                                    featureToEdit.setAttributeValue(field, text);
                                    console.log(featureToEdit.attributeValue(field))
                                    featureServiceTable.updateFeature(objectIdToEdit, featureToEdit);
                                    console.log(featureLayer.featureTable.feature(objectIdToEdit).attributeValue(field))


                                    featureServiceTable.applyFeatureEdits()



                                }
                            }


                        }
                    }
                }

                Button {
                    anchors {
                        bottom: parent.bottom
                        left: parent.left
                    }
                    text: "Ok"
                    style: ButtonStyle {
                        label: Text {
                            text: control.text
                            color:"black"
                            horizontalAlignment: Text.AlignHCenter
                        }
                    }
                    onClicked: identifyDialog.close();
                }
                Button {
                    anchors {
                        bottom: parent.bottom
                        right: parent.right
                    }
                    text: "When you are finished with your edits select 'Enter'"
                    style: ButtonStyle {
                        label: Text {
                            text: control.text
                            color:"black"
                            horizontalAlignment: Text.AlignHCenter
                        }
                    }
                }

            }

        }

        ListModel {
            id:fieldsModel
        }

        Rectangle {
            id: backgroundRectangle
            anchors {
                fill: backgroundColumn

            }
            color: "lightgrey"
            radius: 5
            border.color: "black"
            opacity: 0.77
        }



        function getFields( featureLayer ) {
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


        onMouseClicked: {
            if (selectButtonClicked == "select item"){

                selectFeatureQuery.geometry = mouse.mapPoint
                featureLayer.hitTestFeatures(mouse.x, mouse.y);
                console.log(mouse);
            }
            else if(addButtonClicked == "add item"){
                var featureJson = {
                    geometry: {
                        x: mouse.mapX,
                        y: mouse.mapY,
                        spatialReference: mouse.mapPoint.spatialReference
                    },

                    attributes: {
                        eventtype : "eventtype",
                        eventdate : "district",
                        eventtype: 17
                    }
                }

                if (featureServiceTable.featureTableStatus === Enums.FeatureTableStatusInitialized) {
                    featureServiceTable.addFeature(featureJson)
                    featureServiceTable.applyFeatureEdits(console.log("feature added"))

                }

            }
        }

    }


    NorthArrow {
        anchors {
            right: parent.right
            top: parent.top
            margins: 10
        }

        visible: map.mapRotation != 0
    }

    ZoomButtons {
        anchors {
            right: parent.right
            verticalCenter: parent.verticalCenter
            margins: 10
        }
    }
}


//------------------------------------------------------------------------------
