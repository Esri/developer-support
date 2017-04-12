# Generate Geodatabase Using HttpClient

## About
The DotNet SDK contains built in classes and methods that can be used to generate geodatabases. In nearly all cases these methods will be sufficent for your needs. However there is at least one scenario where using these built in methods will not work.

## Sample use case
When creating a geodatabase you have the option of specifying a query to limit the features that will be returned. A query string with a very long IN clause may return an error stating the URL is too long. However this error is not returned by ArcGIS Server but is instead thrown by the HttpContent class used by the Runtime SDK to hold request parameters. To work around this issue you can generate the geodatabase using REST requests and the StringContent class instead.


## Usage notes
This application uses a SQLite3 database to store user information. I chose this database because it is easy to setup and is portable. However this application could just as easily been written to use MySQL, SQLServer, Oracle, etc. If you download and run this sample make sure you have the Sqlite3 extension enabled in your php.ini file. I chose to write this sample in PHP instead of ASP to allow it be used with multiple operating systems. I would recommend minifying the associated JavaScript files if this application was put into production. I do not set the timeout period for session information in the PHP code. If you wish to alter the timeout period I recommend changing it on your server. I do not "sanitize" the SQL inputs to the database query. Please research methods to do this before implementing a similar application. This application uses POST for all requests and forces the use of HTTPS. The database comes preloaded with four users and three different roles. The users are: user1, user2, user3 and user4. The password for all four users is "password".

## How it works:
The HttpClient class is used to send the post request. First an HttpRequestMessage object is created with it's method type set as POST. Then a StringContent object is created to hold the request parameters and this will be used as the content for the request object. It is very important that the media type is set to "application/x-www-form-urlencoded" when sending a request to a REST endpoint of ArcGIS Server. The HttpClient sent sends an asynchronous request to the server and the string result is retrieved
```csharp
using (var client = new HttpClient()) {
	var request = new HttpRequestMessage(HttpMethod.Post, featureServiceURL + "/createReplica");
        var requestString = "<request parameters>"
	request.Content = new StringContent(requestString, Encoding.UTF8, "application/x-www-form-urlencoded");
	var result = await client.SendAsync(request);
        string resultContent = await result.Content.ReadAsStringAsync();
```
The GenerateGeodatabase request returned a url to a job status url that is used to check the status of the asynchronous process. To check the status requests are sent in a while loop once per every two seconds (this is done by the DelayRequest method). The result of the request is deserialized from a string into a json object and the status of the job is checked. If the status is "Completed" then the outputurl is retrieved from the object.
```csharp
while(!success) {
	await DelayRequest();
	using (var client = new HttpClient())
		var result = await client.GetAsync(url + "?f=json");
		string resultContent = await result.Content.ReadAsStringAsync();
		var jsonResult = JsonConvert.DeserializeObject<dynamic>(resultContent);
		if (jsonResult["status"].Value == "Completed"){
			outputUrl = jsonResult["resultUrl"].Value;
```
This time the ArcGISHttpClient class is used to send a request to retreive the geodatabase from the server. This is an extension of the HttpClient class which has been optimized to work with ArcGIS Server. Finally a task is used to copy the geodatabase from the server to the client.
```csharp
var client = new ArcGISHttpClient();
	var geodatabaseStream = client.GetOrPostAsync(url, null);
        var geodatabasePath = @"<Path to location on Disk>\name.geodatabase";
        await Task.Factory.StartNew(async delegate {
        	using(var stream = System.IO.File.Create(geodatabasePath)) {
                    await geodatabaseStream.Result.Content.CopyToAsync(stream);
```


