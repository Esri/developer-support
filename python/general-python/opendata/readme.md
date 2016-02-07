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

##Warnings
- SSL Cert Verification not verified. See: http://docs.python-requests.org/en/latest/user/advanced/#ssl-cert-verification
- Open Data API is not documented and therefore the endpoints may change at any point : http://ideas.arcgis.com/ideaView?id=087E0000000blPIIAY
- This script may cause a temporary increase in traffic on your server if data is hosted on ArcGIS for Server, as multiple requests will/may be sent to each service to cache the data.
- Not supported by Esri Support Services.

##Ideas for Future Developments
- Extend script to reset a single dataset or a subset that is constrained and monitored.
- Add a script or function that verifies downloads and only resets downloads that are failing.