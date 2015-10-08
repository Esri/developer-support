/***********************************************************************

get-polygon-si-grid-cells.sql  --  View the spatial index graphically.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
	This script will create a new polygon table and generate geometry for
each spatial index grid in a SQL Server geometry spatial table
using the sp_help_spatial_geometry_histogram stored procedure.

Also calculates the density of features that intersect a cell.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Ken Galliher        8/12/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: All
DBMS: SQL Server
DBMS Version: 2008R2 and above

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
SQL Server, Spatial Index, Grid Size, Geometry

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
sp_help_spatial_geometry_histogram  (Transact-SQL)
https://msdn.microsoft.com/en-us/library/gg509094.aspx

***********************************************************************/

IF OBJECT_ID (N'sde_load.parcel_cellbounds_hist', N'U') IS NOT NULL
DROP TABLE sde_load.parcel_cellbounds_hist;
GO
CREATE TABLE sde_load.parcel_cellbounds_hist(id int IDENTITY(1,1) PRIMARY KEY, Cellid int, cellbound geometry, IntersectionCount int);
GO

DECLARE @hist_results table
(
	CellId int,
	Cell geometry,
	IntersectionCount int
);

-- Calculate the min/max x/y from the shape column of a feature class or spatial table.
-- Update the EnvelopeAggregate() function with the name of your geometry column
DECLARE @minx float = (SELECT geometry::EnvelopeAggregate(shape).STPointN(1).STX  AS MinX FROM SDE_LOAD.PARCEL);
DECLARE @miny float = (SELECT geometry::EnvelopeAggregate(shape).STPointN(1).STY  AS MinY FROM SDE_LOAD.PARCEL);
DECLARE @maxx float = (SELECT geometry::EnvelopeAggregate(shape).STPointN(3).STX  AS MaxX FROM SDE_LOAD.PARCEL);
DECLARE @maxy float = (SELECT geometry::EnvelopeAggregate(shape).STPointN(3).STY  AS MaxY FROM SDE_LOAD.PARCEL);
DECLARE @res int = 64;

INSERT INTO @hist_results
EXEC
sp_help_spatial_geometry_histogram
	@tabname = 'SDE_LOAD.PARCEL', -- use single quotes if this should be qualified with a schema name
	@colname = shape,
	@xmin = @minx,
	@xmax = @maxx,
	@ymin = @miny,
	@ymax = @maxy,
	@resolution = @res

-- Insert the records from the calculated @hist_results table into the cellbounds table.
INSERT INTO sde_load.parcel_cellbounds_hist
SELECT CellID, CELL, /*.STBoundary().STBuffer(0.05) AS cellbound,*/ IntersectionCount
FROM @hist_results
GO

-- Select all the rows.
SELECT * FROM sde_load.parcel_cellbounds_hist
