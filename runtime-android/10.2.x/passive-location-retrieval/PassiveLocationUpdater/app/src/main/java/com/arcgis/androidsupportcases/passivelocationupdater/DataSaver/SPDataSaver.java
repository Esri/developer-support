package com.arcgis.androidsupportcases.passivelocationupdater.DataSaver;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

/**
 * Created by alex7370 on 10/10/2016.
 */

public class SPDataSaver implements DataSaver {

    private SharedPreferences sharedPreferences;

    private static final String TAG = "PREFERENCESAVER";

    //Preferences
    private static final String LocationPreferences = "LOCATIONPREF";
    private static final String XValue = "XVALUE";
    private static final String YValue = "YVALUE";
    private static final String Time = "TIME";
    private static final String Velocity = "VELOCITY";
    private static final String ServiceRunning = "SERVICERUNNINGBOOL";
    //EndPreferences

    public SPDataSaver(Context applicationContext) {
        sharedPreferences = applicationContext.getSharedPreferences(LocationPreferences, Context.MODE_PRIVATE);
    }

    @Override
    public void saveLocation(double x, double y, long time, float velocity) {
        Log.d(TAG, "Storing Location");
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putFloat(XValue, (float) x).apply();
        editor.putFloat(YValue, (float) y).apply();
        editor.putLong(Time, time).apply();
        editor.putFloat(Velocity, velocity).apply();
    }

    @Override
    public DataSaverLocation getLocation() {

        return new DataSaverLocation(
                sharedPreferences.getFloat(XValue, 0),
                sharedPreferences.getFloat(YValue, 0),
                sharedPreferences.getLong(Time, 0),
                sharedPreferences.getFloat(Velocity, 0)
        );

    }

    @Override
    public boolean isServiceRunning() {
        return sharedPreferences.getBoolean(ServiceRunning, false);
    }

    @Override
    public void setServiceRunning(boolean running) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putBoolean(ServiceRunning, running).apply();
    }
}
