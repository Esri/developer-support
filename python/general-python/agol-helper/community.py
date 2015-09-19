from agol import AGOL

class community(AGOL):
    """
    Community object that contains operations related to users and groups, \
    and inherits properties from the AGOL object.
    """

    def groupSearch(self):
        """
        The Group Search operation searches for groups in the portal:
        http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000m1000000
        """
        url = "http://{short}.maps.arcgis.com/sharing/rest/community/groups".format(short = self.short)
        print(url)
        data = {'token': self.token,
                'f': 'json',
                'num': 15,
                'q': 'orgid:{orgID}'.format(orgID = self.orgID)}
        jsonResponse = self.sendRequest(url, data)
        return jsonResponse

    def userSearch(self):
        """
        The User Search operation searches for users in the portal.
        http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/User_Search/02r3000000m6000000/
        """
        url = "http://{short}.maps.arcgis.com/sharing/rest/community/users".format(short = self.short)
        data = {'token': self.token,
                'f': 'json',
                'num': 15,
                'q': 'orgid:{orgID}'.format(orgID = self.orgID)}
        jsonResponse = self.sendRequest(url, data)
        return jsonResponse

    def communitySelf(self):
        """
        This resource allows discovery of the current authenticated user identified by the token.
        http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Self/02r300000079000000/
        """
        url = "http://{short}.maps.arcgis.com/sharing/rest/community/self".format(short = self.short)
        data = {'token': self.token,
                'f': 'json'}
        jsonResponse = self.sendRequest(url, data)
        return jsonResponse
