Count Multipart Features 2
=========================

## Instructions

1. Set the `feature_class` variable in `main()` to your featureclass
2. Set the `count_field` variable in `main()` to the desired name of your count field (default is `PartCount`)
3. Set the `overwrite` variable in `main()` to `False` if you don't want to overwrite an existing count
4. The input feature class will have a new field added that will state the number of parts per feature.

## Use Case

This script could be used to identify features with many parts, which could be affecting performance. It could also be used to determine if any features in your feature class are multipart.

## Updates to original

The FeatureClass operations are now handled by passing an `arcpy.da.Describe` dictionary to a `Feature` object

There are some additional properties added to this object that simplify access to describe attributes such as field names, workspace path, shapeType, and shape/oid field names

The cursor objects are now handled by generator functions in the `Feature` class (`get_rows(<fields>, ?<query>)` and `update_rows(<fields>, ?<query>)`)

### Feature
Class for pre-processing a feature class before passing it off to a script

#### Properties
1. field_names: a list of field names
2. workspace_path: the path to the feature workspace as returned by the workspace object in the Describe
3. shape_type: alternative name for shapeType
4. id_field: currently returns `'OID@'` for use with data access cursors, but can be modified to return the OIDFieldName attribute if needed
5. shape_field: currently return `'SHAPE@'` for use with data access cursors, but can be modified to return shapeFieldName attribute if needed

#### Feature.get_rows
This method uses the cursor context manager to return a generator object with each row as a dictionary formatted as `{field_name: field_value}`
If a query is set, then the cursor will pass that query to the cursor

#### Feature.update_rows
This method uses the cursor context manager to return a generator object with each row as a tuple containting the cursor and row dictionary formatted as `(cursor, {field_name: field_value})`
If a query is set, then the cursor will pass that query to the cursor

### count_multipart
The main function of the script, this takes a featureclass path as the only positional argument
#### kwargs
1. field_name: An optional parameter for setting the field name to output the count to
2. overwrite: An optional flag that will prevent overwriting existing fields with the provided field_name
3. report_only: An optional flag that will skip all updates to the featureclass and just print out the number of multipart features found

#### Logic

**Main check:**
```python 
multipart_counts = \
    {
        row[features.id_field]: row[features.shape_field].partCount  # Get the number of parts for each multipart
        for row in features.get_rows([features.id_field, features.shape_field])
        if row[features.shape_field] and row[features.shape_field].isMultipart  # Only get the rows that are multipart
    }
```
This block is the primary work done by the function. It uses a dictionary comprehension to write the partcount of multipart features to an update dictionary

using an update dictionary allows for minimal work to be done within the UpdateCursor itself and reduces the likelyhood of the program crashing or failing while a cursor is active
Even if it did fail in the cursor, the context manager should gracefully handle the error. This pre-processing step also massively speeds up the update because only features that are multipart are updated and a query that filters the rows can be passed directly to the cursor instead of checking every row.

This step also allows for a length check to be run before any more expensive operations and if there are no multipart features, the Cursor is never created

**Update Block:**
```python
with arcpy.da.Editor(features.workspace_path):
    upd_keys = [str(k) for k in multipart_counts.keys()]
    # Use the OIDFieldName to build the SQL query, OBJECTID and OID@ dont work in queries
    update_query = f"{features.OIDFieldName} IN ({','.join(upd_keys)})"  # Only update the rows that are in the dictionary
    # Use _update_rows to get a row dictionary so we can update the row using field names
    for cursor, row in features.update_rows([features.id_field, field_name], query=update_query):
        row[field_name] = multipart_counts[row[features.id_field]]  # Get the part count from the dictionary
        cursor.updateRow(list(row.values()))  # Convert the dictionary to a list and update the row
```
Initialize an Editor object using the builtin context manager

Since we pre-calculated the updates, we can build a SQL query that only pulls rows that need updates written to them
NOTE: The SQL query can't use the `'OID@'` value that we used for everything else, so the we need to pull the OIDFieldName attribute

Using the `Feature.update_rows` method, we can initalise a cursor for the FeatureClass without writing out a second context manager as that method handles context
Since the `update_rows` method returns a dictionary object, we can access the row fields by name instead of index
The values for each row returned by `update_rows` are then pulled from the dictionary after reassignemnt and fed to `updateRow()` from cursor object
