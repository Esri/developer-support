"""
Author: Ashley S (MarieAshley)

Versions: Oracle 12c, ArcGIS for Desktop 10.3.1
"""

import cx_Oracle

class IterationError(Exception):
    pass

class TableError(Exception):
    pass

class InvalidSpan(Exception):
    pass

class sierpinski(object):

    """
    Contains methods to create two spatial tables. The first table is a representation of the sierpinski carpet. The second table contains the squares removed from the carpet.

    Example:
    test = sierpinski(connection, tablename, spatialReference, span, iterations)
    test.createIntermediate() #Stop here if iterations > 1.
    test.createSierpinski()

    Limitations:
    - If the number of iterations is greater than 1, the sierpinski carpet will not be created as the text string will be too long to create the one polygon. However, the intermediate table will still be available to view.
    - If considering a cartesian plane, any square defined in the fourth quadrant where xmin = ymax, cannot be created although these are valid starting positions.
    - For the geometry to be drawn correctly, ymax > xmin.
    - This only works for a spatial reference wkid of 4326.

    Additional Information:
    The geometry type is ST_Geometry. This was an exercise in using two ST_Geometry methods, union and difference, to generate the carpet.

    ST_DIFFERENCE:
    http://desktop.arcgis.com/en/arcmap/10.3/manage-data/using-sql-with-gdbs/st-difference.htm

    ST_UNION:
    http://desktop.arcgis.com/en/arcmap/10.3/manage-data/using-sql-with-gdbs/st-union.htm
    """

    def __init__(self, connection, tablename, span, iterations):

        """
        connection : The connection string (i.e. dataowner/dataowner@instance/sid)

        tablename : Table name of the output spatial table, the sierpinski carpet.

        span : Used to define the initial square. Should be of the format XMin, YMax.

        iterations: Defines the stopping point.
        """
        if span[0] >= span[1]: raise InvalidSpan("Have XMin < YMax.")
        if iterations <= 0: raise IterationError("Have Iterations > 0.")

        self.connection = connection
        self.db = cx_Oracle.connect(connection)
        self.cursor = self.db.cursor()
        self.intermediateCreatedCheck = 0
        self.iterations = iterations

        self.tablename = tablename
        self.table2 = "reverse_" + self.tablename

        self.span = span
        self.spatialReference = 4326

        #self.cursor.execute("DROP TABLE {0}".format(self.tablename))
        #self.cursor.execute("DROP TABLE {0}".format(self.table2))

    def createTable(self, table):
        """
        Creates tables.
        """
        self.cursor.execute("""
            CREATE TABLE {0}
                (FID INTEGER GENERATED ALWAYS AS IDENTITY START WITH 1 INCREMENT BY 1,
                SHAPE sde.st_geometry)""".format(table))
        return self.cursor

    def insert(self, tablename, coord):
        """
        Inserts records into a table.
        """
        self.cursor.execute("""
            INSERT INTO {0} (SHAPE) VALUES (
            sde.st_polygon('polygon (({1}))', {2}))""".format(tablename, coord, self.spatialReference))
        return self.cursor

    def formatCoord(self, array):
        """
        Formats coordinates for use in inserting geometries with the ST_Geometry format.
        """
        return "{0} {1}, {0} {3}, {2} {3}, {2} {1}, {0} {1}".format(
                array[0], array[1], array[2], array[3])

    def defineSquares(self, array):
        """
        Defines the coordinates and delta values of the parent and children squares.

        Parent square:
        y3-- -- -- --
        y2-- -- -- --
        y1-- -- -- --
        y0x0 x1 x2 x3
        """

        #parent square
        self.x0 = array[0]
        self.y0 = array[1]
        self.x3 = array[2]
        self.y3 = array[3]

        self.deltaX = (self.x3 - self.x0)/3.0
        self.deltaY = (self.y3 - self.y0)/3.0

        self.x1 = self.x0 + self.deltaX
        self.x2 = self.x0 + 2*self.deltaX
        self.y1 = self.y0 + self.deltaY
        self.y2 = self.y0 + 2*self.deltaY

        #child squares
        self.children = [[self.x0, self.y0, self.x1, self.y1],
                    [self.x0, self.y1, self.x1, self.y2],
                    [self.x0, self.y2, self.x1, self.y3],
                    [self.x1, self.y2, self.x2, self.y3],
                    [self.x2, self.y2, self.x3, self.y3],
                    [self.x2, self.y1, self.x3, self.y2],
                    [self.x2, self.y0, self.x3, self.y1],
                    [self.x1, self.y0, self.x2, self.y1]]

    def createIntermediate(self):
        """
        Inserts geometry into the intermediate table, which contains the squares used to remove area from the sierpinski carpet. This table should be created first.
        """

        #Inserts first middle square
        self.cursor = self.createTable(self.table2)
        self.defineSquares([self.span[0], self.span[0], self.span[1], self.span[1]])
        coord = self.formatCoord([self.x1, self.y1, self.x2, self.y2])
        self.cursor = self.insert(self.table2, coord)

        childSquares = self.children[:]
        count = 0
        for child in childSquares:
            self.defineSquares(child)
            coord = self.formatCoord([self.x1, self.y1, self.x2, self.y2])
            self.cursor = self.insert(self.table2, coord)
            self.db.commit()
            childSquares.extend(self.children)
            count += 1
            if count == sum([8**x for x in range(1, self.iterations + 1)]):
                break

        self.cursor.execute("CREATE INDEX {0}_spatial_idx ON {0}(SHAPE) INDEXTYPE IS sde.st_spatial_index PARAMETERS('st_grids=1,3,0 st_srid={1}')".format(self.table2, self.spatialReference))
        self.db.commit()
        self.intermediateCreatedCheck = 1

    def createSierpinski(self):
        """
        Generates the sierpinski carpet. This table should be created last.
        """

        if self.iterations > 1:
            raise IterationError("Set iteration value to 1 to create the sierpinski carpet.")
        if self.intermediateCreatedCheck != 1:
            raise TableError("Create the intermediate table first, using createIntermediate.")

        self.cursor = self.createTable(self.tablename)
        coord = self.formatCoord([self.span[0], self.span[0], self.span[1], self.span[1]])
        self.cursor = self.insert(self.tablename, coord)
        self.db.commit()

        self.cursor.execute("SELECT sde.st_astext(sde.st_aggr_union(SHAPE)) FROM {0}".format(self.table2))
        coord = self.cursor.fetchone()
        self.cursor.execute("""
                INSERT INTO {0} (SHAPE) VALUES (
                sde.st_multipolygon('{1}', {2}))""".format(self.table2, coord[0].read(), self.spatialReference))
        self.db.commit()

        self.cursor.execute("""
                SELECT sde.st_astext
                (sde.st_difference ({0}.SHAPE, {1}.SHAPE)) FROM {0}, {1}
                WHERE {1}.FID = (select max({1}.FID) from {1})""".format(self.tablename, self.table2))

        LOBS = self.cursor.fetchall()
        for i in LOBS:
            self.cursor.execute("UPDATE {0} SET SHAPE=sde.st_polygon('{1}', {2})".format(self.tablename, i[0].read(), self.spatialReference))

        self.cursor.execute("CREATE INDEX {0}_spatial_idx ON {0}(SHAPE) INDEXTYPE IS sde.st_spatial_index PARAMETERS('st_grids=1,0,0 st_srid={1}')".format(self.tablename, self.spatialReference))
        self.db.commit()

    def close(self):
        """
        Close all connections and cursors.
        """
        self.cursor.close()
        self.db.close()

if __name__ == "__main__":

    #Parameters to change.
    connection ="connection-string" #i.e. dataowner/dataowner@instance/sid
    tablename = "sierpinski"
    span = [0, 90]
    iterations = 1

    test = sierpinski(connection, tablename, span, iterations)
    print("Creating geometries. Please wait a few minutes.")
    test.createIntermediate()
    print("Intermediate table, {0}, has finished. Take a look.".format(test.table2))
    print("\nCreating the sierpinski carpet.")
    test.createSierpinski()
    test.close()
    print("Done! Check {0}".format(test.tablename))
