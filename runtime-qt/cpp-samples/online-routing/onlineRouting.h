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

#ifndef ONLINEROUTING_H
#define ONLINEROUTING_H

namespace EsriRuntimeQt
{
class MapGraphicsView;
class Map;
class ArcGISLocalTiledLayer;
class ArcGISTiledMapServiceLayer;
class ArcGISDynamicMapServiceLayer;
class ArcGISFeatureLayer;
class GraphicsLayer;
class FeatureLayer;
}

#include <QMainWindow>

class onlineRouting : public QMainWindow
{
    Q_OBJECT
public:
    onlineRouting (QWidget *parent = 0);
    ~onlineRouting ();

public slots:
     void onMapReady();

private:
    EsriRuntimeQt::Map* m_map;
    EsriRuntimeQt::MapGraphicsView* m_mapGraphicsView;
    EsriRuntimeQt::ArcGISTiledMapServiceLayer* m_tiledServiceLayer;
};

#endif // ONLINEROUTING_H
