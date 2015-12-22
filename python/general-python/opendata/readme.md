#Open Data Object
This sample script currently contains an example workflow to refresh the datasets and cache for all datasets in an Open Data site.

##Usage Notes
Requests module is needed: http://docs.python-requests.org/en/latest/

Open Data site needs to be public.

Input username, password, and Open Data site number when initializing the Open Data object.

```python
if __name__ == "__main__":
    """Example workflow that refreshes all datasets in an Open Data site."""
    test = OpenData("username", "password", "0000")
    test.refresh()
```

##Parameters
- username : Username used to log into an ArcGIS Online Organization.
- password : Password used to log into an ArcGIS Online Organization.
- OpenDataSite: Open Data Site Number
-- i.e. 0000 is the site number for https://opendata.arcgis.com/admin/#/sites/0000/datasets
-- The above url may be grabbed when managing an Open Data site.

##Properties
- token : used to authenticate
- OpenDataItems: List of all items in the Open Data site

## Warnings
- SSL Cert Verification not verified. See: http://docs.python-requests.org/en/latest/user/advanced/#ssl-cert-verification
- Open Data API is not documented and therefore the endpoints may change at any point : http://ideas.arcgis.com/ideaView?id=087E0000000blPIIAY
- This script may cause a temporary spike in requests if using ArcGIS for Server. When submitting a cache request, Open Data requests all data from the service 1000 items at a time. This means that there will be multiple requests in a short period of time. This may cause the script to fail as the server is overloaded or if just one service times out. In contrast, layers hosted on ArcGIS Online may not see this issue as the servers will automatically scale to handle the spike in requests.
- Not supported by Esri Support Services.
