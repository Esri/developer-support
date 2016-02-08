/***********************************************************************

trace-logon-trigger.sql  --  Oracle DBMS Trace

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves as a method for capturing the 10046 trace events
that a user performs by starting a trace when they connect to the
database.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        07/01/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: Oracle
DBMS Version: All

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
10046, Trace, Oracle, Logon, Trigger

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
Using Triggers:
https://docs.oracle.com/database/121/TDDDG/tdddg_triggers.htm#TDDDG50000

***********************************************************************/


--Create Trigger for user

CREATE TRIGGER "SYS"."SDE_LOGON" AFTER
LOGON ON DATABASE begin
if user like 'SDE%' then
  execute immediate 'alter session set tracefile_identifier = ''on_logon_SDE''';
  execute immediate 'alter session set timed_statistics=true';
  execute immediate 'alter session set max_dump_file_size=unlimited';
  execute immediate 'alter session set events ''10046 trace name context forever, level 12''';
end if;
end;
/


--Drop Trigger for user

drop trigger sde_logon;


/*

NOTES:
-If the session is not ended, the trace will continue running even if the trigger is dropped

*/
