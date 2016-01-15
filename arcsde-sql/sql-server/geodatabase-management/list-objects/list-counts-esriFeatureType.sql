/***********************************************************************
list-counts-esriFeatureType.sql  --  Feature Class Feature Types
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Purpose:
 This script serves as a method for returning the counts of each geodatabase
 feature and dataset type.
    esriDTRasterDataset
    esriDTTable
    esriFTAnnotation
    esriFTSimple
    esriFTSimpleEdge
    esriFTSimpleJunction
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
History:
Ken Galliher        01/15/2016               Original coding.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Versions Supported:
EGDB: 10.0 +
DBMS: SQL Server
DBMS Version: All
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Tags:
SQL Server, Feature Class, Spatial Type, List, Count
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Notes:
This script must be run with privileges to the SDE repository.
***********************************************************************/
WITH GDBItemTypes AS (
	SELECT
		ITEMS.Definition.value('(/DEFeatureClassInfo/FeatureType)[1]', 'nvarchar(max)') AS "ShapeType"
	FROM 
		sde.GDB_ITEMS AS ITEMS INNER JOIN sde.GDB_ITEMTYPES AS ITEMTYPES
		ON ITEMS.Type = ITEMTYPES.UUID
	WHERE 
		ITEMTYPES.Name = 'Feature Class'
	UNION ALL
	SELECT
		ITEMS.Definition.value('(/DERasterDataset/DatasetType)[1]', 'nvarchar(max)') AS "ShapeType"
	FROM 
		sde.GDB_ITEMS AS ITEMS INNER JOIN sde.GDB_ITEMTYPES AS ITEMTYPES
		ON ITEMS.Type = ITEMTYPES.UUID
	WHERE 
		ITEMTYPES.Name = 'Raster Dataset'
	UNION ALL
	SELECT
		ITEMS.Definition.value('(/DETableInfo/DatasetType)[1]', 'nvarchar(max)') AS "ShapeType"
	FROM 
		sde.GDB_ITEMS AS ITEMS INNER JOIN sde.GDB_ITEMTYPES AS ITEMTYPES
		ON ITEMS.Type = ITEMTYPES.UUID
	WHERE 
	 ITEMTYPES.Name = 'Table'
	AND ITEMS.physicalname IN (SELECT database_name + '.' + owner + '.' + table_name from sde.SDE_table_registry WHERE object_flags = 3)
 )

SELECT ShapeType, COUNT(ShapeType) as totalfeatures 
FROM GDBItemTypes
GROUP BY ShapeType