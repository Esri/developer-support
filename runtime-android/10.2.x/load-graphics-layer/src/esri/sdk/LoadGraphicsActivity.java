package esri.sdk;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Toast;

import com.esri.android.map.GraphicsLayer;
import com.esri.android.map.MapView;
import com.esri.core.geometry.GeometryEngine;
import com.esri.core.geometry.Point;
import com.esri.core.geometry.SpatialReference;
import com.esri.core.map.Graphic;
import com.esri.core.symbol.PictureMarkerSymbol;
import com.esri.core.symbol.Symbol;


public class LoadGraphicsActivity extends Activity {
	
	MapView mMapView;
	private GraphicsLayer mGraphicsLayer;
	private final Random mRandom = new Random();

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        mMapView = (MapView) findViewById(R.id.map);
		Button clickButton =(Button)findViewById(R.id.button1);
		clickButton.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				Context context = getApplicationContext();
				Toast.makeText(context, "Button click detected...loading graphics", Toast.LENGTH_LONG).show();
				mGraphicsLayer = new GraphicsLayer();
				mMapView.addLayer(mGraphicsLayer);
				new Thread(new Runnable() {
			        public void run() {
			            Symbol graphicSymbol = null;
			            try {
							graphicSymbol = new PictureMarkerSymbol("http://upload.wikimedia.org/wikipedia/en/9/94/Information_icon_1(png).png");
						} catch (MalformedURLException e) {
							// TODO catch block
							e.printStackTrace();
						} catch (IOException e) {
							// TODO catch block
							e.printStackTrace();
						}

			            SpatialReference mapSpatialReference = SpatialReference.create(102100);
			            Map<String, Object> graphicAttributes = createGraphicAttributes();
			            for (int i = 0; i < 1000; ++i) {
			                Point pointLocation = geographicCoordinatesToMapPoint(mapSpatialReference,
			                        getDoubleInRange(-77, -83), getDoubleInRange(37, 43));
			                mGraphicsLayer.addGraphic(new Graphic(pointLocation, graphicSymbol, graphicAttributes));
			            }
			        }
			        
			        private double getDoubleInRange(double rangeMin, double rangeMax) {
			            return rangeMin + (rangeMax - rangeMin) * mRandom.nextDouble();
			        }
			        
			        public Point geographicCoordinatesToMapPoint(SpatialReference spatialReference,
			                double longitude, double latitude) {

			            return (Point) GeometryEngine.project(new Point(longitude, latitude),
			                    SpatialReference.create(4326),
			                    spatialReference);
			        }
			        
			        private Map<String, Object> createGraphicAttributes() {
			            Map<String, Object> returnMap = new HashMap<String, Object>();
			            returnMap.put("Key", "Value");
			            return returnMap;
			        }
			        
			    }).start();		
			}
			
		});

    }

	@Override
	protected void onDestroy() {
		super.onDestroy();
 }
	@Override
	protected void onPause() {
		super.onPause();
		mMapView.pause();
 }
	@Override
	protected void onResume() {
		super.onResume();
		mMapView.unpause();
	}

}