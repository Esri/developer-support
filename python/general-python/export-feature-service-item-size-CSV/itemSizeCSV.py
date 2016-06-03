#-------------------------------------------------------------------------------
# Name:        Exports Item Size
# Purpose:     This Script Exports the item size of all hosted feature services
#              in an organization, including date modified and owner name to a CSV
#
# Author:       Kelly Gerrow kgerrow@esri.com
#
# Created:     23/12/2015
# Copyright:   (c) kell6873 2015
# Licence:     <your licence>
#-------------------------------------------------------------------------------

def writeCSV(f, itemlist):
    #updates list to record which emails have been sent to the users
    for user in itemlist:
        #print user
        for item in user:
               modtime =(datetime.date.fromtimestamp(item[3]/1000))


               line = "{}, {}, {},{}\n".format(item[0],item[1].encode('utf-8'),item[2],str(modtime))
               print (line)
               f.write(line)
##               except:
##                pass

import requests, json, ItemCounterHelper, datetime

#Username is case sensitive
user = 'enterUsername'
pw  = 'EnterPassword'

    #Generates Token
t= ItemCounterHelper.agolAdmin(user,pw)

fileLoc = raw_input("Where would you like your CSV to be written to? ex. c:\manageAgol\user.csv ")
itemFile=open(fileLoc, "w")
header="Username,Service Name, Size, date modified\n"
itemFile.write(header)
HFSList=[]


#user list
for user in t.userDict:
    userList = t.countFeatures(user['username'])[1]
    if len(userList)>3:
        HFSList.append(t.countFeatures(user['username'])[1])

writeCSV(itemFile,HFSList)
itemFile.close()