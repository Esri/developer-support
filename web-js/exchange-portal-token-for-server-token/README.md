#Exchange Portal Token for Server Token
##About
When working with Portal it is sometimes necessary to directly access a federated server that is hosting Portal. In this case you probably do not want to require the user to enter their credentials twice. Fortunately it is possible to exchange a Portal token for a server token.
##Caution
It is always a bad idea to hard-code a username and password into a JavaScript application as anyone can view the source of the application and obtain your login credentials. You should prompt the user to enter credentials in a form, access those credentials and then use them to generate the token. Please view this sample as a demonstration of how to exchange a Portal token for a server token and not a recommendation on application security.
##How it works:
The following code snippets show how the code works:

Use esriRequest to generate a Portal token
```javascript
esriRequest({
	url: PORTALTOKENURL,
	content: {
		username: "<Your Portal Username>",
		password: "<Your Portal Password>",
		f:"json"
	}
	handleAs: "json",
	load: portalTokenObtained,
	error: tokenRequestFailed
}, {
	usePost: true
});
```

After the token as been obtained use esriRequest to exchange the Portal token for a server token
```javascript
esriRequest({
	url: PORTALTOKENURL,
	content: {
		token: portalToken,
		serverURL: SERVERURL,
		f: "json"
	},
	handleAs: "json",
	load: serverTokenObtained,
	error: tokenRequestFailed
}, {
	usePost:true
});
```
