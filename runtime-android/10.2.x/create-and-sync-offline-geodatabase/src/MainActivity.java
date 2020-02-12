package com.example.createsyncenabledofflinegeodatabase;

import java.util.Map;
import com.esri.core.ags.FeatureServiceInfo;
import com.esri.core.geodatabase.Geodatabase;
import com.esri.core.geodatabase.GeodatabaseFeatureTableEditErrors;
import com.esri.core.map.CallbackListener;
import com.esri.core.tasks.geodatabase.GenerateGeodatabaseParameters;
import com.esri.core.tasks.geodatabase.GeodatabaseStatusCallback;
import com.esri.core.tasks.geodatabase.GeodatabaseStatusInfo;
import com.esri.core.tasks.geodatabase.GeodatabaseSyncTask;
import com.esri.core.tasks.geodatabase.SyncGeodatabaseParameters;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Toast;

/*
 * OTHER SERVICES
 * 		//http://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/Buffer%20of%20NapervilleShelters%20-%20Shelters/FeatureServer
		//http://services.arcgis.com/Wl7Y1m92PbjtJs5n/ArcGIS/rest/services/crops_duplicate/FeatureServer
 */

public class MainActivity extends Activity {
	
	private static final String TAG = "SAMPLE_ANDROID_APP";
	private static GeodatabaseSyncTask gdbSyncTask;	
	private static final String DEFAULT_GDB_PATH = Environment.getExternalStorageDirectory().getPath() + "/Doogle/boo.geodatabase";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		Button clickButton =(Button)findViewById(R.id.button1);
		clickButton.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Context context = getApplicationContext();
				Toast.makeText(context, "test create geodatabase!", Toast.LENGTH_LONG).show();
				//Lets do this one inside a thread...
				new Thread(new Runnable() {
			        public void run() {
			        	setupOfflineGeodatabase();
			        }
			    }).start();		
			}
			
		});
		
		
		Button syncButton =(Button)findViewById(R.id.button2);
		syncButton.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Context context = getApplicationContext();
				Toast.makeText(context, "test sync!", Toast.LENGTH_SHORT).show();
				try {
					syncGeodatabase();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			
		});
		
	}
	private void setupOfflineGeodatabase() {
		Log.i(TAG, "Getting ArcGIS FeatureService Metadata");			
		//Create GeodatabaseTask Object in order to get Feature Service information / metadata
		gdbSyncTask = new GeodatabaseSyncTask("http://yuew.esri.com:6080/arcgis/rest/services/SFPoint/FeatureServer", null);
		gdbSyncTask.fetchFeatureServiceInfo(new CallbackListener<FeatureServiceInfo>() {
					@Override
					public void onError(Throwable arg0) {
						Log.e(TAG, "Error fetching FeatureServiceInfo");
					}
					@Override
					public void onCallback(FeatureServiceInfo fsInfo) {
						if (fsInfo.isSyncEnabled()) {
							createGeodatabase(fsInfo);
						}
					}
				});
	}

	private static void createGeodatabase(FeatureServiceInfo featureServerInfo) {
		Log.i(TAG, "Creating sync enabled offline geodatabase from Feature Service");
		GenerateGeodatabaseParameters params = new GenerateGeodatabaseParameters(
				featureServerInfo, featureServerInfo.getFullExtent(),featureServerInfo.getSpatialReference());

		CallbackListener<String> gdbResponseCallback = new CallbackListener<String>() {
			@Override
			public void onError(final Throwable e) {
				Log.e(TAG, "Error creating geodatabase" + e.getMessage());	
			}

			@Override
			public void onCallback(String path) {
				Log.i(TAG, "Geodatabase is: " + path);
			}
		};

		GeodatabaseStatusCallback statusCallback = new GeodatabaseStatusCallback() {
			@Override
			public void statusUpdated(GeodatabaseStatusInfo status) {
				Log.i(TAG, status.getStatus().toString());

			}
		}; 
		gdbSyncTask.generateGeodatabase(params, DEFAULT_GDB_PATH, false, statusCallback, gdbResponseCallback);
	}
	
	public void syncGeodatabase() throws Exception {
        Log.i(TAG, "Sync geodatabase from " + DEFAULT_GDB_PATH);
        Geodatabase gdb = new Geodatabase(DEFAULT_GDB_PATH);
 
        SyncGeodatabaseParameters params = gdb.getSyncParameters();

        GeodatabaseSyncTask geodatabaseSyncTask = new GeodatabaseSyncTask("http://yuew.esri.com:6080/arcgis/rest/services/SFPoint/FeatureServer", null);
        
        CallbackListener<Map<Integer, GeodatabaseFeatureTableEditErrors>> callback = new CallbackListener<Map<Integer, GeodatabaseFeatureTableEditErrors>>() {
               @Override
               public void onCallback(final Map<Integer, GeodatabaseFeatureTableEditErrors> paramT) {
                     Log.i(TAG, "Sync Complete: " + (paramT == null || paramT.size() == 0 ? "Success" : "Fail"));
               }
               @Override
               public void onError(final Throwable paramThrowable) {
                     Log.i(TAG, "Sync Error: ", paramThrowable);
               }
        };
        
      GeodatabaseStatusCallback syncStatusCallback = new GeodatabaseStatusCallback() {
      		@Override
      		public void statusUpdated(GeodatabaseStatusInfo status) {
      			Log.i(TAG, status.getStatus().toString());

      		}
      	};
      	
        geodatabaseSyncTask.syncGeodatabase(params, gdb, syncStatusCallback, callback);
	}
}