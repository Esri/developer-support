from agol import AGOL

class geocodeService(AGOL):
    """Geocode Service object, that inherits properties from the AGOL object."""

    def geocodeAddresses(self):
        """
        The geocodeAddresses operation is performed on a Geocode Service resource. \
        The result of this operation is a resource representing the list of geocoded addresses. \
        This resource provides information about the addresses including the address, location, score, and other geocode service-specific attributes.
        http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000s6000000
        """
        url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses"
        data = {'token': self.token,
                'f': 'json',
                'sourceCountry': 'US',
                'addresses': {'records':
                    [{'attributes': {'OBJECTID': 1,
                                     'SingleLine': '380 New York St., Redlands, CA, 92373'}},
                     {'attributes': {'OBJECTID': 2,
                                     'SingleLine': '1 World Way, Los Angeles, CA, 90045'}}]}}
        jsonResponse = self.sendRequest(url, data)
        return jsonResponse


