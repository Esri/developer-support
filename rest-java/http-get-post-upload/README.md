Java HTTP Requests (POST, GET, FILE UPLOAD)
============================================

Sample Java code that takes advantage of ArcGIS's REST architecture. These samples include three core HTTP operations (POST, GET and FILE UPLOAD).
Each opperation is sperated into a seperate class.  The TestRequest file is a console app that can be run in an IDE.  Within the main() method there are three test cases
 - ```testGet()```, ```testPost()```, ```testUpload()```-  that show how to call each class.

## Features

* Perform a File Upload
* Perform a GET request
* Perform a POST request


###Dependencies:

The Upload class requires JARs from the Apache HttpComponents project called HttpClient.  Include these JARs in the project, for the above Upload class to work properly.

* commons-codec-1.9.jar
* commons-logging-1.2.jar
* fluent-hc-4.5.2.jar
* httpclient-4.5.2.jar 
* httpclient-cache-4.5.2.jar
* httpclient-win-4.5.2.jar
* httpcore-4.4.4.jar
* httpmime-4.5.jar
* jna-4.1.0.jar
* jna-platform-4.1.0.jar

[HttpClient 4.5.2 (GA)](http://hc.apache.org/downloads.cgi)
