# Custom Authentication Dialogs

## Use Case:
You want to apply a custom theming to your application as well as maybe change the way you authenticate users.
This is meant as a guide on how to set up some basic authentication and is not meant to be comprehensive.  There is still quite a bit of work to be done for this considered to be a comprehensive solution for any developer.

## What is in this sample:
#### MainActivity.kt
This is the main activity that the user runs in their application.

Here we use an extension function so the user can see the default authentication manager before they test out the new one.
```kotlin
fun Activity.setUpDefaultChallengeHandler() {
    val defaultAuthenticationChallengeHandler = DefaultAuthenticationChallengeHandler(this)
    AuthenticationManager.setAuthenticationChallengeHandler(defaultAuthenticationChallengeHandler)
}
```

We then create a custom class that handles each type of different authentication challenge but for the sake of a simple sample, we are just going to check for a UserCredential challenge.  The username and password for this sample is `user1` / `user1`:
```kotlin
class CustomAuthenticationChallengeHandler(val context: Activity?) : DefaultAuthenticationChallengeHandler(context),
LoginDialog.LoginDialogListener {
    override fun onDialogClick(dialog: DialogFragment) {
        when(dialog) {
            is LoginDialog -> countDownLatch.countDown()
        }
    }

    var countDownLatch = CountDownLatch(0)
    override fun handleChallenge(challenge: AuthenticationChallenge?): AuthenticationChallengeResponse {
        return if (challenge?.type == AuthenticationChallenge.Type.USER_CREDENTIAL_CHALLENGE) {
            countDownLatch = CountDownLatch(1)
            val loginDialog = LoginDialog(context, this)
            loginDialog.show(context?.fragmentManager, "Challenger")
            countDownLatch.await()
            loginDialog.authChallengeResponse
        } else {
            super.handleChallenge(challenge)
        }
    }


}
```

The countdown latch is used to prevent the dialog from executing asynchronously.  If we did not have the countdown latch present, the layer would load immediately and fail.  This halts loading until the dialog is dismissed by either passing in the credentials or canceling the dialog.

## Useful References:

* [Kotlin Lang](https://kotlinlang.org)
* [Extension Functions](https://kotlinlang.org/docs/reference/extensions.html)
* [AuthenticationManager](https://developers.arcgis.com/android/latest/api-reference/reference/com/esri/arcgisruntime/security/AuthenticationManager.html)
* [AuthenticationChallengeResponse](https://developers.arcgis.com/android/latest/api-reference/reference/com/esri/arcgisruntime/security/AuthenticationChallengeResponse.html)
