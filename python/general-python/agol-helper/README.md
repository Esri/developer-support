Hello!

This is an experimental section. I am not formally trained, just a hobbyist, so I apologize if the structure seems a bit strange.  Here is the gist:

agol.py includes a superclass, AGOL. The AGOL object consumes the username and password used to login to your ArcGIS Online Organization. The output is a token, short url, and organization ID. These three items are commonly used in many REST API scripting tasks.

Example REST API scripting tasks are also included. These subclasses are AGOL objects, and inherit the token, short url, and organization ID. An example:
```python
>>> import geocodeService
>>> me = geocodeService(“username”, “password”)
>>> me.geocodeAddresses() #Geocodes addresses
```
Please note that geocoding consumes credits: http://www.esri.com/software/arcgis/arcgisonline/credits

Thank you to all my fellow analysts who helped me put this together!

There may be more samples added here: https://gist.github.com/AshleyDesktop

- Ash
