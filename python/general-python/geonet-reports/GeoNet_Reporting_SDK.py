#######################################################
# Title: GeoNet Report for 19 SDK places              #
# Description: Get all open discussion questions      #
# Author: Timothy H. w/Noah S.                        #
# Date: 12/30/2015                                    #
# Version: 1.0                                        #
# Python Version: 2.7                                 #
# Jive Rest API: v3                                   #
#######################################################

import json, base64, requests, time, string, smtplib 
import csv, operator, time

# currently tracking 19 topics in GeoNet (requires roughly 55 seconds to run)

placeCounter = 0
end = 19

placeIDs = [405096, 405293, 192440, 189179, 148899, 148903, 148901, 148934, 401235, 148938, 148913, 148916, 148920, 191827, 148918, 148930, 148926, 148841, 148881]
placeNames = ["AppStudio", "Survey123", "WAB", "Leaflet", "JavaScript", "Silverlight", "Flex", "ArcObjects", "ProSDK", "Python", "Android", "iOS", "Java", ".NET", "Qt", "WindowsMobile", "WPF", "AGOL", "Collector"]  


# placeID = 405096 #AppStudio
# placeID = 405293 #Survey123
# placeID = 192440 #Web AppBuilder
# placeID = 189179 #Esri Leaflet

# placeID = 148899 #JavaScript API
# placeID = 148903 #Silverlight API
# placeID = 148901 #Flex API

# placeID = 148934 #ArcObjects SDK
# placeID = 401235 #Pro SDK
# placeID = 148938 #Python

# placeID = 148913 #Android Runtime
# placeID = 148916 #iOS Runtime
# placeID = 148920 #Java Runtime
# placeID = 191827 #.NET Runtime
# placeID = 148918 #Qt Runtime
# placeID = 148930 #Windows Mobile
# placeID = 148926 #WPF Runtime

# placeID = 148841 #ArcGIS Online
# placeID = 148881 #Collector

# tags = "4.0beta"

start = 0                      #startIndex
maxReturn = 100                #Max number of content items to process at one time
totalContent = 7               #Number of content items in place
discussionCount = 0
unansweredCount = 0
contentType = "discussion"     #"document" #content filter
workspace = r"C:\Users\dump"   #folder to put files

one = 'Subject'
two = 'URL'
three = '# of Replies'
four = '\n'

tList = []
tList.append(u"{},{},{}".format(one, two, three, four))

nothing = 0 #it's nothing

startTime = time.time()

headers = { "Content-Type": "application/json"}

# Loop through and compile all invites
while (placeCounter < end):
    
    place = placeIDs[placeCounter]
    print "place: " + str(place)
    name = placeNames[placeCounter]
    print "name: " + str(name)

    
    # Group invites uri
    uri = "/api/core/v3/contents?count={}&startIndex={}&filter=type({})&filter=place(https://geonet.esri.com/api/core/v3/places/{})".format(maxReturn, start, contentType, place)
    base_url = "https://geonet.esri.com"
    url = base_url + uri
    print "url: " + str(url)

    # example URL for parsing JSON
    # https://geonet.esri.com/api/core/v3/contents?count=100&startIndex=0&filter=type(discussion)&filter=place(https://geonet.esri.com/api/core/v3/places/405096)
    

    try:
        # Create list of invite IDs
        req = requests.get(url, headers=headers) #this call throws the error message
        data = req.content

        # Remove security header
        data2 = data.replace("throw 'allowIllegalResourceCall is false.';", "")
        # Load json with request text
        jsonData = json.loads(data2)

        for dataItem in jsonData["list"]:
            if unansweredCount < 1:
 
                dUrl = dataItem["resources"]["html"]["ref"] #e.g. https://geonet.esri.com/thread/170189
                dId = dataItem["id"]                        #e.g. "id" : "170189"
                dSubject = dataItem["subject"]
                
                contentUri = "/api/core/v3/contents/{}".format(dId)  
                contentUrl = base_url + contentUri  #e.g. https://geonet.esri.com/api/core/v3/contents/170189

                contentReq = requests.get(contentUrl, headers=headers)
                contentData = req.content

                # Remove security header
                contentData2 = contentData.replace("throw 'allowIllegalResourceCall is false.';", "")
                # Load json with request text
                jsonData2 = json.loads(contentData2)
                
                for dataItem2 in jsonData2["list"]:
                    nothing += 1

                    try:
                        if dataItem2["question"] == True and dataItem2["resolved"] == "open" and dataItem2["replyCount"] < 10: 
                                tList.append(u"{},{},{}".format(dataItem2["subject"].replace(',', ''),dataItem2["resources"]["html"]["ref"],dataItem2["replyCount"]))

                                unansweredCount += 1
                  
                        else:
                                nothing += 2
                               
                    except:
                        nothing += 3
                        pass

        else:
            nothing += 4
            
    except requests.HTTPError, e:
        json.decoder.errmsg


    textBody = '\n'.join(tList)
    print "number of " + placeNames[placeCounter] + " threads: " + str(len(tList))
    name = time.strftime("%b") + "" + time.strftime("%d") + "_" + placeNames[placeCounter] + "_GeoNet"
    csvFile = open("{}\\{}.csv".format(workspace,name),"w")
    csvFile.write(textBody.encode('utf8'))
    csvFile.close()

    
    # sort the rows based on "# of Replies" - opens the csv, sorts it, and re-closes it
    # credit to: https://www.quora.com/What-is-the-best-way-to-sort-a-csv-file-in-python-with-multiple-columns-on-date
    
    ifile = open("{}\\{}.csv".format(workspace,name), 'rb')
    infile = csv.reader(ifile)
    # The first entry is the header line
    infields = infile.next()
    statindex = infields.index('# of Replies')
    # create the sorted list
    sortedlist = sorted(infile, key=operator.itemgetter(statindex), reverse=False)
    ifile.close
    # open the output file - it can be the same as the input file
    ofile = open("{}\\{}.csv".format(workspace,name), 'wb')
    outfile = csv.writer(ofile)
    # write the header
    outfile.writerow(infields)
    # write the sorted list
    for row in sortedlist:
      outfile.writerow(row)
    # processing finished, close the output file
    ofile.close()

    # increment counter to advance to the next topic
    placeCounter += 1
    
    # reset everything
    unansweredCount = 0
    tList = []
    textBody = ''
    jsonData = None
    jsonData2 = None
    contentReq = None
    contentData = None
    contentData2 = None

    # add headers back to tList array for csv files
    tList.append(u"{},{},{}".format(one, two, three, four))

finishTime = time.time()
totalTime = finishTime - startTime

print "Completed in {} seconds".format(totalTime)
print "Current date: "  + time.strftime("%B") + " " + time.strftime("%d") + ", " + time.strftime("%Y")
