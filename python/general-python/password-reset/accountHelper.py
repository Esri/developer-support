#-------------------------------------------------------------------------------
# Name:        Account Helper with user and role dictionaries
# Purpose:     Queries critical information from ArcGIS Online organization which
#              can be used in other scripts
#
# Author:      Kelly Gerrow kgerrow@esri.com
#
# Created:     09/11/2014
# Copyright:   (c) Kelly 2014
# Licence:     <your licence>
#-------------------------------------------------------------------------------

import requests
import json, time, datetime
import string, smtplib, os

class agolAdmin(object):
    #Initializes script reporting on needed values
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.__token, self.__ssl= self.__getToken(username, password)
        if self.__ssl == False:
            self.__pref='http://'
        else:
            self.__pref='https://'
        self.__urlKey, self.__id, self.__Name, self.__FullName, self.__Email, self.__maxUsers = self.__GetAccount()
        self.__portalUrl = self.__pref+self.__urlKey
        self.__userDict = self.__userDictMethod()
        self.__roleDict = self.__roleDictMethod()


    #assigns Variables to names
    @property
    def token(self):
        return self.__token

    @property
    def portalUrl(self):
        return self.__portalUrl

    @property
    def orgID(self):
        return self.__id

    @property
    def orgName(self):
        return self.__Name

    @property
    def fullName(self):
        return self.__FullName

    @property
    def adminEmail(self):
        return self.__Email

    @property
    def maxUser(self):
        return self.__maxUsers

    @property
    def userDict(self):
        return self.__userDict
    @property
    def roleDict(self):
        return self.__roleDict

#----------------------------------------------------Account Information -----------------------------------------------
    #generates token
    def __getToken(self,adminUser, pw):
        data = {'username': adminUser,
            'password': pw,
            'referer' : 'https://www.arcgis.com',
            'expiration': '432000',
            'f': 'json'}
        url  = 'https://arcgis.com/sharing/rest/generateToken'
        jres = requests.post(url, data=data, verify=False).json()
        return jres['token'],jres['ssl']

    #generates account information
    def __GetAccount(self):
        URL= self.__pref+'www.arcgis.com/sharing/rest/portals/self?f=json&token=' + self.token
        response = requests.get(URL, verify=False)
        jres = json.loads(response.text)
        return jres['urlKey'], jres['id'], jres['name'], jres['user']['fullName'], jres['user']['email'], jres['subscriptionInfo']['maxUsers']


    #creates dictionary of role names and corresponding IDs
    def __roleDictMethod(self):
        roleVal = {'administrator':'org_admin', 'publisher':'org_publisher', 'user': 'org_user'}
        start = 1
        number = 50
        while start != -1:
            roleUrl= self.__pref+'www.arcgis.com/sharing/rest/portals/self/roles?f=json&start='+str(start)+'&num='+str(number)+'&token=' + self.token
            response = requests.get(roleUrl, verify = False)
            jres = json.loads(response.text)
            for item in jres['roles']:
                roleVal[str(item['name'])] = str(item['id'])
            start =jres['nextStart']
        return roleVal

    #creates a dictionary of Usernames and related information
    def __userDictMethod(self):

        start = 1
        number = 200
        #retreive information of all users in organization
        userDict = []
        while start != -1:
            listURL ='{}.maps.arcgis.com/sharing/rest/portals/self/users'.format(self.portalUrl)
            request = listURL +"?start="+str(start)+"&num="+str(number)+"&f=json&token="+self.token
            response = requests.get(request, verify = False)
            jres = json.loads(response.text)
            for row in jres['users']:
                userDict.append(row)
            start =jres['nextStart']
        return userDict

    #updates username properties depending on the input

    def updateUser(self,userName,myEsri=None,fullName = None,description=None, firstName=None, lastName=None, access=None,tags=None,email=None, password=None):
        userURL ='https://{}.maps.arcgis.com/sharing/rest/community/users/{}/update'.format(self.__urlKey, userName)
        data = {'f':'json','token':self.token}
        if access:
            data['access'] = access
        if fullName :
            data['fullName']= fullName
        if fullName :
            data['firstName']= firstName
        if fullName :
            data['firstName']= firstName
        if description:
            data['description'] = description
        if myEsri:
            data['usertype'] = myEsri
        if tags:
            data['tags']= tags
        if email:
            data['email'] = email
        if password:
            data['password'] = password
        print data
        response = requests.post(userURL, data=data, verify=False).json()

     #Assign a name or ID for a user role
    def roleAssign(self,roleInput):

        for key,val in self.roleDict.iteritems():
         if key.lower() == roleInput.lower():
             return val
         if val.lower() == roleInput.lower():
            return key

    def myEsriAssign(self, myEsriInput):
        myEsriVal={'my esri': 'both', 'arcgis online':'arcgisonly'}
        for key,val in myEsriVal.iteritems():
         if key.lower() == myEsriInput.lower():
             return val
         if val.lower() == myEsriInput.lower():
            return key


