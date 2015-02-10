package com.example.guo7711.airplanemodesample;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import com.esri.android.map.GraphicsLayer;
import com.esri.android.map.LocationDisplayManager;
import com.esri.android.map.MapOptions;
import com.esri.android.map.MapView;
import com.esri.android.map.ags.ArcGISLocalTiledLayer;
import com.esri.android.map.ags.ArcGISTiledMapServiceLayer;
import com.esri.android.map.event.OnStatusChangedListener;
import com.esri.core.geometry.Envelope;
import com.esri.core.geometry.GeometryEngine;
import com.esri.core.geometry.LinearUnit;
import com.esri.core.geometry.Point;
import com.esri.core.geometry.SpatialReference;
import com.esri.core.geometry.Unit;
import com.esri.core.map.Graphic;
import com.esri.core.symbol.TextSymbol;


public class MainActivity extends Activity {

    MapView mMapView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // after the content of this activity is set
        // the map can be accessed from the layout
        mMapView = (MapView)findViewById(R.id.map);
        mMapView.addLayer(new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"));

        mMapView.setOnStatusChangedListener(new OnStatusChangedListener() {

            private static final long serialVersionUID = 1L;

            @Override
            public void onStatusChanged(Object source, STATUS status) {
                if (source == mMapView && status == STATUS.INITIALIZED) {

                    LocationDisplayManager lDisplayManager = mMapView.getLocationDisplayManager();
                    lDisplayManager.setAutoPanMode(LocationDisplayManager.AutoPanMode.LOCATION);

                    lDisplayManager.setLocationListener(new LocationListener() {

                        boolean locationChanged = false;

                        // Zooms to the current location when first GPS fix arrives.
                        @Override
                        public void onLocationChanged(Location loc) {
                            if (!locationChanged) {
                                locationChanged = true;
                                double locy = loc.getLatitude();
                                double locx = loc.getLongitude();
                                Point wgspoint = new Point(locx, locy);
                               
                                Point mapPoint = (Point) GeometryEngine
                                        .project(wgspoint,
                                                SpatialReference.create(4326),
                                                mMapView.getSpatialReference());
                                mMapView.zoomTo(mapPoint, 13);

                            }

                        }

                        @Override
                        public void onProviderDisabled(String arg0) {

                        }

                        @Override
                        public void onProviderEnabled(String arg0) {
                        }

                        @Override
                        public void onStatusChanged(String arg0, int arg1,
                                                    Bundle arg2) {

                        }
                    });
                    lDisplayManager.start();

                }else if(source == mMapView && status == STATUS.INITIALIZATION_FAILED)
                {
                    mMapView.addLayer(new ArcGISLocalTiledLayer(Environment.getExternalStorageDirectory().getPath()+"/ArcGIS/SanFrancisco.tpk"),0);

                }
                else
                {

                }


            }
        });

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
