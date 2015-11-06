/***********************************************************************

list-user-privs-by-table.sql  --  DB Users by Table Privileges

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves as a method for returning the users within the
database and the privileges to each table within the SDE_table_registry

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        10/07/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: SQL Server
DBMS Version: All

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
SQL Server, privileges, permissions, users

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Notes:
-This script must be run with privileges to the SDE repository.
-If the SDE repository is in the DBO schema, please change line 68

***********************************************************************/

SELECT UPPER(GRANTEE) as "User",
  UPPER(OWNER) "Owner",
  TABLE_NAME "Table_Name",
  CASE "SL"
    WHEN 1
    THEN 'X'
    ELSE ''
  END AS "SELECT",
  CASE "IN"
    WHEN 1
    THEN 'X'
    ELSE ''
  END AS "INSERT",
  CASE "UP"
    WHEN 1
    THEN 'X'
    ELSE ''
  END AS "UPDATE",
  CASE "DL"
    WHEN 1
    THEN 'X'
    ELSE ''
  END AS "DELETE"
FROM
  (SELECT USER_NAME(grantee_principal_id) grantee,
    privs.type PRIVILEGE,
    schema_name(obj.schema_id) AS OWNER,
    object_name(obj.object_id) AS TABLE_NAME
  FROM sys.database_permissions privs
  JOIN sys.all_objects obj
  ON privs.major_id = obj.object_id
  JOIN sde.SDE_table_registry reg --Change to DBO if you are not using the SDE schema
  ON (schema_name(obj.schema_id) + '.' + object_name(obj.object_id)) = (reg.owner + '.' + reg.table_name)
  WHERE class                                                        = 1
  AND state                                                         IN ('G', 'W')
  ) AS all_privs pivot (COUNT(privilege) FOR PRIVILEGE              IN ("SL", "IN", "UP", "DL")) AS PIV
ORDER BY 1,2,3;
