# What is this?
This script is designed to query an ArcGIS Server rest endpoint and generate a list of all 
map and feature services that can be accessed anonymously.
This script creates an item in Portal for ArcGIS for each service in the list. The services are added under the
content folder of the username specified in the variables at the beginning of the script.
This should work with vanilla installs of python version 2.7.x.
ArcPy is not required.

## What is required to run this script?
* ArcGIS Server
* Portal for ArcGIS
* Portal for ArcGIS credentials

## Use Case
User has a clean install of Portal environment and does not want to federate with ArcGIS Server.
This script can be run to add all map and feature services from Server to Portal without federating.
