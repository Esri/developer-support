# How to send feature service SOAP Update request 
This xml sample shows how to send a proper feature service SOAP Update request.

You may import this xml and execute it in SoapUI (view free download here http://www.soapui.org/downloads/soapui.html) or other third party software like Microsoft BizTalk that uses xml to send SOAP request.

This sample code is based on the an esri Fire Feature Server:
http://sampleserver3.arcgisonline.com/ArcGIS/services/Fire/Sheep/MapServer/FeatureServer?wsdl
To test it, you may copy the xml directly in SOAP UI Request.

[Documentation on Feature service Update method]
(http://resources.arcgis.com/en/help/soap/10.1/index.html#/Update/01vp00000056000000/)

## Features
* Uses feature service
* Uses Update method in SOAP API
* Constructs DataObjects, DataObjectArray, DataObject 
* This code is used for updating existing features, in this case, the feature with OBJECTID = 4
