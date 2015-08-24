
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
    title: "App Tracks"

    property variant definitionAttribute: "test";

    Map {
        id: mainMap
        anchors.fill: parent

        focus: true

        onStatusChanged: {
                    if (status === Enums.MapStatusReady) {
                        ps.active = true;
                    }
        }

        ArcGISTiledMapServiceLayer {
            url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
        }

        GeodatabaseFeatureServiceTable {
                    id: featureServiceTable
                    url: "http://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/NothingInIt/FeatureServer/0"
                }

        FeatureLayer {
            id: featureLayer
            featureTable: featureServiceTable
            definitionExpression: "ONE = '"+definitionAttribute+"'"

            function addTracked(feature)
            {
                if (featureTable.featureTableStatus === Enums.FeatureTableStatusInitialized) {
                    console.log(featureTable.addFeature(feature));
                    featureServiceTable.applyFeatureEdits();
                }
            }
        }

        Point {
            id: pointToAdd
            x: 100
            y: 100
            spatialReference: SpatialReference
            {
                wkid:3857
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
                if (pd.geoPoint.x != 0 && pd.geoPoint.y != 0)
                {
                    pointToAdd.setXY(pd.mapPoint.x, pd.mapPoint.y);
                    var featureToAdd = ArcGISRuntime.createObject("Feature");
                    featureToAdd.geometry = pointToAdd;
                    featureToAdd.setAttributeValue("One", "test");
                    console.log(featureToAdd.toString())
                    featureLayer.addTracked(featureToAdd);
                }
            }
        }
    }
}
