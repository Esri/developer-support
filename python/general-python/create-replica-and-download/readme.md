#Create Replica and Download Usage Notes
Create and download a file geodatabase replica from a feature service hosted on ArcGIS Online. To get this script running, change these four lines of code:
```python
username = "username"                                             #CHANGE
password = "password"                                             #CHANGE
downloads = r"location of downloads folder"                       #CHANGE
replicaURL = "feature service url/FeatureServer/createReplica"    #CHANGE
```
The script assumes the replica is created asynchronously. After the create replica request is submitted, the server is pinged every five seconds until the zipped file is fully populated, at which point the zipped file is downloaded.
##Additional Resources

Generate Token
http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000001w0000000

Create Replica
http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000rp000000

Programmatically accessing analysis services
https://developers.arcgis.com/rest/analysis/api-reference/programmatically-accessing-analysis-services.htm



 
