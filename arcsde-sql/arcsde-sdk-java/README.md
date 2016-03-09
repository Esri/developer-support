ArcSDE SDK for Java
===================

Insert points, lines and polygons using the ArcSDE SDK for Java

## Features

* Demonstrates making direct connections to geodatabases.
* Demonstrates creating tables and enabling those tables as spatial layers.
* Demonstrates creating geometries through coordinate pairs.
* Demonstrates inserting geometries into the feature class.
=======

#### Direct connections:
* The instance name variable should follow direct connect syntax for desired DBMS.
* SQL Server: ```sde:sqlserver:db_server```
* Oracle:     ```sde:oracle11g```

[ArcSDE Connection Syntax](http://webhelp.esri.com/arcgisserver/9.3/dotnet/index.htm#geodatabases/arcsde-2034353163.htm)
#### Direct connections to an Oracle geodatabase:
* For full Oracle client connections, supply an empty string for database name.  Append the TNS name to the password. password@tnsname
* For Oracle Instant Client connections, supply an empty string for database name.  Append the ezconnect string to the password  'password@server/SID'

[ArcSDE SDK API - Java](http://help.arcgis.com/en/geodatabase/10.0/sdk/arcsde/api/japi/japi.htm)
