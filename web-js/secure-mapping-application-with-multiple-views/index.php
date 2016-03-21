<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="">
		<meta name="author" content="">
		<title>Secure Web Map</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<link rel="stylesheet" href="CSS/login.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<script type="text/javascript">
			//Display the "invalid user..." message
			function invalid() {
				//Make sure the document is fully loaded
				$(document).ready(function() {
					$(".invalid-user-text").css("visibility", "visible");
				});
			}
		</script>
		<?php
			//Check to see if the protocol used is HTTPS. If not reload the page using HTTPS
			if($_SERVER["HTTPS"] != "on")
			{
				header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
				exit();
			}
			session_start();
			//If the session contains the error property then display an alert showing the username and password was invalid.
			if(isset($_SESSION['error'])){
				$_SESSION['error'] = false;
				//Call the invalid user function
				echo '<script type="text/javascript">invalid();</script>';	
			}
		?>
	</head>
	<body>
		<div class="container">
			<form class="form-signin" action="login.php" method="post">
				<h2 class="form-signin-heading" style="margin-left:15px;">Sign in to View Map</h2>
				<h5 class="invalid-user-text">Invalid username or password</h5>
				<label for="inputEmail" class="sr-only">Username</label>
				<input type="text" id="name" name="username" class="form-control" placeholder="Username" required autofocus>
				<label for="inputPassword" class="sr-only">Password</label>
				<input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
				<button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
			</form>
		</div>
	</body>
</html>