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

    property double scaleFactor: System.displayScaleFactor
    property bool firstPoint: true
    property bool isDone: false
    property int polyGraphicId
    property int counter: 0

    Rectangle {
        id: titleRect
        height: titleText.paintedHeight + titleText.anchors.margins * 2
        color: "Green"
        anchors {
            left: parent.left
            right: parent.right
            top: parent.top
        }
    }

    Text {
        id: titleText
        anchors {
            left: parent.left
            right: parent.right
            top: parent.top
            margins: 2 * AppFramework.displayScaleFactor
        }

        text: "Draw polygons on map and snap points from feature service"
        color: "white"
        font {
            pointSize: 20
        }
        wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        maximumLineCount: 2
        elide: Text.ElideMiddle
        horizontalAlignment: Text.AlignHCenter
    }


    Rectangle {
        id: buttomRect
        y: 608
        height: buttomText.paintedHeight + buttomText.anchors.margins * 2
        color: "Orange"
        anchors.rightMargin: 0
        anchors.leftMargin: 0
        anchors {
            left: parent.left
            right: parent.right
            top: parent.buttom
        }
    }

    Text {
        id: buttomText
        y: 608
        height: 32
        anchors {
            left: parent.left
            right: parent.right
            top: titleRect.buttom
            margins: 2 * AppFramework.displayScaleFactor
        }
        text:"To start editing: Click 'Start Editing' button every time
To finish editing: Press and hold the mouse in 2-3 seconds"
        anchors.rightMargin: 0
        anchors.leftMargin: 0
        font: {
            pointSize: 17
        }
        color: "black"
        wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        maximumLineCount: 2
        elide: Text.ElideMiddle
        horizontalAlignment: Text.AlignLeft
    }

    Map {
        id: map
        anchors.rightMargin: 0
        anchors.bottomMargin: 32
            anchors.leftMargin: 0
            anchors.topMargin: 0
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
            url: "http://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer"
        }

        ArcGISTiledMapServiceLayer {
            url: "http://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer"
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
        onMousePressAndHold: {
            if(isDone == true) {
                finishdraw()
            }
            finishFlash.start()
        }

        onStatusChanged: {
            if (status === Enums.MapStatusReady) {
                map.zoomTo(sfExtent);
                addLayer(graphicsLayer)
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

    Text{
        font.pointSize: 30
        color:"Orange"
        id: starEdit
        text: "Drawing"
        opacity: 0
        anchors {
            top: titleRect.bottom
        }

        SequentialAnimation{
            id: editFlash;
            OpacityAnimator{
                target: starEdit;
                from: 0;
                to: 1;
                duration: 1050

            }
            OpacityAnimator{
                target: starEdit;
                from: 1;
                to: 0;
                duration: 1050
            }
        }
    }

    Text{
        font.pointSize: 30
        id: clear
        color:"Orange"
        text: "Graphic cleared"
        opacity: 0
        anchors {
            top: titleRect.bottom
        }

        SequentialAnimation{
            id: clearFlash;
            OpacityAnimator{
                target: clear;
                from: 0;
                to: 1;
                duration: 1050

            }
            OpacityAnimator{
                target: clear;
                from: 1;
                to: 0;
                duration: 1050
            }
        }
    }

    Text{
        font.pointSize: 30
        id: finish
        color:"Orange"
        text: "Finish Draw"
        opacity: 0
        anchors {
            top: titleRect.bottom
        }

        SequentialAnimation{
            id: finishFlash;
            OpacityAnimator{
                target: finish;
                from: 0;
                to: 1;
                duration: 1050

            }
            OpacityAnimator{
                target: finish;
                from: 1;
                to: 0;
                duration: 1050
            }
        }
    }

    Column {
        id: controlsColumn
        x: 283
        y: 75
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
            width: 100
            text: "Start Editing"
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
                editFlash.start()
            }
        }

        Button {
            text: "Clear Graphics"
            style: generateButton.style
            enabled: true
            onClicked: {
                var numberPolygonDraw = userPolygon.pathCount;
                for (counter; counter < numberPolygonDraw; counter++){
                    userPolygon.removePath(0);
                }
                isDone = false;
                firstPoint = true;
                featureLayer.clearSelection();
                graphicsLayer.removeAllGraphics();
                clearFlash.start()
            }
        }
    }

    function finishdraw() {
        var featureAdd = ArcGISRuntime.createObject("Feature")
        featureAdd.geometry = userPolygon
        featureAdd.setAttributeValue("symbolid","1")
        graphicsLayer.addGraphic(featureAdd)
        console.log("Feature added")

        //Once long press and hold the mouse, it indicates that on polygon is finished.
        //Press "Start Editing" button to draw another polygon
        //Reset the flags
        isDone = false
        firstPoint = true

        //clear the extra unnecessary remaining polygon skatches
        if (userPolygon.pathCount > 0)
        userPolygon.removePath(0);
    }

    function addPoint(mapPoint, mousex, mousey) {
        //newPoint will clone the graphic we defined as redPointGraphic
        var newPoint = redPointGraphic.clone();
        var graphicClone = polygonGraphic.clone();
        if(firstPoint) {
            firstPoint = false
            //Polygon Class inherited from MultiPath method: startPath,
            //use the mapPoint (x,y) to reflect the user mouse click on map
            userPolygon.startPath(mapPoint.x, mapPoint.y);
            console.log("First point click location is: " + mapPoint.x, mapPoint.y)
            graphicClone.geometry = userPolygon;
            polyGraphicId = graphicsLayer.addGraphic(graphicClone);

            newPoint.geometry = mapPoint;
            graphicsLayer.addGraphic(newPoint);

        } else {
            var featureIds = featureLayer.findFeatures(mousex, mousey, 15, 1);
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