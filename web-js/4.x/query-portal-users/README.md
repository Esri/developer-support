# Query Portal Users

## About

The Portal class of the ArcGIS API for JavaScript provides a [queryUsers()](https://developers.arcgis.com/javascript/latest/api-reference/esri-portal-Portal.html#queryUsers) method that executes a query against the Portal to return an array of [PortalUser](https://developers.arcgis.com/javascript/latest/api-reference/esri-portal-PortalUser.html) objects that match the input query. The query being executed is a [User Search](https://developers.arcgis.com/rest/users-groups-and-items/user-search.htm) request (https://&lt;community-url&gt;/users), which will respond with properties like username, fullName, description, region, etc. However, the response may not include all the information about a user, such as their email or groups.

In order to acquire the personal details of a user, we need to send a [User](https://developers.arcgis.com/rest/users-groups-and-items/user-search.htm) request (https://<community-url&gt;/users/<userName&gt;). We can loop through the usernames in the response from queryUsers() and send a User request for each of the usernames.

## How It Works

1. Create a Portal object.

```javascript
    var portalUrl = "https://www.arcgis.com/";
    portal = new Portal(portalUrl);
    portal.authMode = "immediate";
```

2. Call the queryUsers() method once the Portal is loaded.

```javascript
    portal.load().then(function () {
      var queryParams = {
        query: "access: org",
      };
      portal.queryUsers(queryParams).then(function (queryResults) {
        // ...
      });
    });
```

3. Loop throug the results from queryUsers()

```javascript
    portal.load().then(function () {
      var queryParams = {
        query: "access: org",
      };
      portal.queryUsers(queryParams).then(function (queryResults) {
        queryResults.results.forEach((user) => {
          // ...
        });
      });
    });
```

4. In the loop, create a User request using the username from the queryUsers() result.

```javascript
      portal.queryUsers(queryParams).then(function (queryResults) {
        queryResults.results.forEach((user) => {
          var requestUrl =
            portalUrl + "/sharing/rest/community/users/" + user.username;

          esriRequest(requestUrl, {
            query: {
              f: "json"
            }
          })
            .then((response) => {
              console.log(response.data);
            })
            .catch((err) => {
              if (err.name === "AbortError") {
                console.log("Request aborted");
              } else {
                console.error("Error encountered", err);
              }
            });
        });
      });
```

## Related Documentation

- [Portal.queryUsers()—ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-portal-Portal.html#queryUsers)
- [User Search—ArcGIS REST API](https://developers.arcgis.com/rest/users-groups-and-items/user-search.htm)
- [User—ArcGIS REST API](https://developers.arcgis.com/rest/users-groups-and-items/user.htm)
- [request—ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-request.html)

## [Live Sample](https://esri.github.io/developer-support/web-js/4.x/query-portal-users/)
