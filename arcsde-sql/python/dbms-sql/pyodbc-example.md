pyodbc Example
===================

Simple example that shows database connections, execution of SQL and displaying results from an array of rows.

## Example

```python
import pyodbc

conn = pyodbc.connect("DRIVER={SQL SERVER}; SERVER=MY_SERVER; DATABASE=MY_DATABASE; UID=dbuser; PWD=password123")

sql = "SELECT objectid, name FROM dbuser.some_table"

try:
    cursor = conn.cursor()
    result = cursor.execute(sql)
    for row in result.fetchall():
        print("Objectid: {0}, Name: {1}".format(row[0], row[1]))

except Exception as e:
    print "Fail\n", e

'''
results -
Objectid: 3480, Name: value 1
Objectid: 3880, Name: value 2
Objectid: 3885, Name: value 3
'''
```

###### Documentation and more examples
[pyodbc][1]

[1]: https://mkleehammer.github.io/pyodbc/
