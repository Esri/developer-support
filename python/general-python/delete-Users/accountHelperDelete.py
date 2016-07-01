#-------------------------------------------------------------------------------
# Name:        AGOL Admin
# Purpose:     Admin AGOL
#
# Author:      Kelly
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

    def chunky(self,l,n):
        n=max(1,n)
        return [l[i:i+n]for i in range(0, len(l),n )]

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

    #Assign a name or ID for a user role
    def roleAssign(self,roleInput):

        for key,val in self.roleDict.iteritems():
         if key.lower() == roleInput.lower():
             return val
         if val.lower() == roleInput.lower():
            return key

    #updates username properties depending on the input

    def updateUser(self,userName,myEsri=None,fullName = None,description=None, access=None,tags=None,email=None, password=None):
        userURL ='https://{}.maps.arcgis.com/sharing/rest/community/users/{}/update'.format(self.__urlKey, userName)
        data = {'f':'json','token':self.token}
        if access:
            data['access'] = access
        if fullName :
            data['fullName']= fullName
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


    def delUserContent(self, userName, protected=True):
        '''Deletes all of a user's content including protected content and content
        stored in additional folders.'''

        itemURL ='{}.maps.arcgis.com/sharing/rest/content/users/{}'.format(self.portalUrl, userName)
        request = itemURL +"?f=json&token="+self.token
        response = requests.get(request, verify = False)
        jres = json.loads(response.text)
        rootItemlst=[]
        if protected:
            print "protected items will be deleted"
        else:
            print "Protected items will not be deleted"

        if jres['items']:
            for item in jres['items']:
                itemID= item['id']
                rootItemlst.append(itemID)
                if item['protected']:
                    if protected:
                        '''delete protected data'''
                        unprotectURL = '{}.maps.arcgis.com/sharing/rest/content/users/{}/items/{}/unprotect'.format(self.portalUrl,userName,itemID)
                        data = {'f':'json', 'token':self.token}
                        response = requests.post(unprotectURL, data=data, verify=False)
        else:
            print 'No items to delete in the default folder.'
        folderItemLst=[]
        if jres['folders']:
            '''Delete content stored in folders'''
            for folder in jres['folders']:
                folderID = folder['id']
                foldercontentURL ='{}.maps.arcgis.com/sharing/rest/content/users/{}/{}?f=json&token={}'.format(self.portalUrl,userName, folderID, self.token)
                response = requests.get(foldercontentURL, verify = False)
                jres = json.loads(response.text)

                if jres['items']:
                    for item in jres['items']:
                        itemID= item['id']
                        rootItemlst.append(itemID)
                        print "Attempting to delete item ID:{}".format(itemID)

                        if item['protected']:
                            if protected:
                                '''delete protected data'''
                                unprotectURL = '{}.maps.arcgis.com/sharing/rest/content/users/{}/{}/items/{}/unprotect'.format(self.portalUrl,userName,folderID,itemID)
                                data = {'f':'json', 'token':self.token}
                                response = requests.post(unprotectURL,data=data, verify = False).json()
        print 'root list' + str(rootItemlst)
        print 'folderlist '+ str(folderItemLst)


       # try:
        chunked= self.chunky(rootItemlst,10)

        for chunks in chunked:
            encodechunk=[x.encode('UTF8') for x in chunks]
            itemList=""
            for it in encodechunk:
                itemList=itemList+it+","
            folderURL = '{}.maps.arcgis.com/sharing/rest/content/users/{}/deleteItems'.format(self.portalUrl,userName)
            data = {'f':'json','token':self.token, 'items':itemList}
            response = requests.post(folderURL,data=data, verify = False).json()
            #print "Folder {} has been deleted.".format(delFolderID)

##        except KeyError:
##                   print "Unable to delete folder {}, please check that all of the items were deleted from it first.".format(folderID)
##                #delete the folder
##                try:
##                    folderURL = '{}.maps.arcgis.com/sharing/rest/content/users/{}/{}/delete'.format(self.portalUrl,userName,folderID)
##                    data = {'f':'json','token':self.token}
##                    response = requests.post(folderURL,data=data, verify = False).json()
##                    print "Folder {} has been deleted.".format(folderID)
##
##                except KeyError:
##                    print "Unable to delete folder {}, please check that all of the items were deleted from it first.".format(folderID)

    def delUserGroups(self, userName):

        groupURL ='{}.maps.arcgis.com/sharing/rest/community/users/{}'.format(self.portalUrl, userName)
        request = groupURL +"?f=json&token="+self.token
        response = requests.get(request, verify = False)
        jres = json.loads(response.text)
        for row in jres['groups']:
            if row['id'] != "" and row['owner'] == userName:
                delURL ='{}.maps.arcgis.com/sharing/rest/community/groups/{}/delete'.format(self.portalUrl,row['id'])
                data = {'f':'json','token':self.token}
                response = requests.post(delURL,data=data, verify = False).json()
                try:
                    if response['success']:
                         print "deleting is a group" + row['id']
                except:
                    print 'there is an application in this group that must be manually removed'
                    quit()

    def delUser(self, userName):
      #  Revoke Pro Entitlements
        proUrl= '{}.maps.arcgis.com/sharing/rest/content/listings/2d2a9c99bb2a43548c31cd8e32217af6/provisionUserEntitlements'.format(self.portalUrl)
        data = {'f':'json', 'token':self.token ,'userEntitlements':'{"users":["'+userName+'"],"entitlements":[]}'}
        response = requests.post(proUrl, data=data, verify=False).json()
        navURL= '{}.maps.arcgis.com/sharing/rest/content/listings/b2d9a4dd70174fac8986dd2bf15a477a/provisionUserEntitlements'.format(self.portalUrl)
        response = requests.post(navURL, data=data, verify=False).json()
        #disable my ESri Access

        userURL ='https://{}.maps.arcgis.com/sharing/rest/community/users/{}/update'.format(self.__urlKey, userName)
        data = {'f':'json','usertype':'arcgisonly','token':self.token}
        response = requests.post(userURL, data=data, verify=False).json()

        delURL ='{}.maps.arcgis.com/sharing/rest/community/users/{}/delete'.format(self.portalUrl,userName)
        data = {'f':'json','token':self.token}
        response = requests.post(delURL,data=data, verify = False).json()
        if response['success'] is True:
            print 'Deleted the following user: ' +userName
        else:
            print 'user was not deleted'
