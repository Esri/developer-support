/***********************************************************************

list-user-privs-by-roles.sql  --  DB Users by Role Membership

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves as a method for returning the users within the
database and the membership each user has in the database roles.

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
SQL Server, privileges, permissions, users, roles

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Notes:
-If the database has more roles that listed, add them to the IN statement
in the PIVOT and add them to the expression in the SELECT

***********************************************************************/

SELECT UPPER("User") "User",
  "User Type",
  CASE "db_accessadmin"
    WHEN 1
    THEN 'X'
    ELSE ''
  END "DB_ACCESSADMIN",
  CASE "db_datareader"
    WHEN 1
    THEN 'X'
    ELSE ''
  END "DB_DATAREADER",
  CASE "db_datawriter"
    WHEN 1
    THEN 'X'
    ELSE ''
  END "DB_DATAWRITER",
  CASE "db_ddladmin"
    WHEN 1
    THEN 'X'
    ELSE ''
  END "DB_DDLADMIN",
  CASE "db_owner"
    WHEN 1
    THEN 'X'
    ELSE ''
  END "DB_OWNER",
  CASE "Db_securityadmin"
    WHEN 1
    THEN 'X'
    ELSE ''
  END "DB_SECURITYADMIN" --Add additional roles here, if applicable
FROM
  (SELECT d.name AS "User",
    d.type_desc  AS "User Type",
    s.name rname,
    is_rolemember(s.name, d.name) AS RL
  FROM sys.database_principals d,
    sysusers s
  WHERE s.issqlrole                          = 1
  AND s.name                                <> 'PUBLIC'
  AND d.type                                <> 'r'
) AS ROLE_PRIVS PIVOT (SUM(RL) FOR RNAME IN
  (
    DB_ACCESSADMIN,DB_DATAREADER,DB_DATAWRITER,DB_DDLADMIN,DB_OWNER,DB_SECURITYADMIN --Add additional roles here, if applicable
  )
) AS PVT
ORDER BY 2,1
