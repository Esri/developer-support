# Browser Cached Credentials

## Background

This sample demonstrates how to persist browser cached credentials using the ArcGIS Maps SDK for JavaScript and OAuth 2.0

This app is based on the same OAuth sample link below but with local browser caching.

Link:

    https://developers.arcgis.com/javascript/latest/sample-code/identity-oauth-basic/

## Usage notes

Without storing the credentials within the app, users will be asked to sign in repeatedly when they launch the app multiple times or when navigating between multiple web pages in their website. Users can persist the login app session by extracting the state of the Identity Manager and then caching it within localStorage for later use so long as the ArcGIS access token remains valid. When a user wants to revisit the app, they can re-hydrate the state of IdentityManager with the cached JSON credential from localStorage.

API Reference Links:

    https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#toJSON
    https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#initialize

## How to setup

1. Follow the link below to add and register an app using developer credentials.
2. Specify the application ID you received when registering your application and then host this HTML file in a web server.

    When you launch the app, click the Sign in button in the top-right corner. After successfully authenticating, you can close the app window or open the same URL in a separate tab. You should see that you will be immediately signed in when the app is reloaded. Click the sign out button to clear the browser cache and to destroy the credentials.

Link:

    https://developers.arcgis.com/documentation/portal-and-data-services/portal-service/content-items/create/add-apps/#add-and-register-an-app-using-developer-credentials

```javascript
if(localStorage.getItem("OAuthCredential") == null)
{
    // Obtain credential from Identity Manager and save it to localStorage
    esriId.getCredential(info.portalUrl + "/sharing").then((credential)=>{
        esriId.credentials.length = 0;
        esriIdJSON = esriId.toJSON();
        esriIdJSON.credentials.length = 0;
        esriIdJSON.credentials.push(credential);
        esriId.initialize(esriIdJSON)
        localStorage.clear();
        localStorage.setItem("OAuthCredential", JSON.stringify(esriId.toJSON()));
    });
}                               
```

```javascript
if(localStorage.getItem("OAuthCredential") != null)
{
    // Obtain credential from localStorage and initialize the credential JSON with the Identity Manager
    let cachedCredential = JSON.stringify(localStorage.getItem("OAuthCredential"));
    esriId.initialize(localStorage.getItem("OAuthCredential"));
}
```
