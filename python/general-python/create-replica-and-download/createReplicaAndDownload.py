import urllib, urllib2, json, time, os

username = "username"                                             #CHANGE
password = "password"                                             #CHANGE
replicaURL = "feature service url/FeatureServer/createReplica"    #CHANGE
replicaLayers = [0]                                               #CHANGE
replicaName = "replicaTest"                                       #CHANGE

def sendRequest(request):
    response = urllib2.urlopen(request)
    readResponse = response.read()
    jsonResponse = json.loads(readResponse)
    return jsonResponse

print("Generating token")
url = "https://arcgis.com/sharing/rest/generateToken"
data = {'username': username,
        'password': password,
        'referer': "https://www.arcgis.com",
        'f': 'json'}
request = urllib2.Request(url, urllib.urlencode(data))
jsonResponse = sendRequest(request)
token = jsonResponse['token']

print("Creating the replica")
data = {'f' : 'json',
    'replicaName' : replicaName,
    'layers' : replicaLayers,
    'returnAttachments' : 'true',
    'returnAttachmentsDatabyURL' : 'false',
    'syncModel' : 'none',
    'dataFormat' : 'filegdb',
    'async' : 'true',
    'token': token}
request = urllib2.Request(replicaURL, urllib.urlencode(data))
jsonResponse = sendRequest(request)
print(jsonResponse)

print("Pinging the server")
responseUrl = jsonResponse['statusUrl']
url = "{}?f=json&token={}".format(responseUrl, token)
request = urllib2.Request(url)
jsonResponse = sendRequest(request)
while not jsonResponse.get("status") == "Completed":
    time.sleep(5)
    request = urllib2.Request(url)
    jsonResponse = sendRequest(request)

userDownloads = os.environ['USERPROFILE'] + "\\Downloads"

print("Downloading the replica. In case this fails note that the replica URL is: \n")
jres = jsonResponse['resultUrl']
url = "{0}?token={1}".format(jres, token)
print(url)
f = urllib2.urlopen(url)
with open(userDownloads + "\\" + os.path.basename(jres), "wb") as local_file:
    local_file.write(f.read())
print("\n Finished!")
