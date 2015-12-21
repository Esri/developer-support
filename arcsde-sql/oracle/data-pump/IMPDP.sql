/***********************************************************************

IMPDP.SQL  --  Import Data Pump Steps

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
  This script serves as a series of steps to complete the import
data pump process using the IMPDP utility. This script is meant to
be run one step at a time.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        11/03/2014               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: Oracle
DBMS Version: 11g and above

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
IMPDP, Data Pump, Oracle, Import

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
IMPDP Syntax:
http://ss64.com/ora/impdp.html

***********************************************************************/


--1. Create an Oracle database

--2. Connect as SYS via SQL*Plus

sqlplus sys/sys@server/sid as sysdba

--3. Grant public permissions for Oracle geodatabase

GRANT EXECUTE ON dbms_pipe TO public;
GRANT EXECUTE ON dbms_lock TO public;
GRANT EXECUTE ON dbms_lob TO public;
GRANT EXECUTE ON dbms_utility TO public;
GRANT EXECUTE ON dbms_sql TO public;
GRANT EXECUTE ON utl_raw TO public;

--4. Create all required tablespaces
--Note this is a default tablespace to auto extend
CREATE TABLESPACE SDE DATAFILE '/home/oracle/orcl/oradata/banner/sde.dbf'
SIZE 100M AUTOEXTEND ON NEXT 51200K MAXSIZE UNLIMITED EXTENT MANAGEMENT
LOCAL UNIFORM SIZE 320K LOGGING ONLINE SEGMENT SPACE MANAGEMENT MANUAL;

--5. Create the user/schema

create user sde identified by sde default tablespace sde;


--6. Grant all necessary permissions to the new user:

grant CREATE SESSION to sde;
grant CREATE TABLE to sde;
grant CREATE TRIGGER to sde;
grant CREATE SEQUENCE to sde;
grant CREATE PROCEDURE to sde;

grant EXECUTE ON DBMS_CRYPTO to sde;
grant CREATE INDEXTYPE to sde;
grant CREATE LIBRARY to sde;
grant CREATE OPERATOR to sde;
grant CREATE PUBLIC SYNONYM to sde;
grant CREATE TYPE to sde;
grant CREATE VIEW to sde;
grant DROP PUBLIC SYNONYM to sde;
grant ADMINISTER DATABASE TRIGGER to sde;

grant ALTER ANY INDEX to sde;
grant ALTER ANY TABLE to sde;
grant CREATE ANY INDEX to sde;
grant CREATE ANY TRIGGER to sde;
grant CREATE ANY VIEW to sde;
grant DROP ANY INDEX to sde;
grant DROP ANY VIEW to sde;
grant SELECT ANY TABLE to sde;

grant ALTER SESSION to sde;
grant ANALYZE ANY to sde;
grant SELECT ANY DICTIONARY to sde;
grant CREATE DATABASE LINK to sde;
grant CREATE MATERIALIZED VIEW to sde;
grant RESTRICTED SESSION to sde;
grant UNLIMITED TABLESPACE to sde;
grant ALTER SYSTEM to sde;
grant SELECT_CATALOG_ROLE to sde;


--8. Create a directory for the SYSTEM user to access:

create directory DPUMP1 as '/home/oracle/dpump';


--9. Grant R/W to SYSTEM user to read the files in the directory:

GRANT READ, WRITE ON DIRECTORY DPUMP1 to system;

exit

--10. Run the IMPDP from the CMD window for each user schema, starting with SDE:

impdp system/sys directory=dpump1 logfile=sde_imp.log dumpfile=SDE_SCHEMA.DMP schemas=sde


--11. Log into SQLPlus and check for invalid objects:

sqlplus sys/sys@server/sid as sysdba

Select count(*) from dba_objects where owner='SDE' and status='INVALID';


--12. Compile any invalid schema objects:

Exec dbms_utility.compile_schema(schema => 'SDE');
