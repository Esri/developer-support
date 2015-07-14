xy-to-point-cursor.sql
===================
The anonymous pg/plsql scripts allows one to use the existing X and Y coordinates of a table to insert geometry into an empty feature class.  Uses ST_GeomFromText for PostGIS data or ST_point 	for Esri ST_Geometry features.

----------


REQUIRED:

Enterprise PostgreSQL geodatabase.

Existing table with X and Y column (sample SQL to create this below).

Empty feature class to receive the calculation of X, Y values (Create this in ArcGIS).


DOCUMENTATION:

[PostGIS (pg_geometry)][1]

[Esri(ST_Geometry)][2]


TESTING SAMPLE DATA:

Create the test.xy table containing the coordinate values.
```sql
		CREATE TABLE sde.test_xy
		(
		  name character varying(255),
		  x_coord numeric(38,8),
		  y_coord numeric(38,8)
		)
```
		
Insert some initial values into the new test_xy table created above.
```sql
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ( 'Iowa Heartland Development', 1601700.38827856, 592924.23589906);
		
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ('Lumbermans Wholesale Company', 2303800.33381338, 501097.06751965);
		
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ( 'Plain Talk Publishing', 1610249.93843664, 579937.75662273);
		
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ( 'Burlington Northern Sante Fe', 2180668.53184913, 359288.89378747);
		
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ( '800 22nd Avenue', 2160559.50579430, 618667.01873098);
```		
Run one of the snippets	in xy-to-point-cursor.sql depending on which spatial type the target feature class uses.

[1]:http://resources.arcgis.com/en/help/main/10.2/index.html#/ST_Geometry_storage_in_PostgreSQL/002p0000006s000000/
[2]:http://www.postgis.org/docs/ST_GeomFromText.html
