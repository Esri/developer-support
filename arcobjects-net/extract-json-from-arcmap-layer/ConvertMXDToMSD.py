#-------------------------------------------------------------------------------
# Name:         ConvertMXDToMSD
# Purpose:      Convert an MXD file to an MSD file
#
# Author:       ESRI
#
# Created:      30/11/2011
# Copyright:    (c) ESRI
# Licence:      ESRI
#-------------------------------------------------------------------------------
#!/usr/bin/env python

import os
import sys
import arcpy
import arcpy.mapping

def main():
    # variables
    mxd = arcpy.GetParameterAsText(0)
    if (os.path.exists(mxd) == False):
        arcpy.AddError('Invalid mxd filename')
        return
    filename = os.path.splitext(os.path.basename(mxd))[0]
    dir = os.path.dirname(mxd)
    msd = dir + os.path.sep + filename + ".msd"

    try:
        mapdoc = arcpy.mapping.MapDocument(mxd)
        analysis = arcpy.mapping.AnalyzeForMSD(mapdoc)
        errs = analysis['errors']
        if (errs != {}):
            errmsg = "Analyzer Errors:"
            for k in errs.keys():
                errmsg += '\n\t' + k[0]

            arcpy.AddError(errmsg)
            return

        arcpy.mapping.ConvertToMSD(mapdoc, mxd)
        arcpy.SetParameterAsText(1, msd)
    except:
        arcpy.AddError(sys.exc_info()[1])
    finally:
        try:
            mapdoc
        except:
            del mapdoc

if __name__ == '__main__':
    main()
