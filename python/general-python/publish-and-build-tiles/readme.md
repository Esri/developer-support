# Usage notes
- This script uses the REST API to add a tile package as an item and publish that tile package.
- We are also able to find an existing hosted tile package and publish that package.
- Finally, we are able to update sharing. We can share/unshare with everyone and with the org.
- If testing if __name__ == "main" be sure to input the username, password, extent, levels, file name, file type, and who to share with.
- If testing, we upload the .tpk from disk, publish, and then share to the organization. The script was tested against a tile package created from the ArcTutor Network Analyst San Diego streets network.
- Please note that storing services consumes credits.
- Always test modestly. For example, to ensure tiles are created, test with the top level (0) first, instead of all levels.

# Required modules and data
- The requets module is needed.
   Get it here: http://www.lfd.uci.edu/~gohlke/pythonlibs/#requests
   Or here: http://docs.python-requests.org/en/latest/user/install/
- A tile package.
   How to create a tile package:
   http://desktop.arcgis.com/en/desktop/latest/map/working-with-arcmap/how-to-create-a-tile-package.htm

# Example workflow
```python
# Instantiate the object
>>> test = AGOL(username, password)

# Scenario 1: If uploading a .tpk:
>>> test.addItem("path-and-name-of-tile-package.tpk", "Tile Package")
# Scenario 2: Otherwise, to search for a hosted .tpk.
>>> test.itemID = test.search(type = "Tile Package", owner = username).json()['results'][0]['id']

# For both scenarios
>>> test.publish()
>>> test.editTiles()
>>> test.updateTiles("-13024496,5245452,-12082300,6139826,102100", "0")
>>> test.shareItems("true", "true")
>>> test.itemID = test.search(type = "Map Service", owner = username).json()['results'][0]['id']
>>> test.shareItems("true", "true")
```

# What this script needs
- A bit more logic is needed if you want to share with a specific group. You would add that logic to groupSearch and unshareItems.
