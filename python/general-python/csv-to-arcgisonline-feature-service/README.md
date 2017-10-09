Python Script to publish a feature service in ArcGIS Online from CSV (proof of concept)
=========================

## Instructions

1. This script relies on the "Requests" python module, see [Requests API](http://docs.python-requests.org/en/latest/)
2. This script is designed to be run through the command prompt window or unix terminal

## Windows Command Prompt
```
csv-to-arcgisonline-feature-service.py
```

## Terminal
```
python csv-to-arcgisonline-feature-service.py
```


## Use Case

This script is useful for someone who is not familiar with python but would like to run geoprocessing scripts as a scheduled task. Calling a model from a python script is much more reliable than exporting a model to a python script for a few reasons:

1. Takes a CSV file with latitude and longitude values and creates a feature service

2. Feature services are a powerful way to share GIS data online
