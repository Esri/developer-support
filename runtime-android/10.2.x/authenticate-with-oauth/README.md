# Authenticate and License with OAuth

## Use case:
You have a user that ou want to authenticate with your application and you would like to use their portals named user license to check out either a Lite or Basic license.

## What is in this sample:
#### MainActivity.java
This is the entrance of the application and has a button that makes a call to our singleton **OAuthManagement** which sets up our OAuth management for this application.

#### OAuthManagement.java
This is a singleton that goes and creates the OAuthLoginManager which we then use to launch the browser (which shows the OAuth screen) and when the browser returns, we need to handle the return by passing the intent to the handleTokenCredential method.  In here, we log the user into Portal from OAuth and we additionally license the application from the newly created portal object / user.

#### OAuthHandled.java
This is where the OAuth login is handled.  In the **OAuthManagement.java** file, we specify that the callback URI is ```com.arcgis.androidsupportcases://myCode``` which is also configured as an allowed domain under the Authentications tab on the [Applications page](https://developers.arcgis.com/applications/#/) in the **Redirect URI** heading (On this page, I listed com.arcgis.androidsupportcases).  When this activity is launched, it makes a call to OAuthManagement.handleTokenCredential(Intent).  This would then run the login process using the OAuthCredentials.

#### AndroidManifest.xml

In order to get the RedirectURI to work, we need to apply an intent-filter to handle when the URI is invoked by the web browser.  We did the following for our OAuthHandled activity:

```xml
<activity android:name=".OAuthHandled">
    <intent-filter>
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="com.arcgis.androidsupportcases" />
        <action android:name="android.intent.action.VIEW" />
    </intent-filter>
</activity>
```

The scheme is the redirect uri we specified in OAuthManagement.java.  The browsable target activity allows the activity to be started by a web browser and use the data that is invoking that activity.

## Useful References:

* Android Programming: The Big Nerd Ranch Guide (Chapter 26: Background Services) (ISBN-13: 978-0134171456)
* [Category_Browsable](https://developer.android.com/reference/android/content/Intent.html#CATEGORY_BROWSABLE)
* [ArcGIS Runtime Version 100](https://developers.arcgis.com/android/)
* [License your app](https://developers.arcgis.com/android/latest/guide/license-your-app.htm)
