package com.example.tilecachetask;

import android.app.Activity;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.esri.android.map.MapView;
import com.esri.android.map.ags.ArcGISDynamicMapServiceLayer;
import com.esri.android.map.ags.ArcGISLocalTiledLayer;
import com.esri.android.map.ags.ArcGISTiledMapServiceLayer;
import com.esri.core.map.CallbackListener;
import com.esri.core.tasks.tilecache.GenerateTileCacheParameters;
import com.esri.core.tasks.tilecache.TileCacheStatus;
import com.esri.core.tasks.tilecache.TileCacheTask;

import java.io.File;

public class MainActivity extends Activity {

    protected static final String TAG = "OfflineEditorActivity";
    private MapView mapView;
    int layersloaded=0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mapView = ((MapView) findViewById(R.id.map));
        mapView.addLayer(new ArcGISDynamicMapServiceLayer(
                "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"));
        mapView.addLayer(new ArcGISTiledMapServiceLayer("http://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Street_Map/MapServer"));

        File tilefile = new File(Environment.getExternalStorageDirectory(),"tile2");
        if(!tilefile.exists()){
            if(!tilefile.mkdir()){
                Log.e(TAG,"directory creation failed");
            }
            Log.e(TAG,"Directory Creation succeeded");
        }
        final String gdbFileDir = tilefile.getPath();
        final String gdbFileName = gdbFileDir+"/test.tpk";

        Button button1 = (Button) findViewById(R.id.button);
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                downloadBasemap(mapView, gdbFileName);
            }
        });


    }

    private static void downloadBasemap (final MapView mapView, String gdbFileName){
        double[] levels = {0,1,2,3};

        CallbackListener<Long> estimatecallback = new CallbackListener<Long>() {
            @Override
            public void onCallback(Long aLong) {
                Log.e(TAG,"----------------Cache Size:---------------------" + aLong + " bytes");

            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG,"==============error==================="+throwable);
            }
        };

        CallbackListener<TileCacheStatus> callback = new CallbackListener<TileCacheStatus>() {

            @Override
            public void onCallback(TileCacheStatus objs) {
                //showMessage(activity, "TileRequest accepted");
                Log.e(TAG, "TileRequest accepted - "+objs);
            }

            @Override
            public void onError(Throwable e) {
                Log.e(TAG, "onError in callback: " + e.getMessage());

            }
        };

        CallbackListener<String> downloadCallback = new CallbackListener<String>() {

            @Override
            public void onCallback(String objs) {
                Log.e(TAG, "Download callback - "+objs);
                mapView.removeLayer(1);
                ArcGISLocalTiledLayer localTiledLayer = new ArcGISLocalTiledLayer(
                        objs);
                mapView.addLayer(localTiledLayer);
            }

            @Override
            public void onError(Throwable e) {
                Log.e(TAG, "onError in downloadCallback: " + e.getMessage());
            }
        };

        TileCacheTask tileCacheTask = new TileCacheTask("http://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Street_Map/MapServer", null);

        GenerateTileCacheParameters tileCacheParams = new GenerateTileCacheParameters(
                true, levels, GenerateTileCacheParameters.ExportBy.ID, mapView.getExtent(),
                mapView.getSpatialReference());

        //perform estimate
        tileCacheTask.estimateTileCacheSize(tileCacheParams,estimatecallback);

        //perform the actual dl
        tileCacheTask.submitTileCacheJobAndDownload(tileCacheParams, callback,
                downloadCallback, gdbFileName);


    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mapView.pause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        mapView.unpause();

    }


}
