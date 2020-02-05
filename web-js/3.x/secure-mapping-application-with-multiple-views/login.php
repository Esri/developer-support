<?php		
	session_start();
	//If the credentials are invalid set the error property to true and reload the login page
	function invalidCreds() {
		$_SESSION['error']=true;
		header("location: index.php");
	}
	//Class used to connect to the SQLite3 database
	class MyDB extends SQLite3
    {
		function __construct()
		{
			$this->open('Database/authentication.db');
		}
	}
	//If the POST parameters do not contain a username and password return the user to the login page
	if (empty($_POST['username']) || empty($_POST['password'])) {
		invalidCreds();
	}
	else {
		//Get the username and password variables from the POST parameters
		$username=$_POST['username'];
		$password=$_POST['password'];
		$username = stripslashes($username);
		$password = stripslashes($password);
		
		//Create a new database connection
		$db = new MyDB();
		//The SQL used in the request
		$sql = "SELECT full_name, user_role FROM users WHERE user_name='".$username."' AND password='".$password."' LIMIT 1";
		//Query the database and return the results
		$results = $db->query($sql);
		//Check to see if the query returned results
		if($results->fetchArray(SQLITE3_ASSOC)){
			$temp = $results->fetchArray();
			echo array_values($temp)[0];
			//Loop through the results returned (there should be only one)
			while($row = $results->fetchArray(SQLITE3_ASSOC) ){
				//set the session variables
				$_SESSION['user_role']=$row['user_role'];
				$_SESSION['full_name']=$row['full_name'];
				$_SESSION['error']=false;
			}
			//close the database connection
			$db->close();
			//Load the secureMap page
			header("location: secureMap.php");
		} else {
			//If no results were returned send the user back to the login screen
			invalidCreds();			
		}
	}
?>