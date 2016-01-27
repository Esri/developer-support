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