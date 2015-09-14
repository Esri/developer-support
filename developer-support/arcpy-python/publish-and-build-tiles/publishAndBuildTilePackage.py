#If testing if __name__ == "main" be sure to input the username, password, extent, levels, file name, file type, and who to share with.
#If testing, we upload the .tpk from disk, publish, and then share to the organization. The script was tested against a tile package created
#from the ArcTutor Network Analyst San Diego streets network.

"""
The requets module is needed.
Get it here: http://www.lfd.uci.edu/~gohlke/pythonlibs/#requests
Or here: http://docs.python-requests.org/en/latest/user/install/
We are able to add a tile package as an item and publish that tile package.\
We are also able to find an existing hosted tile package and publish that package.
Finally, we are able to update sharing. We can share/unshare with everyone and with the org.\
A bit more logic is needed if you want to share with a specific group. You would add that logic to groupSearch and unshareItems.
Please note that publishing and storing services consumes credits, as does publishing tiles.\
Always test modestly. For example, to ensure tiles are created, test with the top level (0) first, instead of all levels.\
Example usage:
#Instantiate the object
>>> test = AGOL(username, password)
#If uploading a .tpk:
>>> test.addItem("path-and-name-of-tile-package.tpk", "Tile Package")
#Otherwise, to search for a hosted .tpk.
>>> test.itemID = test.search(type = "Tile Package", owner = username).json()['results'][0]['id']
#For both scenarios
>>> test.publish()
>>> test.editTiles()
>>> test.updateTiles("-13024496,5245452,-12082300,6139826,102100", "0")
>>> test.shareItems("true", "true")
>>> test.itemID = test.search(type = "Map Service", owner = username).json()['results'][0]['id']
>>> test.shareItems("true", "true")
"""

print(__doc__)

import requests, time

class AGOL(object):

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.token = self.getToken()
        self.orgID = self.getInfo()['id']
        self.itemID = ""
        self.fileName = ""

    def getToken(self):
        """Get a valid token, assings the token to the AGOL object."""
        url = 'https://arcgis.com/sharing/rest/generateToken'
        data = {'username': self.username,
                'password': self.password,
                'referer' : 'https://www.arcgis.com',
                'f': 'json'}
        return requests.post(url, data).json()['token']

    def getInfo(self):
        """Returns the json of the organization's information."""
        url = 'http://www.arcgis.com/sharing/rest/portals/self?f=json&token=' + self.token
        return requests.get(url).json()

    def search(self, **kwargs):
        """Returns first search result with supplied search parameters."""
        url = "http://www.arcgis.com/sharing/rest/search"
        data = {'f': 'json', 'token': self.token}
        s= ""
        for key, value in kwargs.iteritems(): s = s + key + ":\"" + value + "\"AND "
        s = s[:-4]
        data['q'] = s
        return requests.post(url, data)

    def addItem(self, tilePackage, fileType):
        """Add a tile package to ArcGIS Online and updates the AGOL object's itemID with the ID of the hosted tile package."""
        partialURL = 'http://www.arcgis.com/sharing/rest/content/users/{username}/addItem'.format(username = self.username)
        filesUp = {"file": open(tilePackage, 'rb')}
        url = partialURL + "?f=json&token="+self.token+"&type="+fileType+"&outputType=Tiles"
        self.itemID = requests.post(url, files=filesUp).json()['id']
        time.sleep(30) #Allow time for tile package to upload.

        self.fileName = self.search(id = self.itemID).json()['results'][0]['title']

    def publish(self):
        """Publish the tile package associated with the AGOL objects itemID."""
        url = "http://www.arcgis.com/sharing/rest/content/users/{0}/publish".format(self.username)
        data = {'itemID': self.itemID,
              'filetype': 'tilePackage',
              'outputType': 'Tiles',
              'f': 'json',
              'token': self.token}
        requests.post(url, data)

    def editTiles(self):
        """Edit the min and max scale of the tiled service. This may be needed before building each tile."""
        url = "http://tiles.arcgis.com/tiles/{orgID}/arcgis/rest/admin/services/{serviceName}/MapServer/edit".format(orgID = self.orgID, serviceName = self.fileName)
        data = {"maxScale": "1128.497176", "minScale": "591657527.591555", "token": self.token, 'f': 'json'}
        requests.post(url, data);

    def updateTiles(self, extent, levels):
        """Build each tile of the tiled service."""
        url = "http://tiles.arcgis.com/tiles/{orgID}/arcgis/rest/admin/services/{serviceName}/MapServer/updateTiles".format(orgID = self.orgID, serviceName = self.fileName)
        data = {"extent": extent,"levels": levels,"token":self.token, 'f':'json'}
        jres = requests.post(url, data)
        return jres

    def groupSearch(self):
        #Grabs the IDS of all groups. Return 10 results. Change num in data for more. Need to add logic to specify the group we want.
        url = 'http://www.arcgis.com/sharing/rest/community/groups'
        data = {'f': 'json', 'token': self.token,'num': '10', 'q': "orgid:\""+ self.orgID + "\""}
        orgGroups = requests.post(url, data).json()['results']
        orgGroups = [(x['id'], x['title']) for x in orgGroups]
        return orgGroups

    def unshareItems(self):
        #Use this if the item needs to be unshared with groups. Use groupSearch above to grab the item IDs of all the groups.
        url = 'http://www.arcgis.com/sharing/rest/content/users/{username}/unshareItems'.format(username = self.username)
        data = {'f': 'json',
                'token': self.token,
                'items': self.itemID,
                'groups': 'None'} #Need to add group IDs, which are returned by groupSearch

    def shareItems(self, shareEveryone, shareOrg):
        """Share with the organization or with everyone."""
        url = 'http://www.arcgis.com/sharing/rest/content/users/{username}/shareItems'.format(username = self.username)
        data = {'f': 'json',
                'token': self.token,
                'items': self.itemID,
                'everyone': shareEveryone,
                'org': shareOrg}
        requests.post(url, data)

"""
if __name__ == "__main__":
    un = "username"
    pw = "password"
    tilePackage = r"path-to\SanDiego.tpk" #The name of the tile package, and service, will be the original name of the tile package.
    fileType = 'Tile Package'
    extent = "-13024496,5245452,-12082300,6139826,102100"
    levels = "0"
    shareWithEveryone = 'false' #Toggle true to share the item with everyone. Toggle false to unshare.
    shareWithOrg = 'true'  #Toggle true to share the item with the org. Toggle false to unshare.
    AGOinstance = AGOL(un, pw)
    AGOinstance.addItem(tilePackage, fileType)
    time.sleep(5)
    AGOinstance.publish()
    time.sleep(5)
    AGOinstance.editTiles()
    time.sleep(5)
    AGOinstance.updateTiles(extent, levels)
    AGOinstance.shareItems(shareWithEveryone, shareWithOrg) #Updates tile package.
    AGOinstance.itemID = AGOinstance.search(type = "Map Service", owner = un).json()['results'][0]['id'] #updates self.itemID to the itemID of the feature service that has the name self.fileName.
    AGOinstance.shareItems(shareWithEveryone, shareWithOrg)
"""
