// Copyright 2015 ESRI - Yue Wu
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// You may freely redistribute and use this sample code, with or
// without modification, provided you include the original copyright
// notice and use restrictions.
//
// See the Sample code usage restrictions document for further information.
//------------------------------------------------------------------------------
import QtQuick 2.3
import QtQuick.Dialogs 1.2
import QtQuick.Controls 1.2
import QtQuick.Controls.Styles 1.2
import ArcGIS.AppFramework 1.0
import ArcGIS.AppFramework.Controls 1.0
import ArcGIS.AppFramework.Runtime 1.0
import ArcGIS.AppFramework.Runtime.Controls 1.0

App {
    id: app
    width: 400
    height: 640

    property Point myLocation
    property bool capturePoints: false
    property double scaleFactor: System.displayScaleFactor
    property int numberOfClicks: 0

    Map {
        id: map
        anchors.fill: parent

        onStatusChanged: {
            if (status === Enums.MapStatusReady) {
                //ps.active = true;
                map.addLayer(graphicsLayer)
                graphicsLayer.addGraphic(graphic)
                graphicsLayer.addGraphic(pointGraphic)
            }
        }

        onMouseClicked: {
            if (capturePoints == true) {
                if (numberOfClicks == 0) {
                    featurePoly.startPath(mouse.mapPoint)
                    points.add(mouse.mapPoint)
                    pointGraphic.geometry = points
                    pointGraphic.symbol = markerSymbol
                } else {
                    points.add(mouse.mapPoint)
                    featurePoly.lineTo(mouse.mapPoint)
                    graphic.geometry = featurePoly
                    graphic.symbol = simpFill
                    pointGraphic.geometry = points
                    pointGraphic.symbol = markerSymbol
                }
                numberOfClicks++
            }
        }

        focus: true

        ArcGISTiledMapServiceLayer {
            url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
        }

        GeodatabaseFeatureServiceTable {
            id: featureServiceTable
            url: "http://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/PolygonFromQT/FeatureServer/0"
        }

        GraphicsLayer {
            id: graphicsLayer
        }

        SimpleFillSymbol {
            id: simpFill
            color: "yellow"
            outline: SimpleLineSymbol {
                color: "black"
                width: 4
            }
        }

        Graphic {
            id: graphic
        }

        Graphic {
            id: pointGraphic
        }

        MultiPoint {
            id: points
            spatialReference: {
                "latestWkid": 3857,
                            "wkid": 102100
            }
        }

        SimpleMarkerSymbol {
            id: markerSymbol
            color: "red"
            outline: SimpleLineSymbol {
                color: "black"
                width: 4
            }
        }

        FeatureLayer {
            id: featureLayer
            featureTable: featureServiceTable

            function addTracked(feature) {
                if (featureTable.featureTableStatus === Enums.FeatureTableStatusInitialized) {
                    console.log("Attempting to add....")
                    console.log(featureTable.addFeature(feature))
                    console.log("Added")
                    featureServiceTable.applyFeatureEdits()
                }
            }
        }

        Polygon {
            id: featurePoly
            spatialReference: {
                "latestWkid": 3857,
                            "wkid": 102100
            }
        }
    }

    Rectangle {
        //id: optionsRectangle
        anchors {
            fill: controlsColumn
            margins: -10 * scaleFactor
        }

        color: "lightgrey"
        radius: -10 * scaleFactor
        border.color: "black"
        opacity: 0.88

        MouseArea {
            anchors.fill: parent
            onClicked: (mouse.accepted = true)
        }
    }

    Column {
        id: controlsColumn
        anchors.leftMargin: 21
        anchors.topMargin: 21
        anchors {
            left: parent.left
            top: parent.top
            margins: 20 * scaleFactor
        }
        spacing: 4

        Button {
            id: generateButton
            text: "New Feature"
            width: removeVertexButton.width
            enabled: true
            style: ButtonStyle {
                label: Text {
                    text: control.text
                    color: control.enabled ? "black" : "grey"
                    horizontalAlignment: Text.AlignHCenter
                }
            }

            onClicked: {
                syncButton.enabled = true
                enabled = false
                capturePoints = true

                console.log(featurePoly.pathCount)
            }
        }

        Button {
            id: syncButton
            text: "Add Feature"
            width: removeVertexButton.width
            enabled: false
            style: generateButton.style

            onClicked: {
                if(numberOfClicks >2)
                {
                    enabled = false
                    generateButton.enabled = true

                    var featureToAdd = ArcGISRuntime.createObject("Feature")
                    featurePoly.closePathWithLine()
                    console.log(featurePoly.valid)
                    featureToAdd.geometry = featurePoly
                    featureToAdd.setAttributeValue("test", "test")
                    console.log("This is here")
                    featureLayer.addTracked(featureToAdd)
                    while (points.pointCount > 0) {
                        points.removePoint(0)
                    }
                    while (featurePoly.pathCount > 0) {
                        featurePoly.removePath(0)
                    }

                    pointGraphic.geometry = points
                    graphic.geometry = featurePoly
                    numberOfClicks = 0
                    capturePoints = false
                }
                else
                {
                    warningMessage.visible = true
                }
            }
        }

        MessageDialog {
            id: warningMessage
            title: "Not enough points to create polygon"
            text: "To create a polygon, three or more points are required."
            Component.onCompleted: visible = false
        }

        Button {
            id: removeVertexButton
            text: "Remove Vertex / Cancel"
            enabled: syncButton.enabled
            style: generateButton.style

            onClicked: {
                if (numberOfClicks > 0) {
                    if (featurePoly.pointCount > 0){
                        featurePoly.removePoint(-1, -1)
                    }
                    points.removePoint(points.pointCount - 1)
                    pointGraphic.geometry = points
                    graphic.geometry = featurePoly
                    numberOfClicks = numberOfClicks - 1
                    if (numberOfClicks == 0) {
                        syncButton.enabled = false
                        generateButton.enabled = true
                        capturePoints = false
                    }
                }
                else
                {
                    syncButton.enabled = false
                    generateButton.enabled = true
                    capturePoints = false
                }
            }
        }
    }
}
