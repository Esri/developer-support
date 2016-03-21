<?php
//oauth token end point
$tokenUrl = 'https://www.arcgis.com/sharing/rest/oauth2/token?';
//parameters for the token request
$tokenFields = array(
	'client_id' => '<Your Client id>',
	'client_secret' => '<Your Client Secret',
	'grant_type' => 'client_credentials',
	'expiration' => '1440',
	'f' => 'json',
);
foreach($tokenFields as $key=>$value) {
	$tokenUrl.= $key.'='.$value.'&';
}
//remove the extra & from the end of the request string
$tokenUrl = substr($tokenUrl, 0, -1);

//instantiate curl
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $tokenUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_MAXREDIRS, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

//execute post
$result = curl_exec($ch);
//if Curl was not instantiated successfully
if (!curl_exec($ch)) {
    // if curl_exec() returned false and thus failed
    echo 'An error has occurred: ' . curl_error($ch);
}
//otherwise return the result
else {
    echo 'Got Token <br/>';
}
//close curl
curl_close($ch);
//decode the json response
$obj = json_decode($result, true);
//grab the token using the 'access_token' key
$token = $obj['access_token'];

//geotrigger notify url
$triggerUrl = 'http://geotrigger.arcgis.com/device/notify';

//notify request parameters
$fields = array(
	'deviceIds' => array('<Your Device>'),
	'tags' => array('my_tag'),
	'text' => 'Hey',
	'data' => array('foo' => 'bar')
);

//encode the fields as JSON
$fields = json_encode($fields);

//open HTTP connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch, CURLOPT_URL, $triggerUrl);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_POST, count($fields));
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $token, 'Content-type: application/json',)); 

//execute post
$result = curl_exec($ch);
if (!curl_exec($ch)) {
    // if curl_exec() returned false and thus failed
    echo 'An error has occurred: ' . curl_error($ch);
}
else {
    echo 'everything was successful<br/>';
	// decode the returned JSON
	$obj = json_decode($result);
	//if the object variable is empty
	if(empty($obj)) {
		echo 'Bad JSON';
	}
	//otherwise loop through the locations in the results and show them.
	else {
		foreach($obj->locations as $location) {
			echo $location;
		}
	}
}
//close connection
curl_close($ch);
?>