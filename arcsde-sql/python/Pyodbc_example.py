import pyodbc

conn = pyodbc.connect("DRIVER={SQL SERVER}; SERVER=KENG; DATABASE=BBOXTEST; UID=sa; PWD=sa")
sql = "SELECT objectid, name FROM sde.gdb_items"

cursor = conn.cursor() 
result = cursor.execute(sql)
try:
    for row in result.fetchall():
        print("Objectid: {0}, Name: {1}".format(row[0], row[1]))
    
except Exception as e:
    print "Fail\n", e
    print type(result)
    
