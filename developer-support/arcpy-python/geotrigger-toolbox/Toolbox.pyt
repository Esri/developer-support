from __future__ import print_function
from arcpy import env
from datetime import datetime
from Queue import Queue
from threading import Thread
import os, csv, json, urllib, urllib2, json, multiprocessing

class ParamtererInfo(object):
    def __init__(self):
        self.name = "ParameterInfo"

    def getParamsForFeatureProcessing(self):
        param0 = arcpy.Parameter(
        displayName="Client Id",
        name="app_id",
        datatype="GPString",
        parameterType="Required",
        direction="Input")

        param1 = arcpy.Parameter(
        displayName="Client Secret",
        name="app_secret",
        datatype="GPString",
        parameterType="Required",
        direction="Input")

        param2 = arcpy.Parameter(
        displayName="Input Features",
        name="in_features",
        datatype="GPFeatureLayer",
        parameterType="Required",
        direction="Input")

        params = [param0, param1, param2]
        return params

class Utilities(object):
    def __init__(self):
        self._deleteUrl = 'http://geotrigger.arcgis.com/trigger/delete'
        self._createUrl = 'http://geotrigger.arcgis.com/trigger/create'
        self._updateUrl = 'http://geotrigger.arcgis.com/trigger/update'
        self._errors = {'notification':'Error processing notification.',
             'callback':'Error processing callback url.',
             'properties':'Error processing properties.',
             'tags':'Error processing tags.',
             'tagsoption':'Field GTSTAGS is empty so set value to default',
             'timestart': 'Field GTSFTIME has invalid time value.',
             'startoption': 'Optional field GTSFTIME is set with empty value',
             'timeend': 'Field GTSTTIME has invalid time value.',
             'endoption':'Optional field GTSTTIME is set with empty value',
             'isWritable': 'Error toolbox directory not writable',
             'direction':'Required field GTSDIRECT has invalid direction value. Direction values should be all lowercase like enter and leave.',
             'geometry':'Prerequisite value geometry is invalid so unable to create geotrigger condition property.',
             'selection': 'Feature class has no selection. To run this tool one or more features need to be selected.'}
        self._responses = []
        self._requests = []
        self._queue = None
        self._time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        self._logfile = 'log_' + self._time + '.txt'
        self._exceptions = [] #These are exceptions during processing user may or may not have control over these
        self._failures = [] #These are errors with the data which the end user has control over
        self._rowCollection = []
        self._updateParams = []

    def getCursorFields(self, fc):
        desc = arcpy.Describe(fc) #Arcpy
        shapeType = desc.shapeType
        fields = []
        if shapeType == "Polygon":
            fields.append('OID@')
            fields.append('SHAPE@JSON')
        else:
            fields.append('OID@')
            fields.append('SHAPE@X')
            fields.append('SHAPE@Y')
        for f in arcpy.ListFields(fc):
            if(f.name == 'SHAPE_Length' or f.name == 'SHAPE_Area' or f.type == 'OID'):
                continue
            else:
                fields.append(f.name)
        return fields

    def getRowsAsDicts(self, cursor):
        colnames = cursor.fields
        for row in cursor:
            yield dict(zip(colnames, row))

    def getGeometryFromPoint(self, data):
        geometry = {}
        geometry['longitude'] = data['SHAPE@X']
        geometry['latitude'] = data['SHAPE@Y']
        geometry['distance'] = data['GTSBUFMETR']
        return geometry

    def getGeometryFromPolygon(self, data):
        geometry = {"esrijson": data['SHAPE@JSON']}
        return geometry

    def convertToRow(self, data):
        row = Row()
        if 'GTSBUFMETR' in data:
            row._geometry = self.getGeometryFromPoint(data)
        else:
            row._geometry = self.getGeometryFromPolygon(data)
        for key in data:
            if key == "OID@":
                row._uniqueIdValue = data[key]
            if key == row._tagField:
                row._tagValue = data[key]
            if key == row._fromTimeField:
                row._fromTimeValue = data[key]
            if key == row._toTimeField:
                row._toTimeValue = data[key]
            if key == row._directionField:
                row._directionValue = data[key]
            if key == row._callbackField:
                row._callbackValue = data[key]
            if key == row._notificationField:
                row._notificationValue = data[key]
            if key == row._triggerIdField:
                row._triggerIdValue = data[key]
            if key == row._bufferDistanceField:
                row._bufferDistanceValue = data[key]
        row._data = data
        return row

    def analyzeRow(self, row):
        failures = 0
        direction = 0
        if "enter" in row._directionValue:
            direction = 1
        if "leave" in row._directionValue:
            direction = 1
        if direction == 0:
            row._directionMessage = self._errors['direction']
            message = "Feature {0} {1}".format(row._uniqueIdValue, self._errors['direction'])
            self._failures.append(message)
            failures = failures + 1
        if row._geometry == "":
            row._geometryMessage = self._errors['geometry']
            message = "Feature {0} {1}".format(row._uniqueIdValue, self._errors['geometry'])
            self._failures.append(message)
            failures = failures + 1
        if not "datetime" in str(type(row._fromTimeValue)):
            if row._fromTimeValue != "":
                row._fromTimeMessage = self._errors['timestart']
                message = "Feature {0} {1}".format(row._uniqueIdValue, self._errors['timestart'])
                self._failures.append(message)
                failures = failures + 1
            else:
                row._toTimeMessage = self._errors['startoption']
        if not "datetime" in str(type(row._toTimeValue)):
            if row._toTimeValue != "":
                row._fromTimeMessage = self._errors['endstart']
                message = "Feature {0} {1}".format(row._uniqueIdValue, self._errors['endstart'])
                self._failures.append(message)
                failures = failures + 1
            else:
                row._toTimeMessage = self._errors['endoption']
        if failures > 0:
            return None
        else:
            return row


    def getCondition(self, row):
        try:
            row._fromTimeValue = row._fromTimeValue.strftime("%Y-%m-%dT%H:%M:%S") #Make time a serializable ISO8601 string in the row
            row._toTimeValue = row._toTimeValue.strftime("%Y-%m-%dT%H:%M:%S") #Make time a serializable ISO8601 string in the row
            condition = {}
            condition['geo'] = row._geometry
            condition['direction'] = row._directionValue
            condition['fromTimestamp'] = row._fromTimeValue
            condition['toTimestamp'] = row._toTimeValue
            row._condition = condition
            return condition
        except:
            message = "Feature {0} {1}".format(row._uniqueIdValue, " threw exception while creating condition parameters.")
            self._exceptions.append(message)

    def getAction(self, row):
        try:
            action = {}
            action['callbackUrl'] = row._callbackValue
            action['notification'] = {'text':row._notificationValue}
            row._action = action
            return action
        except:
            message = "Feature {0} {1}".format(row._uniqueIdValue, " threw exception creating action parameters.")
            self._exceptions.append(message)

    def getTriggerId(self, row):
        try:
            triggerIdContainer = []
            triggerIdContainer.append(row._triggerIdValue)
            return triggerIdContainer
        except:
            message = "Feature {0} {1}".format(row._uniqueIdValue, " threw exception creating triggerId parameter.")
            self._exceptions.append(message)

    def getProperties(self, row):
        properties = row._data
        try:
            if "SHAPE@X" in properties:
                del properties["SHAPE@X"]
            if "SHAPE@Y" in properties:
                del properties["SHAPE@Y"]
            if "SHAPE@JSON" in properties:
                del properties["SHAPE@JSON"]
            if "SHAPE" in properties:
                del properties["SHAPE"]
            #if "GTSTRIGGER" in properties:
                #del properties[row._triggerIdField]
            if row._fromTimeField in properties:
                del properties[row._fromTimeField]
            if row._toTimeField in properties:
                del properties[row._toTimeField]
            row._properties = properties
            return properties
        except:
            message = "Feature {0} {1}".format(row._uniqueIdValue, " threw exception creating properties parameters.")
            self._exceptions.append(message)

    def getTags(self, row):
        try:
            tags = row._tagValue.split(",")
            if not tags[0]:
                tags = ['default']
            row._tagValue = tags
            return row._tagValue
        except:
            arcpy.AddMessage("threw exception creating tag parameters")
            message = "Feature {0} {1}".format(row._uniqueIdValue, " threw exception creating tag parameters.")
            self._exceptions.append(message)

    def createParamsFromRow(self, row):
        try:
            params = {}
            params['rateLimit'] = 0
            params['condition'] = self.getCondition(row)
            params['action'] = self.getAction(row)
            params['setTags'] = self.getTags(row)
            params['properties'] = self.getProperties(row)
            self._requests.append(params) #Store it as a list, not JSON
            row._request = json.dumps(params)
            return row
        except:
            message = "Feature {0} {1}".format(row._uniqueIdValue, " threw exception creating final request parameters.")
            self._exceptions.append(message)

    def updateParamsFromRow(self, row):
        try:
            params = {}
            params['triggerIds'] = self.getTriggerId(row)
            params['rateLimit'] = 0
            params['condition'] = self.getCondition(row)
            params['action'] = self.getAction(row)
            params['setTags'] = self.getTags(row)
            params['properties'] = self.getProperties(row)
            self._requests.append(params) #Store it as a list, not JSON
            row._request = json.dumps(params)
            return row
        except:
            message = "Feature {0} {1}".format(row._uniqueIdValue, " threw exception creating final request parameters.")
            self._exceptions.append(message)

    def updateFeatureClassWithTriggerIds(self, fc):
        fields = ["OID@", "GTSTRIGGER"]
        with arcpy.da.UpdateCursor(fc, fields) as cursor: #Arcpy
            for record in cursor:
                triggerId = self.findGeotriggerIdByOID(record[0])
                if(triggerId == None):
                    record[1] = "UNKNOWN"
                else:
                    record[1] = triggerId
                cursor.updateRow(record)

    def findGeotriggerIdByOID(self, id):
        for item in self._responses:
            itemId = item["properties"]["OID@"]
            if(itemId == id):
                return item["triggerId"]
        return None

    def isWritable(self):
        path = os.path.dirname(os.path.realpath(__file__))
        if not os.access(path,os.W_OK):
            self._exceptions.append(self._errors("isWritable"))
            return False
        else:
            return True

    def hasSelection(self, fc):
        desc = arcpy.Describe(fc)
        try:
            selection = desc.fidSet
            return True
        except:
            self._failures.append(self._errors['selection'])
            arcpy.AddMessage(self._errors['selection'])
            return False

    def threadWorker(self,token):
        i = 0
        arcpy.AddMessage("worker")
        try:
            while True:
                arcpy.AddMessage(i)
                i = i + 1
                count = len(queue)
                arcpy.AddMessage(count)
                row = self._queue.get()
                row = utilities.analyzeRow(row)
                if row != None:
                    row = utilities.createParamsFromRow(row)
                    httpResponse = utilities.send(utilities._createUrl, row, token)
                    queue.task_done()

        except:
            self._exceptions.append("theading error in worker while processing queue")
        finally:
            queue.join()

    def send(self, url, row, token):
        try:
            params = row._request;
            request = urllib2.Request(url,params)
            request.add_header("Authorization", "Bearer %s" % token)
            request.add_header("Content-Type", "application/json")
            response = urllib2.urlopen(request)
            response = response.read()
            row._response = response
            responseAsList = json.loads(row._response)
            self._responses.append(responseAsList)
            self._rowCollection.append(row)
            return response
        except:
            message = "{0}".format("A problem occured making HTTP request to create geotriggers.  Check internet connection.")
            self._exceptions.append(message)
            return False



    def delete(self, url, triggerCollection, token):
        try:
            params = {}
            params['triggerIds'] = triggerCollection
            params_json = json.dumps(params)
            self._requests.append(params_json)
            request = urllib2.Request(url,params_json)
            request.add_header("Authorization", "Bearer %s" % token)
            request.add_header("Content-Type", "application/json")
            response = urllib2.urlopen(request)
            response = response.read(response)
            responseAsList = json.loads(response)
            self._responses.append(responseAsList)
            return True
        except:
            message = "{0}".format("A problem occured making HTTP request to delete geotriggers.  Check internet connection.")
            self._exceptions.append(message)
            return False

    def update(self, url, row, token):
        try:
            request = urllib2.Request(url,row._request)
            request.add_header("Authorization", "Bearer %s" % token)
            request.add_header("Content-Type", "application/json")
            response = urllib2.urlopen(request)
            response = response.read()
            responseAsList = json.loads(response)
            row._response = response
            self._responses.append(responseAsList)
            return response
        except:
            message = "{0}".format("A problem occured making HTTP request to create geotriggers.  Check internet connection.")
            self._exceptions.append(message)
            return False



    def writeLog(self):
        logDump = {}
        logDump['failures'] = self._failures
        logDump['exceptions'] = self._exceptions
        logDump['requests'] = self._requests
        logDump['responses'] = self._responses
        logDump = json.dumps(logDump)
        path = os.path.dirname(os.path.realpath(__file__))
        log = os.path.join(path, self._logfile)
        with open(log, 'a') as inputfile:
            print(logDump, file=inputfile)
            inputfile.close()

    def getToken(self, client_id, client_secret):
        params = {}
        params['client_id'] = client_id
        params['client_secret'] = client_secret
        params['grant_type'] = "client_credentials"
        params = urllib.urlencode(params)

        try:
            request = urllib2.Request('https://www.arcgis.com/sharing/oauth2/token/',params)
            response = urllib2.urlopen(request)
            response = response.read()
            response = json.loads(response)

            token = response["access_token"]
            return token
        except:
            self._exceptions.append("Failed to get token")
            return None

class Row(object):
    def __init__(self):
        self._uniqueIdField = "FEATURE"
        self._uniqueIdValue = ""
        self._uniqueIdMessage = ""
        self._tagField = "GTSTAGS"
        self._tagValue = ""
        self._tagMessage = ""
        self._fromTimeField = "GTSFTIME"
        self._fromTimeValue = ""
        self._fromTimeMessage = ""
        self._toTimeField = "GTSTTIME"
        self._toTimeValue = ""
        self._toTimeMessage = ""
        self._directionField = "GTSDIRECT"
        self._directionValue = ""
        self._directionMessage = ""
        self._callbackField = "GTSCALLURL"
        self._callbackValue = ""
        self._callbackMessage = ""
        self._notificationField = "GTSNOTIFY"
        self._notificationValue = ""
        self._notificationMessage = ""
        self._triggerIdField = "GTSTRIGGER"
        self._triggerIdValue = ""
        self._triggerIdMessage = ""
        self._bufferDistanceField = "GTSBUFMETR"
        self._bufferDistanceValue = ""
        self._bufferDistanceMessage = ""
        self._geometry = ""
        self._geometryMessage = ""
        self._data = ""
        self._rateLimit = ""
        self._condition = ""
        self._action = ""
        self._tags = ""
        self._properties = ""
        self._request = ""
        self._response = ""


class Toolbox(object):
    def __init__(self):
        self.label = "Geotrigger Toolbox"
        self.alias = "Geotrigger Toolbox"

        # List of tool classes associated with this toolbox
        self.tools = [Schema,Create,Delete,Update]
        #FromPolygons,FromCSV,Delete, UpdatePoints, UpdatePolygons

class Schema(object):
    def __init__(self):
        """Define the tool (tool name is the name of the class)."""
        self.label = "Prepare Shapefile or Feature Class"
        self.description = ""
        self.canRunInBackground = True

    def getParameterInfo(self):

        """Define parameter definitions"""
        param0 = arcpy.Parameter(
        displayName="Input Features",
        name="in_features",
        datatype="GPFeatureLayer",
        parameterType="Required",
        direction="Input")

        params = [param0]
        return params

    def isLicensed(self):
        return True

    def updateParameters(self, parameters):
        return

    def updateMessages(self, parameters):
        return

    def execute(self, parameters, messages):
        def addSchema(fc):
            desc = arcpy.Describe(fc)
            shapeType = desc.shapeType
            if(shapeType == "Polygon" or shapeType == "Polyline" or shapeType == "MultiPoint" or shapeType == "MultiPatch"):
                shemaFields = [rowInfo._tagField, rowInfo._directionField, rowInfo._callbackField, rowInfo._notificationField, rowInfo._fromTimeField, rowInfo._toTimeField, rowInfo._triggerIdField]
            else:
                shemaFields = [rowInfo._tagField, rowInfo._directionField, rowInfo._callbackField, rowInfo._notificationField, rowInfo._fromTimeField, rowInfo._toTimeField, rowInfo._triggerIdField, rowInfo._bufferDistanceField]
            for fieldname in shemaFields:
                needField = IsFieldNeeded(fc, fieldname)
                if needField:
                    AddField(fc,fieldname)
                else:
                    arcpy.AddMessage("Field %s already exists." % fieldname)
            return True

        def AddField(fc, fieldname):
            arcpy.AddMessage("Adding field %s" % fieldname)
            if fieldname == rowInfo._notificationField:
                arcpy.AddField_management(fc, fieldname, "TEXT", "", "", 2147483647)
            elif fieldname == rowInfo._fromTimeField or fieldname == rowInfo._toTimeField:
                arcpy.AddField_management(fc, fieldname, "DATE", "", "", "")
            elif fieldname == rowInfo._bufferDistanceField:
                arcpy.AddField_management(fc, fieldname, "SHORT", "", "", "")
            else:
                arcpy.AddField_management(fc, fieldname, "TEXT", "", "", 255)
            return


        def IsFieldNeeded(fc, fieldname):
            fieldList = arcpy.ListFields(fc, fieldname)
            fieldCount = len(fieldList)
            if (fieldCount == 1):
                return False
            else:
                return True

        arcpy.env.addOutputsToMap = False
        rowInfo = Row()
        env.workspace = os.path.dirname(os.path.realpath(__file__))
        inputFile = parameters[0].valueAsText
        success = addSchema(inputFile)
        if not success:
            raise arcpy.ExecuteError
        return

class Create(object):
    def __init__(self):
        self.label = "Create Geotriggers From Points or Polygons"
        self.description = ""
        self.canRunInBackground = True
        self.errors = ""

    def getParameterInfo(self):
        paramtererInfo = ParamtererInfo()
        params = paramtererInfo.getParamsForFeatureProcessing()
        return params

    def isLicensed(self):
        return True

    def updateParameters(self, parameters):
        return

    def updateMessages(self, parameters):
        return

    def execute(self, parameters, messages):
        def prepareOperation():
            canWriteFiles = utilities.isWritable()
            if not canWriteFiles:
                return None
            else:
                return True

        def batchCreate(q, rows):
            queues = []
            for row in row:
                row = utilities.analyzeRow(row)
                if row != None:
                    row = utilities.createParamsFromRow(row)
                    httpResponse = utilities.send(utilities._createUrl, row, token)
                    q.put(httpResponse)

        def createQueues():
            count = len(utilities._rowCollection)
            quotient = count / 5
            threadQueues = []
            queue = Queue()
            idx = 0
            for row in utilities._rowCollection:
                if idx < quotient:
                    queue.put(row)
                if idx == quotient:
                    idx = 0
                    threadQueues.append(queue)
                    queue = Queue()
                idx = idx + 1
            return threadQueues

        def createQueue():
            queue = Queue()
            for row in utilities._rowCollection:
                queue.put(row)
            return queue

        def process(token):
            i = 0
            arcpy.AddMessage("worker")
            try:
                while True:
                    arcpy.AddMessage(i)
                    i = i + 1
                    count = len(queue)
                    arcpy.AddMessage(count)
                    row = self._queue.get()
                    row = utilities.analyzeRow(row)
                    if row != None:
                        row = utilities.createParamsFromRow(row)
                        httpResponse = utilities.send(utilities._createUrl, row, token)
                        queue.task_done()

            except:
                self._exceptions.append("theading error in worker while processing queue")
            finally:
                queue.join()

        def runOperation(fc, token):
            fields = utilities.getCursorFields(fc)
            with arcpy.da.SearchCursor(fc, fields) as cursor: #Arcpy
                for data in utilities.getRowsAsDicts(cursor):
                    row = utilities.convertToRow(data)
                    utilities._rowCollection.append(row)
                    message = "Processing row {0}".format(row._uniqueIdValue)
                    arcpy.AddMessage(message)
                    row = utilities.analyzeRow(row)
                    if row != None:
                        row = utilities.createParamsFromRow(row)
                        httpResponse = utilities.send(utilities._createUrl, row, token)

            arcpy.AddMessage("done")
                    #row = utilities.analyzeRow(row)
                    #if row != None:
                        #row = utilities.createParamsFromRow(row)
                        #httpResponse = utilities.send(utilities._createUrl, row, token)
            utilities.updateFeatureClassWithTriggerIds(fc)
            return True


        try:
            arcpy.env.addOutputsToMap = False
            utilities = Utilities()
            client_id = parameters[0].valueAsText
            client_secret = parameters[1].valueAsText
            inputFile = parameters[2].valueAsText

            canrun = prepareOperation()
            if canrun == None:
                #utilities.writeLog()
                raise arcpy.ExecuteError

            token = utilities.getToken(client_id,client_secret)
            if token == None:
                #utilities.writeLog()
                raise arcpy.ExecuteError

            success = runOperation(inputFile,token)


            if not success:
                arcpy.AddMessage("not success")
                raise arcpy.ExecuteError
            return

        finally:
            utilities.writeLog()

class Delete(object):
    def __init__(self):
        """Define the tool (tool name is the name of the class)."""
        self.label = "Delete Selected Features From Service"
        self.description = ""
        self.canRunInBackground = True
        self.errors = ""

    def getParameterInfo(self):
        paramtererInfo = ParamtererInfo()
        params = paramtererInfo.getParamsForFeatureProcessing()
        return params

    def isLicensed(self):
        return True

    def updateParameters(self, parameters):
        return

    def updateMessages(self, parameters):
        return

    def execute(self, parameters, messages):

        def prepareOperation():
            canWriteFiles = utilities.isWritable()
            if not canWriteFiles:
                return None
            else:
                return True


        def deleteGeotriggers(fc, token):
            row = Row()
            triggerCollection = []
            fields = ['OID@' , row._triggerIdField]
            selection = utilities.hasSelection(fc)
            if not selection:
                return False
            with arcpy.da.SearchCursor(fc, fields) as cursor:
                for row in cursor:
                    if row[1]:
                        arcpy.AddMessage(row[1])
                        if(len(row[1]) > 0):
                            triggerCollection.append(row[1])
                        else:
                            message = "Feature {0} not used to delete the Geotrigger because it is missing a valid Trigger Id".format(row[0])
                            utilities._failures.append(message)
            hasResult = utilities.delete(utilities._deleteUrl, triggerCollection, token)
            return hasResult


        try:
            arcpy.env.addOutputsToMap = False
            utilities = Utilities()
            client_id = parameters[0].valueAsText
            client_secret = parameters[1].valueAsText
            inputFile = parameters[2].valueAsText

            canrun = prepareOperation()
            if canrun == None:
                raise arcpy.ExecuteError

            token = utilities.getToken(client_id,client_secret)
            if token == None:
                raise arcpy.ExecuteError

            canDeleteGeotriggers = deleteGeotriggers(inputFile,token)
            if not canDeleteGeotriggers:
                raise arcpy.ExecuteError

            return

        finally:
            utilities.writeLog()

class Update(object):
    def __init__(self):
        self.label = "Update Geotriggers From Points or Polygons"
        self.description = ""
        self.canRunInBackground = True
        self.errors = ""

    def getParameterInfo(self):
        paramtererInfo = ParamtererInfo()
        params = paramtererInfo.getParamsForFeatureProcessing()
        return params

    def isLicensed(self):
        return True

    def updateParameters(self, parameters):
        return

    def updateMessages(self, parameters):
        return

    def execute(self, parameters, messages):
        def prepareOperation():
            canWriteFiles = utilities.isWritable()
            if not canWriteFiles:
                return None
            else:
                return True

        def runOperation(fc, token):
            triggerCollection = []
            fields = utilities.getCursorFields(fc)
            selection = utilities.hasSelection(fc)
            if not selection:
                return False

            with arcpy.da.SearchCursor(fc, fields) as cursor: #Arcpy
                for data in utilities.getRowsAsDicts(cursor):
                    row = utilities.convertToRow(data)
                    message = "Processing row {0}".format(row._uniqueIdValue)
                    arcpy.AddMessage(message)
                    row = utilities.analyzeRow(row)
                    if row != None:
                        row = utilities.updateParamsFromRow(row)
                        httpResponse = utilities.update(utilities._updateUrl, row, token)
            #utilities.updateFeatureClassWithTriggerIds(fc)
            return True


        try:
            arcpy.env.addOutputsToMap = False
            utilities = Utilities()
            client_id = parameters[0].valueAsText
            client_secret = parameters[1].valueAsText
            inputFile = parameters[2].valueAsText

            canrun = prepareOperation()
            if canrun == None:
                #utilities.writeLog()
                raise arcpy.ExecuteError

            token = utilities.getToken(client_id,client_secret)
            if token == None:
                #utilities.writeLog()
                raise arcpy.ExecuteError

            success = runOperation(inputFile,token)

            if not success:
                arcpy.AddMessage("not success")
                raise arcpy.ExecuteError
            return

        finally:
            utilities.writeLog()
