package com.arcgis.doogs.poc;

import android.app.Service;
import android.content.Intent;
import android.graphics.Color;
import android.location.Location;
import android.os.IBinder;
import android.util.Log;
import com.esri.android.geotrigger.GeotriggerBroadcastReceiver;
import com.esri.android.geotrigger.GeotriggerService;
import com.esri.android.map.ags.ArcGISFeatureLayer;
import com.esri.core.geometry.Point;
import com.esri.core.map.CallbackListener;
import com.esri.core.map.FeatureEditResult;
import com.esri.core.map.Graphic;
import com.esri.core.symbol.SimpleMarkerSymbol;
import java.util.HashMap;
import java.util.Map;

public class MyService extends Service implements GeotriggerBroadcastReceiver.LocationUpdateListener {

    public GeotriggerBroadcastReceiver mGeotriggerBroadcastReceiver;

    public static final String TAG = "GTApp";

    public ArcGISFeatureLayer mtrackingLayer;

    public String mDeviceId;

    public MyService() {

        if(mGeotriggerBroadcastReceiver == null){

            mGeotriggerBroadcastReceiver = new GeotriggerBroadcastReceiver();

        }

        if( mtrackingLayer == null){

            mtrackingLayer = new ArcGISFeatureLayer("http://services.arcgis.com/q7zPNeKmTWeh7Aor/arcgis/rest/services/Editing_Layer_Points/FeatureServer/0",ArcGISFeatureLayer.MODE.SELECTION);

        }

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        return START_STICKY;

    }

    @Override
    public void onCreate() {

        super.onCreate();

        registerReceiver(mGeotriggerBroadcastReceiver,GeotriggerBroadcastReceiver.getDefaultIntentFilter());
    }

    @Override
    public void onDestroy() {

        super.onDestroy();

        unregisterReceiver(mGeotriggerBroadcastReceiver);
    }

    @Override
    public IBinder onBind(Intent intent) {

        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public void onLocationUpdate(Location location, boolean b) {

        if(mDeviceId == null || mDeviceId == "Null"){

            try{

                mDeviceId = GeotriggerService.getDeviceId(getApplicationContext());

                if(mDeviceId == null){

                    mDeviceId = "Null";
                }

            }catch(Exception e){

                mDeviceId = "Unknow";
            }

        }

        long unixTime = System.currentTimeMillis();

        Map<String,Object> attributes = new HashMap<String,Object>();

        attributes.put("Date", unixTime);

        attributes.put("DeviceId",mDeviceId);

        Point mapPt = new Point(location.getLongitude(), location.getLatitude());

        Graphic newFeatureGraphic = new Graphic(mapPt, new SimpleMarkerSymbol(Color.RED, 10, SimpleMarkerSymbol.STYLE.CIRCLE), attributes, 0);

        Graphic[] adds = {newFeatureGraphic};

        mtrackingLayer.applyEdits(adds, null, null, new CallbackListener<FeatureEditResult[][]>() {
            @Override
            public void onCallback(FeatureEditResult[][] featureEditResults) {

                if (featureEditResults[0] != null && featureEditResults[0][0] != null && featureEditResults[0][0].isSuccess()) {

                    Log.d(TAG,"Success!");

                    Log.d(TAG,featureEditResults.toString());

                }else{

                    Log.d(TAG,"Unknown failure!");

                }
            }

            @Override
            public void onError(Throwable throwable) {

                Log.d(TAG,throwable.toString());

            }

        });
    }

}
