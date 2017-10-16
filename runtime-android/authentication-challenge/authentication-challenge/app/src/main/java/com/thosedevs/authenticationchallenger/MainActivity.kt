package com.thosedevs.authenticationchallenger

import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.app.Dialog
import android.app.DialogFragment
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.EditText
import android.widget.Toast
import com.esri.arcgisruntime.layers.ArcGISMapImageLayer
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.Basemap
import com.esri.arcgisruntime.security.*
import kotlinx.android.synthetic.main.activity_main.*
import java.util.concurrent.CountDownLatch


class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        //Uncomment to see default behavior.  If uncommented comment out line below to start default behavior
        //setUpDefaultChallengeHandler()

        //Comment this out to see default behavior and uncomment the line above this one.
        AuthenticationManager.setAuthenticationChallengeHandler(CustomAuthenticationChallengeHandler(this))

        map.map = ArcGISMap(Basemap.createDarkGrayCanvasVector())
        val secureLayer = ArcGISMapImageLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire_secure/MapServer")
        map.map.operationalLayers.add(secureLayer)

        secureLayer.addDoneLoadingListener({Log.e("NOHE", "DONE")})
    }

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

    @SuppressLint("ValidFragment")
    class LoginDialog(val context: Activity?,
                      challengeHandler: LoginDialog.LoginDialogListener) : DialogFragment() {

        private var mListener: LoginDialogListener = challengeHandler

        lateinit var authChallengeResponse: AuthenticationChallengeResponse

        override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
            val builder = AlertDialog.Builder(context)
            val inflater = activity.layoutInflater
            val dialogView = inflater.inflate(R.layout.login_dialog_layout, null)
            val password: EditText = dialogView.findViewById(R.id.password)
            val username: EditText = dialogView.findViewById(R.id.username)

            builder.setView(dialogView)
                    .setPositiveButton("Sign in", { _dialogInterface, _id ->
                        if(!username.text.isNullOrBlank() && !password.text.isNullOrBlank()) {
                            authChallengeResponse = AuthenticationChallengeResponse(
                                    AuthenticationChallengeResponse.Action.CONTINUE_WITH_CREDENTIAL,
                                    UserCredential(username.text.toString(), password.text.toString()))
                            mListener.onDialogClick(this)
                        } else {
                            Toast.makeText(context, "Username / Password blank", Toast.LENGTH_SHORT)
                                    .show()
                        }

                    })
                    .setNegativeButton("Cancel", {
                        dl, _ ->
                        authChallengeResponse = AuthenticationChallengeResponse(
                                AuthenticationChallengeResponse.Action.CANCEL,
                                null
                        )
                        this.dialog.cancel()
                        mListener.onDialogClick(this)
                    })
            return builder.create()
        }

        interface LoginDialogListener {
            fun onDialogClick(dialog: DialogFragment)
        }
    }


}

fun Activity.setUpDefaultChallengeHandler() {
    val defaultAuthenticationChallengeHandler = DefaultAuthenticationChallengeHandler(this)
    AuthenticationManager.setAuthenticationChallengeHandler(defaultAuthenticationChallengeHandler)
}
