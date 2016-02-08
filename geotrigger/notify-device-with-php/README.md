#Send push notification to device with PHP script

##About
At the behest of a customer I created a script to send a push notification to an app using the Geotrigger SDK. I struggled mightily to get the script to work. To prevent others from spending many hours trying to accomplish the same thing I have created this sample. You can learn more about sending push notifications to a geotrigger app [here](https://developers.arcgis.com/geotrigger-service/api-reference/device-notify/). More information about the Esri Geotrigger Service [can be found here](https://developers.arcgis.com/geotrigger-service/).

##Usage notes
This script uses Curl. While this makes sending POST requests with PHP much easier this also means Curl must be configured on your server. You must use a client id and client secret registered to your developers.arcgis.com account to create the token used to access the geotrigger service. You must have a device that is registered to receive push notifications that is running an application using the Geotrigger SDK. Note for the push notification to successfully resolve the application must be running.

##How it works:
The following code snippets show how the code works:

Generate a token to be used in the request to the geotrigger service:
```php
$tokenUrl = 'https://www.arcgis.com/sharing/rest/oauth2/token?';
$tokenFields = array(
	'client_id' => '<Your Client id>',
	'client_secret' => '<Your Client Secret',
	'grant_type' => 'client_credentials',
	'expiration' => '1440',
	'f' => 'json',
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $tokenUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_MAXREDIRS, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

$result = curl_exec($ch);
```
Retrieve the token from the response:
```php
$obj = json_decode($result, true);
$token = $obj['access_token'];
```
Create the request and send it to the geotrigger service:
```php
$triggerUrl = 'http://geotrigger.arcgis.com/device/notify';

$fields = array(
	'deviceIds' => array('<Your Device>'),
	'tags' => array('my_tag'),
	'text' => 'Hey',
	'data' => array('foo' => 'bar')
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $triggerUrl);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_POST, count($fields));
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $token, 'Content-type: application/json',)); 

$result = curl_exec($ch);
```
Process the results of the notification request:
```php
$obj = json_decode($result);
if(empty($obj)) {
	echo 'Bad JSON';
}
else {
	foreach($obj->locations as $location) {
		echo $location . "<br/>";
	}
}
```
