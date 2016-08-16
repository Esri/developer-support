/***********************************************************************

trace-oradebug.SQL  --  Oracle DBMS Trace

*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves to find a user mid-session and begin a trace
on their session using the ORADEBUG utility.

*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        07/01/2015               Original coding.

*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: Oracle
DBMS Version: 11.2.0

*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
10046, Trace, Oracle, Logon, Trigger, ORADEBUG

*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
SQL> oradebug help

***********************************************************************/

--Must be run as SYSDBA

--Format query columns
COLUMN USERNAME FORMAT A15
COLUMN PROGRAM FORMAT A20

--Select ORAPID value for the required user
SELECT P.PID "ORAPID", S.USERNAME, S.PROGRAM
FROM V$PROCESS P JOIN V$SESSION S
ON P.ADDR = S.PADDR
WHERE S.USERNAME = 'SDE';

--Set ORAPID in ORADEBUG to the PID from V$PROCESS
ORADEBUG SETORAPID <PID>

--Set the tracefile name (11.2.0.4 and above only)
ORADEBUG SETTRACEFILEID <TRACEFILE_NAME>

--Start the trace
ORADEBUG EVENT 10046 TRACE NAME CONTEXT FOREVER, LEVEL 12

--Verify the trace file name and location
ORADEBUG TRACEFILE_NAME

--Stop the trace
ORADEBUG EVENT 10046 TRACE NAME CONTEXT OFF
--ORADEBUG CLOSE_TRACE is a viable alternative
