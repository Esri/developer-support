--Oracle 12c Pluggable Database Steps



--Connect to the container database as SYS
sqlplus sys/sys@wells-win2012/wcdb as sysdba

--Create Database
create pluggable database gis_admin admin user gisdba identified by gisdba roles=(DBA) file_name_convert = 
('C:\app\chri6962\oradata\wcdb\pdbseed\', 'C:\app\chri6962\oradata\wcdb\gis_admin\');

--Open database
alter pluggable database gis_admin open;



--Connect to the pluggable database as SYS or the CDB DBA
alter session set container = gis_admin;

--or 

conn gisdba/gisdba@wells-win2012/gis_admin

--Grant PUBLIC privileges
GRANT EXECUTE ON dbms_pipe TO public;
GRANT EXECUTE ON dbms_lock TO public;
GRANT EXECUTE ON dbms_lob TO public;
GRANT EXECUTE ON dbms_utility TO public;
GRANT EXECUTE ON dbms_sql TO public;
GRANT EXECUTE ON utl_raw TO public;


--Create SDE Tablespace
CREATE TABLESPACE SDE DATAFILE 'C:/app/chri6962/oradata/wcdb/lxpdb/SDE.dbf' 
SIZE 100M AUTOEXTEND ON NEXT 51200K MAXSIZE UNLIMITED EXTENT MANAGEMENT 
LOCAL UNIFORM SIZE 320K LOGGING ONLINE SEGMENT SPACE MANAGEMENT MANUAL;

--Create SDE User
create user sde identified by sde default tablespace sde;

--Grant SDE User Privileges
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
--grant SELECT ANY TABLE to sde; Not desirable for Oracle 12c instances (see NIM100572)

grant ALTER SESSION to sde;
grant ANALYZE ANY to sde;
grant SELECT ANY DICTIONARY to sde;
grant CREATE DATABASE LINK to sde;
grant CREATE MATERIALIZED VIEW to sde;
grant RESTRICTED SESSION to sde;
grant UNLIMITED TABLESPACE to sde;
grant ALTER SYSTEM to sde;
grant SELECT_CATALOG_ROLE to sde;


--Create geodatabase in ArcCatalog
1. Open ArcCatalog and run the Create Enterprise or Enable Enterprise Geodatabase tool
2. After the tool completes, close ArcCatalog

--Close database
alter pluggable database gis_admin close;

--Unplug database
alter pluggable database gis_admin unplug into '\\tompsett\d\chris\gis_admin.xml';



--Move the physical files to the machine where the install will occur
--\\tompsett\chris\gis_admin


--Connect to new container as SYS
sqlplus sys/sys@tompsett/wdemo as sysdba

--Create a pluggable database based off the XML
create pluggable database gis_admin using 'D:/chris/gis_admin.xml'
source_file_name_convert = ('C:\app\chri6962\oradata\wcdb\gis\', 'D:\chris\gis_admin\')
move
path_prefix = 'D:\app\oracle\oradata\wdemo\gis2\'
file_name_convert = ('D:\chris\gis_admin\','D:\app\oracle\oradata\wdemo\gis_admin\');


Resources:

Administering a CDB with SQL*Plus
http://docs.oracle.com/database/121/ADMIN/cdb_admin.htm#ADMIN13606

Creating and Removing PDBs with SQL*Plus
http://docs.oracle.com/database/121/ADMIN/cdb_plug.htm#ADMIN13549

Viewing Information About CDBs and PDBs with SQL*Plus
http://docs.oracle.com/database/121/ADMIN/cdb_mon.htm#ADMIN13719

Administering PDBs with SQL*Plus
http://docs.oracle.com/database/121/ADMIN/cdb_pdb_admin.htm#ADMIN13663
