/**
* A function that instantiates the DefaultAuthenticationChallengeHandler
* Provided to increase code readability
* Special note:
* This is done on the activity class since in Kotlin, extension functions
* are not yet able to be implemented on classes, only instances of classes.
*/
fun Activity.setUpDefaultChallengeHandler() {
    val defaultAuthenticationChallengeHandler = DefaultAuthenticationChallengeHandler(this)
    AuthenticationManager.setAuthenticationChallengeHandler(defaultAuthenticationChallengeHandler)
}
