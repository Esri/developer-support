# Obtaining Service JSON data from a Stand-Alone IWA Enterprise Server

## Background

This sample demonstrates how to obtain secured service JSON from a stand-alone IWA Enterprise Server using the ArcGIS Maps SDK for JavaScript.

When you use Integrated Windows Authentication (IWA), logins are managed through Microsoft Windows Active Directory. Users do not sign in and out of the organization; instead, when they open the website, they are signed in using the same accounts they used to sign in to Windows.

ArcGIS Enterprise stand-alone is a pattern that uses ArcGIS Server to provide services and content without federating it with an ArcGIS Enterprise portal. This pattern was common in earlier releases, but should now only be used in limited circumstances.

## Usage notes

This is for workflows that make requests to secured map resources from IWA-conifugred Enterprise environments that are not federated to a portal. For environments with no federaeted portal, the Identity Manager registers ServerInfo instead of OAuthInfo. Since IWA uses web tier authentication, there is no need to generate access tokens.

API Reference Links:

    https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-ServerInfo.html
    https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-ServerInfo.html#server
    https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-ServerInfo.html#webTierAuth
    https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#registerServers

## How to setup

1. The code only needs your ArcGIS Enterprise server URL and a map service URL (Tile Service, Map Image Service, Feature Service, etc.)
2. Host this HTML file in a web server.

    When you launch the app, it should output a page of JSON from the map service.

```javascript
        let arcgisServerUrl = "https://example.domain.com/arcgis";
        let serviceUrl = "https://example.domain.com/arcgis/rest/services/.../MapServer";
        
        let serverInfo = new ServerInfo();
        serverInfo.server = arcgisServerUrl;
        serverInfo.webTierAuth = true;
        esriId.registerServers([serverInfo]);                     
```