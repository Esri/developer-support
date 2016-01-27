# How to send Geocode service GeocodeAddress SOAP request 
This xml sample shows how to send a geocode service GeocodeAddress SOAP request 
You may import this xml and execute it in SoapUI (view free download here http://www.soapui.org/downloads/soapui.html) or other third party software like Microsoft BizTalk that uses xml to send SOAP request

[Documentation on Feature service Update method]
(http://resources.arcgis.com/en/help/soap/10.1/index.html#/GeocodeAddress/01vp0000001v000000/)

## Features
* Uses geocode service
* Uses GeocodeAddress method in SOAP API
* Shows the structure of GeocodeAddress response
* Constructs PropertySetProperty as address to geocode 
* This sample shows two method (method1 and method2) to geocode an address based on the way address PropertySetProperty is constructed
* This sample shows an alternative way to send soap request instead of using C#.Net or Java (C# code sample: view the Documentation link above)

Service tested with:

[World Geocoding Service](http://geocode.arcgis.com/arcgis/services/World/GeocodeServer?wsdl)

### Method 1:

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.esri.com/schemas/ArcGIS/10.1">
   <soapenv:Header/>
   <soapenv:Body>
      <ns:GeocodeAddress>
         <Address>
            <PropertyArray>
               <!--Zero or more repetitions:-->
               <PropertySetProperty>
                  <Key>Address</Key>
                  <!--Optional:-->
                  <Value>3225 Springbank Ln, Charlotte, NC, 28226</Value>
               </PropertySetProperty>
            </PropertyArray>
         </Address>
      </ns:GeocodeAddress>
   </soapenv:Body>
</soapenv:Envelope>
```

### Method 2:

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.esri.com/schemas/ArcGIS/10.1">
   <soapenv:Header/>
   <soapenv:Body>
      <ns:GeocodeAddress>
         <Address>
            <PropertyArray>
               <PropertySetProperty>
                  <Key>Address</Key>
                  <Value>380 New York Street</Value>
               </PropertySetProperty>
               <PropertySetProperty>
                  <Key>City</Key>
                  <Value>Redlands</Value>
               </PropertySetProperty>
               <PropertySetProperty>
                  <Key>Region</Key>
                  <Value>CA</Value>
               </PropertySetProperty>
               <PropertySetProperty>
                  <Key>Postal</Key>
                  <Value>92373</Value>
               </PropertySetProperty>
            </PropertyArray>
         </Address>
      </ns:GeocodeAddress>
   </soapenv:Body>
</soapenv:Envelope>
```
