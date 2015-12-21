

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

ApplicationWindow {
    id: appWindow
    width: 800
    height: 600
    title: "Travel Application"

    property bool capturePoints: false
    property double scaleFactor: System.displayScaleFactor
    property int numberOfClicks: 0;
    property int numberOfDate: 0;
    property Point previousPoint;
    property Point prPoint;
    property date previousTime;
    property date lastPointTime;
    property date nextPointTime;

    Map {
        id: map
        anchors.fill: parent

        focus: true

        ArcGISTiledMapServiceLayer {
            url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
        }

        onStatusChanged: {
            if (status === Enums.MapStatusReady) {
                ps.active = true;
                map.addLayer(graphicsLayer)
                graphicsLayer.addGraphic(graphic)
            }
        }

        positionDisplay {
            id: pd
            zoomScale: 17
            mode: Enums.AutoPanModeCompass;
            positionSource: PositionSource {
                id: ps
            }
            onMapPointChanged: {
                console.log(capturePoints)
                if (pd.geoPoint.x != 0 && pd.geoPoint.y != 0 && capturePoints)
                {
                    if (numberOfClicks == 0) {
                        previousPoint = pd.mapPoint
                        console.log(numberOfClicks)
                        featureLine.startPath(pd.mapPoint.x, pd.mapPoint.y)
                        numberOfClicks++;
                        graphic.geometry = featureLine
                        graphic.symbol = simpLine
                        prPoint = pd.mapPoint
                        lastPointTime = new Date
                    }
                    else{
                        nextPointTime = new Date
                        tempLine.startPath(prPoint)
                        tempLine.lineTo(pd.mapPoint)
                        text3.text = ((tempLine.calculateLength2D() * .000621371)/ ((nextPointTime.getTime() - lastPointTime.getTime())*0.000000278)).toFixed(2) + "MpH"
                        text4.text = ((((nextPointTime.getTime() - lastPointTime.getTime())*0.000000278) * 60) / (tempLine.calculateLength2D() * .000621371)).toFixed(2) +"minutsPerMile"

                        tempLine.closeAllPaths()
                        tempLine.removePath(-1)
                        prPoint = pd.mapPoint
                        lastPointTime = nextPointTime

                        featureLine.lineTo(pd.mapPoint.x, pd.mapPoint.y)
                        graphic.geometry = featureLine
                        graphic.symbol = simpLine
                        text2.text = (featureLine.calculateLength2D() * .000621371).toFixed(2) + " miles"
                    }
                }
            }
        }

        GeodatabaseFeatureServiceTable {
            id: featureServiceTable
            url: "http://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/runningRoutes/FeatureServer/0"
        }

        Rectangle {
            id: rectangle1
            width: parent.width
            anchors.top: parent.top
            anchors.left: parent.left

            Text {
                id: text1
                x: 143
                y: 8
                text: qsTr("Elapsed Time")
                font.pixelSize: 2 * scaleFactor
                anchors.top: parent.top
                anchors.left: parent.left
            }

            Text {
                id: text2
                x: 640
                y: 8
                text: qsTr("Distance")
                font.pixelSize: 2 * scaleFactor
                anchors.top: parent.top
                anchors.right: parent.right
            }

            Text {
                id: text3
                x: 143
                y: 66
                text: qsTr("Mph")
                font.pixelSize: 2 * scaleFactor
                anchors.top: text1.bottom
                anchors.left: parent.left
            }

            Text {
                id: text4
                x: 640
                y: 66
                text: qsTr("Pace")
                font.pixelSize: 2 * scaleFactor
                anchors.top: text2.bottom
                anchors.right: parent.right
            }
        }

        GraphicsLayer {
            id: graphicsLayer
        }

        SimpleLineSymbol {
            id: simpLine
            color: "black"
            width: 6
            style: Enums.SimpleLineSymbolStyleDot
        }

        Graphic {
            id: graphic
        }

        FeatureLayer {
            id: featureLayer
            featureTable: featureServiceTable
        }

        Polyline {
            id: featureLine
            spatialReference: {
                "latestWkid": 3857,
                        "wkid": 102100
            }
        }

        Polyline {
            id: tempLine
            spatialReference: {
                "latestWkid": 3857,
                        "wkid": 102100
            }
        }

        Button {
            id: button1
            x: 40
            y: 548
            text: qsTr("Start")
            anchors.bottom :  parent.bottom
            anchors.left: parent.left

            onClicked: {
                capturePoints = true
                enabled = false
                button2.enabled = true
                stopwatch.start()
            }
        }

        Button {
            id: button2
            x: 695
            y: 554
            text: qsTr("Stop")
            anchors.bottom: parent.bottom
            anchors.right: parent.right
            enabled: false
            onClicked: {
                capturePoints = false
                enabled = false
                button1.enabled = true
                stopwatch.stop()
                numberOfDate = 0
                featureLine.closeAllPaths()
                var featureToAdd = ArcGISRuntime.createObject("Feature")
                featureToAdd.geometry = featureLine
                featureServiceTable.addFeature(featureToAdd)
                featureServiceTable.applyFeatureEdits()
                while (featureLine.pathCount > 0) {
                    featureLine.removePath(-1)
                }
                graphic.geometry = featureLine
                numberOfClicks = 0;
            }
        }


    }

    Timer {
            id: stopwatch

            interval:  100
            repeat:  true
            running: false
            triggeredOnStart: true

            onTriggered: {
                if (numberOfDate == 0)
                {
                    previousTime = new Date
                    numberOfDate++;
                }
                else
                {
                    var currentTime = new Date
                    var delta = (currentTime.getTime() - previousTime.getTime())
                    text1.text = toTime(delta)
                }
            }
        }

    function toTime(usec) {

        var mod = Math.abs(usec)
        return (usec < 0 ? "-" : "") +
                (mod >= 3600000 ? Math.floor(mod / 3600000) + ':' : '') +
                zeroPad(Math.floor((mod % 3600000) / 60000)) + ':' +
                zeroPad(Math.floor((mod % 60000) / 1000)) + '.' +
                Math.floor((mod % 1000) / 100)
    }

    function zeroPad(n) {

        return (n < 10 ? "0" : "") + n

    }

}
