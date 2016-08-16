"""
In Oracle 12c, using the SDO Geometry type, this script will create the
polygons from the golden ratio spiral.

Authors:
    Danny B
        -- original concept and code
        -- added and subtracted coordinates to generate new polygons
    Ashley S
        -- cleared up rough spots by using phi to create perfect squares
        -- translated code to use SDO Geometry instead of arcpy geometry

Tested in Python 2.7 32 bit
"""

#Change these two parameters
uin ="golden" #Table name
connection ="connectionstring" #connection, i.e. "dataowner/dataowner@instance/sid

import cx_Oracle

print("Creating connection and cursor")
db = cx_Oracle.connect(connection)
cursor = db.cursor();

print("Creating table")
cursor.execute("""
    CREATE TABLE {0}(
        FID INTEGER GENERATED ALWAYS AS IDENTITY START WITH 1 INCREMENT BY 1,
        SHAPE SDO_GEOMETRY)
    """.format(uin))

m = 100
phi0 = (1 + 5 ** 0.5) /2
feature_info = [[[0,0], [0,1*m], [1*m, 1*m], [1*m, 0]]]

count = 1
exponent = 1
print("Doing some math")
for i in range(24):
    phi = (1.0/(phi0**exponent))*m
    a, b = feature_info[-1][2]
    a_plus = a + phi
    a_minus = a - phi
    b_plus = b + phi
    b_minus = b - phi

    if count == 1:
        coord = [[a, b], [a_plus, b], [a_plus, b_minus], [a, b_minus]]
    elif count == 2:
        coord = [[a, b], [a, b_minus], [a_minus, b_minus], [a_minus, b]]
    elif count == 3:
        coord = [[a, b], [a_minus, b], [a_minus, b_plus], [a, b_plus]]
    else:
        coord = [[a, b], [a, b_plus], [a_plus, b_plus], [a_plus, b]]

    feature_info.append(coord)

    count += 1
    exponent += 1

    if count == 5: count = 1

print("Inserting coordinates")
for coord in feature_info:

    coord2 = "{0},{1}, {2},{3}, {4},{5}, {6},{7}, {0},{1}".format(
    coord[0][0], coord[0][1], coord[1][0], coord[1][1], coord[2][0],
    coord[2][1], coord[3][0], coord[3][1])

    sdogeometry = """SDO_GEOMETRY(2003,NULL,NULL,SDO_ELEM_INFO_ARRAY(1,1003,1),SDO_ORDINATE_ARRAY({0}))""".format(coord2)

    statement = "INSERT INTO {0} ( SHAPE ) VALUES ( {1} )".format(uin, sdogeometry)

    cursor.execute(statement)
    db.commit()

print("Adding to user_sdo_geom_metadata")

cursor.execute("""
    INSERT INTO user_sdo_geom_metadata
        (TABLE_NAME,
        COLUMN_NAME,
        DIMINFO,
        SRID)
    VALUES ('{0}', 'shape',
    SDO_DIM_ARRAY(   -- 600X600 grid
        SDO_DIM_ELEMENT('X', 0, 200, 0.0000001),
        SDO_DIM_ELEMENT('Y', 0, 200, 0.0000001)
        ),
    NULL)
    """.format(uin))

print("Making the spatial index")

cursor.execute("""CREATE INDEX {0}_spatial_idx ON {0}(SHAPE) INDEXTYPE IS MDSYS.SPATIAL_INDEX""".format(uin))

db.commit()
cursor.close()
db.close()

print("Check the table!")
