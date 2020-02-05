# Register Server Token with Identity Manager

## About
The IdentityManager class manages user credentials for secure resources. After credentials have been registered with the IdentityManager tokens will be automatically appended to requests to secured resources. In some cases developers may want to generate a token using custom code and later register the token with the IdentityManager. Reasons for this may include the need to create the token with server side code, the need to create a custom login screen seperate from the map view or the need retrieve a Server token from a cookie or local storage. This allows the developer to control how a token is created but does not force them to control how the token is used. oAuth tokens can easily be registered with IdentityManager using it's registerToken method. However ArcGIS Server does not issue oAuth tokens. Registering an ArcGIS Server token with IdentityManager is more complex.

[Live Sample](https://nhaney90.github.io/register-server-token-with-identity-manager/index.html)

## Usage Notes
To register an ArcGIS Server token with IdentityManager you must call the initialize method and pass in a JSON object representing the credentials you wish to register. The parameters of this credentials object are undocumented. A discussion of how to construct this object [can be found here] (https://geonet.esri.com/thread/119908). Remember, the token must be registed with the IdentityManager before attempting to add a secured layer to the map. Otherwise the user will be prompted to sign-in.

## How It Works
Use EsriRequest to generate a token.
```javascript
esriRequest({
    url: "https://sampleserver6.arcgisonline.com/arcgis/tokens/",
    content: {
        request: "getToken",
        username: "user1",
        password: "user1",
        expiration: 60,
        f: "json"
    },
    handleAs: "json",
    load: tokenObtained,
    error: tokenRequestFailed
}, {
    usePost: true
});
```

Create the credentials object using information about the secured service, the userId of the user who generated the token and the token you wish to register.
```javascript
var credentialsJSON = {
	serverInfos: [{
		server: "https://sampleserver6.arcgisonline.com",
		tokenServiceUrl: "https://sampleserver6.arcgisonline.com/arcgis/tokens/",
		adminTokenServiceUrl: "https://sampleserver6.arcgisonline.com/arcgis/admin/generateToken",
		shortLivedTokenValidity: 60,
		currentVersion: 10.41,
		hasServer: true
	}],
	oAuthInfos: [],
	credentials: [{
		userId: "user1",
		server: "https://sampleserver6.arcgisonline.com/arcgis",
		token: tokenInfo.token,
		expires: tokenInfo.expires,
		validity: 60,
		isAdmin: false,
		ssl: false,
		creationTime: tokenInfo.expires - (60000 * 60),
		scope: "server",
		resources: [
			securedService
		]
	}]
};
```

Call the initialize method to register the token with the IdentityManager.
```javascript
esriId.initialize(credentialsJSON);
```
