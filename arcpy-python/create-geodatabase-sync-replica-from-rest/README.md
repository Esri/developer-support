Create Sync Replica from REST
=========================

## Instructions

1. Open a command prompt
2. Call the script and pass in the argument "-h" to get help on syntax
3. To create a replica from  a single service and output it to your C:\Temp location, use the following syntax:

  ```
  python create-replica.py f http://someserver:6080/arcgis/rest/services/MyService/FeatureServer C:\Temp
  ```
  
4. To create a replica of every service with Sync enabled on your ArcGIS Server, use the following syntax:
  
  ```
  python create-replica.py s http://someserver:6080/arcgis/rest/services C:\Temp
  ```

5. The output is a sqlite .geodatabase file

## Requirements

[Requests API](http://docs.python-requests.org/en/latest/)

## Use Case

This script could be ran daily as a schedule task to create replicas of the most recent data to take out into the field and use within an ArcGIS Runtime offline application.
