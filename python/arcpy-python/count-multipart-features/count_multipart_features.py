#-------------------------------------------------------------------------------
# Name:        Count Multipart
# Purpose:     This takes an input feature class/shapefile, adds a new field
#              and adds a value for how many features make up each multipart
#
# Author:      Lucas Danzinger
#
# Created:     30/05/2013
#-------------------------------------------------------------------------------

import arcpy
import os
import sys

def polyPartCount(fc):
    #determine new field name
    field = addField(fc)
    fields = ("SHAPE@", field)

    #check if the feature class needs to enter an editing sessions
    editor = checkForEditorClass(fc)
    if editor == True:
        editWS = os.path.dirname(fc)
        try:
            editDesc = arcpy.Describe(editWS)
            if editDesc.datasetType == "FeatureDataset":
                editWS = os.path.dirname(editWS)
        except:
            pass
        edit = arcpy.da.Editor(editWS)
        edit.startEditing(False, True)
        edit.startOperation()

    #set up cursor
    try:
        with arcpy.da.UpdateCursor(fc, fields) as cursor:
            for row in cursor:
                for multiPart in row:
                    #grab partCount property from Polyline object
                    #http://resources.arcgis.com/en/help/main/10.1/index.html#/Polygon/018z00000061000000/
                    row[1] = row[0].partCount
                    cursor.updateRow(row)
    except:
        arcpy.AddError(arcpy.GetMessages())

    #if we were required to start editing, stop and save edits
    if editor == True:
        edit.stopOperation()
        edit.stopEditing(True)

    arcpy.SetParameterAsText(1, fc)

def pointCount(fc):
    #determine new field name
    field = addField(fc)
    fields = ("SHAPE@", field)

    #check if the feature class needs to enter an editing sessions
    editor = checkForEditorClass(fc)
    if editor == True:
        editWS = os.path.dirname(fc)
        try:
            editDesc = arcpy.Describe(editWS)
            if editDesc.datasetType == "FeatureDataset":
                editWS = os.path.dirname(editWS)
        except:
            pass
        edit = arcpy.da.Editor(editWS)
        edit.startEditing(False, True)
        edit.startOperation()



    #set up cursor
    try:
        with arcpy.da.UpdateCursor(fc, fields) as cursor:
            for row in cursor:
                for multiPoint in row:
                    #grab pointCount property from Multipoint object
                    #http://resources.arcgis.com/en/help/main/10.1/index.html#/Polyline/018z00000008000000/
                    row[1] = row[0].pointCount
                    cursor.updateRow(row)
    except:
        arcpy.AddError(arcpy.GetMessages())

    #if we were required to start editing, stop and save edits
    if editor == True:
        edit.stopOperation()
        edit.stopEditing(True)

    arcpy.SetParameterAsText(1, fc)

def linePartCount(fc):
    #determine new field name
    field = addField(fc)
    fields = ("SHAPE@", field)

    #check if the feature class needs to enter an editing sessions
    editor = checkForEditorClass(fc)
    if editor == True:
        editWS = os.path.dirname(fc)
        try:
            editDesc = arcpy.Describe(editWS)
            if editDesc.datasetType == "FeatureDataset":
                editWS = os.path.dirname(editWS)
        except:
            pass
        edit = arcpy.da.Editor(editWS)
        edit.startEditing(False, True)
        edit.startOperation()



    #set up cursor
    try:
        with arcpy.da.UpdateCursor(fc, fields) as cursor:
            for row in cursor:
                for multiPart in row:
                    #grab partCount property from Polyline object
                    #http://resources.arcgis.com/en/help/main/10.1/index.html#/Multipoint/018z0000000s000000/
                    row[1] = row[0].partCount
                    cursor.updateRow(row)
    except:
        arcpy.AddError(arcpy.GetMessages())

    #if we were required to start editing, stop and save edits
    if editor == True:
        edit.stopOperation()
        edit.stopEditing(True)

    arcpy.SetParameterAsText(1, fc)

def addField(fc):
    #determine acceptable field name
    fields = arcpy.ListFields(fc)
    newName = "partCount"
    tmpList = []
    for field in fields:
        tmpList.append(field.name)
    if not newName in tmpList:
        fieldName = "partCount"
    else:
        fieldName = "partCount1"
    arcpy.AddField_management(fc, fieldName, 'SHORT')
    return fieldName

#this function will be used to check if the input feature class participates in
#a relationship class, topology, network dataset, or geometric network. If it
#does, then it will return True and the Editor class will need to be used.

def checkForEditorClass(fc):
    #if it is a shapefile, it doesn't need to be edited
    if fc.endswith(".shp"):
        return False

    #check to see if the feature class is versioned. If it is, use Editor class
    versionDesc = arcpy.Describe(fc)
    if versionDesc.isVersioned:
        return True

    fcDesc = arcpy.Describe(fc)
    arcpy.env.workspace = workspace = os.path.dirname(fc)
    fcName = os.path.basename(fc)

    #check for relationship classes
    rc_list = [c.name for c in arcpy.Describe(workspace).children if c.datatype =="RelationshipClass"]
    for rc in rc_list:
         rc_path = os.path.join(workspace, rc)
         des_rc = arcpy.Describe(rc_path)
         if des_rc.datasetType == "RelationshipClass": #double check to make sure it is RC. This can become confusing if there are tables with the same name
             origins = des_rc.originClassNames
             destinations = des_rc.destinationClassNames
             for origin in origins:
                if fcName == origin:
                    return True
             for destination in destinations:
                if fcName == destination:
                    return True


    #check for network dataset
    arcpy.env.workspace = workspace
    nd_list = arcpy.ListDatasets()
    networkDatasets = []
    if nd_list.count > 0:
        for ndataset in nd_list:
            ndatasetDesc = arcpy.Describe(os.path.join(workspace, ndataset))
            if ndatasetDesc.datasetType == "NetworkDataset":
                networkDatasets.append(ndataset)
            else:
                arcpy.env.workspace = newWS = os.path.join(workspace, ndataset)
                for nset in arcpy.ListDatasets("*", "Network"):
                    networkDatasets.append(os.path.join(newWS,nset))
    for networkDataset in networkDatasets:
        ndesc = arcpy.Describe(networkDataset)
        for edges in ndesc.edgeSources:
            if edges.name == fcName:
                return True
        for junctions in ndesc.junctionSources:
            if junctions.name == fcName:
                return True
        for turns in ndesc.turnSources:
            if turns.name == fcName:
                return True

    #check for geometric network
    arcpy.env.workspace = workspace
    g_list = arcpy.ListDatasets()
    geomNet = []
    if g_list.count > 0:
        for gNet in g_list:
            gDesc = arcpy.Describe(os.path.join(workspace, gNet))
            if gDesc.datasetType == "GeometricNetwork":
                geomNet.append(gNet)
            else:
                arcpy.env.workspace = newWS = os.path.join(workspace, gNet)
                for gset in arcpy.ListDatasets("*", "GeometricNetwork"):
                    geomNet.append(os.path.join(newWS, gset))
    for geometricNetwork in geomNet:
        geomdesc = arcpy.Describe(geometricNetwork)
        for FC in geomdesc.featureClassNames:
            if FC == fcName:
                return True

    #check for topologies
    arcpy.env.workspace = workspace
    topologies = []
    for topol in arcpy.ListDatasets():
        topoDesc = arcpy.Describe(os.path.join(workspace, topol))
        if topoDesc.datasetType == "Topology":
            topologies.append(topol)
        else:
            arcpy.env.workspace = newWS = os.path.join(workspace, topol)
            for dset in arcpy.ListDatasets("*", "Topology"):
                topologies.append(os.path.join(newWS,dset))
    for topology in topologies:
        tdesc = arcpy.Describe(topology)
        for FCs in tdesc.featureClassNames:
            if FCs == fcName:
                return True

def main():
    #make sure 10.1 or 10.2 is installed, as it is needed for the data access module
    installInfo = arcpy.GetInstallInfo()['Version'] #grab the version dictionary object key
    if installInfo != ('10.1' or '10.2' or '10.3'):
        versionMessage = 'You must have 10.1 or newer installed'
        arcpy.AddError("{0}".format(versionMessage))

    #get input feature class
    fc = r"C:\Users\luca6804\Documents\ArcGIS\Default.gdb\test"

    #get feature type (point/line/poly)
    fcDesc = arcpy.Describe(fc)

    #determine geometry shape type
    errorMessage = """This is not a supported geometry shape type. Please select a Multipoint, Polyline, or Polygon"""

    if fcDesc.shapeType == "MultiPatch":
        arcpy.AddError(errorMessage)
        sys.exit(errorMessage)
    elif fcDesc.shapeType == "Point":
        arcpy.AddError(errorMessage)
        sys.exit(errorMessage)
    elif fcDesc.shapeType == "Polygon":
        polyPartCount(fc)
    elif fcDesc.shapeType =="Polyline":
        linePartCount(fc)
    elif fcDesc.shapeType == "Multipoint":
        pointCount(fc)

if __name__ == '__main__':
    main()