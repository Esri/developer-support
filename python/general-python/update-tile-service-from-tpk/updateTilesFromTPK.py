#  Name: UpdateTiles.py
#
#
#  Purpose: Overwrite a Tile Service from an uploaded tile package
#
# Requirements: Have a tile package uploaded to ArcGIS Online and published as a
#               Service. This script must be run as the user who owns the service
#               Input Username, and password for user who owns tilepackage and service
#               Input item ID of uploaded tilepackage
#               Input Service Name of service to be overwritten
#
# Author:      Kelly Gerrow
#Contact:      kgerrow@esri.com
#
# Created:     10/3/2016
#-------------------------------------------------------------------------------

#returns ssl value and user token
def getToken(adminUser, pw):
        data = {'username': adminUser,
            'password': pw,
            'referer' : 'https://www.arcgis.com',
            'f': 'json'}
        url  = 'https://www.arcgis.com/sharing/rest/generateToken'
        jres = requests.post(url, data=data, verify=False).json()
        return jres['token'],jres['ssl']

#RETURNS UNIQUE ORGANIZATION URL and OrgID
def GetAccount(pref, token):
    URL= pref+'www.arcgis.com/sharing/rest/portals/self?f=json&token=' + token
    response = requests.get(URL, verify=False)
    jres = json.loads(response.text)
    return jres['urlKey'], jres['id']

def uploadItem(userName, portalUrl, TPK, itemID, layerName, extent, token):
    #Upload the input TPK, this is using a post request through the requests module,
    #returns a response of success or failure of the uploaded TPK. This can then be used to update the tiles
    #in the tile service

    #update Item URL
    updateUrl = '{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/update'.format(portalUrl,userName,itemID)
    #opens Tile Package
    filesUp = {"file": open(TPK, 'rb')}

    #data for request. as this is updated an existing item, the value of overwrite is set to true
    data = {'f':'json',
        'token':token,
        'name':layerName,
        'title': layerName,
        'itemId':itemID,
        'filetype': 'Tile Package',
        'overwrite': 'true',
        'async':'true',
        'extent':extent}
    #submit requst
    response = requests.post(updateUrl, data=data, files=filesUp, verify=False).json()

    return response

def updateTiles(orgID, layerName, extent, lods,token):
   #Build each tile of the tiled service.
   url = "http://tiles.arcgis.com/tiles/{}/arcgis/rest/admin/services/{}/MapServer/updateTiles".format(orgID, layerName)
   data = {"extent": extent,"levels": lods,"token":token, 'f':'json'}
   jres = requests.post(url, data).json()
    #returns jobID
   return jres

#import vARIABLES
import requests, json, time

#Enter Username and Password
user= 'username' #raw_input('What is the ArcGIS Online Username?')
pw = 'password'#raw_input('What is the ArcGIS Online Password?')
inItemID= 'a0d0938b2cb34620a842cbdf71c4388f'#raw_input('What is the Item ID of the uploaded TPK?')
layerName ='servicename'#raw_input('What is the Service Name of the service to overwrite ?')
tpk =  r"location of tpk" #location of TPK
extent = 'extent of tpk' #extent
lods = '0-8' #enter levels in format outlined http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Update_Tiles/02r30000022v000000/



#get account information
token= getToken(user, pw)
if token[1] == False:
           pref='http://'
else:
           pref='https://'

#Create Portal URL and assign variables

t=GetAccount(pref,token[0])
urlKey=t[0]
orgID=t[1]
portalUrl=pref+urlKey


#upload updated TPK
update = uploadItem(user,portalUrl,tpk,inItemID,layerName, extent, token[0])
print update

if update['success'] ==True:
    unpack = updateTiles(orgID, layerName, extent, lods,token[0])

#check publishing status until status is complete
statusURL ='{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/status?jobId={}&f=json&token={}'.format(portalUrl,user,unpack['itemId'],unpack['jobId'],token[0])
requestStatus = requests.get(statusURL)
status=requestStatus.json()
while status['status']=='processing':
    time.sleep(10)
    print status['status']
    statusURL ='{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/status?jobId={}&f=json&token={}'.format(portalUrl,user,unpack['itemId'],unpack['jobId'],token[0])
    requestStatus = requests.get(statusURL)
    status=requestStatus.json()

#print completed status
print status['status']


