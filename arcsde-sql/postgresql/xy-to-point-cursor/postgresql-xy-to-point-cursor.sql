/*
	The anonymous pg/plsql scripts below allow one to use the existing X and Y coordinates of a table to
	insert geometry column into an empty feature class.  Uses ST_GeomFromText for PostGIS data or ST_point 
	for Esri ST_Geometry features.

*/

-- PostGIS pg_geometry
DO 
$$DECLARE 
	pt_curse CURSOR FOR SELECT x_coord, y_coord FROM sde.test_xy;
	x_var numeric; 
	y_var numeric;
BEGIN
	OPEN pt_curse;
LOOP
	FETCH pt_curse INTO x_var, y_var;
	EXIT WHEN NOT FOUND;
		INSERT INTO sde.points_pggeom (objectid, shape)
		SELECT sde.next_rowid('sde', 'points_pggeom'), 
			   ST_GeomFROMText('POINT(' || cast(x_var as text)|| ' ' || cast(y_var as text) || ')''', 4326);
END LOOP;
CLOSE pt_curse;
END$$;


-- Esri ST_Geometry
DO 
$$DECLARE 
	pt_curse CURSOR FOR SELECT x_coord, y_coord FROM sde.test_xy; 
	x_var numeric; 
	y_var numeric;
BEGIN
	OPEN pt_curse;
LOOP
	FETCH pt_curse INTO x_var, y_var;
	EXIT WHEN NOT FOUND;
	    INSERT INTO sde.points_stgeom (objectid, geom) 
		SELECT 
		sde.next_rowid('sde', 'points_stgeom'), 
		ST_point(x_var , y_var, 4326);
END LOOP;
CLOSE pt_curse;
END$$;
