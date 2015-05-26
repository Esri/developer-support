#-------------------------------------------------------------------------------
# Name:        Compare overlapping polygons by date
# Purpose:     The purpose is to find overlapping polygon geometries. If there is a
#              overlapping geometry, it will compare the date field to see which
#              was created more recently. Output is a new feature class containg
#              polygons with newer date fields.
#
# Author:      Lucas Danzinger
#
# Created:     28/02/2013
#
#------------------------------------------------------------------------------

#import arcpy site packages
import arcpy
import os

def find_duplicate_geometries(poly_feat, date_field_name, output_feat):
    #get variables for input polygon shapefile and fields
    lyr = poly_feat
    out = os.path.dirname(lyr)
    lyrDesc = arcpy.Describe(lyr)

    if lyrDesc.shapeType == "Polygon":
        #set environments
        arcpy.env.workspace = out
        arcpy.env.overwriteOutput = 1

        #intersect polygons to find common areas and save in temporary memory
        lyr1 = arcpy.Intersect_analysis(lyr, r"in_memory\intersected")
    else:
        arcpy.AddMessage("The input feature class is not a polygon")

    #Allow user to select the date field
    dateField = date_field_name

    #determine if FID or ObjectID, based on the lyr variable
    if lyr.endswith(".shp"):
        idField   = "FID"
    else:
        idField   = "ObjectID"

    #create a text file to capture the FIDs of matching geometry with larger date values
    tab = os.path.join(out, "log.txt")
    log = open(tab, 'w')

    #create the field header
    log.write("ID\n")

    #nested loop through cursors to compare the SHAPE field
    for row in arcpy.SearchCursor(lyr1):
        for row1 in arcpy.SearchCursor(lyr1):
            if row.shape.equals(row1.shape) == True:
                d1 = row.getValue(dateField)
                d2 = row1.getValue(dateField)
                #for the items that have the same geometry, check if one is larger; if it is, write the FID/OID to the text file
                if d1 > d2:
                    log.write(str(row.getValue(idField)) + "\n")

    #close and save the text file
    log.close()

    #delete cursor objects
    del row, row1

    #grab feature layers
    arcpy.MakeFeatureLayer_management(lyr1, "flyr")
    arcpy.MakeTableView_management(tab, "tblView")

    #Join the table with the layer and keep common values
    arcpy.AddJoin_management("flyr", idField, "tblView", "ID", "KEEP_COMMON")

    #Export the final shapefile out
    finalShp = output_feat
    finalShpName = os.path.basename(finalShp)
    finalShpPath = os.path.dirname(finalShp)
    arcpy.FeatureClassToFeatureClass_conversion("flyr", finalShpPath, finalShpName)

    #Delete temporary layers
    arcpy.Delete_management("flyr")
    arcpy.Delete_management("tblView")
    arcpy.Delete_management(tab)
    arcpy.Delete_management(lyr1)

    #print final message
    arcpy.AddMessage("Identical items found and selected")
    arcpy.AddMessage("Script Complete")

if __name__ == '__main__':
    path2layer = r"C:\Users\luca6804\Documents\ArcGIS\Default.gdb\test_poly_feat"
    date_field_name = "my_date_field"
    output_feat = r"C:\temp\out.shp"
    find_duplicate_geometries(path2layer, date_field_name, output_feat)