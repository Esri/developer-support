/***********************************************************************
branch-version-with-join.sql  --  Query a branch versioned feature class.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Purpose:
  This query shows how to select features from a branch versioned feature
  class by selecting current edits and excluding deleted items.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
History:
Ken Galliher        04/22/2021               Original coding (sort of).
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Versions Supported:
EGDB: 10.6 and above
DBMS: SQL Server
DBMS Version: SQL Server 2012 and above
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Tags:
SQL, Branch Version
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Resources:
Manage Branch Versions:
https://pro.arcgis.com/en/pro-app/latest/help/data/geodatabases/overview/manage-branch-versions.htm
***********************************************************************/

SELECT 
  NAME, 
  objectid, 
  shape, 
  gdb_geomattr_data 
FROM 
  GIS.TAX_4
WHERE GDB_ARCHIVE_OID IN (					 -- Start branch versioning magic
    SELECT GDB_ARCHIVE_OID 
    FROM 
      (
        SELECT 
          GDB_ARCHIVE_OID,  
          ROW_NUMBER() OVER( PARTITION BY OBJECTID ORDER BY GDB_FROM_DATE DESC ) AS rn_, 
          GDB_IS_DELETE 
        FROM GIS.TAX_4 
        WHERE GDB_BRANCH_ID IN (0)			-- *Include* other branch_ids to see other versions
          AND GDB_FROM_DATE <= GETUTCDATE() -- Adjust date range if needed
          AND OBJECTID IN (
            SELECT OBJECTID 
            FROM GIS.TAX_4 
          ) 	  
      ) AS br__ 
    WHERE 
      br__.rn_ = 1 
      AND br__.GDB_IS_DELETE = 0			-- Hide deleted features
	) -- End branch versioning magic

  -- Optional filtering
  AND RetiredByRecord IS NULL
  AND IsSeed <> 1