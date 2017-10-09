# Authenticate to ArcGIS Online / ArcGIS Portal using OAuth

Shows how to signin to ArcGIS Online / Portal using built in ArcGIS iOS SDK OAuth components.  It's important that the redirect uri value contains this string once the application has been created
on the ArcGIS for Developer's website contains this string urn:ietf:wg:oauth:2.0:oob.

[AGSOAuthLoginViewController Class Reference](https://developers.arcgis.com/ios/api-reference/interface_a_g_s_o_auth_login_view_controller.html)

[OAuth Login Sample (more advanced)](https://github.com/Esri/arcgis-runtime-samples-ios/tree/5e2729274f34c02fa3221797bde3f1f98ee4fc7f/OAuth%20Login%20Sample)

## Features

* Authenticate and show logged in username
* Uses AGSPortalDelegates to check for failed login or successful login


NOTE: To see a more advanced sample look at the [OAuth Login Sample](https://github.com/Esri/arcgis-runtime-samples-ios/tree/5e2729274f34c02fa3221797bde3f1f98ee4fc7f/OAuth%20Login%20Sample) originally created by Divesh.
