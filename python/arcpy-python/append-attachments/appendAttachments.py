# Appends attachments from one feature class into a new empty feature class. Assumes attachments related by GLOBALID.

#START OF VARIABLES TO CHANGE
GDB_location = r"path\to\file.gdb" 
source = "sourceFeatureClass" 
target = "emptyTargetFeatureClass" 
source_attachment = "sourceAttachments__ATTACH"
#END OF VARIABLES TO CHANGE

import arcpy

target_attachment = target + "__ATTACH"
jointable = "jointable"
newfield = "oldglobalid"
tableview = "test1234"
temptable = "deleteme"
newglobalid = "newglobalid"

arcpy.env.workspace = GDB_location
arcpy.env.overwriteOutput = True
arcpy.env.qualifiedFieldNames = True
fieldsyntax = target + "_" + "GLOBALID"

print("Enabling attachments")
arcpy.EnableAttachments_management(target)

for table in [target, source, source_attachment]:
    print("Adding field {0} to {1}".format(newfield, table))
    arcpy.AddField_management(table, newfield, "TEXT")

    edit = arcpy.da.Editor(arcpy.env.workspace)
    edit.startEditing(False, False)
    edit.startOperation()

    oid = "GLOBALID"
    if table == source_attachment: oid = "REL_GLOBALID"

    print("Persisting old global id in {0}".format(table))
    with arcpy.da.UpdateCursor(table, [oid, newfield]) as cur:
        for row in cur:
            row[1] = row[0]
            cur.updateRow(row)            
    edit.stopOperation()
    edit.stopEditing(True)

print("Appending {0} to {1}".format(source, target))
arcpy.Append_management(source, target, "NO_TEST")

print("Adding field {0} to {1}".format(newglobalid, target))
arcpy.AddField_management(target, newglobalid, "TEXT")
edit = arcpy.da.Editor(arcpy.env.workspace)
edit.startEditing(False, False)
edit.startOperation()

print("Persisting new global id in {0}".format(target))
with arcpy.da.UpdateCursor(target, ["GLOBALID", newglobalid]) as cur:
    for row in cur:
        row[1] = row[0]
        cur.updateRow(row)            
edit.stopOperation()
edit.stopEditing(True)

fieldinfo = arcpy.FieldInfo()
fields = arcpy.Describe(target).fields
for field in fields:
    if field.name == newfield or field.name == newglobalid:
        fieldinfo.addField(field.name, field.name, "VISIBLE", "")
        continue
    fieldinfo.addField(field.name, field.name, "HIDDEN", "")

arcpy.MakeFeatureLayer_management(target, jointable, field_info = fieldinfo)
arcpy.MakeTableView_management(source_attachment, tableview)

print("Joining {0} to {1} based off of key field {2}.".format(jointable, tableview, newfield))
arcpy.AddJoin_management(tableview, newfield, jointable, newfield, "KEEP_COMMON")

print("Creating table {0}".format(temptable))
arcpy.TableToTable_conversion(tableview, arcpy.env.workspace, temptable)
edit = arcpy.da.Editor(arcpy.env.workspace)
edit.startEditing(False, False)
edit.startOperation()

print("Assigning REL_GLOBALID in {0} to the new global id in {1}".format(temptable, target))
with arcpy.da.UpdateCursor(temptable, [target + "_" + newglobalid, "REL_GLOBALID"]) as cur:
    for row in cur:
        row[1] = row[0]
        cur.updateRow(row)            
edit.stopOperation()
edit.stopEditing(True)

print("Appending {0} to {1}".format(temptable, target_attachment))
arcpy.Append_management(temptable, target_attachment, "NO_TEST")

print("Deleting {0}.".format(temptable))
arcpy.Delete_management(temptable)

for table in [target, source, source_attachment]:
    print("Removing field {0} from {1}".format(newfield, table))
    arcpy.DeleteField_management(table, newfield)

print("Removing field {0} from {1}".format(newglobalid, target))
arcpy.DeleteField_management(target, newglobalid)
                           
print("Finished! Check {0}".format(target))
