#-------------------------------------------------------------------------------
# Name:    Create Heatmap from GPX
# Purpose: Creates a heatmap raster dataset from input GPX files. The input is a
#          directory that contains GPX files. The script will iterate through the
#          directory, convert GPX to features, then create a heatmap from the
#          features.
#
# Author:  Lucas Danzinger
#
# Created:     22/08/2013
#-------------------------------------------------------------------------------s

import arcpy
import os

# Check out any necessary licenses
arcpy.CheckOutExtension("spatial")
arcpy.env.overwriteOutput = True

def create_gpx_features(path2GPXFiles):
    gpxDir = path2GPXFiles
    arcpy.CreateFileGDB_management(gpxDir, "heatmap", "CURRENT")
    arcpy.env.workspace = os.path.join(gpxDir, "heatmap.gdb")

	# Iterate over gpx files, generate feature classes
    featuresToMerge = [] #create empty list
    for file in os.listdir(gpxDir):
        if file.endswith(".gpx"):
            ptFeatureClass = file.replace(".gpx", "_pt") # point feature class name
            try:
                arcpy.GPXtoFeatures_conversion(os.path.join(gpxDir, file), ptFeatureClass)
                print str(file) + " converted to features"
            except Exception as E:
                print str(file) + " failed..."
                print E
            lineFeatureClass = file.replace(".gpx", "_line") # line feature class name
            try:
                arcpy.PointsToLine_management(ptFeatureClass, lineFeatureClass, "", "", "NO_CLOSE")
                print str(file) + " converted to features"
            except Exception as E:
                print str(file) + " failed..."
                print E
            featuresToMerge.append(lineFeatureClass)

    mergedFeatureClass = "merged_lines"
    arcpy.Merge_management(featuresToMerge, mergedFeatureClass, "") # merge line feature classes
    arcpy.gp.LineDensity_sa(mergedFeatureClass, "NONE", "heat_map", ".00001", "0.0001", "SQUARE_MAP_UNITS") # do the heatmap

if __name__ == '__main__':
    path2GPXFiles = r"C:\Temp\GPX"
    create_gpx_features(path2GPXFiles)
