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

    property double scaleFactor: System.displayScaleFactor
    property int numberOfClicks: 0
    property bool firstPoint: true
    property bool isDone: false
    property int polyGraphicId

    Rectangle {
        id: titleRect
        height: titleText.paintedHeight + titleText.anchors.margins * 2
        color: "Green"
        anchors {
            left: parent.left
            right: parent.right
            top: parent.top
        }

        Text {
            id: titleText

            anchors {
                left: parent.left
                right: parent.right
                top: parent.top
                margins: 2 * AppFramework.displayScaleFactor
            }

            text: "Snap points from existing feature to new polygon"
            color: "white"
            font {
                pointSize: 20
            }
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            maximumLineCount: 2
            elide: Text.ElideMiddle
            horizontalAlignment: Text.AlignHCenter
        }
    }

    Map {
        id: map
        wrapAroundEnabled:  true
        focus: true
        anchors {
            left: parent.left
            right: parent.right
            top: titleRect.bottom
            bottom: parent.bottom
        }

        NorthArrow {
            anchors {
                left: parent.left
                top: titleRect.bottom
                margins: 10
            }

            visible: map.mapRotation != 0
        }

        ZoomButtons {
            width: 0
            height: 50
            anchors.verticalCenterOffset: -233
            anchors.topMargin: -223
            anchors.leftMargin: 16
            anchors {
                top: titleRect.bottom
                left: parent.left
                verticalCenter: parent.verticalCenter
                margins: 10
            }
        }

        ArcGISTiledMapServiceLayer {
            url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
        }

        GeodatabaseFeatureServiceTable {
                    id: featureServiceTable
                    url: "https://services1.arcgis.com/FDPKa3De7Gog62xK/arcgis/rest/services/SFPubArt84Mgr/FeatureServer/0"
                }

        GraphicsLayer {
            id: graphicsLayer
        }

        onMouseClicked: {
            //set a flag here to control addPoint function, once the "Add Polygon" button clicked, isDone will equal to true
            if(isDone == true) {
                addPoint(mouse.mapPoint, mouse.x, mouse.y);
            }
       }

        onStatusChanged: {
                    if (status === Enums.MapStatusReady) {
                        map.zoomTo(sfExtent);
                    }
        }

        FeatureLayer {
            id: featureLayer
            featureTable: featureServiceTable
            ColorAnimation on selectionColor {
                to: "red"
                duration: 1000
            }
       }

    Envelope {
            id: sfExtent
            xMin: -13646875.937461125
            yMin: 4537864.794149817
            xMax: -13619530.59059214
            yMax: 4552731.796151265
            spatialReference: map.spatialReference
        }
    }

    Graphic {
        id: redPointGraphic
        symbol: SimpleMarkerSymbol{
            color: "red"
            style: Enums.SimpleMarkerSymbolStyleCircle
            size: 6
        }
    }

    Graphic {
        id: polygonGraphic
        symbol: SimpleFillSymbol {
            color: Qt.rgba(0.5, 0, 0.0, 0.25)
            outline: SimpleLineSymbol {
                color:"orange"
                style: Enums.SimpleLineSymbolStyleDashDot
                width: 4
            }
        }
    }

    MultiPoint {
        id: points
        spatialReference: {"latestWkid": 3857,"wkid":102100}
    }


    Polygon {
        id: userPolygon
        spatialReference: map.spatialReference
    }

    Rectangle {
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
             }
         }

        Column {
               id: controlsColumn
               x: 283
               anchors.rightMargin: 23
               anchors.topMargin: 27
               spacing: 4
               anchors {
                        right: parent.right
                        top: titleRect.bottom
                        margins: 30 * scaleFactor
                       }

             //Click this button to add polygon
             Button {
                id: generateButton
                width: 94
                text: "Add Polygon"
                enabled: true
                style: ButtonStyle {
                     label: Text {
                       renderType: Text.NativeRendering
                       verticalAlignment: Text.AlignHCenter
                       horizontalAlignment: Text.AlignHCenter
                       font.pixelSize: 25 * scaleFactor
                       color: enabled ? "black" : "gray"
                       text: control.text
                                  }
                                }
                 onClicked: {
                               isDone = true;
                            }
                    }

              Button {
                text: "Clear Polygon"
                style: generateButton.style
                enabled: true
                onClicked: {
                     if (userPolygon.pathCount > 0)
                            userPolygon.removePath(0);
                            isDone = false;
                            firstPoint = true;
                            featureLayer.clearSelection();
                            graphicsLayer.removeAllGraphics();
                        }
                    }
                }

        function addPoint(mapPoint, mousex, mousey) {
            //newPoint will clone the graphic we defined as redPointGraphic
            var newPoint = redPointGraphic.clone();
            var graphicClone = polygonGraphic.clone();
            if(firstPoint) {
                firstPoint = false;
                //Polygon Class inherited from MultiPath method: startPath,
                //use the mapPoint (x,y) to reflect the user mouse click on map
                userPolygon.startPath(mapPoint.x, mapPoint.y);
                console.log("First point click location is: " + mapPoint.x, mapPoint.y)
                graphicClone.geometry = userPolygon;
                polyGraphicId = graphicsLayer.addGraphic(graphicClone);

                newPoint.geometry = mapPoint;
                graphicsLayer.addGraphic(newPoint);

            } else {
                var featureIds = featureLayer.findFeatures(mousex, mousey, 5, 1);
                if (featureIds.length == 0) {
                    //Check if any point features that fall within the mouse click range,
                    //if no points fall the tolerance range just add mouse point
                    userPolygon.lineTo(mapPoint.x, mapPoint.y);
                    console.log("Mouse click location: " + mapPoint.x, mapPoint.y)
                    graphicClone.geometry = userPolygon;
                    graphicsLayer.updateGraphic(polyGraphicId,graphicClone);

                    newPoint.geometry = mapPoint;
                    graphicsLayer.addGraphic(newPoint);

                } else {
                    //mouse click location close enough to the point feature,
                    //then snap the features's point as the next vertix of graphic polygon
                    var selectedFeatureId = featureIds[0];
                    var selectedFeature = featureServiceTable.feature(selectedFeatureId);
                    var selectedPoint =selectedFeature.geometry

                    userPolygon.lineTo(selectedPoint.x, selectedPoint.y);
                    console.log("Point feature location: " + selectedPoint.x, selectedPoint.y)
                    graphicClone.geometry = userPolygon;
                    graphicsLayer.updateGraphic(polyGraphicId,graphicClone);

                    newPoint.geometry = selectedPoint;
                    graphicsLayer.addGraphic(newPoint);
                    featureIds = null;
                }
            }
        }
}
