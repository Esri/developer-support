#Create SDO Geometry in Oracle 12c
This sample script demonstrates how to connect to Oracle and insert sdo geometry using python and SQL. For fun, the sample creates polygons from the golden ratio spiral.

##Testing Environment
- Oracle 12c
- ArcGIS for Desktop 10.3.1 
- Python 2.7

##Steps:
1. Install cx_Oracle module
1. Change the table name and the connection string.
1. Run the script!

```python
uin ="golden" #Table name
connection ="connectionstring" #connection, i.e. "dataowner/dataowner@instance/sid
```
![This is where an JPG should be. Sorry you can't see it. Try using Chrome](golden.jpg "Golden Ratio Polygons")

