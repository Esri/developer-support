--PostGIS (ppg_geometry)
-- http://www.postgis.org/docs/ST_GeomFromText.html
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
