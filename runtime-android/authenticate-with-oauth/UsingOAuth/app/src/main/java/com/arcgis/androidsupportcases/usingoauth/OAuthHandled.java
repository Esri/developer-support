package com.arcgis.androidsupportcases.usingoauth;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.esri.arcgisruntime.mapping.ArcGISMap;
import com.esri.arcgisruntime.mapping.Basemap;
import com.esri.arcgisruntime.mapping.view.MapView;
import com.esri.arcgisruntime.security.OAuthLoginManager;

public class OAuthHandled extends AppCompatActivity {

    MapView mapView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        OAuthManagement.getInstance().handleTokenCredential(getIntent());
        setContentView(R.layout.activity_oauth_handled);

        mapView = (MapView) findViewById(R.id.mapView);
        ArcGISMap map = new ArcGISMap(Basemap.Type.DARK_GRAY_CANVAS_VECTOR,0,0,3);
        mapView.setMap(map);
    }
}
