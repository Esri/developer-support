/***********************************************************************
list-delta-counts.sql  --  Feature Class Feature Types
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Purpose:
This SQL query generates a new table, called DeltaTables and owned
by DBO by default, in the database with the following information:
the name of all the versioned tables, the owner of each table, and
the number of Adds and Deletes for each table.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
History:
Julia Lenhardt        05/09/2016               Original coding.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Versions Supported:
EGDB: 10.0 +
DBMS: SQL Server
DBMS Version: All
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Tags:
SQL Server, Feature Class, Spatial Type, List, Count, Versioning
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Notes:
This script must be run with privileges to select from the SDE repository.
***********************************************************************/
SET NOCOUNT ON

-- To start, check if the table already exists. If so, drop and recreate it.
-- Change the name and owner of the table as you like

--IF OBJECT_ID(N'#DeltasCount', N'U') IS NOT NULL
--DROP TABLE #DeltasCount


CREATE TABLE [#DeltasCount](
	[TableName] [nvarchar](128) NULL,
	[Owner] [nvarchar](32) NULL,
	[RegistrationID] [int] NULL,
	[NumAdds] [int] NULL,
	[NumDeletes] [int] NULL
) 

-- Next, declare all the variables

DECLARE @registration_id INT
DECLARE @owner VARCHAR(50)
DECLARE @table_name VARCHAR(50)
DECLARE @add VARCHAR(50)
DECLARE @delete VARCHAR(50)

DECLARE @SQLStatementAll NVARCHAR(max)

-- Declare and define the cursor, searching for tables
-- registered as versioned using the built-in sde.is_versioned
-- function. For more information on this function, check out the doc:
-- http://desktop.arcgis.com/en/arcmap/10.3/manage-data/using-sql-with-gdbs/is-versioned.htm

DECLARE db_cursor CURSOR
FOR
SELECT a.registration_id, a.OWNER, a.table_name
FROM sde.sde_table_registry a
WHERE sde.is_versioned(OWNER, table_name) = 'TRUE'

-- Open and run the cursor
OPEN db_cursor

FETCH NEXT
FROM db_cursor
INTO @registration_id, @owner, @table_name

WHILE @@FETCH_STATUS = 0
BEGIN
	-- Below, we concatenate the registration ID and the letters "a" and "d" to search for 
	-- the Adds and Deletes table, respectively, for each versioned table. Note that if the adds and deletes
	-- tables aren't owned by "dbo", you'll have to edit this or pull the owner information. 
	
	SET @add = @owner + '.a' + CAST(@registration_id AS VARCHAR(12))
	SET @delete = @owner + '.d' + CAST(@registration_id AS VARCHAR)
	
	-- Insert all the values into a single table called DeltaTables
	SET @SQLStatementAll = (N'INSERT INTO #DeltasCount (TableName, Owner, RegistrationID, NumAdds, NumDeletes) VALUES( ''' + @table_name + ''', ''' + @owner + ''', ' + CONVERT(VARCHAR(20), @registration_id)) + ', ' + ' (select COUNT(*) [NumDeletes] from ' + CONVERT(VARCHAR(20), @delete) + '),' + ' (select COUNT(*) [NumAdds] from ' + CONVERT(VARCHAR(20), @add) + '))'

	-- Use PRINT to debug your SQL string before executing
	PRINT @SQLStatementAll

	EXEC sp_executesql @SQLStatementAll

	FETCH NEXT
	FROM db_cursor
	INTO @registration_id
		,@owner
		,@table_name
END

CLOSE db_cursor

DEALLOCATE db_cursor
SELECT * FROM #DeltasCount
DROP TABLE #DeltasCount



