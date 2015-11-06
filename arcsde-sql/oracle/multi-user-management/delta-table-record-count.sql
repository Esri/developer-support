/***********************************************************************

delta-table-record-count.sql  --  Delta Table Record Count

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves as a method for returning the total number
of records within all the delta tables that are registered with the
geodatabase. The output of this script will appear as:
FC_NAME........(ADDS)##	(DELS)##

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        07/03/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: 10.0 and above
DBMS: Oracle
DBMS Version: 11g and above (Only enter DBMS version if it requires a specific version)
ST_SHAPELIB: Required

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
Oracle, Versioned, Count, Delta

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Notes:
This script must be run as the Geodatabase Administrator

***********************************************************************/

SET SERVEROUTPUT ON

DECLARE
  --Create a list of all fully-registered objects and their versioning status
  CURSOR fcList
  IS
    SELECT items.name AS FC_Name,
      XMLCast(XMLQuery('*/Versioned' PASSING xmltype(items.definition) RETURNING CONTENT) AS VARCHAR(100)) AS Versioned
    FROM gdb_items_vw items
    INNER JOIN gdb_itemtypes itemtypes
    ON items.Type         = itemtypes.UUID
    WHERE ITEMTYPES.NAME IN ('Feature Class', 'Table');
  SQL_STMT VARCHAR2(200); --Intermediate SQL Statement for dynamic variables
  ADDS     VARCHAR2(61); --Fully-qualified Adds table name
  DELS     VARCHAR2(61); --Fully-qualified Delets table name
  ACNT     NUMBER; --Record count of the Adds table
  dCNT     NUMBER; --Record count of the Deletes table
BEGIN
  DBMS_OUTPUT.ENABLE (100000000);
  FOR FC IN FCLIST
  --Loop through the feature class list and return delta counts on versioned objects
  LOOP
    IF fc.versioned = 'true' THEN
      SELECT (t.owner
        || '.A'
        || t.registration_id)
      INTO adds --Set "adds" variable to fully-qualifed adds table
      FROM table_registry t
      WHERE (t.owner
        || '.'
        || t.table_name) = upper(fc.fc_name);
      SELECT (t.owner
        || '.D'
        || t.registration_id)
      INTO dels --Set "dels" variable to the fully-qualified delete table
      FROM table_registry t
      WHERE (t.owner
        || '.'
        || T.TABLE_NAME) = UPPER(FC.FC_NAME);
      SQL_STMT          := 'select count(*) from ' || ADDS || '';
      EXECUTE IMMEDIATE SQL_STMT INTO ACNT; --Set "ACNT" variable to the count of records in the adds table
      SQL_STMT := 'select count(*) from ' || DELS || '';
      EXECUTE IMMEDIATE SQL_STMT INTO DCNT; --Set "DCNT" variable to the count of records in the delete table
      --Print the output for each versioned feature class
      DBMS_OUTPUT.PUT_LINE(rpad(upper(fc.fc_name),64,'.') || '(ADDS)' || rpad(acnt,10) || ' (DELS)' || rpad(dcnt,10));
    END IF;
  END LOOP;
END;
/
