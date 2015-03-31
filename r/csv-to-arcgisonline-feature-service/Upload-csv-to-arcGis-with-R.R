if (!require("RCurl")) {
  install.packages("RCurl", repos="http://cran.rstudio.com/") 
  library("RCurl")
}
if (!require("plyr")) {
  install.packages("plyr", repos="http://cran.rstudio.com/") 
  library("plyr")
}
if (!require("httr")) {
  install.packages("httr", repos="http://cran.rstudio.com/") 
  library("httr")
}
if (!require("rjson")) {
  install.packages("rjson", repos="http://cran.rstudio.com/") 
  library("rjson")
}

#Arguments from CMD
args <- commandArgs(trailingOnly = TRUE)
username<-args[1]
password<-args[2]
ItemName<-args[3]
CSVfile<-args[4]
XField<- args[5]
YField<- args[6]
tags<- args[7]

#username<-c('aruizga')
#password<-c('*******')
#ItemName<-"itemName"
#CSVfile<-"C:/data.csv"
#XField<- "latitude"
#YField<- "longitude"
#tags<-"SPSS"

#Generate Token
url = "https://arcgis.com/sharing/rest/generateToken"
data = list('username'= username,
            'password'= password,
            'referer' = 'http://arcgis.com',
            'expiration' = 1209600,
            'f'= 'json')
r<-POST(url,body = data)
content(r)
x <- fromJSON(content(r))
token<-x$token
print(token)

#Get Info - Short
root <- "http://www.arcgis.com/sharing/rest/portals/self?f=json&token="
u <- paste(root,token, sep = "")
r <- getURL(u)
x <- fromJSON((r))
short<-x$urlKey


#Upload Data
itemName<-ItemName
uploadURL <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',sep = "")
url <- paste(uploadURL,username, "/addItem?token=", token,"&f=json",sep = "")
data = list(multipart= 'true',
            filename = itemName,
            type='CSV')
r<-POST(url,body = data)
x <- fromJSON((content(r)))
ItemID<-x$id
ItemID


#addPart
CSV1<-CSVfile
URL1 <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/items/',ItemID,'/addPart?f=json&token=',token,sep = "")
URL<-paste(URL1,"&file=",CSV1,"&partNum=",1,sep="")
k<-POST(URL, body=list(file=upload_file(CSV1)))
content(k)
print("Part Added")

#Commit
commitURL <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/items/',ItemID,'/commit?f=json&token=',token,sep = "")
t <- getURL(commitURL)
 

#Status Test CSV
Type<-"CSV"
accepted<-'non'
while (accepted != 'completed'){
  URL <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/items/',ItemID,'/status?f=json&token=',token,sep = "")
  x <- getURL(URL)
  x <- fromJSON(x)
  accepted<-x[1]
  print(accepted)
  Sys.sleep(5)
}


#UpdateItem
URL <- paste('http://',short,'.maps.arcgis.com/sharing/content/users/',username,'/items/',ItemID,'/update?f=json&token=',token,sep = "")
filename=CSV1
data = list(title= itemName,
            tags= tags,
            filename= filename,
            typeKeywords= 'CSV',
            type= 'CSV')
w<-POST(URL,body = data)




#Analyze CSV
URL <- paste('http://www.arcgis.com/sharing/rest/content/features/analyze?token=',token,sep = "")
CSVID=ItemID
FileName=CSV1
data = list('f'= 'JSON',
            'itemid'= CSVID,
            'file'= FileName,
            'filetype'='csv')
a<-POST(URL,body = data)
x <- fromJSON((content(a)))
analyzed<-x$publishParameters
#analyzed



#Publish service
URL <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/publish',sep = "")
publishParams<-analyzed
publishParams$name = itemName
publishParams$locationType = 'coordinates'
publishParams$latitudeFieldName = XField
publishParams$longitudeFieldName = YField
query_dict = list(
  'itemID'= ItemID,
  'filetype'= 'csv',
  'f'= 'json',
  'token'= token,
  'publishParameters'=publishParams)
query_dict$publishParameters=toJSON(query_dict$publishParameters)
a<-POST(URL,body = query_dict)
a <- fromJSON((content(a)))
elements<-a$services[[1]]
serviceItemId<-elements$serviceItemId
jobId<-elements$jobId
serviceurl<-elements$serviceurl
serviceurl



#Status Test CSV
accepted<-'non'
while (accepted != 'completed'){
  URL <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/items/',ItemID,'/status?jobid=',jobId,'&f=json&token=',token,sep = "")
  x <- getURL(URL)
  x <- fromJSON(((x)))
  accepted<-x[1]
  Sys.sleep(5)
  print(accepted)
}


#Test Query
URL <- paste(serviceurl,'/0/query?where=1=1&returnCountOnly=True&f=json&token=',token,sep = "")
x <- getURL(URL)
x <- fromJSON(((x)))
count<-x[1]
print("Number of records:")
print(count)