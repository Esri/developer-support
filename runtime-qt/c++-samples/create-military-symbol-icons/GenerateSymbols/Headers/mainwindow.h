#ifndef MAINWINDOW_H
#define MAINWINDOW_H

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
class MessageGroupLayer;
class MessageProcessor;
class Message;
}

#include <QMainWindow>
#include <QVBoxLayout>
#include <QMainWindow>
#include <QXmlStreamReader>
#include <QPushButton>
#include <QFile>
#include "MessageGroupLayer.h"
#include "GraphicsLayer.h"

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

public slots:
    void onBasemapReady();
    void onButtonClicked();

private:
    void addMessage(QList<QString> currentMessage, bool createIcon);
    void createButton(QString imagePath, QString name);
    void createMessages();
    void delay();

    QSize* myIconSize;   //The size of the icon to be created

    EsriRuntimeQt::Map* m_map;
    EsriRuntimeQt::MapGraphicsView* m_mapGraphicsView;
    EsriRuntimeQt::MessageGroupLayer* m_messageGroupLayer;
    EsriRuntimeQt::MessageProcessor* m_messageProcessor;
    EsriRuntimeQt::ArcGISTiledMapServiceLayer* m_basemap;
    EsriRuntimeQt::GraphicsLayer* tempGraphicsLayer;
    EsriRuntimeQt::Message* message;
    QVBoxLayout* buttonLayout;
    QPushButton* m_runBtn;
    //QList of QList's to contain the military messages
    QList< QList<QString> > messages;
};

#endif // MAINWINDOW_H
