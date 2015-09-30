import urllib, urllib2, json

class AGOL(object):
    """
    Superclass that includes most commonly used methods.
    """

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.token = self.generateToken()

        self.info = self.portalSelf()
        self.short = self.info['urlKey']
        self.orgID = self.info['id']

    def sendRequest(self, url, data):
        request = urllib2.Request(url, urllib.urlencode(data))
        response = urllib2.urlopen(request)
        jsonResponse = json.loads(response.read())
        return jsonResponse

    def generateToken(self):
        """
        Generate Token generates an access token in exchange for \
        user credentials that can be used by clients when working with the ArcGIS Portal API:
        http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000m5000000
        """
        url = "https://arcgis.com/sharing/rest/generateToken"
        data = {'username': self.username,
                'password': self.password,
                'referer': "https://www.arcgis.com",
                'f': 'json'}
        jsonResponse = self.sendRequest(url, data)
        return jsonResponse['token']

    def portalSelf(self):
        """
        The Portal Self resource is used to return the view of the portal as seen by the current user. \
        It is used here to grab the url key and the organization id:
        http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000001m7000000
        """
        url = "http://arcgis.com/sharing/rest/portals/self"
        data = {'token': self.token,
                'f': 'json'}
        jsonResponse = self.sendRequest(url, data)
        return jsonResponse
