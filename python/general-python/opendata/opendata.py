"""

Warning: SSL Cert Verification not verified. See: http://docs.python-requests.org/en/latest/user/advanced/#ssl-cert-verification

Warning: Open Data API is not documented and therefore the endpoints may change at any point : http://ideas.arcgis.com/ideaView?id=087E0000000blPIIAY

Not supported by Esri Support Services.

Requests module is needed, download it here: http://docs.python-requests.org/en/latest/

"""
print(__doc__)

import requests

class OpenData(object):

    """
    Example Open Data object. Open Data site needs to be public.
    username : Username used to log into an ArcGIS Online Organization.
    password : Password used to log into an ArcGIS Online Organization.
    OpenDataSite: Open Data Site Number (i.e. 0001).
    """

    def __init__(self, username, password, OpenDataSite):
        
        self.username = username
        self.password = password
        self.token = self.generateToken()

        self.OpenDataSite = OpenDataSite
        self.OpenDataItems = self.findAllOpenDataItems()

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
        return requests.post(url, data, verify=False).json()['token']

    def findAllOpenDataItems(self):
        """
        Finds and returns all item IDs in an Open Data site. \
        Will receive error if the Open Data site is not public.
        """
        url = "https://opendata.arcgis.com/api/sites/{0}/datasets.json?token={1}".format(self.OpenDataSite, self.token)
        info = requests.get(url, verify=False).json()['datasets']
        return [x['id'] for x in info]

    def refresh(self):
        """
        Refreshes all Open Data datasets and download cache.
        """
        for dataset in self.OpenDataItems:
            url = "https://opendata.arcgis.com/api/datasets/{0}/refresh.json?token={1}".format(dataset, self.token)
            requests.put(url, verify=False)

if __name__ == "__main__":
    """Example workflow that refreshes all datasets in an Open Data site."""
    test = OpenData("username", "password", "0000")
    test.refresh()
