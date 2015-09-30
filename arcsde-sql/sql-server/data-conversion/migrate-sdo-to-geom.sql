/***********************************************************************

migrate-sdo-to-geom.sql  --  Migrate SDO to Geometry

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves as a method for converting SDO data to
Geometry in SQL Server via linked server. This script assumes that
a function linked server is set up to Oracle.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        8/10/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: SQL Server
DBMS Version: 2008 and above

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
SDO, SQL Server, Conversion, Migration, Geometry, WKB

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
OPENQUERY (Transact-SQL)
https://msdn.microsoft.com/en-us/library/ms188427.aspx

***********************************************************************/

--Create a temporary table to hold the WKB from Oracle
CREATE TABLE #SDO_TEST
  ( RID INT IDENTITY(1,1) NOT NULL, WKB VARBINARY(MAX)
  );


--Using Openquery insert the WKB from Oracle into the temporary table
INSERT INTO #SDO_TEST
  (WKB
  )
SELECT WKB
FROM OPENQUERY( FURY,'select mdsys.sdo_util.to_wkbgeometry(a.shape) wkb from sde.alexsdo a');


--Loop through each record in the temporary table and convert WKB to Geometry
--For insertion into a registered feature class, the next_rowid function must be used
DECLARE
  @ITERATOR INT
  -- Initialize the iterator
  SELECT @ITERATOR = MIN(RID) FROM #SDO_TEST
  -- Loop through the rows of a table
  WHILE @ITERATOR IS NOT NULL
BEGIN
  DECLARE
    @ID AS INTEGER EXEC SDE.NEXT_ROWID 'sde',
    'SDO_FC',
    @ID OUTPUT;
    INSERT INTO SDE.SDO_FC
      (OBJECTID, SHAPE
      )
    SELECT @id,
      GEOMETRY::STGeomFromWKB(WKB, 4269) AS SHAPE
    FROM #SDO_TEST
    WHERE RID       = @ITERATOR;
    SELECT @ITERATOR= MIN(RID) FROM #SDO_TEST WHERE @ITERATOR < RID
  END ;


--Drop the temporary table
DROP TABLE #SDO_TEST;
