install.packages('RCurl')
install.packages('plyr')
install.packages('httr')
install.packages('rjson')

library(RCurl)
library(plyr)
library(httr)
library(rjson)

#Generate Token
url = "https://arcgis.com/sharing/rest/generateToken"
data = list('username'= "myUsername",
            'password'= "myPassword",
            'referer' = 'http://arcgis.com',
            'expiration' = 1209600,
            'f'= 'json')
r<-POST(url,body = data)
content(r)
x <- fromJSON(content(r))
token<-x$token

#Get Info - Short
root <- "http://arcgis.com/sharing/rest/portals/self?f=json&token="
u <- paste(root,token, sep = "")
r <- getURL(u)
x <- fromJSON((r))
short<-x$urlKey


#Upload Data
username<-'aruizga'
itemName<-'RSPSS6'
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
data<-read.csv("Data1.csv")
CSV1<-"Data1.csv"
URL1 <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/items/',ItemID,'/addPart?f=json&token=',token,sep = "")
URL<-paste(URL1,"&file=",CSV1,"&partNum=",1,sep="")
k<-POST(URL, body=list(file=upload_file(CSV1)))
content(k)


#Commit
commitURL <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/items/',ItemID,'/commit?f=json&token=',token,sep = "")
t <- getURL(commitURL)
t  

#Status Test CSV
Type<-"CSV"
URL <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/items/',ItemID,'/status?f=json&token=',token,sep = "")
x <- getURL(URL)
x

#ItemID<-'f08e06c90be3439cbddbf1c03331cfe3'


#UpdateItem
URL <- paste('http://',short,'.maps.arcgis.com/sharing/rest/content/users/',username,'/items/',ItemID,'/update?f=json&token=',token,sep = "")
tags='SPSS'
filename=CSV1
data = list(title= itemName,
            tags= "spss",
            filename= filename,
            typeKeywords= 'CSV',
            type= 'CSV')
w<-POST(URL,body = data)
content(w)
