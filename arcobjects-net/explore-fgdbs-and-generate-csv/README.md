# Usage:

This program is a console application that uses ArcObjects. It can be called from the command line in two ways **(Note: Either the -p or the -r option MUST be specified)**:

### 1.) Specifying a folder that contains File GeoDatabases:

    .\FGDB-Crawler-CSVGen.exe -r C:\directorythatcontainsfgdbs outputFile.csv

If the '-r' option is specified, program will take a folder 'directorythatcontainsfgdbs' that contains file geodatabases (\*.gdbs) and generates a CSV file 'outputFile.csv' that contains information about various data contained in the file geodatabases. Non-file-geodatabase (files without a .gdb file extension) will be skipped.

### 2.) Specifying a path to a specific File GeoDatabase:

    .\FGDB-Crawler-CSVGen.exe -p C:\filegeodatabase.gdb outputFile.csv

If the '-p' option is specified, the program will take 'filegeodatabase.gdb' and generate a CSV file 'outputFile.csv' that contains information about that specific file geodatabase.

# About the .csv output:

Regardless of whether or not the '.csv' is ommitted from the output file (third argument) when the program is called from the command line, the output that is generated will have the '.csv' file extension.

The output CSV file contains information such as:
* The paths of the .gdb folders found
* What is contained in the .gdb folder (and their subsets/children)
* What types are they (File Geodatabase Feature Class, File Geodatabase Topology etc.), and where they are located in the .gdb folder
* If possible to retrieve, what are the creation times, last accessed times, dates modified, and file sizes
