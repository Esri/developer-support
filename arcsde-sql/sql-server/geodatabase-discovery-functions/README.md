sql-server-discovery-functions.sql
===================
SQL Server - TSQL

Use built-in geodatabase discovery functions to display dataset level information.

----------


REQUIRED:
Enterprise SQL Server geodatabase.

```sql
/**
* Use built in SDE Geodatabase discovery functions to display 
* dataset level information.
*
* Using the records in the sde.sde_table_tegistry table, the following CTE will return information for each table.
* http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/archive-view-name.htm
*
**/
WITH table_registry_discovery AS (
	SELECT registration_id, 
			owner, 
			table_name,
			sde.is_simple(owner, table_name) as is_simple,
			sde.geometry_column_type(owner, table_name, gc.f_geometry_column) as geometry_column_type,
			--sde.geometry_columns(owner, table_name) as geometry_column_type, -- older version
			sde.rowid_name(owner, table_name) as rowid_name,
			sde.is_versioned(owner, table_name) as version_status,
			sde.version_view_name(owner, table_name) as vvw_name,
			sde.is_archive_enabled(owner, table_name) as is_arch_enabled,
			sde.archive_view_name(owner, table_name) as archive_view_name,
			sde.is_replicated(owner, table_name) as is_replicated,
			sde.globalid_name(owner, table_name) as globalid_name
	FROM sde.SDE_table_registry
	INNER JOIN sde.sde_geometry_columns gc
	ON table_name = gc.f_table_name
)

-- SELECT all columns from the above CTE
SELECT registration_id, 
		rowid_name, 
		table_name,
		geometry_column_type,
		version_status,
		vvw_name,
		is_arch_enabled,
		archive_view_name,
		is_simple,
		is_replicated,
		globalid_name
FROM table_registry_discovery
ORDER BY registration_id

```

DOCUMENTATION:

[Archive_View_Name][1]

[Geometry_Columns][2]

[GlobalID_Name][3]

[Is_Archive_Enabled][4]

[Is_Simple][5]

[Is_Versioned][6]

[Is_Replicated][7]

[RowID_Name][8]

[Version_View_Name][9]

[1]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/archive-view-name.htm
[2]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/geometry-columns.htm
[3]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/globalid-name.htm
[4]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/is-archive-enabled.htm
[5]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/is-simple.htm
[6]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/is-versioned.htm
[7]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/is-replicated.htm
[8]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/rowid-name.htm
[9]:http://desktop.arcgis.com/en/desktop/latest/manage-data/using-sql-with-gdbs/version-view-name.htm


