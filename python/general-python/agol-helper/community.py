from agol import AGOL

class community(AGOL):
    """Community object, that inherits properties from the AGOL object."""

    def groupSearch(self):
        """The Group Search operation searches for groups in the portal:
        http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000m1000000"""
        url = "http://{short}.maps.arcgis.com/sharing/rest/community/groups".format(short = self.short)
        data = {'token': self.token,
                'f': 'json',
                'q': 'orgid:{orgID}'.format(orgID = self.orgID)}
        jsonResponse = self.sendRequest(url, data)
        results = jsonResponse['results']
        orgGroups = [(x['id'], x['title']) for x in results]
        return orgGroups

    def userSearch(self):
        """The User Search operation searches for users in the portal.
        http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/User_Search/02r3000000m6000000/"""
        url = "http://{short}.maps.arcgis.com/sharing/rest/community/users".format(short = self.short)
        data = {'token': self.token,
                'f': 'json',
                'q': 'orgid:{orgID}'.format(orgID = self.orgID)}
        jsonResponse = self.sendRequest(url, data)
        results = jsonResponse['results']
        users = [x['username'] for x in results]
        return users