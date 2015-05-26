#-------------------------------------------------------------------------------
# Title:        Remove all basemap layers
# Purpose:      Remove all basemaps from MXDs. This script takes an input
#               directory and walks through it, finding all MXDs and searching
#               for basemap layerss
#
# Author:       Luke Danzinger
#
# Created:      16/12/2013
#-------------------------------------------------------------------------------

"""This script is designed to open an MXD, check to see if
a basemap exists, and if it does, removes it from the map"""

#import modules
import arcpy
import os

def remove_basemaps(path):
    for r,d,f in os.walk(path):
        for m in f:
            if m.endswith(".mxd"):
                mxd = arcpy.mapping.MapDocument(os.path.join(r, m))
                #get dataframes
                dataframes = arcpy.mapping.ListDataFrames(mxd)
                for df in dataframes:
                    #loop through layers
                    layers = arcpy.mapping.ListLayers(mxd, "*Basemap*")
                    for layer in layers:
                        print("Basemap Layer found in " + m)
                        #remove an layers in this list, as they contain the Basemap wildcard
                        try:
                            arcpy.mapping.RemoveLayer(df, layer)
                            print(str(layer.name) + " removed from " + m)

                            #save the changes
                            mxd.save()
                            print("changes applied to " + m)
                            del mxd, layers
                        except:
                            print(m + " cannot be saved")
    print("script complete")

if __name__ == '__main__':
    #set workspace
    path = "C:\TestData"
    remove_basemaps(path)