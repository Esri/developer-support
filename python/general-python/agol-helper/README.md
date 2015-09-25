#Usage notes
This section aims to aid developers who are looking for REST API python code samples. For an existing API that uses python and the ArcGIS Online REST API, see ArcREST: https://github.com/esri/arcrest
##agol.py: ArcGIS Online (AGOL) Superclass
agol-helper includes the AGOL superclass that retrieves a token, the organization short url and organization ID. The methods used to grab these attributes are commonly used for any workflow.
```python
>>> me = AGOL("username", "password")
>>> me.token #Grabs the token.
>>> me.short #Grabs the organization short url.
>>> me.orgID #Grabs the organization ID.
```
##Subclass templates
The subclasses (i.e. community, geocodeService, portals) mimic the structure of the ArcGIS Online REST API help: http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r300000054000000

For example, community.py contains Group Search and User Search, which are resources accessed using the community root url. These resources are documented in *Managing your organization > Community* in the REST API help.

Group Search: http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Group_Search/02r3000000m1000000/

User Search: http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/User_Search/02r3000000m6000000/

The code samples should be easy to find, allowing developers to use these samples when creating their own workflows. Each method's documentation contains a link to the appropriate help page as well.

###community.py
community contains methods that use the community root url. The methods are related to users and groups. 
```python
>>> me = community("username", "password")
>>> test = me.groupSearch()
```
###geocodeService.py
geocodeService contains methods that use the Geocode Service.
```python
>>> me = geocodeService("username", "password")
>>> test = me.geocodeAddresses()
```
### portals.py
portals contains methods that use the portals root url.
```python
>>> me = portals("username", "password")
>>> test = me.portalSelfRoles()
```
These are incomplete templates. Please feel free to contribute.

This code is an amalgamation of samples provided by Technical Support Analysts and our end users.
