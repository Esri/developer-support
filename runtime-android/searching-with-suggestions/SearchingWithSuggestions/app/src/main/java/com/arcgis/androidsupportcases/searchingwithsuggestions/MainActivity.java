package com.arcgis.androidsupportcases.searchingwithsuggestions;

import android.app.SearchManager;
import android.content.Intent;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.SearchView;
import android.util.Log;
import android.view.Menu;

import com.arcgis.androidsupportcases.searchingwithsuggestions.Data.SuggestionHolder;
import com.esri.android.map.GraphicsLayer;
import com.esri.android.map.MapView;
import com.esri.core.geometry.Geometry;
import com.esri.core.geometry.GeometryEngine;
import com.esri.core.geometry.Point;
import com.esri.core.geometry.SpatialReference;
import com.esri.core.map.Graphic;
import com.esri.core.symbol.SimpleMarkerSymbol;
import com.esri.core.tasks.geocode.LocatorGeocodeResult;

public class MainActivity extends AppCompatActivity {

    MapView mMapView;
    GraphicsLayer gL;
    private final String TAG = "ESS";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mMapView = (MapView) findViewById(R.id.map);
        gL = new GraphicsLayer(GraphicsLayer.RenderingMode.DYNAMIC);
        mMapView.addLayer(gL);
        handleIntent(getIntent());
    }

    /**
     * Handle onNewIntent() to inform the fragment manager that the
     * state is not saved.  If you are handling new intents and may be
     * making changes to the fragment state, you want to be sure to call
     * through to the super-class here first.  Otherwise, if your state
     * is saved but the activity is not stopped, you could get an
     * onNewIntent() call which happens before onResume() and trying to
     * perform fragment operations at that point will throw IllegalStateException
     * because the fragment manager thinks the state is still saved.
     *
     * @param intent
     */
    @Override
    protected void onNewIntent(Intent intent) {
        setIntent(intent);
        handleIntent(intent);
    }

    /** This will add the point to the mapview if the intent is ACTION_VIEW.  This will be invoked
     *  when the search suggestion is clicked on.
     */
    private void handleIntent(Intent intent) {
        if(Intent.ACTION_VIEW.equals(intent.getAction())) {
            Log.d(TAG, intent.getData().toString());
            LocatorGeocodeResult lgr = SuggestionHolder.getInstance().FindFeatureFromSearch(Integer.parseInt(String.valueOf(intent.getData())));
            Log.d(TAG,lgr.getAttributes().toString());
            Point point = new Point(Double.parseDouble(lgr.getAttributes().get("DisplayX")), Double.parseDouble(lgr.getAttributes().get("DisplayY")));
            addAddressToMap(point);
        }
    }

    /**
     * This creates the menu and the search widget.
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.search_menu, menu);

        SearchManager searchManager = (SearchManager) getSystemService(SEARCH_SERVICE);
        SearchView searchView = (SearchView) menu.findItem(R.id.app_bar_search).getActionView();
        searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));
        searchView.setIconified(true);

        return true;
    }

    /**
     *
     * This adds the geocoded point to the mapview.
     */
    public void addAddressToMap(Point point) {
        gL.removeAll();
        Geometry x = GeometryEngine.project(point, SpatialReference.create(4326),SpatialReference.create(102100));
        gL.addGraphic(new Graphic(x, new SimpleMarkerSymbol(Color.RED, 12, SimpleMarkerSymbol.STYLE.DIAMOND)));
        mMapView.zoomToScale((Point) x, 15000);
    }

}
