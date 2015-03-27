#-------------------------------------------------------------------------------
# Name:        UpdateWebMap

# Purpose:     Update a webmap to AGOL based on the input JSON.

# Note:         To access the web map JSON to be modified, use
#               http://arcgis.com/sharing/rest/content/items/<itemID>/data?f=pjson
#               you will need to replace the following:
#               true > True
#               false > False
#               null > None

# Author:      Melanie Summers
#
# Created:     17/03/2015
#-------------------------------------------------------------------------------

import urllib
import urllib2
import json

def generateToken(username, password):
    '''Generate a token using urllib modules for the input
    username and password'''

    url = "https://arcgis.com/sharing/generateToken"
    data = {'username': username,
        'password': password,
        'referer' : 'https://arcgis.com',
        'expires' : 1209600,
        'f': 'json'}
    data = urllib.urlencode(data)
    request = urllib2.Request(url, data)
    response = urllib2.urlopen(request)

    return json.loads(response.read())

def GetInfo(ssl, token):
    '''Get information about the specified organization
    this information includes the Short name of the organization (['urlKey'])
    as well as the organization ID ['id']'''

    URL= '{}://arcgis.com/sharing/rest/portals/self?f=json&token={}'.format(ssl,token)
    request = urllib2.Request(URL)
    response = urllib2.urlopen(request)
    return json.loads(response.read())

def findWebMap(ssl, short, username, token, webmapName):
    '''Returns the details for the item returned that
    matches the itemname and has a type of web map.
    To access the webmap ID, use the key ['id']'''

    ItemsURL = '{}://{}.maps.arcgis.com/sharing/rest/content/users/{}?f=json&token={}'.format(ssl, short, username, token)
    Request = urllib2.Request(ItemsURL)
    Response = urllib2.urlopen(Request)
    items = json.loads(Response.read())['items']
    for item in items:
        if item['title'] == webmapName and item['type'] == 'Web Map':
            return item

def updateItem(ssl, Short, username, itemID, token, JSON):
    '''Updates the input webmap with the new JSON loaded,
    uses urllib as a get request'''

    url = '{}://{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/update?token={}&f=json'.format(ssl, Short, username, itemID, token)

    dumped = json.dumps(JSON)
    data = {'async': 'True',
            'text': dumped}

    data = urllib.urlencode(data)
    request = urllib2.Request(url, data)
    response = urllib2.urlopen(request)

    return json.loads(response.read())


if __name__ == '__main__':

    username = raw_input("Please enter your username: ")
    password = raw_input("Please enter your password: ")
    webmapName = raw_input("What is the title of the web map?: ")


    tokenResponse = generateToken(username, password)
    token = tokenResponse['token']
    if tokenResponse['ssl']:
        ssl = 'https'
    else:
        ssl = 'http'
    Info = GetInfo(ssl, token)
    Short = Info['urlKey']

    itemID = findWebMap(ssl, Short, username, token, webmapName)['id']

    JSON = "Replace with JSON, remove the quotes"
    WebMap = updateItem(ssl, Short, username, itemID, token, JSON)