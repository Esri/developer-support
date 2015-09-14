package com.arcgis.doogs.statuslistener;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.esri.android.map.Layer;
import com.esri.android.map.MapView;
import com.esri.android.map.event.OnStatusChangedListener;


public class MainActivity extends ActionBarActivity {

    MapView mMapView;

    private static final String TAG = "MAINACTIVITYTAG";

    //private static final String TILED_WORLD_STREETS_URL = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        mMapView = (MapView)findViewById(R.id.map);

        //mMapView.addLayer(new ArcGISTiledMapServiceLayer(TILED_WORLD_STREETS_URL));

        mMapView.setOnStatusChangedListener(new OnStatusChangedListener() {

            private static final long serialVersionUID = 1L;

            @Override
            public void onStatusChanged(Object source, STATUS status) {

                boolean isAirplaneModeOn = MainActivity.this.isAirplaneModeOn();

                if(isAirplaneModeOn){ //This check could also be done when associating the MapView with the layout in onCreate

                    Log.d(TAG,"Application has detected that your device is in airplane mode.");

                }

                if ((status == STATUS.INITIALIZED) && (source instanceof MapView )) {

                    boolean concerns = MainActivity.this.isConnectedToInternet();

                    if(!concerns){

                        Log.d(TAG,"Map initialization succeeded but application detected internet connection problems.");

                    }else{

                        Log.d(TAG,"Map initialization succeeded");

                    }

                }

                if ((status == STATUS.INITIALIZATION_FAILED) && (source instanceof MapView )) {

                    Log.d(TAG,"Map initialization failed");

                }

                if ((status == STATUS.LAYER_LOADED) && (source instanceof Layer)) {

                    boolean concerns = MainActivity.this.isConnectedToInternet();

                    if(!concerns){

                        Log.d(TAG,"Layer loaded succeeded but the application has detected there is no internet connection.");

                    }else{

                        Log.d(TAG,"Layer load succeeded");

                    }

                }

                if ((status == STATUS.LAYER_LOADING_FAILED) && (source instanceof Layer)) {

                    Log.d(TAG,"Layer failed to load");

                }

            }

        });
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        getMenuInflater().inflate(R.menu.menu_main, menu);

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        int id = item.getItemId();

        if (id == R.id.action_settings) {

            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public boolean isConnectedToInternet(){  //make sure manifest has ACCESS_NETWORK_STATE

        //Warning not tested. Proof of concept to help alert / handle cases where Internet connection is poor, aka use offline maps

        Context context = getApplicationContext();

        ConnectivityManager cm = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();

        boolean isConnected = activeNetwork != null && activeNetwork.isConnectedOrConnecting();

        return isConnected;

    }

    public boolean isAirplaneModeOn() {

        Context context = getApplicationContext();

        //Warning deprication announcements, tread carefully.  Settings.Global in Jelly Bean+
        //Simple airplane mode checks and handling may be best done inside a Broadcast Receiver
        //http://stackoverflow.com/questions/4319212/how-can-one-detect-airplane-mode-on-android

        return Settings.System.getInt(context.getContentResolver(), Settings.System.AIRPLANE_MODE_ON, 0) != 0;

    }
}
