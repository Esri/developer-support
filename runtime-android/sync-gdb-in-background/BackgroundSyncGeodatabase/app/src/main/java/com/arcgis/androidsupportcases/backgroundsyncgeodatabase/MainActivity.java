package com.arcgis.androidsupportcases.backgroundsyncgeodatabase;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

  Button gdbSyncBtn;

  @Override protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    boolean serviceOn = GDBService.isServiceAlarmOn(getApplicationContext());
    if(serviceOn) {
      ((Button) findViewById(R.id.gdbSyncBtn)).setText("Turn Off");
    } else {
      ((Button) findViewById(R.id.gdbSyncBtn)).setText("Turn On");
    }

    gdbSyncBtn = (Button) findViewById(R.id.gdbSyncBtn);
    gdbSyncBtn.setOnClickListener(new View.OnClickListener() {
      @Override public void onClick(View v) {
        boolean serviceOn = GDBService.isServiceAlarmOn(getApplicationContext());
        GDBService.setServiceInterval(getApplicationContext(), !serviceOn);
        if(serviceOn) {
          ((Button) v).setText("Turn Off");
        } else {
          ((Button) v).setText("Turn On");
        }
      }
    });

  }
}
