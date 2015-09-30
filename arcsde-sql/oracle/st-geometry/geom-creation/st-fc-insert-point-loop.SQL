/***********************************************************************

st-fc-insert-point-loop.SQL  --  Insert ST points into feature class

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
DBMS: Oracle
DBMS Version: All
ST_Shapelib: Not Required

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
Oracle, Feature Class, ST_Geometry, Insert, Point

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
Next_RowID:
http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/next-rowid.htm

***********************************************************************/
--ORACLE ST CURSOR

SET SERVEROUTPUT ON
-- Declare a cursor
DECLARE
  CURSOR points
  IS
    SELECT * FROM sde.input_table;
  --Loop through the cursor
BEGIN
  FOR pt IN points
  LOOP
    INSERT
    INTO SDE.POINTS
      (
        OBJECTID,
        SHAPE
      )
      VALUES
      (
        sde.gdb_util.next_rowid('sde', 'points'),
        sde.st_geometry(pt.point_x,pt.point_y, null, null, 2286)
      );
  END LOOP;
  COMMIT;
END;
/
