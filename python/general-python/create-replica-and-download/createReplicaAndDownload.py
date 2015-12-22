#Downloads a replica created asynchronously
#Resources: https://developers.arcgis.com/rest/analysis/api-reference/programmatically-accessing-analysis-services.htm
import urllib, urllib2, json, time, os

def sendRequest(request):
    response = urllib2.urlopen(request)
    readResponse = response.read()
    jsonResponse = json.loads(readResponse)
    return jsonResponse

username = "username"                                             #CHANGE
password = "password"                                             #CHANGE
downloads = r"location of downloads folder"                       #CHANGE
replicaURL = "feature service url/FeatureServer/createReplica"    #CHANGE

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
    'replicaName' : 'Nov20Test',
    'layers' : [0,1],
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

print("Downloading the replica")
url = jsonResponse['resultUrl']
f = urllib2.urlopen(url)
with open(downloads + "\\" + os.path.basename(url), "wb") as local_file:
    local_file.write(f.read())

