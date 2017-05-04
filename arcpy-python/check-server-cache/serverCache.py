## serverCache.py
##
## Module that will allow you to use the RESTFul endpoints on the
## server for further manipulation
##
## Written By:  Alexander N. & Scott P.
##
## Created On: August 18, 2014


"""  This script is designed to generate a token login and then reach out
to a server service passing that token and retrieve
server items.
This script creates a server object and then sends the request for the
cache to the server and gets a JSON response.
This should work with vanilla installs of python version 2.7.x.
ArcPy is not required.

Sample syntax is:
######
sv = serverPython('ServerUsername', 'ServerPassword', 'ServerRestURL', 'ServerTokenURL')
for i in sv.getStatus("ServiceName", "ServiceType"):
    print "Scale level of cache: " + str(i['levelID']) + "  Percent Complete: " + str(i['percent'])
######
The two service types are MapServer and ImageServer
"""
import urllib
import urllib2
import json
import httplib
import time
import getpass
import smtplib

class serverPython:

    def __init__(self, username, password, refererURL, tokenURL):
        """This instantiates the serverPython object and grabs the variables from the user"""
        self.__username = username
        self.__password = password
        self.__client = "referer"
        self.__referer = refererURL
        self.__expiration = "6000"
        self.__encrypted = "false"
        self.__format = "json"
        self.__tokenURL = tokenURL
        self.__token = self.getToken()
        self.__reportingTools = self.__referer + "/services/System/ReportingTools/GPServer/ReportCacheStatus/execute"

    def __sendRequest(self, urla, data, referer):
        """This private method allows the user to send the request with the referer attached"""
        try:
            url = urllib2.Request(urla)
            url.add_header('referer',referer)
            jres = urllib2.urlopen(url, data).read()
            return json.loads(jres)
        except httplib.IncompleteRead as e: return json.loads(e.partial)

    def getToken(self):
        """This generates a token for a user"""
        data = {'password': self.__password,
                'f': self.__format,
                'username': self.__username,
                'client': self.__client,
                'referer' : self.__referer,
                'expiration': self.__expiration,
                'encrypted': self.__encrypted}
        return serverPython.__sendRequest(self, self.__tokenURL, urllib.urlencode(data), self.__referer)['token']

    def getStatus(self, serviceName, serviceType):
        """This gets the cache status of the map or image server"""
        serviceToSend = serviceName + ":" + serviceType
        data = {'token' : self.__token,
                'service_url': serviceToSend,
                'f':self.__format}
        return serverPython.__sendRequest(self, self.__reportingTools, urllib.urlencode(data), self.__referer)['results'][0]['value']['lodInfos']

    def emailThePeople(self, emailTo, messageToSend, subject):
        """This will send an email using Gmail SMTP.  Gmail address is required"""
        fromAddress = 'likeImPuttingThisOnline@gmail.com'
        message = "\r\n".join([
            "From: {0}",
            "To: {1}",
            "Subject: {2}",
            "",
            "{3}".format(fromAddress, emailTo, subject, messageToSend)
            ])
        username = 'likeImPuttingThisOnline@gmail.com'
        password = 'thisIsAPassword'
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.starttls()
        server.login(username, password)
        server.sendmail(fromAddress, emailTo, message)
        server.quit()

if __name__ == "__main__":
    sv = serverPython('alex7370', 'password', 'http://alexn.esri.com/arcgis/rest', 'http://alexn.esri.com/arcgis/tokens/')
    message = ""
    for i in sv.getStatus("Ashley", "MAPSERVER"):
        message = message + "Scale level of cache: " + str(i['levelID']) + "  Percent Complete: " + str(i['percent']) + "\n"
    sv.emailThePeople('whoIsGettingAnEmail@email.Address', message, 'Subject')
