package com.arcgis.androidsupportcases.backgroundsyncgeodatabase;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.os.AsyncTask;
import android.os.Environment;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.util.Log;
import android.widget.Toast;
import com.esri.arcgisruntime.arcgisservices.ArcGISFeatureServiceInfo;
import com.esri.arcgisruntime.concurrent.Job;
import com.esri.arcgisruntime.concurrent.ListenableFuture;
import com.esri.arcgisruntime.datasource.arcgis.Geodatabase;
import com.esri.arcgisruntime.loadable.LoadStatus;
import com.esri.arcgisruntime.tasks.geodatabase.GenerateGeodatabaseParameters;
import com.esri.arcgisruntime.tasks.geodatabase.GeodatabaseSyncTask;
import com.esri.arcgisruntime.tasks.geodatabase.SyncGeodatabaseParameters;
import java.io.File;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Created by alex7370 on 7/14/2016.
 */
public class GDBSyncService extends Service {

  private static final String TAG = "GDBSyncService";

  /**
   * The intent we want to notify when the sync completes.
   */
  public static final String ACTION_SYNC_GDB_COMPLETE =
      "com.arcgis.androidsupportcases.backgroundsyncgeodatabase.SYNC_GDB_COMPLETE";

  /**
   * This is the permission required to fire our broadcast receiver so others cannot snoop in and fire it without our permission
   */
  public static final String PRIVATE_BROADCAST =
      "com.arcgis.androidsupportcases.backgroundsyncgeodatabase.PRIVATE";

  /**
   * Called by the system when the service is first created.  Do not call this method directly.
   */
  @Override public void onCreate() {
    super.onCreate();
  }

  /**
   * Called by the system every time a client explicitly starts the service by calling
   * {@link Context#startService}, providing the arguments it supplied and a
   * unique integer token representing the start request.  Do not call this method directly.
   *
   * <p>For backwards compatibility, the default implementation calls
   * {@link #onStart} and returns either {@link #START_STICKY}
   * or {@link #START_STICKY_COMPATIBILITY}.
   *
   * <p>If you need your application to run on platform versions prior to API
   * level 5, you can use the following model to handle the older {@link #onStart}
   * callback in that case.  The <code>handleCommand</code> method is implemented by
   * you as appropriate:
   *
   * {@sample development/samples/ApiDemos/src/com/example/android/apis/app/ForegroundService.java
   * start_compatibility}
   *
   * <p class="caution">Note that the system calls this on your
   * service's main thread.  A service's main thread is the same
   * thread where UI operations take place for Activities running in the
   * same process.  You should always avoid stalling the main
   * thread's event loop.  When doing long-running operations,
   * network calls, or heavy disk I/O, you should kick off a new
   * thread, or use {@link AsyncTask}.</p>
   *
   * @param intent The Intent supplied to {@link Context#startService},
   * as given.  This may be null if the service is being restarted after
   * its process has gone away, and it had previously returned anything
   * except {@link #START_STICKY_COMPATIBILITY}.
   * @param flags Additional data about this start request.  Currently either
   * 0, {@link #START_FLAG_REDELIVERY}, or {@link #START_FLAG_RETRY}.
   * @param startId A unique integer representing this specific request to
   * start.  Use with {@link #stopSelfResult(int)}.
   * @return The return value indicates what semantics the system should
   * use for the service's current started state.  It may be one of the
   * constants associated with the {@link #START_CONTINUATION_MASK} bits.
   * @see #stopSelfResult(int)
   */
  @Override public int onStartCommand(Intent intent, int flags, int startId) {
    Log.i(TAG, "Received an intent: " + intent);
    new Thread(new Runnable() {
      @Override public void run() {
        new InternalListener().execute();
      }
    }).start();

    return START_STICKY;
  }

  /**
   * Return the communication channel to the service.  May return null if
   * clients can not bind to the service.  The returned
   * {@link IBinder} is usually for a complex interface
   * that has been <a href="{@docRoot}guide/components/aidl.html">described using
   * aidl</a>.
   *
   * <p><em>Note that unlike other application components, calls on to the
   * IBinder interface returned here may not happen on the main thread
   * of the process</em>.  More information about the main thread can be found in
   * <a href="{@docRoot}guide/topics/fundamentals/processes-and-threads.html">Processes and
   * Threads</a>.</p>
   *
   * @param intent The Intent that was used to bind to this service,
   * as given to {@link Context#bindService
   * Context.bindService}.  Note that any extras that were included with
   * the Intent at that point will <em>not</em> be seen here.
   * @return Return an IBinder through which clients can call on to the
   * service.
   */
  @Nullable @Override public IBinder onBind(Intent intent) {
    return null;
  }

  public class InternalListener extends AsyncTask<Void, Void, Void> {
    ArcGISFeatureServiceInfo agfsi;
    File filecheck;

    /**
     * <p>Runs on the UI thread after {@link #doInBackground}. The
     * specified result is the value returned by {@link #doInBackground}.</p>
     *
     * <p>This method won't be invoked if the task was cancelled.</p>
     *
     * @param aVoid The result of the operation computed by {@link #doInBackground}.
     * @see #onPreExecute
     * @see #doInBackground
     * @see #onCancelled(Object)
     */
    @Override protected void onPostExecute(Void aVoid) {
      super.onPostExecute(aVoid);
      Log.e("NOHE", "THIS IS VALID ANDROID");
    }

    @Override protected Void doInBackground(Void... params) {

      final String PATH = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "Android" + File.separator + "data" + File.separator
          + "data" + File.separator + "default.geodatabase";
      Log.e("NOHE", PATH);
      filecheck = new File(PATH);

      agfsi = new ArcGISFeatureServiceInfo("http://services.arcgis.com/Wl7Y1m92PbjtJs5n/ArcGIS/rest/services/NoheLayer2/FeatureServer");
      Log.e("NOHE", "TEST");
      agfsi.addDoneLoadingListener(new Runnable() {
        @Override public void run() {
          if (agfsi.getLoadStatus() == LoadStatus.LOADED) {
            Log.e("NOHE", "Checking file");
            final GeodatabaseSyncTask gdbSyncTask = new GeodatabaseSyncTask(GDBSyncService.this, agfsi);

            if (!filecheck.exists()) {
              Log.e("NOHE", "GDB DOESN'T EXIST> GENERATING");

              final ListenableFuture<GenerateGeodatabaseParameters> gdbParams = gdbSyncTask.createDefaultGenerateGeodatabaseParametersAsync();
              gdbParams.addDoneListener(new Runnable() {
                @Override public void run() {
                  try {
                    Job syncTaskJob = gdbSyncTask.generateGeodatabaseAsync(gdbParams.get(), PATH);
                    doMoreStuff(syncTaskJob);
                    syncTaskJob.addJobDoneListener(new Runnable() {
                      @Override public void run() {
                        Log.e("NOHE", "DONE DONE DONE");
                      }
                    });
                  } catch (Exception ex) {
                    Toast.makeText(GDBSyncService.this, ex.getMessage(), Toast.LENGTH_SHORT).show();
                  }
                }
              });
            } else {
              Log.e("NOHE", "GDB EXIST SYNCING");
              final Geodatabase gdb = new Geodatabase(PATH);
              final ListenableFuture<SyncGeodatabaseParameters> syncGDB = gdbSyncTask.createDefaultSyncGeodatabaseParametersAsync(gdb);
              syncGDB.addDoneListener(new Runnable() {
                @Override public void run() {
                  try {
                    Job syncTaskJob = gdbSyncTask.syncGeodatabaseAsync(syncGDB.get(), gdb);
                    doMoreStuff(syncTaskJob);
                    syncTaskJob.addJobDoneListener(new Runnable() {
                      @Override public void run() {
                        Log.e("NOHE", "DONE DONE DONE");
                      }
                    });
                  } catch (Exception ex) {
                    Toast.makeText(GDBSyncService.this, ex.getMessage(), Toast.LENGTH_SHORT).show();
                  }
                }
              });
            }


          }
          else {
            Log.e("NOHE", "FAILED");
          }
        }
      });

      agfsi.loadAsync();
      Log.e("NOHE", "STARTING JOB");

      return null;
    }

    private void doMoreStuff(final Job job) {
      Log.wtf("NOHE", "doMoreStuff started");
      Resources resources = getResources();

      final Notification updateNotification = Notifications.getUpdateNotification(resources, GDBSyncService.this);

      final Notification doneNotification = Notifications.getDoneNotification(resources, GDBSyncService.this);

      Log.e("NOHE", "adding Job Changed Listener");

      startForeground(3474, updateNotification);
      job.addJobChangedListener(new Runnable() {
        @Override public void run() {
          NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(getBaseContext());
          Log.e("NOHE", "Starting jobs");
          if (job.getStatus() != Job.Status.DONE) {
            Log.wtf("NOHE", "" + job.getStatus());
          } else if (job.getStatus() == Job.Status.DONE) {
            if (job.getError() != null) {
              Log.wtf("NOHE", "" + job.getStatus());
              Log.wtf("NOHE", "" + job.getError().getMessage());
              Resources resourcesInternal = getResources();

              Notification failedNotification = Notifications.getFailedNotification(resourcesInternal, GDBSyncService.this, job);

              notificationManagerCompat.notify(0, failedNotification);
            } else if (job.getResult() != null) {
              Log.e("NOHE", "" + job.getStatus());

              /**
               * So we know when the Sync has completed and we can update the GUI as needed.
               */
              sendBroadcast(new Intent(ACTION_SYNC_GDB_COMPLETE), PRIVATE_BROADCAST);

              notificationManagerCompat.notify(0, doneNotification);

            }
            stopSelf();
          }
          Log.e("NOHE", "Jobs ended");
        }
      });
      job.resume();
    }

  }

}
