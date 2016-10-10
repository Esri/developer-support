package com.arcgis.androidsupportcases.passivelocationupdater.DataSaver;

import android.os.Bundle;

/**
 * Created by alex7370 on 10/10/2016.
 * Used in the event someone wants to use Realm or another database
 */

public interface DataSaver {

    void saveLocation(double x, double y, long time, float velocity);

    DataSaverLocation getLocation();

    boolean isServiceRunning();

    void setServiceRunning(boolean running);

}
