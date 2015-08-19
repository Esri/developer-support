
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

ApplicationWindow {
    id: appWindow
    width: 800
    height: 600
    title: "Overview-Map-Sample"

    Map {
        id: mainMap
        anchors.fill: parent

        focus: true

        ArcGISTiledMapServiceLayer {
            url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
        }

        Point {
            id: startingPoint
            x: -8416364.298
            y: 4628331.280
        }

        onStatusChanged:
        {
            if(status == Enums.MapStatusReady)
            {
                mainMap.zoomTo(startingPoint)
            }

        }

        onExtentChanged: redBox.geometry = mainMap.extent

    }


    //This is the portion that demonstrated the overview map being created...

        Rectangle {
            id: overviewRectangle

            anchors.right: mainMap.right
            anchors.top: mainMap.top

            width: 250
            height: 150

            color: "lightgrey"
            radius: 5
            border.color: "black"
            opacity: 0.77

            Map {
                id: overviewMap
                anchors.fill: overviewRectangle

                focus: true

                ArcGISTiledMapServiceLayer {
                    url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
                }

                wrapAroundEnabled: true

                GraphicsLayer {
                    id: graphicLayer

                    Graphic {
                        id: redBox
                        geometry: Polygon {
                        }
                        symbol: SimpleFillSymbol {
                            color: "transparent"
                            outline: SimpleLineSymbol {
                                color: "red"
                            }
                        }
                        attributes: {
                            "description": "Extent"
                        }
                        drawOrder: 1
                        visible: true
                        selected: false
                    }
                }

                extent: mainMap.extent.scale(4)
            }

    }

}
