/***********************************************************************

trace-session-dbms-system.SQL  --  Oracle DBMS Trace

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves to start tracing all events in a single
session. One advantage to this script is the ability to set
tracing on, while mid-session.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        07/01/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: Oracle
DBMS Version: 11.2.0

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
10046, Trace, Oracle, DBMS_SYSTEM

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
http://docstore.mik.ua/orelly/oracle/bipack/ch11_02.htm

***********************************************************************/

--Oracle DBMS_SYSTEM Tracing Procedures


--Must be run as SYSDBA

--Format query columns
COLUMN USERNAME FORMAT A15
COLUMN PROGRAM FORMAT A20

--Select SID and SERIAL# value for the required user
SELECT S.SID, S.SERIAL#, S.USERNAME, S.PROGRAM
FROM V$PROCESS P JOIN V$SESSION S
ON P.ADDR = S.PADDR
WHERE S.USERNAME = 'SDE';

--Flush buffer cache and shared pool
ALTER SYSTEM FLUSH BUFFER_CACHE;
ALTER SYSTEM FLUSH SHARED_POOL;

--Start the session trace for a different user
exec dbms_support.start_trace_in_session(<SID>,<SERIAL#>,waits=>true,binds=>false);

--Stop the session trace
exec dbms_support.stop_trace_in_session(<SID>,<SERIAL#>);


--Find Trace file for a single user or process
select u_dump.value || '\' || instance.value || '_ora_' || v$process.spid
|| nvl2(v$process.traceid, '_' || v$process.traceid, null ) || '.trc' "Trace File"
from V$PARAMETER u_dump
cross join V$PARAMETER instance
cross join V$PROCESS
join V$SESSION on v$process.addr = V$SESSION.paddr
where u_dump.name = 'user_dump_dest'
and instance.name = 'instance_name' and v$session.username = 'SDE';


--Requires the install of the $ORACLE_HOME/rdbms/admin/dbmssupp.sql script
