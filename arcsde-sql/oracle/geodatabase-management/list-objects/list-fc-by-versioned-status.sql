
/***********************************************************************

list-fc-by-versioned-status.sql  --  Feature Class Version Status

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves as a method for returning the versioned status
of registered geodatabase objects without using the isversioned()
function.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        07/27/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: Oracle
DBMS Version: 11g and above (Only enter DBMS version if it requires a specific version)
ST_SHAPELIB: Required

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
Oracle, Feature Class, Versioned, List, XML

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Notes:
This script must be run with privileges to the SDE repository.

***********************************************************************/

--This script queries the XML for each feature class or table and then converts
--the XML results to a string.

SELECT items.name AS fc_name,
  xmlcast(Xmlquery('*/Versioned' passing Xmltype(items.DEFINITION) returning content) AS VARCHAR(100)) AS versioned,
  itemtypes.name AS gdb_type
FROM sde.gdb_items_vw items
INNER JOIN sde.gdb_itemtypes itemtypes
ON items.TYPE         = itemtypes.uuid
WHERE itemtypes.name IN ('Feature Class', 'Table')
ORDER BY 1,
  3;
