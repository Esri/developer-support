# Usage: Merge attachments from two feature classes. Creates an output feature class.

# Testing Environment:
# Tested with Python 2.7, 10.4 file GDB, Oracle 12c, and SQL Server 2012.
# Executed as a standalone script.
# Did not test with versioned datasets.
# The script was not extensively tested. Always check the output. Always backup data.

# Assumptions:
#1. There are only two feature classes, each feature class has attachments enabled.
#2. This code will Merge (not append) feature classes into a newly created feature class.
#3. The feature classes are stored in the same GDB.
#4. The field names fc1oid, fc2oid, a1reloid, a2reloid do not already exist. These fields will be created.
#5. The file, schemaChanges, does not exist in the same directory this python script is stored in. If it does, it will be overwritten.
#6. The two feature classes have the same fields, and are in the same spatial reference.

# Notes:
# Helps work around NIM078105.
# Lots of schema changes, which are printed and written to a log file named schemaChanges.

import arcpy

#START OF VARIABLES TO CHANGE
GDB_location = r"path-to-gdb\geodatabase.gdb" #If not using a file geodatabase, specify database connection file.
feature_class_1 = "FC1"
feature_class_2 = "FC2"
attachment_table_1 = "FC1__ATTACH"
attachment_table_2 = "FC2__ATTACH"
is_versioned = False
output_feature_class = "test1"
dataowner = None #For SQL Server and Oracle, supply the data creator name (i.e. "datacreator"). For File GDB, leave as None.
geodatabase_name = None #For SQL Server, supply the GDB name (i.e. "GDBNAME"). For File GDB and Oracle, leave as None.
#END OF VARIABLES TO CHANGE

attachment_table_merge = output_feature_class + "__ATTACH"
jointable = "testmerge"
firsttable = "deleteme1"
secondtable = "deleteme2"

arcpy.env.workspace = GDB_location
arcpy.env.overwriteOutput = True
arcpy.env.qualifiedFieldNames = True

fieldsyntax = output_feature_class + "_" + "OBJECTID"
if dataowner != None: fieldsyntax = dataowner + "_" + fieldsyntax
if geodatabase_name != None: fieldsyntax = geodatabase_name + "_" + fieldsyntax

fields = {feature_class_1: "fc1oid", feature_class_2: "fc2oid",
          attachment_table_1: "a1reloid", attachment_table_2: "a2reloid"}

FILE = open("schemaChanges.txt", "w")
print("Schema changes:")
FILE.write("Schema changes:\n")

for table in fields.keys():
    print("Adding field {0} to {1}".format(fields[table], table))
    FILE.write("Adding field {0} to {1}\n".format(fields[table], table))
    arcpy.AddField_management(table, fields[table], "LONG")

    edit = arcpy.da.Editor(arcpy.env.workspace)
    edit.startEditing(False, is_versioned)
    edit.startOperation()

    if table == attachment_table_1 or table == attachment_table_2:
        oid = "REL_OBJECTID"
    else: oid = "OID@"
    
    with arcpy.da.UpdateCursor(table, [oid, fields[table]]) as cur:
        for row in cur:
            row[1] = row[0]
            cur.updateRow(row)            
    edit.stopOperation()
    edit.stopEditing(True)

print("Merging {0} and {1}, creating {2}".format(feature_class_1, feature_class_2, output_feature_class))
FILE.write("Merging {0} and {1}, creating {2}\n".format(feature_class_1, feature_class_2, output_feature_class))
arcpy.Merge_management([feature_class_1, feature_class_2], output_feature_class)

print("Enabling attachments on {0}, creating {1}".format(output_feature_class, attachment_table_merge))
FILE.write("Enabling attachments on {0}, creating {1}\n".format(output_feature_class, attachment_table_merge))
arcpy.EnableAttachments_management(output_feature_class)
     
arcpy.MakeFeatureLayer_management(output_feature_class, jointable)

for table in [[attachment_table_1, feature_class_1, firsttable],[attachment_table_2, feature_class_2, secondtable]]:
    tableview = "testmergedattachments"
    arcpy.MakeTableView_management(table[0], tableview)
    arcpy.AddJoin_management(tableview, fields[table[0]], jointable, fields[table[1]], "KEEP_COMMON")

    print("Creating table {0}".format(table[2]))
    FILE.write("Creating table {0}\n".format(table[2]))
    arcpy.TableToTable_conversion(tableview, arcpy.env.workspace, table[2])

    edit = arcpy.da.Editor(arcpy.env.workspace)
    edit.startEditing(False, is_versioned)
    edit.startOperation()    
    with arcpy.da.UpdateCursor(table[2], [fieldsyntax, "REL_OBJECTID"]) as cur:
        for row in cur:
            row[1] = row[0]
            cur.updateRow(row)            
    edit.stopOperation()
    edit.stopEditing(True)

arcpy.Append_management([firsttable, secondtable], attachment_table_merge, "NO_TEST")

print("Deleting {0} and {1}".format(firsttable, secondtable))
FILE.write("Deleting {0} and {1}\n".format(firsttable, secondtable))
for i in [firsttable, secondtable]:
    arcpy.Delete_management(i)

for i in fields.keys():
    print("Removing field {0} from {1}".format(fields[i], i))
    FILE.write("Removing field {0} from {1}\n".format(fields[i], i))
    arcpy.DeleteField_management(i, fields[i])

print("Removing fields {0} and {1} from {2}".format(fields[feature_class_1], fields[feature_class_2], output_feature_class))
FILE.write("Removing fields {0} and {1} from {2}\n".format(fields[feature_class_1], fields[feature_class_2], output_feature_class))
arcpy.DeleteField_management(output_feature_class, [fields[feature_class_1], fields[feature_class_2]])
                           
print("Finished! Check {0}".format(output_feature_class))
FILE.write("Finished! Check {0}".format(output_feature_class))
FILE.close()
