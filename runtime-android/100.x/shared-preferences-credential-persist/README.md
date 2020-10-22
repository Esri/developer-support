# Store credentials using SharedPreferencesCredentialPersistence

This application demonstrates how to use the new class SharedPreferencesCredentialPersistence available at 100.9 ArcGIS Android Runtime SDK.
This class allows you to store the credentials of a user (with permission), so that they do not have to login every time they close out of the application.
Only issue with this sample, is that once you store the credentials in the Android SharedPreferences xml, then you have to restart the app for the app to recognize the changes.
At the moment, when you store the credentials, you are redirected to the MainActivity, and it prompts again for credentials, but a user can just cancel and the data will still load.

![SharedPreferences](https://github.com/banuelosj/developer-support/blob/master/runtime-android/100.x/shared-preferences-credential-persist/demo.gif)

## How to use the sample
1. Once the application loads, it will prompt for sign in.
   Username: user1
   Password: user1
2. The data will load, and a user can now click on the "Store Credentials" button.
3. Clicking the button will redirect the user to a Login Fragment, where a user can enter their username and password, then click the "Save" button to store the credentials.
4. Once the "Save" button is clicked, the user is redirected back to the MainActivity.
5. After a user closes out of the app, and re-opens the app, they will no longer be prompted to sign in.

## Relevant API
* SharedPreferencesCredentialPersistence
* UserCredential
* AuthenticationManager
* CredentialCacheEntry
* [SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences)
* [FragmentManager](https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentManager)