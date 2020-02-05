<?php
	//Check to see if the request came from the proper application
	if($_SERVER['HTTP_REFERER'] == "http://mydomain/index.html") {
		//The url to the token endpoint of the sever containing the secure service
		$url = "http://sampleserver6.arcgisonline.com/arcgis/tokens/";
		//The fields included in the request
		$fields = array(
			'request' => 'getToken',
			'username' => 'user1',
			'password' => 'user1',
			'expiration' => 120,
			'clientid' => 'ref.' . $_SERVER['HTTP_REFERER'],
			'f' => 'json'
		);
		$fields_string = "";
		foreach($fields as $key=>$value) {
			$fields_string .= $key.'='.$value.'&'; 
		}
		//Instantiate Curl
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch,CURLOPT_POST,count($fields));
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$result = curl_exec($ch);
		
		//If Curl was not instantiated successfully
		if (!curl_exec($ch)) {
			echo 'An error has occurred: ' . curl_error($ch);
		}
		//Otherwise return the result
		else {
			echo $result;
		}
		//Close Curl
		curl_close($ch);
	}
	//If the referer is invalid
	else {
		echo 'Unauthorized';
	}
?>