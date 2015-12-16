/***********************************************************************

gdb-package-releases.SQL  --  List individual releases of gdb packages

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves to list the packages within an enterprise
geodatabase. Best used for comparing geodatabases to see if they
are at the same release.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        08/22/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: 10.0 and above
DBMS: Oracle
DBMS Version: All

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
Oracle, Packages, Release

***********************************************************************/

SET serveroutput ON
BEGIN
  dbms_output.put_line('ARCHIVE_UTIL Release: ' || ARCHIVE_UTIL.C_package_release);
  dbms_output.put_line('DBTUNE_UTIL Release: ' || DBTUNE_UTIL.C_package_release);
  dbms_output.put_line('GDB_UTIL Release: ' || GDB_UTIL.C_package_release);
  dbms_output.put_line('INSTANCES_UTIL Release: ' || INSTANCES_UTIL.C_package_release);
  dbms_output.put_line('KEYSET_UTIL Release: ' || KEYSET_UTIL.C_package_release);
  dbms_output.put_line('LAYER_STATS_UTIL Release: ' || LAYER_STATS_UTIL.C_package_release);
  dbms_output.put_line('LAYERS_UTIL Release: ' || LAYERS_UTIL.C_package_release);
  dbms_output.put_line('LOCATOR_UTIL Release: ' || LOCATOR_UTIL.C_package_release);
  dbms_output.put_line('LOCK_UTIL Release: ' || LOCK_UTIL.C_package_release);
  dbms_output.put_line('LOGFILE_UTIL Release: ' || LOGFILE_UTIL.C_package_release);
  dbms_output.put_line('METADATA_UTIL Release: ' || METADATA_UTIL.C_package_release);
  dbms_output.put_line('PINFO_UTIL Release: ' || PINFO_UTIL.C_package_release);
  dbms_output.put_line('RASTERCOLUMNS_UTIL Release: ' || RASTERCOLUMNS_UTIL.C_package_release);
  dbms_output.put_line('REGISTRY_UTIL Release: ' || REGISTRY_UTIL.C_package_release);
  dbms_output.put_line('SDE_UTIL Release: ' || SDE_UTIL.C_package_release);
  dbms_output.put_line('SDO_UTIL Release: ' || SDO_UTIL.C_package_release);
  dbms_output.put_line('SPX_UTIL Release: ' || SPX_UTIL.C_package_release);
  dbms_output.put_line('SREF_UTIL Release: ' || SREF_UTIL.C_package_release);
  dbms_output.put_line('ST_CREF_UTIL Release: ' || ST_CREF_UTIL.C_package_release);
  dbms_output.put_line('ST_DOMAIN_OPERATORS Release: ' || ST_DOMAIN_OPERATORS.C_package_release);
  dbms_output.put_line('ST_GEOM_COLS_UTIL Release: ' || ST_GEOM_COLS_UTIL.C_package_release);
  dbms_output.put_line('ST_GEOM_UTIL Release: ' || ST_GEOM_UTIL.C_package_release);
  dbms_output.put_line('ST_GEOMETRY_OPERATORS Release: ' || ST_GEOMETRY_OPERATORS.C_package_release);
  dbms_output.put_line('ST_GEOMETRY_SHAPELIB_PKG Release: ' || ST_GEOMETRY_SHAPELIB_PKG.C_package_release);
  dbms_output.put_line('ST_RELATION_OPERATORS Release: ' || ST_RELATION_OPERATORS.C_package_release);
  dbms_output.put_line('ST_SPREF_UTIL Release: ' || ST_SPREF_UTIL.C_package_release);
  dbms_output.put_line('ST_TYPE_EXPORT Release: ' || ST_TYPE_EXPORT.C_package_release);
  dbms_output.put_line('ST_TYPE_USER Release: ' || ST_TYPE_USER.C_package_release);
  dbms_output.put_line('ST_TYPE_UTIL Release: ' || ST_TYPE_UTIL.C_package_release);
  dbms_output.put_line('SVR_CONFIG_UTIL Release: ' || SVR_CONFIG_UTIL.C_package_release);
  dbms_output.put_line('VERSION_USER_DDL Release: ' || VERSION_USER_DDL.C_package_release);
  dbms_output.put_line('VERSION_UTIL Release: ' || VERSION_UTIL.C_package_release);
  dbms_output.put_line('XML_UTIL Release: ' || XML_UTIL.C_package_release);
END;
/
