
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
DBMS: SQL Server
DBMS Version: All

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
Oracle, Feature Class, Versioned, List, XML

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Notes:
This script must be run with privileges to the SDE repository.
If the geodatabase is in the DBO schema, modify the schema name below
***********************************************************************/

--This script queries the XML for each feature class or table and then converts
--the XML results to a string.

SELECT GDB_ITEMS.NAME                                                   AS "FC_Name",
  DEFINITION.value('(/DEFeatureClassInfo/Versioned)[1]', 'varchar(20)')	AS "Versioned",
  GDB_ITEMTYPES.NAME                                                    AS "GDB_Type"
FROM SDE.GDB_ITEMS
INNER JOIN SDE.GDB_ITEMTYPES
ON SDE.GDB_ITEMS.TYPE         = SDE.GDB_ITEMTYPES.UUID
WHERE SDE.GDB_ITEMTYPES.NAME IN ('Feature Class','Table')
