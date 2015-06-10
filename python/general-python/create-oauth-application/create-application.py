import sys, os, urllib, urllib2, json, httplib, ssl


#####Parameters or Variables Start#####

#NOTE FOR THIS TO WORK THE USER (AKA userName) MUST HAVE ADMIN PERMISSIONS


portalUrl = "https://arcgis.com"
userName = "XXXXX"
password = "XXXXX"


####Parameters or Variables End######


def generateToken(username, password):
    '''Generate a token using the requests module for the input
    username and password'''
    params = {}
    params['username'] = username
    params['password'] = password
    params['referer'] = 'https://arcgis.com'
    params['expiration'] = 1209600
    params['f'] = "json"
    params = urllib.urlencode(params)  
    try:
        request = urllib2.Request(portalUrl + '/sharing/generateToken',params)
        response = urllib2.urlopen(request)
        response = response.read()
        print response
        response = json.loads(response)  
        token = response["token"]
        print token
        print response
        return token
    except Exception:
        print "request failed to get token"
        pass

    
def addItem(token):
    params = {}
    params['title'] = "New Application"
    params['tags'] = "Access, Tokens, Content"
    params['type'] = "Application"
    params['description'] = "This application was created programmatically."
    params['access'] = "private"
    params['f'] = "json"
    params['token'] = token
    params = urllib.urlencode(params)  
    try:
        request = urllib2.Request(portalUrl + '/sharing/rest/content/users/' + userName + '/addItem',params)
        response = urllib2.urlopen(request)
        response = response.read()
        print response
        response = json.loads(response)  
        item_id = response["id"]
        print "item id: " + item_id
        registerApplication(item_id, token)
    except Exception:
        print "addItem request failed"
        pass

def registerApplication(item,token):
    params = {}
    params['itemId'] = item
    params['appType'] = 'multiple'
    params['redirect_uris'] = []
    params['f'] = 'json'
    params['token'] = token
    params = urllib.urlencode(params)  
    try:
        request = urllib2.Request(portalUrl + '/sharing/oauth2/registerApp',params)
        response = urllib2.urlopen(request)
        response = response.read()
        print response
        response = json.loads(response)  
        print "APPLICATION SUCCESSFULLY REGISTERED"
        client_id = response["client_id"]
        client_secret = response["client_secret"]
        print "client id: " + client_id
        print "client secret: " + client_secret
    except Exception:
        print "register app request failed"
        pass

               
if __name__ == "__main__":
    token = generateToken(userName, password)
    addItem(token)