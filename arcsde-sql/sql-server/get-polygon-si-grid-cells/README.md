get-polygon-si-grid-cells.sql
===================
###SQL Server - TSQL



Use built-in SQL Server stored procedures and spatial functions to reveal polygon representations of a spatial table's spatial index.  This also includes density of features.



####REQUIRED:
SQL Server2008R2 database or later.
Update your user and table names in the necessary places.

```sql
IF OBJECT_ID (N'sde_load.parcel_cellbounds_hist', N'U') IS NOT NULL
DROP TABLE gisuser.parcel_cellbounds_hist;
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
DECLARE @minx float = (SELECT geometry::EnvelopeAggregate(shape).STPointN(1).STX  AS MinX FROM gisuser.PARCEL);
DECLARE @miny float = (SELECT geometry::EnvelopeAggregate(shape).STPointN(1).STY  AS MinY FROM gisuser.PARCEL);
DECLARE @maxx float = (SELECT geometry::EnvelopeAggregate(shape).STPointN(3).STX  AS MaxX FROM gisuser.PARCEL);
DECLARE @maxy float = (SELECT geometry::EnvelopeAggregate(shape).STPointN(3).STY  AS MaxY FROM gisuser.PARCEL);
DECLARE @res int = 64;

INSERT INTO @hist_results
EXEC
-- Built in stored procedure http://msdn.microsoft.com/en-us/library/gg509094.aspx
sp_help_spatial_geometry_histogram
	@tabname = 'gisuser.PARCEL', -- use single quotes if this should be qualified with a schema name
	@colname = shape,
	@xmin = @minx,
	@xmax = @maxx,
	@ymin = @miny,
	@ymax = @maxy,
	@resolution = @res

-- Insert the records from the calculated @hist_results table into the cellbounds table.
INSERT INTO gisuser.parcel_cellbounds_hist
SELECT CellID, CELL, /*.STBoundary().STBuffer(0.05) AS cellbound,*/ IntersectionCount
FROM @hist_results
GO

```

DOCUMENTATION:

[sp_help_spatial_geometry_histogram][1]


[1]:https://msdn.microsoft.com/en-us/library/gg509094.aspx
