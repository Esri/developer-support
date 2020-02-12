#include "mainwindow.h"
#include "Map.h"
#include "MapGraphicsView.h"
#include "ArcGISTiledMapServiceLayer.h"
#include "SymbolDictionary.h"
#include "Message.h"
#include "MessageGroupLayer.h"
#include "MessageProcessor.h"
#include <QIcon>
#include <QPushButton>
#include <QVBoxLayout>
#include <QApplication>
#include <iostream>

using namespace std;

MainWindow::MainWindow(QWidget *parent) : QMainWindow(parent)
{
    m_map = new EsriRuntimeQt::Map(this);

    m_mapGraphicsView = EsriRuntimeQt::MapGraphicsView::create(m_map, this);
    setCentralWidget(m_mapGraphicsView);
    m_map->setWrapAroundEnabled(false);

    EsriRuntimeQt::ArcGISTiledMapServiceLayer* m_basemap = new EsriRuntimeQt::ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/ESRI_StreetMap_World_2D/MapServer", this);
    m_map->addLayer(m_basemap);

    //Once the basemap has initialized execute the delay function
    connect(m_basemap, SIGNAL(layerCreateComplete()), this, SLOT(onBasemapReady()));

    //Create a message group layer
    m_messageGroupLayer = new EsriRuntimeQt::MessageGroupLayer(EsriRuntimeQt::SymbolDictionaryType::Mil2525C, 2, this);
    m_map->addLayer(m_messageGroupLayer);

    //Create a message processor from the message group layer
    m_messageProcessor = m_messageGroupLayer->messageProcessor();

    //Create the icon size object and a panel to hold the buttons
    myIconSize = new QSize(50, 98);
    buttonLayout = new QVBoxLayout(m_mapGraphicsView);

    m_mapGraphicsView->setLayout(buttonLayout);
    setCentralWidget(m_mapGraphicsView);
}

MainWindow::~MainWindow()
{
}

void MainWindow::onBasemapReady() {
    //Call the delay button
    delay();
}

void MainWindow::createButton(QString imagePath, QString name) {
     //Grab the image from the file location
     QIcon* myIcon = new QIcon(imagePath);
     //Create a new QPushButton using the image as the background
     QPushButton* button = new QPushButton(*myIcon, "", m_mapGraphicsView);
     button->setObjectName(name);
     button->setFixedHeight(100);
     button->setFixedWidth(100);
     button->setIconSize(*myIconSize);
     //Add a click event to the button
     connect(button, SIGNAL(clicked()), this, SLOT(onButtonClicked()));
     //Add the button to the UI
     buttonLayout->addWidget(button);
}

void MainWindow::addMessage(QList<QString> currentMessage, bool createIcon){
    //Create a new message
    EsriRuntimeQt::Message* message = new EsriRuntimeQt::Message();
    //Create a unique identifier for the message
    QString uuidString = QUuid::createUuid().toString();
    message->setMessageId(uuidString);
    message->setProperty(QString("_type"), currentMessage[0]);
    message->setProperty(QString("_action"), currentMessage[1]);
    message->setProperty(QString("_control_points"), currentMessage[2]);
    message->setProperty(QString("sic"), currentMessage[3]);
    message->setProperty(QString("_wkid"), currentMessage[4]);
    message->setProperty(QString("uniquedesignation"), QString("mainSymbol"));
    message->setProperty(QString("x"), QString("fast"));
    //Pass the message to the message processor
    m_messageProcessor->processMessage(*message);
    //Create a graphic from the message
    EsriRuntimeQt::Graphic* graphic2Save =  m_messageGroupLayer->messageProcessor()->graphic(uuidString);
    //If the createIcon parameter is true create an icon based on the message
    if(createIcon == true) {
        //Create a symbol object from the graphic's symbol
        EsriRuntimeQt::Symbol mySymbol = graphic2Save->symbol();
        //Use the symbol's createSymbolImage method to create a QImage.
        QImage image = mySymbol.createSymbolImage(graphic2Save->geometry(), 50, 50, QColor(255, 255, 255));
        m_messageGroupLayer->removeAllLayers();
        //Save the image with the give file name
        image.save(currentMessage[5]);
        //Create a button using the image as it's background
        createButton(currentMessage[5], currentMessage[6]);
    }
    else {
        //Zoom to the message
        m_map->setExtent(EsriRuntimeQt::Envelope(-122.5, 37.5, -122.2, 38, EsriRuntimeQt::SpatialReference(4326)));
    }
}

void MainWindow::delay(){
    //If the code executes before the message group layer has initialized the application will crash.
    //Wait a second to ensure everything is ready. There is no way I am aware of to ensure the MessageProcessor
	//has "Initialized".
    QTime dieTime = QTime::currentTime().addSecs(1);
    while (QTime::currentTime() < dieTime){
        QCoreApplication::processEvents(QEventLoop::AllEvents, 100);
    }
    createMessages();
}

//Send the message to the processor when the button is clicked
void MainWindow::onButtonClicked() {
    //Get the name of the button that sent the message
    QString buttonName = QObject::sender()->objectName();
    //Check to see what the name of the button was
    if(buttonName == messages[0][6]) {
        addMessage(messages[0], false);
    }
    if(buttonName == messages[1][6]) {
        addMessage(messages[1], false);
    }
    if(buttonName == messages[2][6]) {
        addMessage(messages[2], false);
    }
    if(buttonName == messages[3][6]) {
        addMessage(messages[3], false);
    }
    if(buttonName == messages[4][6]) {
        addMessage(messages[4], false);
    }
}

//This function creates the messages to display on the map
void MainWindow::createMessages(){
    //Messages are created as a QList of QStrings. In this case the location of the symbol is hardcoded.
    QList<QString> message1;
    message1.append(QString("position_report"));
    message1.append(QString("update"));
    message1.append(QString("-122.41559344990662,37.67343976212521"));
    message1.append(QString("OHGD-----------"));
    message1.append(QString("4326"));
    message1.append(QString("image1.png"));
    message1.append(QString("messageBtn1"));
    //After the message has been created call the addMessage function
    addMessage(message1, true);

    QList<QString> message2;
    message2.append("position_report");
    message2.append("update");
    message2.append("-122.4167, 37.7833");
    message2.append("GFGPOPP-------X");
    message2.append("4326");
    message2.append("image2.png");
    message2.append(QString("messageBtn2"));
    addMessage(message2, true);

    QList<QString> message3;
    message3.append("position_report");
    message3.append("update");
    message3.append("-122.40496220562436,37.761494340981166");
    message3.append("SFGPUH-----E---");
    message3.append("4326");
    message3.append("image3.png");
    message3.append(QString("messageBtn3"));
    addMessage(message3, true);

    QList<QString> message4;
    message4.append("position_report");
    message4.append("update");
    message4.append("-122.48091660983289,37.71942287197732");
    message4.append("SFGPU------F---");
    message4.append("4326");
    message4.append("image4.png");
    message4.append(QString("messageBtn4"));
    addMessage(message4, true);

    QList<QString> message5;
    message5.append("position_report");
    message5.append("update");
    message5.append("-122.48899163778705,37.77978895443526");
    message5.append("SFGPUCII---F---");
    message5.append("4326");
    message5.append("image5.png");
    message5.append(QString("messageBtn5"));
    addMessage(message5, true);

   //Add each message to the master list
   messages.append(message1);
   messages.append(message2);
   messages.append(message3);
   messages.append(message4);
   messages.append(message5);
}
