Recover Corrupt Data
=========================

Recovers some data, but may not recover all data or any of the data. This script runs *Select Layer By Attribute* record by record and appends the record into a new dataset, whose schema matches the corrupt dataset. This will only work for feature classes.  

## Symptoms of corrupt data

- A feature class has hidden records in the attribute table. That is, the attribute table will show OBJECTIDs 1, 2, 4 for example; however, *Select Layer By Attribute* for OBJECTID = 3 returns a result.
- Display issues. Zoom out and the data disappears.
- Tools like *Repair Geometry* or *Add Spatial Index* do not resolve the issue.
- Any tool that exports the data will fail to export all records.
- The attribute table will show x amount of records. After scrolling, the table shows a different amount of records (i.e. Jumps from 353 records to 183 records).

## Steps
1. Create a new feature class with the same schema as the "corrupt" feature class (we are able to import the schema from the *New Feature Class* wizard).
2. Change appropriate parameters at end of script:
```python
if __name__ == "__main__":

    # Change these two parameters
    corrupted = r"C:\path\to\corrupted.gdb\featureClass"
    repaired = r"C:\path\to\repaired.gdb\featureClass"
```
