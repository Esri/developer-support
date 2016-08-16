/***********************************************************************

xplan-display.sql  --  Oracle Explain Plan Display

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves to demonstrate how to generate an explain plan for
the standard output. Allows format and display the plan of a cached
query.

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
SELECT sql_id, sql_text FROM v$sql
WHERE sql_text LIKE '%SOME QUERY%';

--View the explain plan with default settings
SELECT * FROM TABLE(dbms_xplan.display_cursor(sql_id=>'4hj2v3afcq2h6',
                                              cursor_child_no=>0,
                                              format=>'TYPICAL'));

--View the explain plan formatted to include all information
SELECT * FROM TABLE(dbms_xplan.display_cursor(sql_id=>'4hj2v3afcq2h6',
                                              cursor_child_no=>0,
                                              format=>'ALL'));

--View the explain plan formatted to modify the display
SELECT * FROM TABLE(dbms_xplan.display_cursor(sql_id=>'4hj2v3afcq2h6',
                                              cursor_child_no=>0,
                                              format=>'ALL,IOSTATS LAST'));
