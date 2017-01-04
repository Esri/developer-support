#-------------------------------------------------------------------------------
# Name:        Item Count helper
# Purpose:     Contains functions that query pertinent information in the organization
#              Which can be used in other scripts.
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

    def allItems(self, userName):
        '''returns a list of all dictionaries of all items in a user's content including their subfolders'''

        allItems = []

        itemURL ='{}.maps.arcgis.com/sharing/rest/content/users/{}'.format(self.portalUrl, userName)
        request = itemURL +"?f=json&token="+self.token
        response = requests.get(request, verify=False).json()

        for item in response['items']:
            allItems.append(item)

        for folder in response['folders']:
            itemURL = '{}.maps.arcgis.com/sharing/rest/content/users/{}/{}?f=json&token={}'.format(self.portalUrl, userName, folder['id'], self.token)
            response = requests.get(itemURL, verify=False).json()
            for item in response['items']:
                allItems.append(item)

        return allItems


    def countFeatures(self, userName):
       '''returns the number of hosted feature services and total size in MB of hosted feature services in a user's content.
       requires a list of dictionaries as the input, this can be aquired from the allItems function.'''
       allItems=self.allItems(userName)


       hfsList=[]

       num = 0
       HFS = 0

       for item in allItems:
             if item['type'] == 'Feature Service':
               for x in item['typeKeywords']:
                  if x=='Hosted Service':
                       num +=1
                       HFS += (item['size'] * .000001)
                       hfsList.append([userName,item['title'],item['size']* .000001, item['modified']])

       return HFS, hfsList


