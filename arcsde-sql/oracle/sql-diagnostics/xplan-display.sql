/***********************************************************************

xplan-display.sql  --  Oracle Explain Plan Display

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves to demonstrate how to generate an explain plan for
the standard output. Allows format and display the contents of a plan
table.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        12/01/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: Oracle
DBMS Version: 11.2.0 and above

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
Explain Plan, xplan, Oracle, dbms_xplan

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
http://docs.oracle.com/cd/E11882_01/appdev.112/e40758/d_xplan.htm#ARPLS378

***********************************************************************/

--Generate an explain plan for a query
EXPLAIN PLAN FOR
SELECT '1' FROM DUAL; --Replace with desired query

--View the explain plan with default settings
SELECT * FROM TABLE(dbms_xplan.display);

--View the explain plan formatted to include all information
SELECT * FROM TABLE(dbms_xplan.display(format=>'ALL'));

--View the explain plan formatted to remove some information
SELECT * FROM TABLE(dbms_xplan.display(format=>'ALL,-ROWS'));
