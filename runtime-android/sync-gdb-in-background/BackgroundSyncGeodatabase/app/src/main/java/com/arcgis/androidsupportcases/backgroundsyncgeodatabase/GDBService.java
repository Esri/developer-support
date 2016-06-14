package com.arcgis.androidsupportcases.backgroundsyncgeodatabase;

import android.app.AlarmManager;
import android.app.IntentService;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.os.AsyncTask;
import android.os.Environment;
import android.os.SystemClock;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.util.Log;
import android.widget.Toast;
import com.esri.arcgisruntime.arcgisservices.ArcGISFeatureServiceInfo;
import com.esri.arcgisruntime.concurrent.Job;
import com.esri.arcgisruntime.concurrent.ListenableFuture;
import com.esri.arcgisruntime.datasource.arcgis.Geodatabase;
import com.esri.arcgisruntime.datasource.arcgis.SyncModel;
import com.esri.arcgisruntime.geometry.Envelope;
import com.esri.arcgisruntime.geometry.SpatialReference;
import com.esri.arcgisruntime.loadable.LoadStatus;
import com.esri.arcgisruntime.tasks.geodatabase.GenerateGeodatabaseParameters;
import com.esri.arcgisruntime.tasks.geodatabase.GeodatabaseSyncTask;
import com.esri.arcgisruntime.tasks.geodatabase.SyncGeodatabaseParameters;
import java.io.File;

/**
 * Created by alex7370 on 6/10/2016.
 */
public class GDBService extends IntentService {
  private static final String TAG = "GDBSyncService";
  private static final long SYNC_INTERVAL = 1000 * 12; //60 seconds is the minimum at android 5.1+
  Job x;
  /**
   * Creates an IntentService.  Invoked by your subclass's constructor.
   *
   */
  public GDBService() {
    super(TAG);
  }

  /**
   * Creates the service.
   *
   * @param context - The application context.
   * @return
   */
  public static Intent newIntent(Context context) {
    return new Intent(context, GDBService.class);
  }

  public static void setServiceInterval(Context context, boolean isOn) {
    Intent i = GDBService.newIntent(context);
    PendingIntent pendingIntent = PendingIntent.getService(context, 0, i, 0);

    AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
    Log.e(TAG, "Intent Opening");
    if (isOn) {
      Log.e(TAG, "Intent Running");
      alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME, SystemClock.elapsedRealtime(), SYNC_INTERVAL, pendingIntent);
    } else {
      Log.e(TAG, "Intent Closing");
      alarmManager.cancel(pendingIntent);
      pendingIntent.cancel();
    }
  }

  public static boolean isServiceAlarmOn(Context context) {
    Intent i = GDBService.newIntent(context);
    PendingIntent pendingIntent = PendingIntent.getService(context, 0, i, PendingIntent.FLAG_NO_CREATE);
    return  pendingIntent != null;
  }

  @Override protected void onHandleIntent(Intent intent) {
    Log.i(TAG, "Received an intent: " + intent);

    //new InternalListener().execute();
    new Thread(new Runnable() {
      @Override public void run() {
        new InternalListener().execute();
      }
    }).start();
  }

  public class InternalListener extends AsyncTask<Void, Void, Void> {
    ArcGISFeatureServiceInfo agfsi;
    File filecheck;

    @Override protected Void doInBackground(Void... params) {
      //Resources resources = getResources();

      final String PATH = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "Android" + File.separator + "data" + File.separator
          + "data" + File.separator + "default.geodatabase";
      filecheck = new File(PATH);
      //GeodatabaseSyncTask gdbSyncTask = new GeodatabaseSyncTask(getApplicationContext(), "http://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/NoheLayer2/FeatureServer");   //Fails
      agfsi = new ArcGISFeatureServiceInfo("http://services.arcgis.com/Wl7Y1m92PbjtJs5n/ArcGIS/rest/services/NoheLayer2/FeatureServer");
      Log.e(TAG, "TEST");
      agfsi.addDoneLoadingListener(new Runnable() {
        @Override public void run() {
          if (agfsi.getLoadStatus() == LoadStatus.LOADED) {
            Log.e(TAG, "Checking file");
            final GeodatabaseSyncTask gdbSyncTask = new GeodatabaseSyncTask(GDBService.this, agfsi);

            if (!filecheck.exists()) {
              Log.e(TAG, "GDB DOESN'T EXIST> GENERATING");

              final ListenableFuture<GenerateGeodatabaseParameters> gdbParams = gdbSyncTask.createDefaultGenerateGeodatabaseParametersAsync();
              gdbParams.addDoneListener(new Runnable() {
                @Override public void run() {
                  try {
                    Job syncTaskJob = gdbSyncTask.generateGeodatabaseAsync(gdbParams.get(), PATH);
                    doMoreStuff(syncTaskJob);
                  } catch (Exception ex) {
                    Toast.makeText(GDBService.this, ex.getMessage(), Toast.LENGTH_SHORT).show();
                  }
                }
              });
            } else {
              Log.e(TAG, "GDB EXIST SYNCING");
              final Geodatabase gdb = new Geodatabase(PATH);
              final ListenableFuture<SyncGeodatabaseParameters> syncGDB = gdbSyncTask.createDefaultSyncGeodatabaseParametersAsync(gdb);
              syncGDB.addDoneListener(new Runnable() {
                @Override public void run() {
                  try {
                    Job syncTaskJob = gdbSyncTask.syncGeodatabaseAsync(syncGDB.get(), gdb);
                    doMoreStuff(syncTaskJob);
                  } catch (Exception ex) {
                    Toast.makeText(GDBService.this, ex.getMessage(), Toast.LENGTH_SHORT).show();
                  }
                }
              });
            }


          }
          else {
            Log.e(TAG, "FAILED");
          }
        }
      });

      agfsi.loadAsync();
      Log.e(TAG, "STARTING JOB");

      return null;
    }

    private void doMoreStuff(final Job job) {
      Log.e(TAG, "doMoreStuff started");
      Resources resources = getResources();
      final Notification updateNotification = new NotificationCompat.Builder(GDBService.this)
          .setOngoing(true)
          .setProgress(100, 0, true)
          .setSmallIcon(R.drawable.ic_sync_gdb_inprogress)
          .setContentTitle(resources.getString(R.string.sync_notification_title))
          .setAutoCancel(true)
          .setTicker(resources.getString(R.string.sync_updating))
          .build();

      final Notification doneNotification = new NotificationCompat.Builder(GDBService.this)
          .setOngoing(false)
          .setSmallIcon(R.drawable.ic_sync_complete)
          .setContentTitle(resources.getString(R.string.sync_notification_title))
          .setAutoCancel(true)
          .setTicker(resources.getString(R.string.sync_done))
          .setSubText(resources.getString(R.string.sync_done))
          .build();

      Log.e(TAG, "adding Job Changed Listener");
      job.addJobChangedListener(new Runnable() {
        @Override public void run() {
          NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(getBaseContext());
          Log.e(TAG, "Starting jobs");
          if (job.getStatus() != Job.Status.DONE) {
            Log.e(TAG, "" + job.getStatus());
            notificationManagerCompat.notify(0, updateNotification);
          } else if (job.getStatus() == Job.Status.DONE) {
            if (job.getError() != null) {
              Log.e(TAG, "" + job.getStatus());
              Log.e(TAG, "" + job.getError().getMessage());
              Resources resourcesInternal = getResources();
              Notification failedNotification = new NotificationCompat.Builder(GDBService.this).setOngoing(false)
                  .setSmallIcon(R.drawable.ic_sync_failed)
                  .setContentTitle(resourcesInternal.getString(R.string.sync_notification_title))
                  .setAutoCancel(true)
                  .setTicker(resourcesInternal.getString(R.string.sync_failed))
                  .setSubText(job.getError().getMessage())
                  .build();
              notificationManagerCompat.notify(0, failedNotification);
            } else if (job.getResult() != null) {
              Log.e(TAG, "" + job.getStatus());
              notificationManagerCompat.notify(0, doneNotification);
            }
          }
          Log.e(TAG, "Jobs ended");
        }
      });
      job.resume();
    }

  }

}
