#Create Replica and Download Usage Notes
Create and download a file geodatabase replica from a feature service hosted on ArcGIS Online. To get this script running, change these lines of code:
```python
username = "username"                                             #CHANGE
password = "password"                                             #CHANGE
replicaURL = "feature service url/FeatureServer/createReplica"    #CHANGE
replicaLayers = [0]                                               #CHANGE
replicaName = "replicaTest"                                       #CHANGE
```
The script assumes the replica is created asynchronously. After the create replica request is submitted, the server is pinged every five seconds until the zipped file is fully populated, at which point the zipped file is downloaded in the Downloads folder.
##Additional Resources

Generate Token
http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000001w0000000

Create Replica
http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000rp000000

Programmatically accessing analysis services
https://developers.arcgis.com/rest/analysis/api-reference/programmatically-accessing-analysis-services.htm



 
