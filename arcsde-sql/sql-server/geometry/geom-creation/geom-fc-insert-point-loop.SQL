/***********************************************************************

geom-fc-insert-point-loop.SQL  --  Insert geometry points into feature class

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves to insert point data stored in one table into
a registered feature class within an enterprise geodatabase.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        08/22/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: 10.0 and above
DBMS: SQL Server
DBMS Version: All

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
SQL Server, Feature Class, Geometry, Insert, Point

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
Next_RowID:
http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/next-rowid.htm

***********************************************************************/
--SQL SERVER LOOP

-- Get the number of rows in the looping table
DECLARE
  @RowCount INT SET @RowCount =
  (SELECT COUNT(*)FROM sde.INPUT_TABLE
  )
  -- Declare an iterator
  DECLARE
    @iterator INT
    -- Initialize the iterator
    SELECT @iterator = MIN(OBJECTID) FROM SDE.INPUT_TABLE
    -- Loop through the rows of a table
    WHILE @iterator IS NOT NULL
  BEGIN
    DECLARE
      @id AS INTEGER EXEC sde.next_rowid 'sde', 'points', @id OUTPUT;
      INSERT INTO sde.POINTS
        (OBJECTID, Shape
        )
      SELECT @id,
        geometry::STPointFromText( 'POINT('+str(POINT_X, 38, 8) + ' ' + str(POINT_Y, 38, 8) + ')', 2286) AS SHAPE
      FROM sde.INPUT_TABLE
      WHERE objectid  = @iterator;
      SELECT @iterator= MIN(OBJECTID) FROM SDE.INPUT_TABLE WHERE @iterator < OBJECTID
    END
