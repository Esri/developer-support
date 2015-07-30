# Script to add all unsecured map and feature services from an ArcGIS Server Rest endpoint to Portal as items
# Created by: Jeff S
#
# The portalURL, portalUsername, portalPassword, and serverURL must be updated
# before running the script

import urllib, urllib2, json

# variables
portalURL = 'https://portal.example.com/portal' # Portal url including web adaptor
portalUsername = 'username'  # Portal username
portalPassword = 'password' # Portal password
serverURL = 'https://server.example.com/arcgis/rest/services' # Rest endpoint
addCount = 0
failCount = 0

# Generate Portal token
def generateToken(username,password):
    params = {'username':username,
              'password':password,
              'referer':portalURL,
              'f':'json'}
    try:
        request = urllib2.Request(portalURL + '/sharing/generateToken', urllib.urlencode(params))
        response = urllib2.urlopen(request)
        token = json.loads(response.read())['token']
        return token
    except Exception:
        print 'Failed to generate token'
        pass

# Generate list of map and feature services in all folders on the Server Rest page
def getServices(serverUrl):
    serviceList = []
    request = urllib2.Request(serverUrl + '?f=json')
    response = urllib2.urlopen(request)
    restRoot = json.loads(response.read())
    # Return services in root folder
    for services in restRoot['services']:
        if (services['type'] == 'MapServer') or (services['type'] == 'FeatureServer'):
            serviceList.append(services['name'] + '/' + services['type'])
    # Return services in subfolders
    for folder in restRoot['folders']:
        request = urllib2.Request(serverUrl + '/' + folder + '?f=json')
        response = urllib2.urlopen(request)
        for services in json.loads(response.read())['services']:
            if (services['type'] == 'MapServer') or (services['type'] == 'FeatureServer'):
                serviceList.append(services['name'] + '/' + services['type'])
    return serviceList

# Add item to Portal
def addItem(serviceName,token):
    global addCount
    global failCount
    if serviceName.split("/")[-1] == 'MapServer':
        service_type = 'Map Service'
    else:
        service_type = 'Feature Service'
    itemName = serviceName.split("/")[-2]
    service_request = urllib2.Request(serverURL + '/' + serviceName + '?f=json')
    service_response = urllib2.urlopen(service_request)
    serviceInfo = json.loads(service_response.read())
    serviceXmin = serviceInfo['fullExtent']['xmin']
    serviceXmax = serviceInfo['fullExtent']['xmax']
    serviceYmin = serviceInfo['fullExtent']['ymin']
    serviceYmax = serviceInfo['fullExtent']['ymax']
    serviceExtent = str(serviceXmin) + ',' + str(serviceYmin) + ',' + str(serviceXmax) + ',' + str(serviceYmax)
    serviceSR = serviceInfo['fullExtent']['spatialReference']['wkid']
    serviceKeywords = serviceInfo['documentInfo']['Keywords']
    addItem_URL = portalURL + '/sharing/rest/content/users/' + portalUsername + '/addItem'
    addItem_params = {'type':service_type,
                      'typeKeywords':serviceKeywords,
                      'url':serverURL + '/' + serviceName,
                      'title':itemName,
                      'tags':itemName,
                      'description':itemName,
                      'snippet':itemName,
                      'accessInformation':'',
                      'spatialReference':serviceSR,
                      'extent':serviceExtent,
                      'thumbnailURL':serverURL + '/' + serviceName + '/export?size=200,133&bbox=' + serviceExtent + '&format=png32&f=image',
                      'token':token,
                      'f':'json'}
    addItem_request = urllib2.Request(addItem_URL, urllib.urlencode(addItem_params))
    addItem_request.add_header('Referer', portalURL)
    addItem_response = urllib2.urlopen(addItem_request)
    if json.loads(addItem_response.read()).get('success'):
        print serviceName + ': Success'
        addCount += 1
    else:
        print serviceName + ': ** Failed to add **'
        failCount += 1

if __name__ == "__main__":
    token = generateToken(portalUsername,portalPassword)
    serviceList = getServices(serverURL)
    for service in serviceList:
        try:
            addItem(service,token)
        except:
            print service + ': ** Failed to add **'
            failCount += 1
    print '\nSuccessfully added ' + str(addCount) + ' items to Portal'
    print 'Failed to add ' + str(failCount) + ' items to Portal'
