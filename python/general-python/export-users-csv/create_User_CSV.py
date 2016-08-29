#-------------------------------------------------------------------------------
# Name:         Create CSV with user information
# Purpose:      Creates a CSV with pertinent account information about the users
#               in the organization

# Author:      Kelly Gerrow
#
# Created:     11/11/2014
# Copyright:   (c) kell6873 2014
# Licence:     <your licence>
#-------------------------------------------------------------------------------

import requests, json
import accountHelper

def readLine(openedfile):
    #Reads file and splits contents by comma

        line = openedfile.readline()
        line = line.strip()
        splitstring = line.split(",")
        return splitstring

def createUserList():
    userList = []
    allvals = ['username','fullName', 'tags', 'email', 'userType', 'role', 'disabled']
    for row in t.userDict:
       userLst = []
       #Appends variables into user list, and adds user list to list of user list
       for val in allvals:
            userLst.append(row[val])
       userList.append(userLst)
    return userList


def writeCSV(f, userlist):
    #updates list to record which emails have been sent to the users and writes information to user.
    for user in userlist:
        for i,j in enumerate(user):
            if user[i]:
                user[i] = user[i]
            else:
                user[i] = 'none'
        try:

            line = "{}, {}, {}, {}, {}, {}, {}\n".format(user[0],user[1],user[2][0],user[3],user[4],user[5],user[6])
            print (line)
            f.write(line)
        except:
            pass


if __name__ == '__main__':
    #username is case sensitive
    user = 'username'
    pw  = 'password'


    #calls organization info
    t = accountHelper.agolAdmin(user, pw)

        #create user List
    userList = createUserList()
    fileLoc =raw_input("Where would you like your CSV to be written to? ex. c:\manageAgol\user.csv ")
    userFile=open(fileLoc, "w")
    header="Username,Full Name, Tags,Email,Type, Role,Disabled\n"
    userFile.write(header)

#Performs analysis on userlist to prepare for writing to CSV file
    for user in userList:
            user[5]= t.roleAssign(user[5])
            user[4] = t.myEsriAssign(user[4])

        #Writes the updated list to the CSV File
    writeCSV(userFile,userList)
    userFile.close()
