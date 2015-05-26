#-------------------------------------------------------------------------------
# Name:    Create Replica from REST
# Purpose: Create a sqlite replica from the rest endpoint of a feature service
#          Note that this is a command line tool, and sample syntax is provided.
#
# Author: Lucas Danzinger
#
# Created: 16/12/2013
#
# Requirements: Python 2.7 and the Requests API -
#               http://requests.readthedocs.org/en/latest/user/install/#install
#-------------------------------------------------------------------------------

import requests
import os
import argparse

def getReplica(ServiceURL, outputLocation):
    # Make the initial GET request
    r = requests.get(ServiceURL + "?f=pjson")
    # Get the service name
    name = ServiceURL.split("/")[-2]
    # Get the lyr IDs
    lyrList = []
    for lyr in r.json()["layers"]:
        lyrList.append(str(lyr["id"]))
    layers = ",".join(lyrList)
    # Get the Spatial Reference
    try:
        sr = r.json()["spatialReference"]["wkid"]
    except:
        sr = r.json()["spatialReference"]["wkt"]
    # Get the Geometry
    xmin = r.json()["fullExtent"]["xmin"]
    ymin = r.json()["fullExtent"]["ymin"]
    xmax = r.json()["fullExtent"]["xmax"]
    ymax = r.json()["fullExtent"]["ymax"]
    # Get the Sync Model
    if r.json()["syncCapabilities"]["supportsPerLayerSync"]:
        syncModel = "perLayer"
    else:
        syncModel = "perReplica"
    # Create the Geometry String to pass into the parameters
    geomString = "{},{},{},{}".format(str(xmin), str(ymin), str(xmax), str(ymax))
    # Set up the http parameters for Server (there are some case/naming differences...)
    try:
        syncParams = {"geometry": geomString,
                    "geometryType": "esriGeometryEnvelope",
                    "inSR": sr,
                    "layerQueries": {""},
                    "layers": str(layers),
                    "replicaName": "fctest",
                    "returnAttachments": False,
                    "returnAttachmentsDataByUrl": True,
                    "transportType": "esriTransportTypeURL",
                    "async": False,
                    "syncModel": syncModel,
                    "dataFormat": "sqlite",
                    "replicaOptions": "",
                    "f": "pjson"
                    }
        # Post the request for the .geodatabase
        r = requests.post("{}/createReplica".format(ServiceURL), params=syncParams)
        # Retrieve the output .geodatabase location and write to disk
        geodatabaseURL = r.json()["URL"]
    # Set up the http parameters for AGOL (there are some case/naming differences...)
    except:
        syncParams = {"geometry": geomString,
                    "geometryType": "esriGeometryEnvelope",
                    "inSR": sr,
                    "layerQueries": {""},
                    "layers": str(layers),
                    "replicaName": "fctest",
                    "returnAttachments": False,
                    "returnAttachmentsDataByUrl": True,
                    "transportType": "esriTransportTypeUrl",
                    "async": False,
                    "syncModel": syncModel,
                    "dataFormat": "sqlite",
                    "replicaOptions": "",
                    "f": "pjson"
                    }
        # Post the request for the .geodatabase
        r = requests.post("{}/createReplica".format(ServiceURL), params=syncParams)
        # Retrieve the output .geodatabase location and write to disk
        geodatabaseURL = r.json()["responseUrl"]
    outGDB = os.path.join(outputLocation, "{}.geodatabase".format(name))
    if os.path.exists(outGDB):
        os.remove(outGDB)
    with open(outGDB, 'wb') as handle:
        request = requests.get(geodatabaseURL, stream=True)
        for block in request.iter_content(1024):
            if not block:
                break
            handle.write(block)

if __name__ == '__main__':
    """ Usage:
    This is a command line tool with the following arguments:

    positional arguments:
      Option        use f for feature service URL, and s for service directory
      URL           if f, enter <feature service URL>; if s enter <services URL>
      OutputFolder  Enter the output location to store the sqlite .geodatabase
                    file

    optional arguments:
      -h, --help    show this help message and exit

    example:
    <create-replica.py s http://someserver:6080/arcgis/rest/services C:\Temp>
    """

    parser = argparse.ArgumentParser()
    parser.add_argument("Option", help="use f for feature service URL, and s "
                        "for service directory")
    parser.add_argument("URL", help="if f, enter <feature service URL>; if s "
                        " enter <services URL>")
    parser.add_argument("--OutputFolder", help="Enter the output location to "
                        "store the sqlite .geodatabase file")
    args = parser.parse_args()
    ServiceURL = args.URL
    outputFolder = args.OutputFolder
    Option = args.Option

    if Option is "f":
        try:
            if outputFolder is None:
                basePath = r"\\someserver\data"
                folderExists = 0
                for fsdir in os.listdir(basePath):
                    if fsdir == ServiceURL.split("/")[-2] + "_FeatureServer":
                        outputFolder = os.path.join(basePath, fsdir)
                        folderExists += 1
                if folderExists == 0:
                    outputFolder = os.path.join(basePath, ServiceURL.split("/")[-2] + "_FeatureServer")
                    os.makedirs(outputFolder)
            getReplica(ServiceURL, outputFolder)
            print "successfully generated replica for {}".format(ServiceURL)
        except Exception as E:
            print "could NOT generate replica for {}".format(ServiceURL)
            print E
    elif Option is "s":
        r = requests.get(ServiceURL + "?f=pjson")
        for service in r.json()["services"]:
            if service["type"] == "FeatureServer":
                folderExists = 0
                fsURL = "{}/{}/{}".format(ServiceURL, service["name"], service["type"])
                r_fsURL = requests.get(fsURL + "?f=pjson")
                if outputFolder is None:
                    basePath = r"\\someserver\data"
                    for fsdir in os.listdir(basePath):
                        if fsdir == service["name"] + "_FeatureServer":
                            newOutputFolder = os.path.join(basePath, fsdir)
                            folderExists += 1
                    if folderExists == 0:
                        newOutputFolder = os.path.join(basePath, service["name"] + "_FeatureServer")
                        os.makedirs(newOutputFolder)
                    try:
                        if r_fsURL.json()["syncEnabled"]:
                            getReplica(fsURL, newOutputFolder)
                            print "successfully generated replica for {}".format(service["name"])
                    except Exception as E:
                        print "could NOT generate replica for {}".format(fsURL)
                        print E
                else:
                    try:
                        if r_fsURL.json()["syncEnabled"]:
                            getReplica(fsURL, outputFolder)
                            print "successfully generated replica for {}".format(service["name"])
                    except Exception as E:
                        print "could NOT generate replica for {}".format(fsURL)
                        print E
