### Geoprocessing with SQLite geodatabase
## Multi step process that:
1.  Creates a SQLite geodatabase and adds st_geometry type
2.  Copies two fgdb polygon feature classes into SQLite geodatabase
3.  Connect to SQLite gdb with sqlite3 module
4.  Use SQL to add a new column called acres
5.  Create a new SQLite feature class based on the intersection of imported feature classes.
6.  Use an insert cursor to calculate and insert the acre value into new SQLite feature class.

#### [CreateSQLiteDatabase](http://desktop.arcgis.com/en/arcmap/10.3/analyze/arcpy-functions/createsqlitedb.htm)


```python
from arcpy import env
import arcpy
import sqlite3

poly1 = r"D:\Data\John-5-blocks.gdb\Water"
poly2 = r"D:\Data\John-5-blocks.gdb\AOI"

#Create a spatialite enabled sqlite database with the arcpy gp function
sqlite_db_spatialite = r'D:\Data\sqlite\Roads.sqlite'
arcpy.gp.CreateSQLiteDatabase(sqlite_db_spatialite,'ST_GEOMETRY')
print("Created - {} as st_geometry".format(sqlite_db_spatialite))


# Set an arcpy workspace to sqlite gdb
wrkspc = sqlite_db_spatialite
arcpy.env.workspace = wrkspc
print("Workspace set...")

#move some sample data in
arcpy.FeatureClassToGeodatabase_conversion([poly1], wrkspc)
print(arcpy.GetMessages())
arcpy.FeatureClassToGeodatabase_conversion([poly2], wrkspc)
print(arcpy.GetMessages())

# Set the sqlite feature class variables
in_fc = r"{}/main.Water".format(wrkspc)
aoi = r"{}/main.AOI".format(wrkspc)

#Verify the correct string format with path
in_features = [aoi,in_fc]
for f in in_features:
    print f

#Use sqlite3 functions for some SQL fun
conn = sqlite3.connect(sqlite_db_spatialite)
print("connected")

cur = conn.cursor()
cur.execute("ALTER TABLE Water ADD COLUMN acres REAL")
print("Successfully altered the table -- {}".format(cur.fetchone()))

#set the name and location of the output feature class
try:
    new_sl_fc = "{}/new_sl_fc".format(wrkspc)
    print("{} awakens!".format(new_sl_fc))

    #make an intersection
    arcpy.analysis.Intersect(in_features,new_sl_fc)
    print("Intersect finished")

    #Run the update cursor to calculate the acres field using the shape_area field
    with arcpy.da.UpdateCursor(new_sl_fc,['acres','SHAPE@LENGTH']) as acre_crsr:
        for ac in acre_crsr:
            ac[0] = ac[1] / 4046.856
            acre_crsr.updateRow(ac)

except Exception as ex:
    print(arcpy.GetMessages())
        
print("Done")