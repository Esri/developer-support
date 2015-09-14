#------------------------------------------------------------------------------
# Name:        Get XY in Different Projection
# Purpose:     Update double fields that are named "X" and "Y" with the X & Y in
#              a different SR than what the feature class is defined. If the fields
#              named X and Y don't exist, the script will add these to the feature class
#
# Author:      Lucas Danzinger
#
# Created:     22/08/2013
#-------------------------------------------------------------------------------

#import arcpy site package
import arcpy
import os

def get_xy(path2shp, wkid):
    #set projection
    spatialRef = wkid

    #get feature class
    fc = path2shp

    #make sure the X and Y fields exist
    fields = arcpy.ListFields(path2shp)
    if not "X" in fields:
        arcpy.AddField_management(path2shp, "X", "DOUBLE")
    if not "Y" in fields:
        arcpy.AddField_management(path2shp, "Y", "DOUBLE")

    #set up cursor
    cur = arcpy.UpdateCursor(fc, "", spatialRef)

    #update the X and Y fields with the update cursor
    for row in cur:
        pnt = row.Shape.getPart(0)
        row.x = pnt.X
        row.y = pnt.Y
        cur.updateRow(row)

    #delete temporary variables
    del cur, row

if __name__ == '__main__':
    get_xy(r"C:\Users\luca6804\Documents\ArcGIS\Default.gdb\far", 3857)
