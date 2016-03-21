#-------------------------------------------------------------------------------
#https://blogs.esri.com/esri/arcgis/2013/04/23/updating-arcgis-com-hosted-feature-services-with-python/
#https://geonet.esri.com/thread/70855

#NOTE ArcMap should be opened and signed into ArcGIS Online while running this script

#This script lists all FileGeodatabases in a specified directory
#Then for each File Geodatabase it adds layers to an Untitled document and saves out a new document / mxd, in the same directory as the Untitled.mxd document.
#Note there is conditional logic which determines what layers get added to the map.  If the layer name ends with an alpha character (not a digit), the layer is added
#Then once the ArcMap document is created this script publishes the content as a hosted feature service in ArcGIS Online.

#At the very bottom of the page the only variables that really need to be adjusted are:

# 1) pathLocationContainingEmptyMXD  and 2) pathLocationWhereGeodatabasesLive


#-------------------------------------------------------------------------------
import arcpy, os, sys, datetime
import xml.dom.minidom as DOM

arcpy.env.overwriteOutput = True

def getNameForContext(workspace):
    base=os.path.basename(workspace)
    os.path.splitext(base)
    return os.path.splitext(base)[0]

def caculateProcessTimeInMinutes(starttime, endtime):
    delta = endtime - starttime
    seconds = float(delta.total_seconds())
    minutes = seconds / 60
    totaltime = "{}{}".format(minutes, " minutes")
    return totaltime

def generateListofFileGeodatabases(path):
    arcpy.env.workspace = path
    workspaces = arcpy.ListWorkspaces("*", "FileGDB")
    return workspaces

def generateDocumentsFromWorkspacesAndPublish(workspaces):
    i = 0
    j = 1
    for workspace in workspaces:
        start = datetime.datetime.now()
        process_message = '{} {} {} {}'.format('Processing job: ', j, ' of ', len(workspaces))
        workspace_message = '{}{}'.format("Current workspace is: ", workspaces[i])
        print "-------------------------------------------------------------------------------------"
        print process_message
        print workspace_message

        arcpy.env.workspace = workspaces[i]
        name = getNameForContext(workspaces[i])
        createDocumentWithFileGeodatabaseLayers(name)
        end = datetime.datetime.now()
        intervaltime = caculateProcessTimeInMinutes(start,end)
        intervaltime_message = "{}{}{}{}{}".format("It took ", intervaltime, " to provision and publish ", name, " content.")
        print intervaltime_message
        i = i + 1
        j = j + 1
    print "-------------------------------------------------------------------------------------"
    print "Content in each geodatabase has been published as a hosted feature service successfully!"

def createDocumentWithFileGeodatabaseLayers(name):
    mxd = arcpy.mapping.MapDocument(pathLocationContainingEmptyMXD)
    mxd_path = os.path.dirname(pathLocationContainingEmptyMXD)
    df = arcpy.mapping.ListDataFrames(mxd)[0]
    flist = arcpy.ListFeatureClasses()
    for fd in flist:
        if(fd[-1:].isalpha()):
            fc = os.path.join(arcpy.env.workspace,fd)
            fl = arcpy.MakeFeatureLayer_management(fc, fd)
            layer = arcpy.mapping.Layer(fd)
            arcpy.mapping.AddLayer(df, layer, "AUTO_ARRANGE")
            del layer
            del fl
            del fd
    mxdName = '{}{}'.format(name,".mxd")
    doc = os.path.join(mxd_path,mxdName)
    message_doc = '{} {}'.format("Current mxd path is: ", doc)
    print message_doc
    mxd.saveACopy(doc);
    publishMXDDocumentAsHostedFeatureService(doc, name)
    del doc
    del mxd

def publishMXDDocumentAsHostedFeatureService(doc, name):
    mapDoc = doc
    serviceName = name
    shareLevel = 'PRIVATE'              # Options: PUBLIC or PRIVATE
    shareOrg = 'NO_SHARE_ORGANIZATION'  # Options: SHARE_ORGANIZATION and NO_SHARE_ORGANIZATION
    shareGroups = ''                    # Options: Valid groups that user is member of

    tempPath = os.path.dirname(pathLocationContainingEmptyMXD)



    sdDraft = tempPath+'/{}.sddraft'.format(serviceName)
    newSDdraft = 'updatedDraft.sddraft'

    try:
        os.remove(serviceName+'.sd')
        message_service_def_exists = 'SD already exists, overwriting..'
        SD = os.path.join(tempPath, serviceName + '.sd')
        message_service_def_removed = 'File removed and overwritten'
    except OSError:
        message_service_def_exists = 'No SD exists, writing one now.'
        SD = os.path.join(tempPath, serviceName + '.sd')

    message_sd = '{} {}'.format("Current service definition path is: ", SD)
    print message_sd

    try:

        # create service definition draft
        country_code = name[:3]
        snippet = '{}{}'.format(country_code, " demographic data from Esri.")
        analysis = arcpy.mapping.CreateMapSDDraft(mapDoc, sdDraft, serviceName, 'MY_HOSTED_SERVICES', summary=snippet,tags=country_code) #TODO Need better way to name snippet

        # Read the contents of the original SDDraft into an xml parser
        doc = DOM.parse(sdDraft)

        # The follow 5 code pieces modify the SDDraft from a new MapService
        # with caching capabilities to a FeatureService with Query,Create,
        # Update,Delete,Uploads,Editing capabilities. The first two code
        # pieces handle overwriting an existing service. The last three pieces
        # change Map to Feature Service, disable caching and set appropriate
        # capabilities. You can customize the capabilities by removing items.
        # Note you cannot disable Query from a Feature Service.
        tagsType = doc.getElementsByTagName('Type')
        for tagType in tagsType:
            if tagType.parentNode.tagName == 'SVCManifest':
                if tagType.hasChildNodes():
                    tagType.firstChild.data = 'esriServiceDefinitionType_Replacement'

        tagsState = doc.getElementsByTagName('State')
        for tagState in tagsState:
            if tagState.parentNode.tagName == 'SVCManifest':
                if tagState.hasChildNodes():
                    tagState.firstChild.data = 'esriSDState_Published'

        # Change service type from map service to feature service
        typeNames = doc.getElementsByTagName('TypeName')
        for typeName in typeNames:
            if typeName.firstChild.data == 'MapServer':
                typeName.firstChild.data = 'FeatureServer'

        #Turn off caching
        configProps = doc.getElementsByTagName('ConfigurationProperties')[0]
        propArray = configProps.firstChild
        propSets = propArray.childNodes
        for propSet in propSets:
            keyValues = propSet.childNodes
            for keyValue in keyValues:
                if keyValue.tagName == 'Key':
                    if keyValue.firstChild.data == 'isCached':
                        keyValue.nextSibling.firstChild.data = 'false'

        #Turn on feature access capabilities
        configProps = doc.getElementsByTagName('Info')[0]
        propArray = configProps.firstChild
        propSets = propArray.childNodes
        for propSet in propSets:
            keyValues = propSet.childNodes
            for keyValue in keyValues:
                if keyValue.tagName == 'Key':
                    if keyValue.firstChild.data == 'WebCapabilities':
                        keyValue.nextSibling.firstChild.data = 'Query,Create,Update,Delete,Uploads,Editing'

        # Write the new draft to disk
        f = open(newSDdraft, 'w')
        doc.writexml( f )
        f.close()

         # Analyze the service
        analysis = arcpy.mapping.AnalyzeForSD(newSDdraft)

        if analysis['errors'] == {}:
            # Stage the service
            arcpy.StageService_server(newSDdraft, SD)

            # Upload the service. The OVERRIDE_DEFINITION parameter allows you to override the
            # sharing properties set in the service definition with new values.
            arcpy.UploadServiceDefinition_server(SD, 'My Hosted Services', serviceName, '', '', '', '', 'OVERRIDE_DEFINITION','SHARE_ONLINE', shareLevel, shareOrg, shareGroups)

            print 'Uploaded and overwrote service'

            # Write messages to a Text File
            txtFile = open(tempPath+'/{}-log.txt'.format(serviceName),"a")
            txtFile.write (str(datetime.datetime.now()) + " | " + "Uploaded and overwrote service" + "\n")
            txtFile.close()

        else:
            # If the sddraft analysis contained errors, display them and quit.
            print analysis['errors']

            # Write messages to a Text File
            txtFile = open(tempPath+'/{}-log.txt'.format(serviceName),"a")
            txtFile.write (str(datetime.datetime.now()) + " | " + analysis['errors'] + "\n")
            txtFile.close()

    except:

        print arcpy.GetMessages()
        # Write messages to a Text File
        txtFile = open(tempPath+'/{}-log.txt'.format(serviceName),"a")
        txtFile.write (str(datetime.datetime.now()) + " | Last Chance Message:" + arcpy.GetMessages() + "\n")
        txtFile.close()

if __name__ == '__main__':
    starttime = datetime.datetime.now()
    pathLocationContainingEmptyMXD = r"C:\temp\Data\POC2\Untitled.mxd"
    pathLocationWhereGeodatabasesLive = r"C:\temp\Data\POC2"
    workspaces = generateListofFileGeodatabases(pathLocationWhereGeodatabasesLive)
    generateDocumentsFromWorkspacesAndPublish(workspaces)
    endtime = datetime.datetime.now()
    totaltime = caculateProcessTimeInMinutes(starttime,endtime)
    totaltime_message = "{}{}{}".format("It took ", totaltime, " to provision and publish all file geodatabase content.")
    print totaltime_message
