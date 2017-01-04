package com.arcgis.androidsupportcases.backgroundsyncgeodatabase;

import android.app.Notification;
import android.content.Context;
import android.content.res.Resources;
import android.support.v4.app.NotificationCompat;
import com.esri.arcgisruntime.concurrent.Job;

/**
 * Created by alex7370 on 7/21/2016.
 */
public class Notifications {
  public static Notification  getUpdateNotification(Resources resources, Context context) {
    Notification updateNotification = new NotificationCompat.Builder(context)
        .setOngoing(true)
        .setProgress(100, 0, true)
        .setSmallIcon(R.drawable.ic_sync_gdb_inprogress)
        .setContentTitle(resources.getString(R.string.sync_notification_title))
        .setAutoCancel(true)
        .setTicker(resources.getString(R.string.sync_updating))
        .build();

    return updateNotification;
  }

  public static Notification  getDoneNotification(Resources resources, Context context) {
    Notification doneNotification = new NotificationCompat.Builder(context)
        .setOngoing(false)
        .setSmallIcon(R.drawable.ic_sync_complete)
        .setContentTitle(resources.getString(R.string.sync_notification_title))
        .setAutoCancel(true)
        .setTicker(resources.getString(R.string.sync_done))
        .setSubText(resources.getString(R.string.sync_done))
        .build();

    return doneNotification;
  }

  public static Notification  getFailedNotification(Resources resources, Context context, Job job) {
    Notification failedNotification = new NotificationCompat.Builder(context).setOngoing(false)
        .setSmallIcon(R.drawable.ic_sync_failed)
        .setContentTitle(resources.getString(R.string.sync_notification_title))
        .setAutoCancel(true)
        .setTicker(resources.getString(R.string.sync_failed))
        .setSubText(job.getError().getMessage())
        .build();

    return failedNotification;
  }
}
