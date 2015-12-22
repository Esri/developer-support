#Open Data Object
This sample script currently contains an example workflow to refresh the datasets and cache for all datasets in an Open Data site.
##Usage Notes
Requests module is needed: http://docs.python-requests.org/en/latest/

Input username, password, and Open Data site number when initializing the Open Data object.

```python
if __name__ == "__main__":
    """Example workflow that refreshes all datasets in an Open Data site. This will not work for datasets that have errors in Open Data."""
    test = OpenData("username", "password", "0000")
    test.refresh()
```

##Parameters
- username : Username used to log into an ArcGIS Online Organization.
- password : Password used to log into an ArcGIS Online Organization.
- OpenDataSite: Open Data Site Number
-- i.e. 0001 is the site number for https://opendata.arcgis.com/admin/#/sites/0000/datasets
-- The above url may be grabbed when managing an Open Data site.

##Properties
- token : used to authenticate
- OpenDataItems: List of all items in the Open Data site
