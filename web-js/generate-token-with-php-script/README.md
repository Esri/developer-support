#Generate token with PHP script

##About
Earlier I wrote a sample at the request of a customer showing how to [generate a token with esri request](https://github.com/Esri/developer-support/blob/gh-pages/web-js/generate-long-lived-token/README.md). As noted in the description of that sample the demonstrated approach should never be used in a production environment because the username and password are hardcoded. This allows anyone to steal your credentials. If you want to access a secure service without requiring the user to enter credentials Esri recommends using a proxy page. However I have seen several situations where a customer may not want to use a proxy page or it's implementation may be difficult. To help in this situation I modified my earlier sample to make a request to a PHP script which generates the token using hard coded credentials and returns the token to the application. Because the script runs on the server side the credentials cannot be stolen. This approach is also useful if you need to generate a long-lived token or require a token for any other purpose.

##Sample use case
Let's say you have developed an application which consumes a secured layer from your ArcGIS Server. The users of your application do not have or need to know login credentials for your ArcGIS Server. Thus you cannot prompt your user for credentials. Due to your web development stack or other restrictions using a proxy page is not an ideal solution. You therefore use a PHP script similar to this one to generate a token and return it to the application. This essentially "pokes a hole" in your data security. Now anyone who accesses your application can view your secure data. The goal is to limit who has access to the application. Therefore you should use a login page to limit access to the application itself. In this scenario each user has credentials to access the application but does not have credentials to access the data meaning the data security is not mixed with the application security.

##Usage notes
This PHP script needs to be configured for each deployment. The referer url, token endpoint url, username and password must be changed each time. While this sample demonstrates how to create tokens with username and passwords this same approach would work with clientid and client secret as well. This script also uses Curl. While this makes sending POST requests with PHP much easier this also means Curl must be configured on your server.

##How it works:
The following code snippets show how the code works:

Using esriRequest send a simple get request to the PHP script:
```javascript
esriRequest({
	url: "/generateToken.php",
    handleAs: "json",
    load: tokenObtained,
    error: tokenRequestFailed
}, {
    usePost: false
});
```
In the PHP code the token request is created and sent to the server via a POST:
```php
$fields = array(
	'request' => 'getToken',
	'username' => 'user1',
	'password' => 'user1',
	'expiration' => 120,
	'clientid' => 'ref.' . $_SERVER['HTTP_REFERER'],
	'f' => 'json'
);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
```
The token is then returned to the application:
```javascript
function tokenObtained(response) {
	token = response.token;
}
```
