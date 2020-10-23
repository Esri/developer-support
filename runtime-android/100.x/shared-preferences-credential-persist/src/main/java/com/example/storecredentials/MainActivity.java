package com.example.storecredentials;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.esri.arcgisruntime.layers.ArcGISMapImageLayer;
import com.esri.arcgisruntime.loadable.LoadStatus;
import com.esri.arcgisruntime.mapping.ArcGISMap;
import com.esri.arcgisruntime.mapping.Basemap;
import com.esri.arcgisruntime.mapping.view.MapView;
import com.esri.arcgisruntime.security.AuthenticationChallengeHandler;
import com.esri.arcgisruntime.security.AuthenticationManager;
import com.esri.arcgisruntime.security.Credential;
import com.esri.arcgisruntime.security.CredentialCacheEntry;
import com.esri.arcgisruntime.security.CredentialPersistence;
import com.esri.arcgisruntime.security.DefaultAuthenticationChallengeHandler;
import com.esri.arcgisruntime.security.SharedPreferencesCredentialPersistence;
import com.esri.arcgisruntime.security.UserCredential;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * This application demonstrates how to use the new class SharedPreferencesCredentialPersistence
 * available at 100.9 ArcGIS Android Runtime SDK.
 * This class allows you to store the credentials of a user (with permission), so that they do not
 * have to login every time they close out of the application.
 * **/

public class MainActivity extends AppCompatActivity {
    private String TAG = "Main Activity...";
    private MapView mapview;
    private Button btnCache;
    private UserCredential storedCred;
    private Boolean isStored = false;

    public static FragmentManager fragmentManager;
    public LoginFragment loginFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mapview = findViewById(R.id.mapViewTest);
        btnCache = findViewById(R.id.buttonCache);

        // initialize fragment manager
        fragmentManager = getSupportFragmentManager();

        btnCache.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openLoginFragment();
            }
        });

        ArcGISMap map = new ArcGISMap(Basemap.createLightGrayCanvas());
        mapview.setMap(map);

        AuthenticationChallengeHandler handler = new DefaultAuthenticationChallengeHandler(this);
        AuthenticationManager.setAuthenticationChallengeHandler(handler);

        // check to see if there are any shared preferences first
        SharedPreferences sharedPreferences = getSharedPreferences("com.esri.arcgisruntime.security.SharedPreferencesCredentialPersistence", Context.MODE_PRIVATE);
        if(sharedPreferences != null && sharedPreferences.getAll().size() > 0) {
            Log.i(TAG, "we can grab credentials now...");
            // hide button
            btnCache.setVisibility(View.INVISIBLE);

            // parse the xml file for the username and password
            try {
                String key = "";
                Map<String, ?> preferencesMap = sharedPreferences.getAll();
                for (Map.Entry<String, ?> entry : preferencesMap.entrySet()) {
                    // find the key that contains the username and password as there are keys without them
                    if(entry.getKey().contains("username")) {
                        key = entry.getKey();
                        break;
                    }
                }
                int usernamePos = key.indexOf("username");
                int passwordPos = key.indexOf("password");
                int usernameStartPos = key.indexOf(":", usernamePos) + 3;
                String usernameStr = key.substring(usernameStartPos, key.indexOf('"', usernameStartPos) - 1);
                int passwordStartPos = key.indexOf(":", passwordPos) + 3;
                String passwordStr = key.substring(passwordStartPos, key.indexOf('"', passwordStartPos) - 1);

                // create a UserCredential Object from the username and password of the SharedPreferences file
                storedCred = new UserCredential(usernameStr, passwordStr);
                isStored = true;
                displayLayer(storedCred);
            } catch (Exception ex ) {
                Log.i(TAG, "Failed to obtain sharedPreferences: " + ex.getMessage());
            }

        } else {
            displayLayer();
        }
    }

    // stores the credentials to SharedPreferences
    private void storeCache(String u, String p) {
        try {
            // setting persistance
            SharedPreferencesCredentialPersistence spcPersistence = new SharedPreferencesCredentialPersistence(this);
            Credential cred = new UserCredential(u, p);

            CredentialCacheEntry ccEntry = new CredentialCacheEntry(AuthenticationManager.CredentialCache.toJson(), cred);
            spcPersistence.add(ccEntry);

            AuthenticationManager.CredentialCache.setPersistence(spcPersistence);
            Toast.makeText(this, "successfully stored credentials...", Toast.LENGTH_LONG).show();
            displayLayer((UserCredential) cred);
        } catch(Exception ex) {
            Log.i(TAG, "error to set persistence: " + ex.getMessage());
        }
    }

    private void displayLayer(UserCredential credential) {
        ArcGISMapImageLayer mapImageLayer = new ArcGISMapImageLayer(getString(R.string.serviceUrl));
        mapImageLayer.setCredential(credential);
        mapview.getMap().getOperationalLayers().add(mapImageLayer);
    }

    private void displayLayer() {
        ArcGISMapImageLayer mapImageLayer = new ArcGISMapImageLayer(getString(R.string.serviceUrl));
        mapview.getMap().getOperationalLayers().add(mapImageLayer);
        mapImageLayer.addDoneLoadingListener(() -> {
            if(mapImageLayer.getLoadStatus() == LoadStatus.LOADED) {
                Log.i(TAG, "No sharedPreferences found, please click the button to store credentials!");
            }
        });
    }

    public void openLoginFragment() {
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        loginFragment = new LoginFragment();
        fragmentTransaction.add(R.id.fragment_container, loginFragment, null);
        fragmentTransaction.commit();
    }

    public void getCreds(String username, String password) {
        // Grab credentials sent from the LoginActivity
        if(username != null && password != null) {
            storeCache(username, password);
            // hide stored credentials button
            btnCache.setVisibility(View.INVISIBLE);
        }
    }

    public void closeLoginFragment() {
        Log.i(TAG, "closing....");
        //Here we are clearing back stack fragment entries
        List<Fragment> fragments = fragmentManager.getFragments();
        fragmentManager.beginTransaction().remove(fragments.get(0)).commit();
    }


    @Override protected void onResume() {
        mapview.resume();
        super.onResume();
    }

    @Override protected void onPause() {
        mapview.pause();
        super.onPause();
    }

    @Override protected void onDestroy() {
        mapview.dispose();
        super.onDestroy();
    }
}

