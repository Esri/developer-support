# How to send feature service SOAP Update request 
This xml sample shows how to send a proper feature service SOAP Update request. It is based on the following sample Feature Service:
http://sampleserver3.arcgisonline.com/ArcGIS/services/Fire/Sheep/MapServer/FeatureServer?wsdl


To test it, you may copy this xml and execute it in SoapUI (view free download here http://www.soapui.org/downloads/soapui.html) or other third party software like Microsoft BizTalk that uses xml to send SOAP request.

[Documentation on Feature service Update method]
(http://resources.arcgis.com/en/help/soap/10.1/index.html#/Update/01vp00000056000000/)

## Features
* Uses feature service
* Uses Update method in SOAP API
* Constructs DataObjects, DataObjectArray, DataObject 
* This code is used for updating existing features, in this case, the feature with OBJECTID = 4


```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns="http://www.esri.com/schemas/ArcGIS/10.1" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soapenv:Header/>
  <soapenv:Body>
     <ns:Update>
        <LayerOrTableID>0</LayerOrTableID>
        <DataObjects>
           <DataObjectArray xsi:type="ns:ArrayOfDataObject">
                 <DataObject xsi:type="ns:GraphicFeature">
                    <Properties xsi:type="ns:PropertySet">
                       <PropertyArray xsi:type="ns:ArrayOfPropertySetProperty">
                          <PropertySetProperty xsi:type="ns:PropertySetProperty">
                             <Key>OBJECTID</Key>
                             <Value xsi:type="xsd:int">1</Value>
                          </PropertySetProperty>
                          <PropertySetProperty xsi:type="ns:PropertySetProperty">
                             <Key>description</Key>
                             <Value xsi:type="xsd:string">Feel free to Change it</Value>
                          </PropertySetProperty>
                       </PropertyArray>
                    </Properties>
                 </DataObject>
              </DataObjectArray>
        </DataObjects>
        <GdbVersion></GdbVersion>
        <RollbackOnFailure>true</RollbackOnFailure>
        <RollbackOnFailureSpecified>true</RollbackOnFailureSpecified>
     </ns:Update>
  </soapenv:Body>
</soapenv:Envelope>
```
