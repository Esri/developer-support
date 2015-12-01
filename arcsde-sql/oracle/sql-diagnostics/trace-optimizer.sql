
/***********************************************************************

trace-optimizer.SQL  --  Oracle DBMS Trace

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves to dump the optimizer or compiler information for a
single cached SQL query. This is an updated version of the 10053 event
capture.

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
10053, Trace, Oracle, Optimizer, Compiler

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
http://structureddata.org/2011/08/18/creating-optimizer-trace-files/

***********************************************************************/

--Find the SQL ID of the query to analyze
SELECT sql_id, sql_text FROM v$sql
WHERE sql_text LIKE '%SOME QUERY%';

--After gathering the SQL ID use dbms_sqldiag to dump the query trace
exec dbms_sqldiag.dump_trace(p_sql_id => '73xq8qpz6c61g',   --ID of the SQL query
                             p_child_number => 0,           --Child Number
                             p_component => 'Compiler',     --Component (OPTIONS: Optimizer (default) or Compiler)
                             p_file_id=> 'CBO_Trace')       --Name of the tracefile identifier
