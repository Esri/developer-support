require([
    "esri/map", 
    "application/bootstrapmap",
    "esri/arcgis/Portal", 
    "esri/arcgis/OAuthInfo", 
    "esri/IdentityManager",
    "esri/layers/FeatureLayer",
    "dojo/dom-style", 
    "dojo/dom-attr", 
    "dojo/dom", 
    "dojo/on", 
    "dojo/_base/array",
    "dojo/dom-style", 
    "dojo/domReady!"
  ], function (
    Map, bootstrapmap, arcgisPortal, OAuthInfo, esriId, FeatureLayer,
    domStyle, domAttr, dom, on, arrayUtils, domStyle){

    //Global variables for resultsArray (object array of all AGOL items), map appID, and the oAuthInfo object.
    var resultsArray, map, appID, info;

    //OAuthInfo to store appId from user input
    var info = new OAuthInfo({
      appId: appID,
      popup: true
    });
    esriId.registerOAuthInfos([info]);

    //Check if user is signed in already
    esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
      function (){
        //if user signed in display the map and dropdown of services they own
        displayItems();
      }
    ).otherwise(
      function (){
        // Anonymous view - no user logged in.
        console.log("in anonymous view - no user logged in");
      }
    );

    //Listen for the sign-in button to be clicked
  	on(dom.byId("sign-in"), "click", function (){
      console.log("signing in...");
      //Get the value the user put it to the appid text box
      appID = document.getElementById("appid").value;

      //assign appID to OAuthInfo appId property
      info.appId = appID; 

      esriId.registerOAuthInfos([info]);

      esriId.getCredential(info.portalUrl + "/sharing", {
          oAuthPopupConfirmation: false
        }
      ).then(function (){
          displayItems();
        });
  	});




    //displayItems called from sign-in click event
    function displayItems(){
      console.log("in displayItems");

      //---------------Hide the jumbotron and associated items in order to display map------------------//
      document.getElementById('primary-message-callout').style.display = "none";  //Hide the welcome message
      document.getElementById('steps-to-run').style.display = "none";             //Hide the Steps
      document.getElementById('input-sign-in').style.display = "none";            //Hide the app-id text box
      document.getElementById('sign-in-button').style.display = "none";           //Hide the sign-in button
      document.getElementById('footer-container').style.display = "none";         //Hide the footer
      //------------------------------------------------------------------------------------------------//

      new arcgisPortal.Portal(info.portalUrl).signIn().then(
        function (portalUser){
          //Welcome the logged in user
          window.alert("Welcome " + portalUser.fullName);
          //query the portal for content if sign in success
          queryPortal(portalUser)
        }

        ).otherwise(
          function (error){
            window.alert("Error occurred while signing in: ", error);
          }
        );
    }

    //function to query the portal items based on parameters
    function queryPortal(portalUser){

      var portal = portalUser.portal;

      var queryParams = {
        q: "owner:" + portalUser.username,
        sortField: "numViews",
        sortOrder: "title",
        num: 100
      };

      //After querying call createDropdownList
      portal.queryItems(queryParams).then(createDropdownList)


    }

    //function to append services to dropdown list
    function createDropdownList(items){

      //Get the results in an array
      resultsArray = (items.results);
      //get a handle to the dropdown
      var bootstrapSelectJQuery = $("#service-dropdown-list");

      //loop through results and create an html fragment to add to the drop down list
      for(var i = 0; i < resultsArray.length; i++){
        if(resultsArray[i].displayName === "Feature Layer"){
          var htmlFragment = "<li><a href=\"#\">" + resultsArray[i].title + "</a></li>";
          bootstrapSelectJQuery.append(htmlFragment);
        }
      }
      //display the map
      loadMap();
    }


    //event handler for bootstrap dropdown to add services when clicked
    $('#service-dropdown-list').on('click', "li", function(){
      //Store the URL of the item a user clicks
      var serviceUrlForSelection;
      var selection = $(this).text();

      //Loop through the array of results to find object with cooresponding name selected
      for(var i=0; i < resultsArray.length; i++){
        if(resultsArray[i].displayName === "Feature Layer"){
          if(resultsArray[i].title === selection){
            console.log(resultsArray[i]);
            serviceUrlForSelection = resultsArray[i].url;
            console.log("Url is: " + serviceUrlForSelection);

          }
        }
      };

      //Some services have an index /0 in AGOL and some do not, add this to temporary support both
      var lastTwoCharactersURL = serviceUrlForSelection.slice(-2);

      if(lastTwoCharactersURL == "/0"){
        console.log("this has a index!");
        map.addLayer(new FeatureLayer(serviceUrlForSelection));
      } else{
        console.log("this doesn't have an index! - manually add /0");
        map.addLayer(new FeatureLayer(serviceUrlForSelection + "/0"));
      }    

    });

    function loadMap(){

      //Set the serviceDropdown list to visible (hidden initially)
      domStyle.set("add-data-dropdown", "visibility", "visible");
      // Get a reference to the ArcGIS Map class
      map = bootstrapmap.create("mapDiv",{
        basemap: "osm",
        center:[-97.69, 39.09],
        zoom:5,
        scrollWheelZoom: true
      });

    }

  });
    
