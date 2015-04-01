postgresql-xy-to-point-cursor.sql
===================

The anonymous pg/plsql scripts allow one to use the existing X and Y coordinates of a table to insert geometry column into an empty feature class.  Uses ST_GeomFromText for PostGIS data or ST_point 	for Esri ST_Geometry features.

----------


REQUIRED:
Enterprise PostgreSQL geodatabase.
Existing table with X and Y column (sample SQL to create this below).
Empty feature class to receive the calculation of X, Y values (Create this in ArcGIS).

DOCUMENTATION:
PostGIS (pg_geometry)
http://www.postgis.org/docs/ST_GeomFromText.html
	
Esri(ST_Geometry)
http://resources.arcgis.com/en/help/main/10.2/index.html#/ST_Geometry_storage_in_PostgreSQL/002p0000006s000000/

TESTING SAMPLE DATA:
Create the test.xy table containing the coordinate values.

		CREATE TABLE sde.test_xy
		(
		  name character varying(255),
		  x_coord numeric(38,8),
		  y_coord numeric(38,8)
		)
		
Insert some initial values into the new test_xy table created above.

		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ( 'Iowa Heartland Development', 1601700.38827856, 592924.23589906, 1);
		
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ('Lumbermans Wholesale Company', 2303800.33381338, 501097.06751965, 2);
		
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ( 'Plain Talk Publishing', 1610249.93843664, 579937.75662273, 3);
		
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ( 'Burlington Northern Sante Fe', 2180668.53184913, 359288.89378747, 4);
		
		INSERT INTO sde.test_xy(name, x_coord, y_coord) 
		VALUES ( '800 22nd Avenue', 2160559.50579430, 618667.01873098, 5);

