#Authors: Ashley S. and Isaac H.
"""Recovers some data. This will only work for feature classes.

Problem: A dataset has records that are hidden.

Symptoms:
    (1) The attribute table will show OBJECTIDs 1, 2, 4 for example; however, Select By Attribute for OBJECTID = 3 returns a result.
    (2) Display issues. Zoom Out and the data disappears.
    (3) Tools like Repair Geometry or Add Spatial Index do not resolve the issue.
    (4) Any tool that exports the data will fail to export all records.
    (5) The Attribute Table will show x amount of records. After scrolling, the table shows a different amount of records (i.e. Jumps from 353 records to 183 records).

Resolution automated by this script:
    Run a Select Layer By Attribute, record by record, take the selection and append into a new dataset.

Steps:
    (1) Create a new dataset with the same schema as the "corrupt" dataset (we are able to Import the schema from the New Feature Class wizard).
    (2) Change appropriate parameters at end of script.
"""

print(__doc__)

import arcpy

class recover(object):

    """Exposes hidden records, recovering corrupt datasets."""

    def __init__(self, corruptedData, emptyData):
        arcpy.MakeFeatureLayer_management(corruptedData, "corruptedData")
        arcpy.MakeFeatureLayer_management(emptyData, "emptyData")
        self.corruptedData = "corruptedData"
        self.emptyData = emptyData

    def check(self):

        """Reports hidden OIDS"""

        global L, L2
        L, L2, n = [], [], 1
        cur = arcpy.da.SearchCursor(self.corruptedData, "OID@")
        for row in cur: L.append(row[0])
        for i in L:
            while n != i:
                L2.append(n)
                n += 1
            n += 1
        print("Skips at OBJECTID: ")
        for i in L2: print(i)

    def append(self):

        """Appends the records into a new dataset."""

        cur = arcpy.da.SearchCursor(self.corruptedData, "OID@")
        for row in cur:
            arcpy.SelectLayerByAttribute_management(self.corruptedData, "NEW_SELECTION",
                                                    '"{0}"={1}'.format(str(arcpy.Describe(self.corruptedData).fields[0].name), str(row[0])))
            arcpy.Append_management(self.corruptedData, self.emptyData, "NO_TEST")

if __name__ == "__main__":

    #Change these two parameters
    corrupted = r"C:\path\to\corrupted.gdb\featureClass"
    repaired = r"C:\path\to\repaired.gdb\featureClass"

    test = recover(corrupted, repaired)
    test.check()
    test.append()
