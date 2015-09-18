
// Copyright 2015 ESRI
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// You may freely redistribute and use this sample code, with or
// without modification, provided you include the original copyright
// notice and use restrictions.
//
// See the Sample code usage restrictions document for further information.
//

import QtQuick 2.3
import QtQuick.Controls 1.2
import ArcGIS.Runtime 10.26
import QtPositioning 5.3
import QtQuick.Controls.Styles 1.2

ApplicationWindow {
    id: appWindow
    width: 800
    height: 600
    title: "Capture on Click"

    property Point myLocation
    property bool capturePoints
    property var featureToAdd
    property double scaleFactor: System.displayScaleFactor

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

            points.add(mouse.mapPoint)
            featurePoly.lineTo(mouse.mapPoint);
            graphic.geometry = featurePoly
            graphic.symbol = simpFill
            pointGraphic.geometry = points
            pointGraphic.symbol = markerSymbol


            //featurePoly.insertPoint(0,-1, mouse.mapPoint)
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
            spatialReference: {"latestWkid": 3857,"wkid":102100}
        }

        SimpleMarkerSymbol {
            id: markerSymbol
            color: "red"
            outline: SimpleLineSymbol  {
                color: "black"
                width: 4
            }
        }

        FeatureLayer {
            id: featureLayer
            featureTable: featureServiceTable

            function addTracked(feature)
            {
                if (featureTable.featureTableStatus === Enums.FeatureTableStatusInitialized) {
                    console.log(featureTable.addFeature(feature));
                    featureServiceTable.applyFeatureEdits();
                }
            }
        }


        Polygon {
            id: featurePoly
            //geometryType: Enums.GeometryTypePolygon
            spatialReference: {"latestWkid": 3857,"wkid":102100}

        }



}


    Rectangle {
        //id: optionsRectangle
        anchors {
            fill: controlsColumn
            margins: .10 * scaleFactor
        }

        color: "lightgrey"
        radius:  .10 * scaleFactor
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
                            featureToAdd = ArcGISRuntime.createObject("Feature");
                            featurePoly.startPath(-117, 38);

                            console.log(featurePoly.pathCount)
                        }
                    }

                    Button {
                        id: syncButton
                        text: "Add Feature"
                        width: generateButton.width
                        enabled: false
                        style: generateButton.style

                        onClicked: {
                            enabled = false
                            generateButton.enabled = true
                            featureToAdd.geometry = featurePoly;
                            featureLayer.addTracked(featurePoly)


                        }
                    }

                    Button {
                        id: insertPointButton
                        text: "Add Vertex"
                        width: generateButton.width
                        enabled: syncButton.enabled
                        style: generateButton.style

                        onClicked: {
                            featurePoly.insertPoint(0,-1,myLocation)
                        }
                    }

                    }


}

