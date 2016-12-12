import arcpy, sys
from arcpy import env

wkspc = r"C:\Users\ken6574\AppData\Roaming\ESRI\Desktop10.3\ArcCatalog\KENG-SQL2014_KENG2014.sde"
env.workspace = wkspc

exe = arcpy.ArcSDESQLExecute(wkspc)

# simple error handling of the ArcSDESQLExecute execute method to test for successful connection
try:
    results = exe.execute("SELECT TOP 1 c FROM sde.gdb_items")
    print(results)
except Exception as ex:
    ex = sys.exc_info()[0]
    print("There was an error: %s" % ex)
    
# simple example of querying multiple columns and handling the each row as an array    
try:
    results = exe.execute("SELECT objectid, name FROM sde.gdb_items")
    for row in results:
        print("Objectid: {0}, Name: {1}".format(row[0], row[1]))

except Exception as ex:
    ex = sys.exc_info()[0]
    print("There was an error: %s" % ex)