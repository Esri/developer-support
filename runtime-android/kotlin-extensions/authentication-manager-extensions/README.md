# Authentication Manager Extensions
## What are these extension functions for?
These extension functions are for the [Authentication Manager class](https://developers.arcgis.com/android/latest/api-reference/reference/com/esri/arcgisruntime/security/AuthenticationManager.html)

## How do I contribute?
Append your extension to the `AuthenticationManagerExt.kt` file and then post a short description of the extension function on this page (preferably in the order you added it to the file)

## Functions

### fun Activity.setUpDefaultChallengeHandler()
Instantiates the DefaultAuthenticationChallengeHandler.  Doing it this way increases code readability inside the application.  Additionally, this is done on the activity class rather than the AuthenticaionManager class since extension functions are not yet able to be implemented on classes themselves, only instances of classes.  In the future, we should plan on moving this to the AuthenticaionManager class (once that fix makes it into the kotlin language)
