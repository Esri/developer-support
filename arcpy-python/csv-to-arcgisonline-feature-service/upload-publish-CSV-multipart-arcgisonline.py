#-------------------------------------------------------------------------------
# Name:        UploadPublishCSVMultipart

# Purpose:     This script uploads and publishes a CSV that includes XY data, not
#              addresses. This uses a multipart upload for the CSV and requires
#              username, password, CSVfile, X and Y fields, and tags to be defined


# Author:      Melanie Summers
#
# Created:     21/07/2014
#-------------------------------------------------------------------------------

import requests
import os
import json
import tempfile
import time


def generateToken(username, password):
    '''Generate a token using the requests module for the input
    username and password'''

    url = "https://arcgis.com/sharing/generateToken"
    data = {'username': username,
        'password': password,
        'referer' : 'https://arcgis.com',
        'expiration' : 1209600,
        'f': 'json'}
    request = requests.post(url, data=data, verify=False)
    return request.json()['token']

def GetInfo(token):
    '''Get information about the specified organization
    this information includes the short name of the organization (['urlKey'])
    as well as the organization ID ['id']'''

    URL= 'https://arcgis.com/sharing/rest/portals/self?f=json&token={}'.format(token)
    response = requests.get(URL, verify=False)
    return response.json()

def uploadItem(short, username, token, itemName):
    '''Upload the input CSV, this is using a post request through the requests module,
    to access the itemID, use the index ['id']'''

    uploadURL = 'http://{}.maps.arcgis.com/sharing/rest/content/users/{}/addItem?token={}&f=json'.format(short, username, token)
    data = {'multipart': 'true',
            'filename' : itemName,
            'type': 'CSV'}

    response = requests.post(uploadURL, data=data)
    return response.json()

def SplitFile(inputfile):
    '''Splits the input file into smaller portions to be added individually
    returns the temporary folder location where the files are stored.'''

    Folder = tempfile.mkdtemp()
    opened = open(inputfile, 'r')
    totalsize = os.path.getsize(inputfile)
    midsize = totalsize/6291000

    if midsize > 0:
        for X in range(1, midsize +1):
            lines = opened.read(totalsize/midsize)
            interfile = open(os.path.join(Folder, 'Data' +  str(X) + '.csv'), 'w')
            interfile.write(lines)
            interfile.close()
        opened.close()
    else:
        lines = opened.read()
        interfile = open(os.path.join(Folder, 'Data1.csv'), 'w')
        interfile.write(str(lines))
        interfile.close()
        opened.close()
    return Folder

def addPart(short, username, CSVID, token, filename, num):
    '''Add part of the input CSV using a post request through the request module'''

    addpartURL = 'http://{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/addPart?token={}&f=json'.format(short, username, CSVID, token)
    data = {'file': open(filename, 'rb')}
    url = addpartURL + "&file="+filename+ "&partNum="+str(num)
    response = requests.post(url, files = data)
    return json.loads(response.text)

def StatusTest(TYPE, short, username, ItemID, token, jobID=''):
    '''return the job status, used to confirm the item was uploaded
    or the service published successfully before proceeding'''

    if TYPE == 'CSV':
        TestURL = "http://{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/status?f=json&token={}".format(short, username, ItemID, token)
    elif TYPE == 'SERVICE':
        TestURL = "http://{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/status?jobid={}&f=json&token={}".format(short, username, ItemID, jobID, token)
    result = requests.get(TestURL)
    return result.json()

def commit(short, username, ID, token):
    '''Used as part of the multipart upload to combine the parts,
    the order is defined by the partnumber specified when
    each part was added'''

    commitURL = "http://{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/commit?f=json&token={}".format(short, username, ID, token)
    response = requests.post(commitURL)

    return json.loads(response.text)

def updateItem(short, username, ID, token, itemTitle, tags, filename):
    '''Updates the item details title, tags, filename, type, and typekeywords'''

    updateURL = "http://{}.maps.arcgis.com/sharing/content/users/{}/items/{}/update?f=json&token={}".format(short, username, ID, token)

    data = {'title': itemTitle,
            'tags': tags,
            'filename': filename,
            'typeKeywords': 'CSV',
            'type': 'CSV'}
    response = requests.post(updateURL, data=data)

    return json.loads(response.text)

def analyzeCSV(token, CSVID, FileName):
    '''Analyzes the input CSV to generate the JSON used
    when publishing the CSV'''

    url = 'http://www.arcgis.com/sharing/rest/content/features/analyze?token={}'.format(token)
    data = {'f': 'JSON',
            'itemid': CSVID,
            'file': FileName,
            'filetype':'csv'}
    request = requests.post(url, data=data)
    return request.json()

def decode_list(feature):
    rv=[]
    for item in feature:
        if isinstance(item, unicode):
            item = item.encode('utf-8')
        elif isinstance(item, list):
            item = decode_list(item)
        elif isinstance(item, dict):
            item = decode_dict(item)
        rv.append(item)
    return rv

def decode_dict(data):
    rv = {}
    for key, value in data.iteritems():
        if isinstance(key, unicode):
            key = key.encode('utf-8')
        if isinstance(value, unicode):
            value = value.encode('utf-8')
        elif isinstance(value, list):
            value = decode_list(value)
        elif isinstance(value, dict):
            value = decode_dict(value)
        rv[key] = value
    return rv


def PublishService(Short, itemID, username, token, itemName, publishParams, XField, YField):
    ''' Publishes the input itemID (uploaded CSV) this is using
    a post request from urllib, the JSON input can be generated by
    the analyze function. Item name, X and Y fields are specified'''

    publishURL = 'http://{}.maps.arcgis.com/sharing/rest/content/users/{}/publish'.format(Short, username)
    publishParams['name'] = itemName
    publishParams['locationType'] = 'coordinates'
    publishParams['latitudeFieldName'] = YField
    publishParams['longitudeFieldName'] = XField
    query_dict = {
        'itemID': itemID,
        'filetype': 'csv',
        'f': 'json',
        'token': token,
        'publishParameters':publishParams}

    query_dict['publishParameters'] = json.dumps(query_dict['publishParameters'], sort_keys=False)
    request = requests.post(publishURL, data=query_dict)
    return request.json()


def TestQuery(ServiceURL, token):
    '''This is a test query to ensure the service was published succcessfully'''

    QueryURL = "{}/0/query?where=1=1&returnCountOnly=True&f=json&token={}".format(ServiceURL, token)
    result = requests.get(QueryURL)

    return result.json()

if __name__ == '__main__':

    username = raw_input("Please enter your username: ")
    password = raw_input("Please enter your password: ")
    ItemName = raw_input("Enter the name of the service")
    Tags = 'tags'
    CSV = raw_input("Please enter the path to the CSV file: ")
    XField = raw_input("What is the X/Latitude field name? ")
    YField = raw_input("What is the Y/Longitude field name? ")

    token = generateToken(username, password)
    Info = GetInfo(token)
    Short = Info['urlKey']

    ItemID = uploadItem(Short, username, token, ItemName)['id']
    TempDir = SplitFile(CSV)

    Count = 0
    for a, b, c in os.walk(TempDir):
        for name in c:
            print name
            index = name.replace('Data', '').replace('.csv', '')
            PART = addPart(Short, username, ItemID, token, os.path.join(TempDir,name), index)

    commit(Short, username, ItemID, token)

    while StatusTest('CSV', Short, username, ItemID, token)['status']!='completed':
        if StatusTest('CSV', Short, username, ItemID, token)['status'] == 'failed':
            print "CSV upload failed"
            break
        time.sleep(5)
        print ("Processing CSV")

    updateItem(Short, username, ItemID, token, ItemName, Tags, os.path.basename(CSV))

    Analyzed = analyzeCSV(token, ItemID, os.path.basename(CSV))
    decoded = decode_dict(Analyzed['publishParameters'])

    OutputURL = PublishService(Short, ItemID, username, token, ItemName, decoded, XField, YField)
    while StatusTest('SERVICE', Short, username, OutputURL['services'][0]['serviceItemId'], token,OutputURL['services'][0]['jobId'])['status']!='completed':
        if StatusTest('SERVICE',Short, username, OutputURL['services'][0]['serviceItemId'], token,OutputURL['services'][0]['jobId'])['status'] == 'failed':
            print"Publishing service failed"
            break
        time.sleep(25)
        print("Processing Service")


    print TestQuery(OutputURL['services'][0]['serviceurl'], token)['count']