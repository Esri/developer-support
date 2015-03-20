#Usage notes
- Insert points into a Postgres pg_geometry column or ST_Geometry column using the values in an X and Y column.
- Postgres Only.
- Does not require a geodatabase.
- ST_Geometry must be installed to use Esri ST_Geometry.
- http://resources.arcgis.com/en/help/main/10.2/index.html#//019v0000000r000000

#Requirements
- A table in a PostgreSQL database containing 1 X and 1 Y column.
- A SQL Editor that can connect to a Postgres database and run PG/PLSql
- For pg_geometry, use the PG_Geometry script.
- For ST_Geometry, Use the Esri ST_Geometry script.
- Ensure the proper SRID is input into the calls for ST_Point or ST_GeomFromText.
