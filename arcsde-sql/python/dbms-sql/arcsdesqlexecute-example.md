ArcSDESQLExecute Example
===================

Simple example that shows database connections, execution of SQL and displaying results from an array of rows.

## Example

```python
import arcpy, sys
from arcpy import env

wkspc = r"C:\path\to\database\connection_file.sde"
env.workspace = wkspc

# simple example of querying multiple columns and handling the each row as an array    
try:
    exe = arcpy.ArcSDESQLExecute(wkspc)
    sql = "SELECT objectid, name FROM gis.some_table"
    results = exe.execute(sql)
    for row in results:
        print("Objectid: {0}, Name: {1}".format(row[0], row[1]))

except Exception as ex:
    print "Fail\n", ex[0]

'''
results -
Objectid: 3480, Name: value 1
Objectid: 3880, Name: value 2
Objectid: 3885, Name: value 3
'''

```

###### Documentation and more examples
[ArcSDESQLExecute][1]

[Executing SQL Using an ArcSDE Connection][2]
[1]: http://desktop.arcgis.com/en/arcmap/10.3/analyze/arcpy-classes/arcsdesqlexecute.htm
[2]: http://desktop.arcgis.com/en/arcmap/10.3/analyze/python/executing-sql-using-an-arcsde-connection.htm
