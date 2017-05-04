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

#include "onlineRouting.h"
#include <QtNetwork>
#include <QNetworkProxy>
#include "MapGraphicsView.h"
#include "Map.h"
#include "ArcGISRuntime.h"
#include "ArcGISTiledMapServiceLayer.h"
#include <Point.h>
#include <Route.h>
#include <RouteTask.h>
#include <OnlineRouteTask.h>
#include <SpatialReference.h>
#include <StopGraphic.h>
#include <Geometry.h>

onlineRouting::onlineRouting(QWidget *parent)
    : QMainWindow(parent)
{
    m_map = new EsriRuntimeQt::Map(this);

    //// connect to signal that is emitted when the map is ready
    //// the mapReady signal is emitted when the Map has obtained a
    //// spatial reference from an added layer
    connect(m_map, SIGNAL(mapReady()), this, SLOT(onMapReady()));

    m_mapGraphicsView = EsriRuntimeQt::MapGraphicsView::create(m_map, this);
    setCentralWidget(m_mapGraphicsView);
    m_map->setWrapAroundEnabled(false);

    QString path = EsriRuntimeQt::ArcGISRuntime::installDirectory();
    path.append("/sdk/samples/data");
    QDir dataDir(path); // using QDir to convert to correct file separator
    QString pathSampleData = dataDir.path() + QDir::separator();

    //// ArcGIS Online Tiled Basemap Layer
    m_tiledServiceLayer = new EsriRuntimeQt::ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer", this);
    m_map->addLayer(m_tiledServiceLayer);

    EsriRuntimeQt::SpatialReference spRef(102100);

    qDebug() << "Starting";
    EsriRuntimeQt::UserCredentials* userCreds = new EsriRuntimeQt::UserCredentials;
    qDebug() << "Entering Creds";
    userCreds->setUserAccount("USERNAME", "PASSWORD");
    userCreds->setTokenServiceUrl("https://arcgis.com/sharing/rest/generateToken");

    qDebug() << "Adding points";

    EsriRuntimeQt::Point fStop(-8992692.876936214, 4177474.740788635, spRef);
    EsriRuntimeQt::Point sStop(-8999273.570710145, 4171243.683085704, spRef);



    qDebug() << "Adding stopGraphics";
    EsriRuntimeQt::StopGraphic stop(fStop);
    EsriRuntimeQt::StopGraphic stop2(sStop);

    qDebug() << "Adding stopFeaturess";
    EsriRuntimeQt::NAFeaturesAsFeature stopFeatures;
    stopFeatures.addFeature(&stop);
    stopFeatures.addFeature(&stop2);

    qDebug() << "Setting up routing";
    EsriRuntimeQt::OnlineRouteTask& InRoutingTask = EsriRuntimeQt::OnlineRouteTask("https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", userCreds) ;

    qDebug() << "Entering params";
    EsriRuntimeQt::OnlineRouteTaskParameters* IParameters = new EsriRuntimeQt::OnlineRouteTaskParameters(InRoutingTask.defaultParameters());
    IParameters->setOutSpatialReference(spRef);
    IParameters->setReturnRoutes(true);
    IParameters->setStops(&stopFeatures);

    qDebug() << "Getting results";
    EsriRuntimeQt::RoutingResult *routeResults = InRoutingTask.solveAndWait(IParameters);
    qDebug() << "Solve completed";


    QList<EsriRuntimeQt::Route> routes = routeResults->routes();

    qDebug() << "Writing a list";
    for(int i = 0; i < routes.count(); i++)
    {
        qDebug() << "The miles of the trip are: " << routes.at(i).totalMiles();
    }
}

onlineRouting::~onlineRouting()
{

}


void onlineRouting::onMapReady()
{

}
