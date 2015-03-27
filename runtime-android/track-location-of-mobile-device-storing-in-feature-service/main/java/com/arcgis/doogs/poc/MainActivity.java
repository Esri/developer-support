package com.arcgis.doogs.poc;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;

import com.esri.android.geotrigger.GeotriggerService;
import com.esri.android.map.ags.ArcGISFeatureLayer;


public class MainActivity extends ActionBarActivity {

    public static final String TAG = "GTApp";

    public ArcGISFeatureLayer trackingLayer;

    private static final String AGO_CLIENT_ID = "<ArcGISOnline-ClientID>";

    private static final String GCM_SENDER_ID = "<Google-Project-Number>";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        GeotriggerHelper.startGeotriggerService(this, AGO_CLIENT_ID, GCM_SENDER_ID, null,
                GeotriggerService.TRACKING_PROFILE_ADAPTIVE);

        Intent intent = new Intent(this, MyService.class);
        startService(intent);
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_stop) {
            GeotriggerService.stop(this);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

}