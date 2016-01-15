/***********************************************************************
list-counts-esriFeatureType.sql  --  Feature Class Feature Types
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Purpose:
 This script provides a stored procedure to list each Geoprocessing
 History entry for a given feature class.  The results returned are
 essentially the same results seen in the metadata view.
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
SQL Server, Feature Class, Spatial Type, List, Count, GP History
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Notes:
This script must be run with privileges to the SDE repository.
***********************************************************************/
IF OBJECT_ID (N'sde.ListGPHistory', N'P') IS NOT NULL
    DROP PROCEDURE sde.ListGPHistory;
GO
CREATE PROCEDURE [sde].[ListGPHistory](@tableName varchar(100))
AS
DECLARE 
	@xml xml
SELECT @xml = (select documentation from sde.GDB_ITEMS AS ITEMS INNER JOIN sde.GDB_ITEMTYPES AS ITEMTYPES
		ON ITEMS.Type = ITEMTYPES.UUID
	WHERE ITEMS.Name = @tableName)
;WITH getGPVals AS
(
	SELECT 
		@tableName as TableName,
		T.c.query('.') AS XMLValue, 
		reverse(left(reverse(c.value('(@ToolSource)', 'varchar(1000)')), 
			charindex('\', reverse(c.value('(@ToolSource)', 'varchar(1000)'))) -1)) as ToolProcess,
		CAST(
				SUBSTRING(c.value('(@Date)', 'varchar(10)'), 1,4) + '/' +
				SUBSTRING(c.value('(@Date)', 'varchar(10)'), 3,2) + '/' +
				SUBSTRING(c.value('(@Date)', 'varchar(10)'), 5,2) as datetime2
			) 
		as TheDate,
		c.value('(.)[1]', 'varchar(max)')  as ProcessParams
	FROM   @xml.nodes('//Process') T(c)
	)
	SELECT * FROM getGPVals
GO


--exec sde.ListGPHistory 'address.sde.capacitorbank'