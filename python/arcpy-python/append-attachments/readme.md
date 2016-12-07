#Append attachments into a new feature class
Appends records from one feature class into a new empty feature class.
Appends attachments from the original feature class into the attachment table of the new feature class.

##Usage
- Assumes attachments related by GLOBALID.
- Helpful in the event that fields need to be reordered, in which case a new table must be created. The new table will have different global ids than the original table. The attachments need to therefore be reassigned.

##Steps:
1. If applicable, copy-paste feature class from the enterprise geodatabase to a new file geodatabase.
1. Create a new empty output table (with the reordered fields if applicable). The name should be unique.
1. If the output table does not have a GLOBALID field, add one. Right-click > Manage > Add GlobalIDs. 
1. Change the following parameters in the script (appendAttachments.py). 
1. Run the script.
1. Check the output.
1. If applicable, copy-paste the new feature class into the enterprise geodatabase.
```python
#START OF VARIABLES TO CHANGE
GDB_location = r"path\to\file.gdb" 
source = "sourceFeatureClass" 
target = "emptyTargetFeatureClass" 
source_attachment = "sourceAttachments__ATTACH"
#END OF VARIABLES TO CHANGE
```
