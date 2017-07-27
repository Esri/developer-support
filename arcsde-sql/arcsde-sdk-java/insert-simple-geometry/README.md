
## Insert Simple Geometry

Insert points, lines and polygons using the ArcSDE SDK for Java

## Features

* Demonstrates connecting to geodatabases.
* Demonstrates creating tables and enabling those tables as spatial layers.
* Demonstrates creating geometries through coordinate pairs.
* Demonstrates inserting geometries into the feature class.

### Java SeConnection Direct Connection Example (Oracle):
Using Oracle's EZConnect syntax on the password:
```java

String server = "MyDBServer";
String database = "";
String user = "sde";
String password = "sde@MyDBServer/sde1041";
String instance = "sde:oracle11g";

SeConnection conn = new SeConnection(server, instance, database, user, password);
```

### Java SeConnection Direct Connection Example (SQL Server):
Unlike Oracle, the database name is required.
```java

String server = "MyDBServer\\Instance_Name";
String database = "MyDatabase";
String user = "sde";
String password = "sde";
String instance = "sde:sqlserver:MyDBServer\\Instance_name";

SeConnection conn = new SeConnection(server, instance, database, user, password);
```

[ArcSDE SDK API - Java](http://help.arcgis.com/en/geodatabase/10.0/sdk/arcsde/api/japi/japi.htm)
