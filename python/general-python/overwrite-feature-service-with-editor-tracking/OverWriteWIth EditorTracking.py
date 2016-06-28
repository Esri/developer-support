#  Name: OverWriteWithEditorTracking.py
#
#
#  Purpose: Publish an already-uploaded File Geodatabase to overwrite an existing service
#  that preserves editor tracking information
#
# Requirements: Have new data uploaded to ArcGIS Online
#               Input Username, and password for user who owns items
#               Input item ID of uploaded file geodatabase
#               Input Service Name of service to be overwritten
#
# Author:      Kelly Gerrow
#Contact:      kgerrow@esri.com
#
# Created:     4/8/2016
#-------------------------------------------------------------------------------

#returns ssl value and user token
def getToken(adminUser, pw):
        data = {'username': adminUser,
            'password': pw,
            'referer' : 'https://www.arcgis.com',
            'f': 'json'}
        url  = 'https://arcgis.com/sharing/rest/generateToken'
        jres = requests.post(url, data=data, verify=False).json()
        return jres['token'],jres['ssl']

#RETURNS UNIQUE ORGANIZATION URL
def GetAccount(pref, tokenfun):
    URL= pref+'www.arcgis.com/sharing/rest/portals/self?f=json&token=' + tokenfun
    response = requests.get(URL, verify=False)
    jres = json.loads(response.text)
    return jres['urlKey']


#import vARIABLES
import requests, json, time

#Enter Username and Password
user= raw_input('What is the ArcGIS Online Username?')
pw = raw_input('What is the ArcGIS Online Password?')
inItemID= raw_input('What is the Item ID of the uploaded FGDB?')
layerName =raw_input('What is the Service Name of the service to overwrite ?')



#get account information
token= getToken(user, pw)
if token[1] == False:
           pref='http://'
else:
           pref='https://'

#Create Portal URL

t=GetAccount(pref,token[0])
portalUrl=pref+t



#Create Publishing parameters including editor tracking
paramDict ={'name':layerName, 'maxRecordCount':2000,'layerInfo':{'capabilities':'Query'}, "editorTrackingInfo":{"enableEditorTracking":'true',"preserveEditUsersAndTimestamps":'true'}}

#submit publish request
URL ='{}.maps.arcgis.com/sharing/rest/content/users/{}/publish'.format(portalUrl,user)
data = {'f':'json',
        'token':token,
        'itemId':inItemID,
        'filetype': 'fileGeodatabase',
        'overwrite':'true',
        'publishParameters' : str(paramDict),
        'buildInitialCache':'false'}
request = requests.post(URL, data=data)
requestor=request.json()

#cdetermine publishing job and retreive item id
for item in requestor['services']:
    outID=item['serviceItemId']
    jobId=item['jobId']
print request.json()

#check status until status is complete
statusURL ='{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/status?jobId={}&f=json&token={}'.format(portalUrl,user,outID,jobId,token[0])
requestStatus = requests.get(statusURL)
status=requestStatus.json()
while status['status']=='processing':
    time.sleep(10)
    print status['status']
    statusURL ='{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/status?jobId={}&f=json&token={}'.format(portalUrl,user,outID,jobId,token[0])
    requestStatus = requests.get(statusURL)
    status=requestStatus.json()

#print completed status
print status['status']


