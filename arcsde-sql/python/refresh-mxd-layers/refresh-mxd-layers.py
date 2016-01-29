#-------------------------------------------------------------------------------
# Name:           refresh-mxd-layers.py
# Purpose:        This script is designed to refresh the layers within an MXD
#                 by copying the data to an empty MXD. Using this script should 
#                 work around the following bugs:
#                 NIM100842, NIM066771, NIM102388, NIM038965
#
# Author:         Christian Wells
#
# Created:        11/23/2015
# Version Tested: 10.1, 10.2.x, 10.3.x
#-------------------------------------------------------------------------------

import arcpy, os, string, re

def RefreshMxd(folderPath, mxd_temp, mxd_new):
    #Walk folderPath directory
    for root,dirs,files in os.walk(folderPath):
        for f in files:
            fullpath = os.path.join(root,f)
            if os.path.isfile(fullpath):
                basename, extension = os.path.splitext(fullpath)
                #Find files with .mxd file extension
                if extension.lower() == ".mxd":
                    #Open existing MXD as a Map Document object
                    mxd_start = arcpy.mapping.MapDocument(fullpath)
                    newlyrs = arcpy.mapping.ListLayers(mxd_start)
                    #Open Blank MXD as a Map Document object
                    mxd_tmp = arcpy.mapping.MapDocument(mxd_temp)
                    print fullpath
                    #List layers within existing MXD
                    for df in arcpy.mapping.ListDataFrames(mxd_tmp):
                        for lyr in newlyrs:
                            print  "\t"+ lyr.name
                            #Add Layer to blank MXD
                            arcpy.mapping.AddLayer(df, lyr, "BOTTOM")
                            print "\tAdded layer {0}".format(lyr.name)
                    #Save a copy of the new MXD
                    mxd_tmp.saveACopy(os.path.join(mxd_new, f))
                    print "Saved mxd {0}\n".format(f)
                    del df, lyr, newlyrs, mxd_tmp, mxd_start

if __name__== "__main__":
    #Set variable to the location where the corrupt MXDs are stored
    folderPath =    r"C:\MXD_Folder"
    #Set variable to the location where a blank MXD resides (Must not exist in the folderPath directory)
    mxd_temp =      r"C:\blank.mxd"
    #Set variable to the location where new MXDs will be saved (Will be created if it doesn't not exist.)
    mxd_new =       r"C:\MXDs_Fixed"
    if not os.path.exists(mxd_new):
        os.mkdir(mxd_new)
    RefreshMxd(folderPath, mxd_temp, mxd_new)
