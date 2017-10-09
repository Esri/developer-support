# What is this?
This script is designed to generate a token login and then reach out
to a server service passing that token and retrieve
server items.
This script creates a server object and then sends the request for the
cache to the server and gets a JSON response.
This should work with vanilla installs of python version 2.7.x.
ArcPy is not required.

## What is required to run this script?
* ArcGIS Server
* ArcGIS Server credentials
* A map service or image service that has tiles that need to be created (Not dynamic creation of tiles)
* (optional) A GMail account to email the server status

## Sample syntax
```python
sv = serverPython('ServerUsername', 'ServerPassword', 'ServerRestURL', 'ServerTokenURL')
for i in sv.getStatus("ServiceName", "ServiceType"):
    print "Scale level of cache: " + str(i['levelID']) + "  Percent Complete: " + str(i['percent'])
```
## What kind of arguments can be passed to the server type:
MapServer and ImageServer
## Use Case
Users want to get updates emailed to them on the status of their cache without opening the server manager.  They would like to do this from any machine and just run a quick script or schedule the script to run at an interval to see if the cache status has hung or has completed.
