package com.arcgis.androidsupportcases.usingoauth;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.esri.arcgisruntime.ArcGISRuntimeEnvironment;
import com.esri.arcgisruntime.security.OAuthLoginManager;

public class MainActivity extends AppCompatActivity {
    
    Button oAuthButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        oAuthButton = (Button) findViewById(R.id.launchOAtuh);
        oAuthButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                OAuthManagement.getInstance().LaunchLogin(getApplicationContext());
            }
        });


    }
}
