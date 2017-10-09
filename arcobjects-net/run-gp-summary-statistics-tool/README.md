# Sample code for running Geoprocessing summary statistics tool.

Three inputs parameters
(1)input layer location
(2)output location
(3) summary field followed by summary method - in this case "MAX" - maximium value

[Documentation on Running GP tool in .NET](http://help.arcgis.com/en/sdk/10.0/arcobjects_net/conceptualhelp/index.html#//0001000003rr000000)

## Features

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRI.ArcGIS.Geoprocessing;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS;



