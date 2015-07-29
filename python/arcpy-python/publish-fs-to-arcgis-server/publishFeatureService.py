#-------------------------------------------------------------------------------
# Title:       Publish Feature Service
# Purpose:     This script automates the process of publishing a feature
#              service to ArcGIS Server
#
# Author:      Lucas Danzingers
#
# Created:     22/08/2013
#-------------------------------------------------------------------------------

import arcpy
import os
import sys
import tempfile
import xml.dom.minidom as DOM

def main():
    arcpy.env.overwriteOutput = True

    # Set up base variables
    tempPath = tempfile.gettempdir()
    path2MXD = arcpy.GetParameterAsText(0)
    serverConnection = arcpy.GetParameterAsText(1)
    serviceName = os.path.basename(path2MXD)[:-4]

    # All paths are built by joining names to the tempPath
    SDdraft = os.path.join(tempPath, "tempdraft.sddraft")
    newSDdraft = os.path.join(tempPath, "updatedDraft.sddraft")
    SD = os.path.join(tempPath, serviceName + ".sd")
    mxd = arcpy.mapping.MapDocument(path2MXD)

    arcpy.mapping.CreateMapSDDraft(mxd, SDdraft, serviceName, "ARCGIS_SERVER", serverConnection)
    arcpy.AddMessage("Creating Draft for ArcGIS Server...")

    # Read the contents of the original SDDraft into an xml parser
    doc = DOM.parse(SDdraft)

    # Change service type from map service to feature service
    typeNames = doc.getElementsByTagName('TypeName')
    for typeName in typeNames:
        if typeName.firstChild.data == "FeatureServer":
            extension = typeName.parentNode
            for extElement in extension.childNodes:
                # Disabled SOE.
                if extElement.tagName == 'Enabled':
                    print extElement.firstChild.data
                    extElement.firstChild.data = 'true'
                    arcpy.AddMessage("Enabled Feature Server")

    # Write the new draft to disk
    f = open(newSDdraft, 'w')
    doc.writexml( f )
    f.close()
    arcpy.AddMessage("SDDraft successfully created")

    # Analyze the service and check for errors
    analysis = arcpy.mapping.AnalyzeForSD(newSDdraft)
    if analysis['errors'] == {}:
        # Stage the service
        arcpy.AddMessage("No errors found. Converting SDDraft to SD...")
        arcpy.StageService_server(newSDdraft, SD)
        arcpy.AddMessage("SD created successfully")
        try:
            arcpy.UploadServiceDefinition_server(SD, serverConnection, serviceName)
            arcpy.AddMessage("Service has been successfully published to ArcGIS Server")
        except:
            arcpy.AddMessage("\n ****** The upload was not successful ******* \n")
    else:
        # If the sddraft analysis contained errors, display them and quit.
        arcpy.AddMessage(analysis['errors'])

    #delete sddraft and sd files
    try:
        os.remove(SDdraft)
        os.remove(SD)
    except:
        pass

if __name__ == '__main__':
    main()
