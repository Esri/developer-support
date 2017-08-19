# Downloading Feature Layer Attachments via the ArcGIS API for Python
## [Copied from GeoNet](https://geonet.esri.com/docs/DOC-10441-downloading-feature-layer-attachments)

I have commonly encountered questions regarding the downloading of attachments (e.g. pictures and documents) from ArcGIS Online Feature Layers. The aim of this is to provide an alternative solution to what's currently on offer.
 
Firstly, the only way attachments are included when exporting data via ArcGIS Online is when exporting as a File Geodatabase. The reason for this is the File Geodatabase is the only format that supports related records. Therefore, the most common answer to accessing Feature Layer attachments outside of ArcGIS Online is to export the Feature Layer as a File Geodatabase, and extrude the data using a script [like this](https://support.esri.com/en/technical-article/000011912) through ArcGIS Desktop. There is also a [sync script](https://gist.github.com/oevans/6992139) available which can sync a local File Geodatabase with a hosted Feature Layer. These work well, but they do rely on ArcGIS Desktop, and in the case of option one, also require you to download the File Geodatabase (which can grow in size as you add data to it) in advance of running the script.
 
For this reason, I created a script using the new [ArcGIS API for Python](https://developers.arcgis.com/python/) which works independently from ArcGIS Desktop. In fact it works directly with a Web GIS, so you don't even have to download a File Geodatabase in order to access your attachments. It can be re-run on a regular basis, and only downloads new attachments to disk if they have not been previously downloaded.

### So what does this script do?

1. Creates a folder in which feature attachments are stored (e.g. Attachment Downloads)
1. Within this folder creates a sub-folder for each layer in the specified Feature Layer
	1. If the AttachmentStorage variable is set to 'GroupedFolder', attachments are stored in the format ObjectId-AttachmentId-OriginalFileName in one single folder
	1. If the AttachmentStorage variable is set to 'IndividualFolder', a new folder is created for every feature with an attachment (named using the features Object ID), while the attachments are stored within in the format AttachmentId-OriginalFileName
1. If the attachment already exists on disk it will not be downloaded again
1. Summary of downloads (total number of downloads and total attachments size) provided as final console output

### How do you get setup?

1. Follow the ArcGIS API for Python [Install and set up](https://developers.arcgis.com/python/guide/install-and-set-up/) guide
	1. If using Anaconda, you can use the .yml file to create appropriate environment
1. If using Startup.bat file, edit (in a text editor) to reference appropriate folders
1. Once you get a Jupyter Notebook open, paste the attached .zip file below in an accessible location (and unzip it)
1. Open the DownloadAttachments.ipynb file via Jupyter Notebooks and run (click into code and press Crtl+Enter)
1. The script will run on a the specified public Feature Layer and download the attachments to the specified Downloads folder
1. An associated log file is created in the Logging folder every time you run the script

### Notes:

* Update the FeatureLayerId variable to run on your own Feature Layer
* Specify your PortalUserName, PortalPassword if the Feature Layer is secured
* The names of folders are filtered to show only 0-9 and a-Z characters
* This script has not been tested against ArcGIS Enterprise (only Feature Layers hosted in ArcGIS Online), but it should still work