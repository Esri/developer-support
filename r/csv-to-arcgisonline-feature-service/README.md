R Script to publish a feature service in ArcGIS Online from CSV (proof of concept)
=========================

## Instructions

In order to run R from Windows Command Prompt you need to use Rscript, that comes with the installation of R. 

## Windows Command Prompt
```
>"C:\Program Files\R\R-3.1.2\bin\i386\Rscript.exe" Upload-csv-to-arcGis-with-R.R <username> <password> <ItemName> <CSV_File> <latitude_field_name> <longitude_field_name> <Tag>
```


## Example:
```
>"C:\Program Files\R\R-3.1.2\bin\i386\Rscript.exe" Upload-csv-to-arcGis-with-R.R aruizga ***password*** ItemName C:/data.csv latitude longitude MyTag
```


## Use Case

This script is useful for someone who is not familiar with R but would like to run geoprocessing scripts as a scheduled task. Calling a model from a R script is much more reliable than exporting a model to a R script for a few reasons:

1. Takes a CSV file with latitude and longitude values and creates a feature service

2. Feature services are a powerful way to share GIS data online
