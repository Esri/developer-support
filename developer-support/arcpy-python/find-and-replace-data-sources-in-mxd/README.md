Find and Replace Data Sources in an MXD (batch)
=========================

## Instructions

1. Set the input MXD directory, as well as the oldPath and newPath variables
2. Run the script
3. All MXDs in the input directory that contain data layers with the oldPath will be replaced and saved with the newPath


## Use Case

Updating or changing a server name can cause all paths in a map document to break. This script could be used to fix these types of issues for all MXDs in an input directory. The section inside of os.walk() could be used to point to a single MXD instead of an entire directory.
