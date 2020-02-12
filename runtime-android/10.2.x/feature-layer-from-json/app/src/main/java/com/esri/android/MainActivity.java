/*
 * * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.esri.android;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.esri.android.map.MapView;
import com.esri.android.map.ags.ArcGISFeatureLayer;
import com.esri.core.map.FeatureSet;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonParser;

import java.io.IOException;
import java.io.InputStream;


public class MainActivity extends Activity {
    private MapView mMapView;
    private Boolean layerAdded  = false;
    private static final String TAG = "MainActivity";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mMapView = (MapView) findViewById(R.id.map);

        final String FEATURES_JSON_PATH = getResources().getString(R.string.features_json);
        final String LAYER_INFO_PATH = getResources().getString(R.string.layerinfo_json);

        Button addLayerButton = (Button) findViewById(R.id.button);
        addLayerButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //handle if layer was already added
                if (layerAdded) {
                    return;
                }
                JsonFactory factory = new JsonFactory();
                JsonParser parser;
                String layerInfoString;
                String featureData;
                ArcGISFeatureLayer featureLayer;

                //create Strings from JSON files
                try {
                    featureData = jsonFileToString(FEATURES_JSON_PATH);
                    layerInfoString = jsonFileToString(LAYER_INFO_PATH);
                } catch (IOException e) {
                    Toast.makeText(MainActivity.this, "JSON file(s) failed to open", Toast.LENGTH_SHORT).show();
                    Log.e(TAG, "JSON file(s) failed to parse to open");
                    return;
                }

                //construct parser
                try {
                    parser = factory.createJsonParser(featureData);
                    parser.nextToken();
                } catch (IOException e) {
                    Toast.makeText(MainActivity.this, "JSON file(s) failed to parse", Toast.LENGTH_SHORT).show();
                    Log.e(TAG, "JSON file(s) failed to parse");
                    return;
                }

                //construct FeatureSet using parser on featureData string
                FeatureSet featureSet;
                try {
                    featureSet = FeatureSet.fromJson(parser, true);
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Error constructing FeatureSet from JSON", Toast.LENGTH_SHORT).show();
                    Log.e(TAG, "Error constructing FeatureSet from JSON");
                    return;
                }

                //construct FeatureLayer options and set mode to snapshot
                ArcGISFeatureLayer.Options layerOptions = new ArcGISFeatureLayer.Options();
                layerOptions.mode = ArcGISFeatureLayer.MODE.SNAPSHOT;

                //construct FeatureLayer with components
                featureLayer = new ArcGISFeatureLayer(layerInfoString, featureSet, layerOptions);
                featureLayer.addGraphics(featureSet.getGraphics());

                //set opacity on FeatureLayer and add layer to mapView
                featureLayer.setOpacity(0.5f);
                mMapView.addLayer(featureLayer);
                layerAdded = true;

            }
        });
    }

    /**
     * Returns a String representation of input JSON file
     *
     * @param filename the file to convert to String
     * @return String of JSON file
     * @throws IOException if unable to open the file
     */
    private String jsonFileToString(String filename) throws IOException {
        InputStream is = getAssets().open(filename);
        int size = is.available();
        byte[] buffer = new byte[size];
        is.read(buffer);
        is.close();
        String bufferString = new String(buffer);
        return bufferString;
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
