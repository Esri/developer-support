/***********************************************************************

get-orainfo.SQL  --  Get Oracle Information Script

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
  This script serves as a series of steps to gather information from
an Oracle database prior to exporting or creating a datapump for the
end goal of restoring the database in a different environment.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Shawn Thorne          10/04/2012               Original coding.
Shawn Thorne          06/30/2015               Updated.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: Oracle
DBMS Version: 10g and above

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
Oracle, Get_OraInfo, Tablespace, Users, Permissions

***********************************************************************/

clear screen

PROMPT
PROMPT

PROMPT *********************************************************
PROMPT * Script to gather information about an Oracle instance *
PROMPT *********************************************************
PROMPT
PROMPT

sho user

PROMPT
PROMPT

PROMPT This script needs to be executed as the SYS or SYSTEM user, or with a user that has been assigned the DBA role!!
PROMPT
PROMPT
PAUSE  Press CTRL+C to quit, or press any key to continue ...
PROMPT

CLEAR BREAKS COMPUTES COLUMNS

host mkdir C:\TEMP

spool C:\TEMP\ORA_Info_Results.txt replace

set linesize 130 pages 500

col member for a80
col "Filesize in MBs" for 9,999,999.99

PROMPT
PROMPT
PROMPT


PROMPT *******************
PROMPT * ORACLE BIT INFO *
PROMPT *******************

select
   length(addr)*4 || '-bit' "ORA Bit Version"
from
   v$process
where
   ROWNUM =1;


PROMPT
PROMPT
PROMPT


PROMPT ******************************************
PROMPT * ARCHIVING, FLASHBACK, RECYCLEBIN, INFO *
PROMPT ******************************************

-- Disable Archiving
-- shutdown immediate;
-- startup mount
-- alter database noarchivelog;
-- alter database open;


-- Disable Flashback Recovery
-- alter database flashback off;


-- Disable Recyclebin
-- alter system set recyclebin=off scope=spfile;
-- shutdown immediate
-- startup open
-- create pfile from spfile;


select log_mode, flashback_on from v$database;

PROMPT
PROMPT

col value for a12
select name, value from v$parameter where name = 'recyclebin';

PROMPT
PROMPT

PROMPT
PROMPT
PROMPT

PROMPT ***********************************
PROMPT * SID, ORA VERSION, HOSTNAME INFO *
PROMPT ***********************************

select instance_name, version "ORA VERSION", substr(host_name,1,30) "HOST NAME", active_state "STATE", archiver "ARCHIVE"
from v$instance;

PROMPT
PROMPT
PROMPT

PROMPT
PROMPT ************************
PROMPT * LIST OF ENDIAN TYPES *
PROMPT ************************
PROMPT

col PLATFORM_NAME for a35
col SERVER_NAME   for a20

select * from v$transportable_platform order by platform_id;


PROMPT
PROMPT
PROMPT *********************************
PROMPT * ENDIAN TYPE FOR THIS INSTANCE *
PROMPT *********************************
PROMPT

select
   vi.host_name "SERVER_NAME",
   vd.name "SID",
   vd.platform_id,
   vd.platform_name "PLATFORM_NAME",
   vtp.endian_format
from
   v$database vd, v$transportable_platform vtp, v$instance vi
where
   vd.platform_id = vtp.platform_id
and
   upper(vi.instance_name) = upper(vd.name);


PROMPT
PROMPT
PROMPT

PROMPT ************************************
PROMPT * INSTALLED ORACLE COMPONENTS INFO *
PROMPT ************************************


SELECT substr(comp_name,1,40) AS "ORACLE COMPONENT", substr(schema,1,30) AS "SCHEMA", substr(version,1,12) AS version
FROM dba_registry
ORDER BY 1;

PROMPT
PROMPT
PROMPT

PROMPT ******************
PROMPT * REDO LOGS INFO *
PROMPT ******************

col FILENAME      for a60
col "Size in MBs" for 999,999,999.99

select l.group#,lf.member "FILENAME",l.status,lf.type,l.bytes/1024/1024 "Size in MBs", l.archived
from v$log l, v$logfile lf
where l.group#=lf.group#
order by 2;


PROMPT
PROMPT
PROMPT


PROMPT **********************
PROMPT * CONTROL FILES INFO *
PROMPT **********************

SELECT substr(name,1,80) FILENAME
FROM V$CONTROLFILE
order by 1;

PROMPT
PROMPT
PROMPT

PROMPT ******************
PROMPT * TEMP FILE INFO *
PROMPT ******************

SELECT substr(name,1,80) FILENAME, bytes/1024/1024 "Filesize in MBs"
FROM V$TEMPFILE
order by 1;

PROMPT
PROMPT
PROMPT


PROMPT *******************
PROMPT * TABLESPACE INFO *
PROMPT *******************

COL c1 heading "Tablespace Name" FORMAT A25
COL c2 heading "Used MB"    	 FORMAT 99,999,999
COL c3 heading "Free MB"    	 FORMAT 99,999,999
COL c4 heading "Total MB"   	 FORMAT 99,999,999

break on report

compute sum of c2 on report
compute sum of c3 on report
compute sum of c4 on report

SELECT
   fs.tablespace_name              c1,
   (df.totalspace - fs.freespace)  c2,
   fs.freespace                    c3,
   df.totalspace                   c4,
   round(100 * (fs.freespace / df.totalspace)) "% Free"
FROM (select distinct tablespace_name, round(sum(bytes) / 1048576) TotalSpace
     from dba_data_files group by tablespace_name) df,
     (select tablespace_name, round(sum(bytes) / 1048576) FreeSpace
     from dba_free_space group by tablespace_name) fs
WHERE df.tablespace_name = fs.tablespace_name
ORDER BY 1;

PROMPT
PROMPT
PROMPT


PROMPT **************************
PROMPT * TABLESPACE EXTENT INFO *
PROMPT **************************


select tablespace_name, block_size, segment_space_management, initial_extent "INITIAL_EXT", next_extent "NEXT_EXT",      extent_management "EXT_MGMT", allocation_type "ALLO_TYPE"
from dba_tablespaces
order by 1;


PROMPT
PROMPT
PROMPT


PROMPT ****************************
PROMPT * TABLESPACE METADATA INFO *
PROMPT ****************************

set long 9999999

select dbms_metadata.get_ddl('TABLESPACE',tbsp.tablespace_name)
from dba_tablespaces tbsp;

PROMPT
PROMPT
PROMPT


PROMPT **********************
PROMPT * USER METADATA INFO *
PROMPT **********************
PROMPT
PROMPT

select dbms_metadata.get_ddl('USER',usr.username)
from dba_users usr;


PROMPT
PROMPT
PROMPT

PROMPT
PROMPT All users in the database
PROMPT =========================

col username for a22

select username,substr(default_tablespace,1,30) default_tablespace, substr(temporary_tablespace,1,20) temp_tablespace, substr(profile,1,20) profile, substr(account_status,1,20) account_status
from dba_users
order by 1;


PROMPT
PROMPT
PROMPT Users that own data in SDE
PROMPT ==========================
PROMPT
PROMPT
PROMPT SDE Layers
PROMPT -----------

select owner,count(*) from sde.layers group by owner order by 1;

PROMPT
PROMPT
PROMPT SDE Tables
PROMPT -----------

select owner,count(*) from sde.table_registry group by owner order by 1;

PROMPT
PROMPT
PROMPT ST_Geometry Layers
PROMPT -------------------

select owner,count(*) from sde.st_geometry_columns group by owner order by 1;


PROMPT
PROMPT
PROMPT

PROMPT Number of Columns in SDE Tables
PROMPT --------------------------------

col tablename for a60

select owner||'.'||table_name tablename, count(*) NumColumns from sde.column_registry group by owner||'.'||table_name order by 2 desc ;


PROMPT
PROMPT
PROMPT


PROMPT ************************
PROMPT * USER PRIVILEGES INFO *
PROMPT ************************

PROMPT
PROMPT Privileges assigned to users that own data in ArcSDE
PROMPT ====================================================

col username for a20
col PRIVILEGES_ASSIGNED for a30

break on username skip 1

select grantee username, granted_role PRIVILEGES_ASSIGNED
from dba_role_privs
where grantee in (select distinct owner from sde.table_registry
                  union
                  select distinct owner from sde.st_geometry_columns
                  union
                  select distinct owner from sde.layers)
union
select grantee "USERNAME", privilege "PRIVILEGES ASSIGNED"
from dba_sys_privs
where grantee in (select distinct owner from sde.table_registry
                  union
                  select distinct owner from sde.st_geometry_columns
                  union
                  select distinct owner from sde.layers)
order by 1;

PROMPT
PROMPT
PROMPT

PROMPT
PROMPT ********************
PROMPT * SDE VERSION INFO *
PROMPT ********************


select major,minor,bugfix,description  from sde.version;


PROMPT
PROMPT
PROMPT

PROMPT
PROMPT *********************
PROMPT * SDE INSTANCE INFO *
PROMPT *********************

select * from sde.instances order by instance_id;

PROMPT
PROMPT
PROMPT

PROMPT
PROMPT ********************
PROMPT * SDE PACKAGE INFO *
PROMPT ********************

col owner for a16
col name  for a24
col text  for a80

break on owner skip 1

select owner, name, text from dba_source where owner = 'SDE' and UPPER(text) like '%C_PACKAGE_RELEASE%' order by 2;

PROMPT
PROMPT
PROMPT


PROMPT
PROMPT **************************
PROMPT * SDE SERVER_CONFIG INFO *
PROMPT **************************

col prop_name 		for a20
col char_prop_value for a64
col num_prop_value 	for 999999999

select * from sde.server_config order by prop_name;

PROMPT
PROMPT
PROMPT

PROMPT
PROMPT ****************************
PROMPT * SDE DBTUNE KEYWORDS INFO *
PROMPT ****************************


col KEYWORD 	for A40
col "DATA TYPE" for A40

select KEYWORD,CONFIG_STRING "DATA TYPE" from sde.dbtune where parameter_name = 'GEOMETRY_STORAGE' order by 1;

PROMPT
PROMPT
PROMPT

PROMPT
PROMPT ***********************
PROMPT * SDE VERSIONING INFO *
PROMPT ***********************

col "COUNT" for 999,999,999

PROMPT
PROMPT # of Versions
PROMPT =============

select count(*) "COUNT" from sde.versions;

PROMPT
PROMPT

PROMPT
PROMPT # of Records in States Table
PROMPT ============================

select count(*) "COUNT" from sde.states;

PROMPT
PROMPT

PROMPT
PROMPT # of Records in State_Lineages Table
PROMPT ====================================

select count(*) "COUNT" from sde.state_lineages;

PROMPT
PROMPT

PROMPT
PROMPT # of Records in MVTables_Modified Table
PROMPT =======================================

select count(*) "COUNT" from sde.mvtables_modified;

PROMPT
PROMPT
PROMPT

PROMPT
PROMPT SDE.Compress_Log (last 20 Compresses)
PROMPT =====================================

select * from sde.compress_log where rownum < 21 order by compress_start desc;

PROMPT
PROMPT
PROMPT

PROMPT ******************************
PROMPT * WHOs CONNECTED TO SDE INFO *
PROMPT ******************************


col username format a22
col program  format a20
col machine  format a20

select substr(username,1,12) "USERNAME", sid, serial#, program, substr(machine,1,20) machine, logon_time
from v$session
where schemaname in
(select distinct owner from sde.table_registry)
or schemaname in
(select distinct owner from sde.st_geometry_columns)
order by 1,2;

PROMPT
PROMPT
PROMPT


PROMPT
PROMPT ******************
PROMPT * SDE LOCKS INFO *
PROMPT ******************

PROMPT
PROMPT # of Layer Locks
PROMPT ================
PROMPT

select count(*) "COUNT" from SDE.LAYER_LOCKS;

PROMPT
PROMPT

PROMPT
PROMPT # of Object Locks
PROMPT =================
PROMPT

select count(*) "COUNT" from SDE.OBJECT_LOCKS;

PROMPT
PROMPT

PROMPT
PROMPT # of State Locks
PROMPT ================
PROMPT

select count(*) "COUNT" from SDE.STATE_LOCKS;

PROMPT
PROMPT

PROMPT
PROMPT # of Table Locks
PROMPT ================
PROMPT

select count(*) "COUNT" from SDE.TABLE_LOCKS;

PROMPT
PROMPT
PROMPT

PROMPT ********************
PROMPT * ORA PROFILE INFO *
PROMPT ********************

col profile for a12
col limit for a12

break on profile skip 1

select profile,resource_name, resource_type, limit from dba_profiles order by 1,2;

PROMPT
PROMPT
PROMPT

PROMPT ****************
PROMPT * ORA SGA INFO *
PROMPT ****************

col name for a50

select * from v$sgainfo order by name;

PROMPT
PROMPT
PROMPT


PROMPT ****************
PROMPT * ORA PGA INFO *
PROMPT ****************

column value format 999,999,999,999,999

select
   name,
   value
from
   v$pgastat
order by 1;


PROMPT
PROMPT
PROMPT

PROMPT **************************************
PROMPT * ORA INITIALIZATION PARAMETERS INFO *
PROMPT **************************************

sho parameters

PROMPT
PROMPT
PROMPT

/*
PROMPT ***********************************************************************
PROMPT * HIDDEN PARAMETER INFO (11GR2) - Run as SYS user or user with SYSDBA *
PROMPT ***********************************************************************

set pages 2000
set lines 130
col "Parameter"      for a45 word wrapped
col "Description"    for a40 word wrapped
col "Session Value"  for a20 word wrapped
col "Instance Value" for a20 word wrapped


SELECT a.ksppinm "Parameter", a.ksppdesc "Description", b.ksppstvl "Session Value", c.ksppstvl "Instance Value"
FROM x$ksppi a, x$ksppcv b, x$ksppsv c
WHERE a.indx = b.indx
AND a.indx = c.indx
AND a.ksppinm LIKE '/_%' escape '/'
ORDER BY 1
/

PROMPT
PROMPT
PROMPT

 */

spool off

host notepad C:\TEMP\ORA_Info_Results.txt
