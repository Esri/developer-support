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

Create an empty test_xy table in your PostGIS database.

```PLpgSQL
CREATE TABLE sde.test_xy
(
  name character varying(255),
  x_coord numeric(38,8),
  y_coord numeric(38,8)
)
```

Insert a few initial values into the test_xy table created above.

```PLpgSQL
INSERT INTO sde.test_xy(name, x_coord, y_coord)
VALUES ( 'Iowa Heartland Development', -95.85450821899968, 41.26032662300048);

INSERT INTO sde.test_xy(name, x_coord, y_coord)
VALUES ('Lumbermans Wholesale Company', -86.83733475399492, 36.157220097130846);

INSERT INTO sde.test_xy(name, x_coord, y_coord)
VALUES ( 'Plain Talk Publishing', -96.93516146812652, 42.78694730817284);

INSERT INTO sde.test_xy(name, x_coord, y_coord)
VALUES ( 'Burlington Northern Sante Fe', -97.32718700699968, 32.864737798000476);

INSERT INTO sde.test_xy(name, x_coord, y_coord)
VALUES ( '800 22nd Avenue', -86.80997891429467, 36.161404032870905);
```

Run one of the snippets	in xy-to-point-cursor.sql depending on which spatial type the target feature class uses.

### PostGIS (pg_geometry)
* first use arcmap to create an empty feature class in the sde database and name it 'points_pggeom'
```PLpgSQL
-- In this example, sde.points_pggeom is the target feature class to receive the calculation of the XY values.
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
```
### Esri ST_Geometry

* first use arcmap to create an empty feature class in the sde database and name it 'points_stgeom'

```PLpgSQL
-- In this example, sde.points_stgeom is the target feature class to receive the calculation of the XY values.
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
```

[1]:http://resources.arcgis.com/en/help/main/10.2/index.html#/ST_Geometry_storage_in_PostgreSQL/002p0000006s000000/
[2]:http://www.postgis.org/docs/ST_GeomFromText.html
