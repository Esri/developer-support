#Feature Service Viewer

##Steps to demo
1. <a href="https://developers.arcgis.com/sign-in/">Create a Developer account or sign in to your existing developer account.</a>
2. <a href="https://developers.arcgis.com/authentication/accessing-arcgis-online-services/#registering-your-application">Register a new application</a> to create a client-id (app id)
3. After you have create an application select the 'Authentication' tab and add the following redirect URIs:
<br>http://esri.github.io/developer-support/web-js/fs-viewer/oauth-callback.html<br>
![Image of Allowed Domains](https://dl.dropboxusercontent.com/u/343305078/AllowedDomains.png)
4. <a href="http://esri.github.io/developer-support/web-js/fs-viewer/#?">View Live Sample</a>


##About
This sample demonstrates how to use the OAuth2 authentication pattern to view all services that you own and add them to a web map.  It extends the pattern demonstarated in the <a href="https://developers.arcgis.com/javascript/jssamples/portal_oauth_popup.html">OAuth Popup</a> sample to demonstrate how you could authenticate a user and query for feature services that they own. After, all feature services are added to a dropdown list and the user can select feature services to add to the map.  

##How it works
First get the app id that the user enters into a text box and set it as the appId property of the OAuthInfo object
```JavaScript

    var info = new OAuthInfo({
      appId: appID,
      popup: true
    });
    
  	on(dom.byId("sign-in"), "click", function (){
      console.log("signing in...");
      //Get the value the user put it to the appid text box
      appID = document.getElementById("appid").value;

      //assign appID to OAuthInfo appId property
      info.appId = appID; 
      ...
    }

```

After a new <a href="https://github.com/david-chambers/arcgis-sdks/blob/master/JavaScript/fs-viewer/js/oauth.js#L76-l89">Portal object is created and the user is signed in</a>, query the portal and create the dropdown list
```JavaScript
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
```

After, a <a href="https://github.com/david-chambers/arcgis-sdks/blob/master/JavaScript/fs-viewer/js/oauth.js#L129-L145">click listener is added to each element</a>, when the user selects an item the URL will be obtained and a FeatureLayer object will be instantiated with it.  This FeatureLayer is added to the map.  

###Demo
![Alt text](https://dl.dropboxusercontent.com/u/343305078/Demo_final.gif "Optional Title")

###Limitations
- Feature Layers with several sub layers are not currently supported.  The sub layer with an index of 0 will be added to the map. <a href="https://github.com/david-chambers/arcgis-sdks/blob/master/JavaScript/fs-viewer/js/oauth.js#L147-L156">Current logic.</a>
