# Java SQL with ST_Geometry
## Copy geometry from a feature class to an unregistered spatial table with its WKB representation.

*Requires a feature class with existing geometry and a second feature class of the same spatial type (point, line, polygon, etc.) This example assumes an empty second spatial table with an Integer ID column and an ST_Geometry shape (points) column.*

### Make a database connection:
Download the appropriate JDBC driver for your Oracle version.

[JDBC Driver download ](https://docs.oracle.com/javase/7/docs/api/java/sql/package-summary.html)

```Java
Connection conn = null;
...
..
try {
		Class.forName("oracle.jdbc.driver.OracleDriver");

		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    try {
    		conn = DriverManager.getConnection("jdbc:oracle:thin:@server_name:port:SID","username","password");
    	}
	catch(SQLException e) {
		  e.printStackTrace();
	}
    ...
    ..
    return conn;
```

### Select geometries as WKB from the existing feature class into a HashMap
Increment a simple integer and store each value as the feature ID.  Store the WKB geometry in a byte array.

```Java
Map<Integer, byte[]> shpText = new HashMap<>();
		int count = 0;
		Statement stmt = null;
		String query = "SELECT sde.st_asbinary(shape) as shp FROM gis.sample_points";

		try{
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while(rs.next()){
				count++;
				byte[] shp = rs.getBytes("shp");
				shpText.put(count, shp);
			}
		}
```

### Insert the values in the HashMap into the ID and Shape column using ST_PointFromWKB.  
Also included is a simple mechanism to commit inserts in batches.

```Java
try {
	conn.setAutoCommit(false);
	p_stmt = conn.prepareStatement(query);

	for (Map.Entry<Integer, byte[]> e : results.entrySet()) {
		count++;

		p_stmt.setInt(1, e.getKey().intValue());
		p_stmt.setBytes(2, e.getValue());
		p_stmt.executeUpdate();

		//commit throttle
		if((count % commit_throttle) == 0){
			System.out.println(count + " rows inserted...");
			conn.commit();
			System.out.println(count + " rows committed...");
		}
	}
```

#### Documentation
[Java.SQL](https://docs.oracle.com/javase/7/docs/api/java/sql/package-summary.html)

[Java JDBC Drivers (.jar)](http://www.oracle.com/technetwork/database/features/jdbc/index-091264.html)

[ST_AsBinary](http://desktop.arcgis.com/en/arcmap/10.3/manage-data/using-sql-with-gdbs/st-asbinary.htm)

[ST_PointFromWKB](http://desktop.arcgis.com/en/arcmap/10.3/manage-data/using-sql-with-gdbs/st-pointfromwkb.htm)
