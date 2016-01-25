#Secure Mapping Application with Multiple Role Based Views
![Alt text](SecureMapApp.gif "Application Demo")

##About
Esri has tools to both secure data (ArcGIS Server security and ArcGISOnline security) and the means to automatically login and view secured data (ESRI's proxy page from Github). Thus the proxy page allows you to negate the security you placed on your data. If you create a public application that uses the proxy page to view sensitive data then your data is no longer protected. If the proxy page is used to access secured data in your application then the application should have a login page.

A related problem is how to display different data and tools in an application based on who is using it. For example one person needs to be able to view a particular feature layer but not be able to edit it while another person needs to be able to both view and edit the layer. Furthermore the person who cannot edit does not need to know the editing tools exist. This problem is easily solved by using a login page and searching a user database for the privileges of the current user. The data and tools in the application can then be tailored to the person viewing the application.

##Sample use case
Let's say you have three people in your organization. Each person needs to be able to access your custom application but each person has different privileges. However each user is unaware they have different privileges. Thus the application cannot give the impression that different users see different information. Furthermore the application should not be accessible to users outside of your organization though the URL is public.

##Usage notes
This application uses a SQLite3 database to store user information. I chose this database because it is easy to setup and is portable. However this application could just as easily been written to use MySQL, SQLServer, Oracle, etc. If you download and run this sample make sure you have the Sqlite3 extension enabled in your php.ini file. I chose to write this sample in PHP instead of ASP to allow it be used with multiple operating systems. I would recommend minifying the associated JavaScript files if this application was put into production. I do not set the timeout period for session information in the PHP code. If you wish to alter the timeout period I recommend changing it on your server. I do not "sanitize" the SQL inputs to the database query. Please research methods to do this before implementing a similar application. This application uses POST for all requests and forces the use of HTTPS. The database comes preloaded with four users and three different roles. The users are: user1, user2, user3 and user4. The password for all four users is "password".

##How it works:
This application is composed of three main PHP files: index.php (the login page), login.php (sends data to the Sqlite database) and secureMap.php (loads the appropriate map based on the user role). The following code snippets show how these files work together:

index.php
Check to see if the page was loaded over https. If it was not reload the page using https.
```php
if($_SERVER["HTTPS"] != "on")
{
	header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
	exit();
}
```
Start a session. Check to see if the session information contains the error flag. This indicates a user has been redirected to this page after their credentials were not found in the database. The JavaScript function will alert the user they have entered invalid credentials.
```php
session_start();
if(isset($_SESSION['error'])){
	$_SESSION['error'] = false;
	echo '<script type="text/javascript">invalid();</script>';	
}
```
login.php
The username and password entered by the user will be sent to the login.php file via a POST. The code will check to see if these parameters are empty.
```php
if (empty($_POST['username']) || empty($_POST['password'])) {
		invalidCreds();
	}
else {
	$username=$_POST['username'];
	$password=$_POST['password'];
```
A connection is made to the database and the query is sent to it. The code then checks the results and sets the session variables. The connection is closed and the user is redirected to the secureMap.php page.
```php
$temp = $results->fetchArray();
while($row = $results->fetchArray(SQLITE3_ASSOC) ){
	$_SESSION['user_role']=$row['user_role'];
	$_SESSION['full_name']=$row['full_name'];
	$_SESSION['error']=false;
}
$db->close();
header("location: secureMap.php");
```
secureMap.php
The page checks the session variables and then loads the appropriate JavaScript file.
```php
if($_SESSION['user_role'] == "tier1") {
	echo '<script src="Maps/mapOne.js" type="text/javascript"></script>';
	initializeMap();
}
else if($_SESSION['user_role'] == "tier2"){
	echo '<script src="Maps/mapTwo.js" type="text/javascript"></script>';
	initializeMap();
}
else if($_SESSION['user_role'] == "tier3"){
	echo '<script src="Maps/mapThree.js" type="text/javascript"></script>';
	initializeMap();
}
```
After the JavaScript file has been loaded initialize the map and set the name of the currently signed in user.
```
function initializeMap() {
	echo '<script type="text/javascript">showUser("', $_SESSION['full_name'] ,'");</script>';
	echo '<script type="text/javascript">initMap();</script>';
}
```

