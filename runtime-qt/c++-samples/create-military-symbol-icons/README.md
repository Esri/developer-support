#Generate icons from military symbols
##About
The MessageProcessor class of Qt Runtime API can create thousands of different military symbols based on the attributes of a message sent to it. The Symbol class can also create images based on the symbol that created it. This sample shows how to spin these two pieces of functionality together to create button icons for military symbols. Included in this sample is a video showing the application in action.
##The Logic
Creating images from Military Symbols is a bit more complicated than creating an image from say a SimpleMarkerSymbol.
First create the message group layer and access the message processor
```C++
m_messageGroupLayer = new EsriRuntimeQt::MessageGroupLayer(EsriRuntimeQt::SymbolDictionaryType::Mil2525C, 2, this);
m_map->addLayer(m_messageGroupLayer);
m_messageProcessor = m_messageGroupLayer->messageProcessor();
```
Generate the attributes for each message you would like to create icons for.
```C++
QList<QString> message1;
message1.append(QString("position_report"));
message1.append(QString("update"));
message1.append(QString("-122.41559344990662,37.67343976212521"));
message1.append(QString("OHGD-----------"));
message1.append(QString("4326"));
message1.append(QString("image1.png"));
message1.append(QString("messageBtn1"));
addMessage(message1, true);
```
Based on the attributes specified above generate a message using the message processor.
```C++
EsriRuntimeQt::Message* message = new EsriRuntimeQt::Message();
QString uuidString = QUuid::createUuid().toString();
message->setMessageId(uuidString);
message->setProperty(QString("_type"), currentMessage[0]);
message->setProperty(QString("_action"), currentMessage[1]);
message->setProperty(QString("_control_points"), currentMessage[2]);
message->setProperty(QString("sic"), currentMessage[3]);
message->setProperty(QString("_wkid"), currentMessage[4]);
message->setProperty(QString("uniquedesignation"), QString("mainSymbol"));
message->setProperty(QString("x"), QString("fast"));
m_messageProcessor->processMessage(*message);
```
Retrieve the message and cast it to a graphic. Access the symbol of the graphic and use it's createSymbolImage method to create an icon based on the military message symbol.
```C++
EsriRuntimeQt::Graphic* graphic2Save =  m_messageGroupLayer->messageProcessor()->graphic(uuidString);
EsriRuntimeQt::Symbol mySymbol = graphic2Save->symbol();
QImage image = mySymbol.createSymbolImage(graphic2Save->geometry(), 50, 50, QColor(255, 255, 255));
m_messageGroupLayer->removeAllLayers();
image.save(currentMessage[5]);
```