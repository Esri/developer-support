import arcpy
import zipfile
import os
import shutil

from arcpy import env as env
from os import path as path
from sys import argv

env.overwriteOutput = True

def main():
    inFile = arcpy.GetParameterAsText(0)
    outputFL = 'outputFL'
    zipFolder = path.join(env.scratchFolder, "ZipFolder")
    arcpy.AddMessage('zip folder path: ' + zipFolder)
    filenameExts = list()
    if path.exists(zipFolder):
        if os.path.isdir(zipFolder):
            shutil.rmtree(zipFolder)
    os.mkdir(zipFolder)
    arcpy.AddMessage('***ZipFolder Path****')
    zip2Extract = zipfile.ZipFile(inFile, 'r')
    zip2Extract.extractall(zipFolder)
    zip2Extract.close()
    arcpy.AddMessage('*** Done extracting: %s ***' % zipFolder)
    for dirpath, dirnames,filenames in arcpy.da.Walk(zipFolder, datatype='FeatureClass'):
        for filename in filenames:
            fileWithPath = path.join(dirpath, filename)
            arcpy.AddMessage('file with path: ' + fileWithPath)
            if filename.endswith('.shp'):
                dsc = arcpy.Describe(fileWithPath)

   	featLayer = arcpy.MakeFeatureLayer_management(fileWithPath, outputFL)
    lyrName = dsc.name[:-4] + ".lyr"
    uploadedLyrFile = path.join(zipFolder,lyrName);
    arcpy.AddMessage(uploadedLyrFile)

    newLyrFile = path.join(zipFolder, "output_layer_file.lyr")
    #test = path.join(zipFolder, "test.shp")
    arcpy.AddMessage(newLyrFile)

    if path.isfile(uploadedLyrFile):
        try:
            arcpy.ApplySymbologyFromLayer_management(featLayer, uploadedLyrFile)
            arcpy.SaveToLayerFile_management(featLayer, newLyrFile) #Writing the layer file to disk, which is assocated with the feature layer 'featLayer'
            arcpy.SetParameter(1, featLayer)
        except arcpy.ExecuteError:
            arcpy.AddError(arcpy.GetMessages(2))
        except Exception as ex:
            arcpy.AddError(ex.message)

if __name__ == '__main__':
    main()