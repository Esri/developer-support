agol-helper includes a superclass, AGOL, which contains commonly used methods and properties. Currently it accesses a token, the organization short url and organization ID, which are used in many REST API scripting tasks.
```python
>>> me = AGOL("username", "password")
>>> me.token #Grabs the token.
>>> me.short #Grabs the organization short url.
>>> me.orgID #Grabs the organization ID.
```
Subclasses are also included.
- community: community object that contains operations related to users and groups, and inherits properties from the AGOL object. This may be used to search for groups and users. 
```python
>>> me = community("username", "password")
>>> test = me.groupSearch()
```
- geocodeService: geocode service object, that inherits properties from the AGOL object. This may be used to geocode addresses.
```python
>>> me = geocodeService("username", "password")
>>> test = me.geocodeAddresses()
```
- portals: portal object that inherits properties from the AGOL object. This may be used to look up the roles used in the organization.
```python
>>> me = portals("username", "password")
>>> test = me.portalSelfRoles()
```
These are incomplete templates. The templates may be used to look up how to structure a request using python, for developers who are creating their own API and need a short code sample. Custom functions may be added to a template to aid a workflow.  

This code is an amalgamation of samples provided by Technical Support Analysts and our end users.

For an existing API that uses python and the ArcGIS Online REST API, see ArcREST: https://github.com/esri/arcrest
