package com.arcgis.androidsupportcases.passivelocationupdater;


import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.arcgis.androidsupportcases.passivelocationupdater.DataSaver.DataSaver;
import com.arcgis.androidsupportcases.passivelocationupdater.DataSaver.SPDataSaver;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionDeniedResponse;
import com.karumi.dexter.listener.PermissionGrantedResponse;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.single.PermissionListener;

import java.util.Date;

import butterknife.BindString;
import butterknife.BindView;
import butterknife.ButterKnife;

public class MainActivity extends AppCompatActivity {

    //Butterknife Resource and View binding
    @BindView(R.id.location_update) TextView locationText;
    @BindView(R.id.service_running_status) TextView serviceStatus;
    @BindView(R.id.service_btn) Button serviceBtn;
    @BindString(R.string.start_service) String serviceStartString;
    @BindString(R.string.stop_service) String serviceStopString;
    @BindString(R.string.service_not_started) String serviceNotStartedString;
    @BindString(R.string.service_running) String serviceRunningString;
    //End Butterknife binding

    //Start local Variables
    Intent locationService;
    DataSaver dataSaver;
    BroadcastReceiver locationUpdateReciever;
    //End local Variables

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        Dexter.initialize(this);

        dataSaver = new SPDataSaver(getApplicationContext());
        locationService = new Intent(MainActivity.this, LocationService.class);

        refreshScreen();

        locationUpdateReciever = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                refreshScreen();
            }
        };

        serviceBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!dataSaver.isServiceRunning()) {
                    //Check to see if we have permission to use location
                    Dexter.checkPermission(new PermissionListener() {
                        @Override
                        public void onPermissionGranted(PermissionGrantedResponse response) {
                            //If we do, start the service.
                            MainActivity.this.startService(locationService);
                        }

                        @Override
                        public void onPermissionDenied(PermissionDeniedResponse response) {
                        }

                        @Override
                        public void onPermissionRationaleShouldBeShown(PermissionRequest permission, PermissionToken token) {

                        }
                    }, Manifest.permission.ACCESS_FINE_LOCATION);
                } else {
                    MainActivity.this.stopService(locationService);
                }
            }
        });


    }

    /**
     * Dispatch onPause() to fragments.
     */
    @Override
    protected void onPause() {
        super.onPause();

        this.unregisterReceiver(locationUpdateReciever);
    }

    @Override
    protected void onResume() {
        super.onResume();

        IntentFilter filter = new IntentFilter(LocationUpdateUtilities.NEW_LOCATION);
        this.registerReceiver(locationUpdateReciever, filter, LocationUpdateUtilities.PRIVATE_BROADCAST_PREMISSION, null);
    }

    private void refreshScreen() {
        if(dataSaver.isServiceRunning()) {
            serviceBtn.setText(serviceStopString);
            serviceStatus.setText(serviceRunningString);
        } else {
            serviceBtn.setText(serviceStartString);
            serviceStatus.setText(serviceNotStartedString);
        }

        locationText.setText("Latest Location: \n" +
                "X: " +
                dataSaver.getLocation().getxValue() + "\n" +
                "Y: " +
                dataSaver.getLocation().getyValue() + "\n" +
                "Time: " +
                new Date(dataSaver.getLocation().getTime()).toString() + "\n" +
                "Velocity: " +
                dataSaver.getLocation().getVelocity()
        );
    }
}
