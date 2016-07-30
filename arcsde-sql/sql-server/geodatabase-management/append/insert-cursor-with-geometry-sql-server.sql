/***********************************************************************
geom-fc-insert-point-loop.SQL  --  Insert geometry points into feature class
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Purpose:
 This script serves to insert rows from one non-versioned feature class
 into another feature class mimicking the Append tool.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
History:
Ken Galliher       08/22/2015               Original coding.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Versions Supported:
EGDB: 10.0 and above
DBMS: SQL Server
DBMS Version: All
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Tags:
SQL Server, Feature Class, Geometry, Insert
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Resources:
Next_RowID:
http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/next-rowid.htm
***********************************************************************/
-- Declare the objectid, shape and SRID variables.
-- include any additional attribute columns.
-- Select 1 SRID value from either of the tables.  
-- Since this is done in SQL and not ArcGIS, it's up to you to
-- make sure the SRIDs of all the features are homogeneous.
Declare @objectid int, 
	@name varchar(10), 
	@shape geometry, 
	@srid int = (SELECT Top 1 shape.STSrid FROM InputTable)

-- Declare a cursor to grab the values from the input table.
-- In this example, the table contains only an objectid, name(varchar) and shape column.
-- Include any necessary columns (except for an existing objectid column if
-- the input table is a featue class).
DECLARE insert_cursor CURSOR FOR 
SELECT name, shape FROM InputTable
 
-- open the cursor
OPEN insert_cursor
FETCH NEXT FROM insert_cursor into @name, @shape  -- objectid calculated later
 
-- begin looping through the cursor
WHILE @@FETCH_STATUS=0
BEGIN

-- Use the next_rowid function included in sde geodatabases to generate a
-- new objectid from the target table.
EXEC dbo.next_rowid 'dbo', 'Target_Table', @objectid OUTPUT;

-- Start inserting
INSERT INTO dbo.Target_Table

-- Grab the geometry from the input and calc it into the geometry of the target.
-- The select statement's column order should follow the column order of the target table.
SELECT @objectid, geometry::STGeomFromWKB(@shape.STAsBinary(), @srid), @name

-- get next available row into variables
FETCH NEXT FROM insert_cursor into @name, @shape 
END

CLOSE insert_cursor
DEALLOCATE insert_cursor
GO
