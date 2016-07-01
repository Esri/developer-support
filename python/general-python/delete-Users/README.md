Python Script deletes all users and their content in the organization by a specific role. (proof of concept)
=========================

## Instructions

1. This script relies on the requests and json modules as well as the provided accountHelperDelete module

2. Script requires that you change users role to a role named delete in order to be deleted (or modify the script)

3. This script is designed to be run through an IDE

4. Enter your ArcGIS Online Administrator username and password as the values for user and pw

WARNING! This will delete all of the users content, and groups, including content with delete protection enabled. This is not recommended for production environments as deleted data cannot be retrieved!


## Use Case

If removing users who created testing content, this can help to remove thier username quickly.

Any content deleted is permenantly deleted!

#Additions

You can download and the following item in ArcGIS Online to get the script with the needed requests library in order to access a ready to use script: https://www.arcgis.com/home/item.html?id=ff0e8a1b546d42eab1c4fc39b36019af