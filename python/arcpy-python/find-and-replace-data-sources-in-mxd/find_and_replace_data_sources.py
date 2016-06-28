#-------------------------------------------------------------------------------
# Name:        Find and Replace Data Sources in MXD
# Purpose:     Takes an input workspace to recursively walk through a directory
#              and replace a specified path. A common use case is when the name
#              of a server has changed and all paths in MXDs are borken
#
# Author:      Lucas Danzinger
#
# Created:     22/08/2013
#-------------------------------------------------------------------------------

import arcpy
import os

def find_and_replace(MXD_workspace, oldPath, newPath):
    arcpy.env.workspace = MXD_workspace
    path = arcpy.env.workspace

    for root, dirs, files in os.walk(path):
        for name in files:
            if name.endswith(".mxd"):
                mxd_name = name
                fullpath = os.path.join(root,name)
                print mxd_name
                print fullpath
                mxd = arcpy.mapping.MapDocument(fullpath)
                for df in arcpy.mapping.ListDataFrames(mxd):
                    for flayer in arcpy.mapping.ListLayers(mxd, "*", df):
                        if flayer.isFeatureLayer or flayer.isRasterLayer:
                            try:
                                mxd.findAndReplaceWorkspacePaths(oldPath, newPath, False)
                                print "Repaired the path for " + name
                            except:
                                print(mxd_name + " cannot replace paths")
                mxd.save()
                del mxd
    print "complete..."

if __name__ == '__main__':
    find_and_replace(r"path2MXDs", r"path2oldGDB", r"path2newGDB")
