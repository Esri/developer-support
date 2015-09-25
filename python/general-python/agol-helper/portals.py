from agol import AGOL

class portals(AGOL):
    """
    Portal object that inherits properties from the AGOL object.
    """

    #portalSelf omitted as it exists in agol.AGOL.portalSelf.

    def portalSelfRoles(self):
        """
        Returns roles used in the organization.
        """
        url = "http://arcgis.com/sharing/rest/portals/self/roles"
        data = {'token': self.token,
                'f': 'json',
                'num': 15}
        jsonResponse = self.sendRequest(url, data)
        return jsonResponse
