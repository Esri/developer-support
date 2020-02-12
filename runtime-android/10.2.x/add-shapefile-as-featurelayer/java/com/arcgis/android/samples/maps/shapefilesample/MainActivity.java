/* Copyright 2013 ESRI
 *
 * All rights reserved under the copyright laws of the United States
 * and applicable international laws, treaties, and conventions.
 *
 * You may freely redistribute and use this sample code, with or
 * without modification, provided you include the original copyright
 * notice and use restrictions.
 *
 * See the Sample code usage restrictions document for further information.
 *
 */

package com.arcgis.android.samples.maps.shapefilesample;

import android.app.Activity;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.esri.android.map.FeatureLayer;
import com.esri.android.map.MapView;
import com.esri.android.map.event.OnStatusChangedListener;
import com.esri.core.geodatabase.ShapefileFeatureTable;
import com.esri.core.renderer.SimpleRenderer;
import com.esri.core.symbol.SimpleMarkerSymbol;

import java.io.FileNotFoundException;


public class MainActivity extends Activity {

    MapView mMapView;
    FeatureLayer featureLayer;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // after the content of this activity is set
        // the map can be accessed from the layout
        mMapView = (MapView)findViewById(R.id.map);

        ShapefileFeatureTable shapefileFeatureTable = null;
        try {
            
            shapefileFeatureTable = new ShapefileFeatureTable(Environment.getExternalStorageDirectory().getPath()+"/ArcGIS/samples/HelloWorld/shapefiletest.shp");
            featureLayer = new FeatureLayer(shapefileFeatureTable);
            featureLayer.setRenderer(new SimpleRenderer(new SimpleMarkerSymbol(
                    getResources().getColor(android.R.color.holo_blue_bright),
                    28, SimpleMarkerSymbol.STYLE.CIRCLE)));

            mMapView.addLayer(featureLayer);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
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
