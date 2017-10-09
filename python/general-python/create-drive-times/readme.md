# Create Drive Times Using the REST API

## Requirements
* Knowledge on the REST API
* Knowledge on Python
* An ArcGIS Online Organizational Account (Credits will be consumed with this script)
* Python version 2.7.8 (Untested on other versions)

## Use case
This would be useful if the user would like to automate drive time location using a point feature service in ArcGIS Online.  This automatically goes out and creates the drive time analyis without the need to visit ArcGIS Online.  This uses python standarad libraries.  No other downloads are required.  This also provides a good foundation for the creation of an ArcGIS Online class in the event that users would like to add on to it with their own methods and properties. **Important: Not all parameters have been incorporated in the creation of this method.  Some parameters may need to be added by the user.**

## Resources
* [Programmatically accessing analysis services](https://developers.arcgis.com/rest/analysis/api-reference/programmatically-accessing-analysis-services.htm)
* [Create Drive-Time Areas](https://developers.arcgis.com/rest/analysis/api-reference/create-drivetime.htm)
* [Get started with the Spatial Analysis service](https://developers.arcgis.com/rest/analysis/api-reference/getting-started.htm)
* [Service Credits Overview](http://www.esri.com/software/arcgis/arcgisonline/credits)

## Sample Usage

Input feature is a URL to a point feature service.  The where clause selects one object so as to save on credit consumption.  The output can be found in the users My Content folder.

```python
username = "thisIsAUserName"
password = "MyPassword!"
onlineAccount = ArcGISOnline(username, password)
jobResults = onlineAccount.CreateDriveTimes("URLTOPOINTFEATURESERVICE", "OBJECTID = 4", [5.0, 10.0, 15.0], "Minutes", "Split", "ThisIsAnOutput")
print "DONE"
```
