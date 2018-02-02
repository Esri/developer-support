# Usage:

.\FGDB-Crawler-CSVGen.exe targetPath outputFile.csv

This program will take a folder 'targetPath' that contains file geodatabases (\*.gdbs) and generates a CSV file 'outputFile.csv' that contains information about various data contained in the file geodatabases. Non-file-geodatabase (files without a .gdb file extension) will be skipped.

The output CSV file contains information such as:
* The paths of the .gdb folders found
* What is contained in the .gdb folder (and their subsets/children)
* What types are they (File Geodatabase Feature Class, File Geodatabase Topology etc.), and where they are located in the .gdb folder
* If possible to retrieve, what are the creation times, last accessed times, dates modified, and file sizes
