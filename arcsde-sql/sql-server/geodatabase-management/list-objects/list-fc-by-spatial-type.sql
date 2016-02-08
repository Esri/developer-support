/***********************************************************************

list-fc-by-spatial-type.sql  --  Feature Class Spatial Types

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves as a method for returning the spatial type of
feature classes registered with the SDE repository tables.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        07/27/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: SQL Server
DBMS Version: All

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
SQL Server, Feature Class, Spatial Type, List

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Notes:
This script must be run with privileges to the SDE repository.

***********************************************************************/

SELECT UPPER(SCHEMA_NAME(o.schema_id)) AS OWNER,
  OBJECT_NAME(o.object_id)             AS TABLE_NAME,
  UPPER(c.name)                        AS GEOMETRY_COL,
  CASE TYPE_NAME(C.user_type_id)
    WHEN 'int'
    THEN 'SDEBINARY'
    ELSE UPPER(TYPE_NAME(C.user_type_id))
  END AS DATA_TYPE
FROM sys.objects o
JOIN sys.columns c
ON o.object_id = c.object_id
WHERE c.name   =
  (SELECT SPATIAL_COLUMN
  FROM sde.sde_layers --Please change the schema to match the geodatabase administrator
  WHERE (owner   = SCHEMA_NAME(o.schema_id)
  AND table_name = OBJECT_NAME(o.object_id))
  );
