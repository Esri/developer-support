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
//
import QtQuick 2.3
import QtQuick.Controls 1.2
import QtQuick.Controls.Styles 1.2
import ArcGIS.Runtime 10.26
import ArcGIS.Runtime.Toolkit.Controls 1.0

ApplicationWindow {
    id: appWindow
    width: 800
    height: 600
    title: "Snap points from existing feature to new polygon"

    property double scaleFactor: System.displayScaleFactor
    property int numberOfClicks: 0
    property bool firstPoint: true
    property bool isDone: false
    property int polyGraphicId

    Map {
        id: map
        anchors.fill: parent
        wrapAroundEnabled:  true
        focus: true

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

        NavigationToolbar {
            id: navigationToolbar
            map: map
            anchors {
                top: parent.top
                left: parent.left
                margins:15
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
            xMin: -13638047.46069416
            yMin: 4542259.923276166
            xMax: -13624374.787259668
            yMax: 4549693.424276889
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
             }
         }

        Column {
               id: controlsColumn
               anchors.rightMargin: 21
               anchors.topMargin: 21
               spacing: 4
               anchors {
                        right: parent.right
                        top: parent.top
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
