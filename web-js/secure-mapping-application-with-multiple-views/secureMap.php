<!DOCTYPE html>
<html>
 <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
    <title>Secure Map App</title>
    <link rel="stylesheet" href="https://js.arcgis.com/3.15/esri/css/esri.css">
	<link rel="stylesheet" href="https://js.arcgis.com/3.15/dijit/themes/claro/claro.css">
	<link rel="stylesheet" href="CSS/map.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="https://js.arcgis.com/3.15/"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
	<script>
		var currentUser;
		//wait for the document to load
		$(document).ready(function() {
			//enable tooltips
			$(function () { $("[data-toggle = 'tooltip']").tooltip(); });
			//execute when the close button on the widget panel has been clicked
			$("#closePanelBtn").click(function(){
				//hide the panel
				$("#widgetPanel").css("visibility", "hidden");
				//call the destroy widget function
				destroyCurrentWidget();
			});
			//enable the widget buttons
			enableButtons();
			//display the name of the currently logged in user
			$("#loggedInNameText").text(currentUser);
		});
		function showUser(user) {
			//set the current user variable
			currentUser = user;
		}	
	</script>
	<?php
		session_start();
		//If the URL contains a "logout" parameter return to the login screen
		if (isset($_GET['logout'])) {
			returnToLogin();
		}
		//load the appropriate map based on the role of the logged in user
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
		//if for some reason the user role does not match a listed user role, return to the login page.
		else {
			returnToLogin();
		}
		
		//Destroy the session and return to the login screen
		function returnToLogin() {
			session_destroy();
			header("location: index.php");
		}
		
		//call the initMap function and set the current user
		function initializeMap() {
			echo '<script type="text/javascript">showUser("', $_SESSION['full_name'] ,'");</script>';
			echo '<script type="text/javascript">initMap();</script>';
		}
	?>
</head>
<body class="claro">
<div id="container">
<nav id="navbar" class = "navbar" role = "navigation">
   <div class = "navbar-header">
	  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#example-navbar-collapse" aria-expanded="false" aria-controls="navbar">
         <span class = "sr-only">Toggle navigation</span>
         <span class = "icon-bar"></span>
         <span class = "icon-bar"></span>
         <span class = "icon-bar"></span>
      </button>
      <a class = "navbar-brand" style='color:#fff;' href = "#">Secure Map App</a>
   </div>
   <div class = "collapse navbar-collapse" id = "example-navbar-collapse">
		  <p id="loggedInNameText" class="navbar-text"></p>
      <ul class = "nav navbar-nav">
         <li>
			<a href = "#" style='color:#fff;' id="logoutBtn" class="" data-toggle="modal" data-target="#myModal">Logout</button>
				<div id="myModal" class="modal fade" tabindex="-1" role="dialog">
				  <div class="modal-dialog modal-sm">
					<div class="modal-content">
					  <div class="modal-header">
						<h4>Logout <i class="fa fa-lock"></i></h4>
					  </div>
					  <div class="modal-body"><i class="fa fa-question-circle"></i> Are you sure you want to log-off?</div>
					  <div class="modal-footer"><a href='secureMap.php?logout=true' class="btn btn-primary btn-block">Logout</a></div>
					</div>
				  </div>
				</div>
			</li>
         </li>	
      </ul>
   </div>
</nav>
<div class = "btn-toolbar" role="toolbar">
	<div class = "btn-group">
		<button type = "button" class = "btn btn-default widget-btn" data-toggle = "tooltip" data-placement = "bottom" title="Launch the Measure Widget" id="measureBtn">Measure</button>
		<button type = "button" class = "btn btn-default widget-btn middle-btn" data-toggle = "tooltip" data-placement = "bottom" title="Launch the Editing Widget" id="editBtn">Edit</button>
		<button type = "button" class = "btn btn-default widget-btn" data-toggle = "tooltip" data-placement = "bottom" title="Launch the Directions Widget" id="routeBtn">Routing</button>
	</div>
</div>
   <div id="mapDiv" class="map">
		<div id="BasemapToggle"></div>
		<div id="searchDiv"></div>
		<div id="widgetPanel" class = "panel panel-default">
			<div class = "panel-heading" style='background-color:#f8f8f8;' >Current Widget
				<button id="closePanelBtn" type="button" data-toggle = "tooltip" title="Close Widget" class=""data-placement = "left">X</button>
			</div>
			<div class = "panel-body"></div>
		</div>
   </div>
</div>
</body>

