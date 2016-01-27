# How to send feature service SOAP query request 
This xml sample shows how to send a proper feature service SOAP Update request. It is based on the following sample Feature Service: http://sampleserver3.arcgisonline.com/ArcGIS/services/Fire/Sheep/MapServer/FeatureServer?wsdl

To test it, you may copy this xml and execute it in SoapUI (view free download here http://www.soapui.org/downloads/soapui.html) or other third party software like Microsoft BizTalk that uses xml to send SOAP request.

[Documentation on Feature service Query method]
(http://resources.arcgis.com/en/help/soap/10.1/index.html#/Query/01vp00000047000000/)

## Features
* Uses feature service
* Uses Query method in SOAP API
* Uses where clause in query

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.esri.com/schemas/ArcGIS/10.1"> 
  <soapenv:Header/> 
    <soapenv:Body> 
      <ns:Query> 
         <LayerOrTableID>0</LayerOrTableID> 
         <DefinitionExpression></DefinitionExpression> 
         <QueryFilter> 
            <WhereClause>OBJECTID = 1</WhereClause> 
            <Resolution>0</Resolution> 
         </QueryFilter> 
         <ServiceDataOptions> 
            <Format>NATIVE</Format> 
         </ServiceDataOptions> 
         <GdbVersion></GdbVersion> 
        <MaximumAllowableOffset>0.0</MaximumAllowableOffset> 
      </ns:Query> 
   </soapenv:Body> 
 </soapenv:Envelope> 
```xml
