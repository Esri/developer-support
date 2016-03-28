#Merge Attachments
Merge attachments from two feature classes. Creates an output feature class.

##Testing Environment
* Tested with Python 2.7, 10.4 File GDB, Oracle 12c, and SQL Server 2012.
* Executed as a standalone script.
* Did not test with versioned datasets.
* The script was not extensively tested. Always check the output. Always backup data.

##Assumptions
* There are only two feature classes, each feature class has attachments enabled.
* This code will Merge (not append) feature classes into a newly created feature class.
* The feature classes are stored in the same GDB.
* The field names fc1oid, fc2oid, a1reloid, a2reloid do not already exist. These fields will be created.
* The file, schemaChanges, does not exist in the same directory this python script is stored in. If it does, it will be overwritten.
* The two feature classes have the same fields, and are in the same spatial reference.

## Instructions
Change these variables in the script:

```python
#START OF VARIABLES TO CHANGE
GDB_location = r"path-to-gdb\geodatabase.gdb"
feature_class_1 = "FC1"
feature_class_2 = "FC2"
attachment_table_1 = "FC1__ATTACH"
attachment_table_2 = "FC2__ATTACH"
is_versioned = False
output_feature_class = "test1"
dataowner = None 
geodatabase_name = None
#END OF VARIABLES TO CHANGE
```

* GDB_location: If not using a file geodatabase, specify database connection file for the GDB_location.
* dataowner: For SQL Server and Oracle, supply the data creator name (i.e. "datacreator"). For File GDB, leave as None.
* geodatabase_name: For SQL Server, supply the GDB name (i.e. "GDBNAME"). For File GDB and Oracle, leave as None.
