# Sync Geodatabase in Background

## Use case:
You have a large geodatabase that you are syncing with your Android device.  While your activity is destroyed, stopped, or paused, this will run to make sure your geodatabase is synced.  Since syncing is a long running process, it is good to have the ability to sync in the background as to allow you to perform other operations on your device.

## What is in this sample:
#### MainActivity.java
This is the main activity that the user runs in their application.  This is what starts the background service on these lines:

```java
        Intent i = new Intent(MainActivity.this, GDBSyncService.class);
        MainActivity.this.startService(i);
```

#### GDBService.java
* This is the service itself.  This service is invoked via the ```onStartCommand``` method will run the service once
* The notifications used in the service are being instantiated in static methods coming from Notifications.java

#### Notifications.java
* This is the area where the static methods are stored to create the notificaitons used in the GDBService.java class.

#### AndroidManifest.xml

One line is needed to register this service with the application.  We needed to add the following within the application tag:

```xml
<service android:name=".GDBSyncService"
  android:process=":somenamehere"/> <!-- somenamehere can replaced with whatever process you wish to call it -->
```

We also have a custom permission that prevents others from calling our broadcast receiver unless it contains the app was created with the same certificate.
```xml
<permission android:name="com.arcgis.androidsupportcases.backgroundsyncgeodatabase.PRIVATE"
      android:protectionLevel="signature" />

<uses-permission android:name="com.arcgis.androidsupportcases.backgroundsyncgeodatabase.PRIVATE" />
```

#### Dynamically Created BroadcastReceiver
In the MainActivity.java file we are creating a BroadcastReceiver dynamically.  It has a signature level permission applied to it which only allows apps signed with the same certificate to invoke this receiver.  This prevents anyone else from seeing our broadcasts and intercepting them or calling them on their own.

We are invoking the broadcast intent in the GDBSyncService.java file with:

```java
public static final String PRIVATE_BROADCAST =
      "com.arcgis.androidsupportcases.backgroundsyncgeodatabase.PRIVATE";
public static final String ACTION_SYNC_GDB_COMPLETE =
      "com.arcgis.androidsupportcases.backgroundsyncgeodatabase.SYNC_GDB_COMPLETE";
sendBroadcast(new Intent(ACTION_SYNC_GDB_COMPLETE), PRIVATE_BROADCAST);
```

We are receiving this broadcast in the MainActivity.java file with:
```java
BroadcastReceiver mOnSyncComplete;

mOnSyncComplete = new BroadcastReceiver() {
      @Override public void onReceive(Context context, Intent intent) {
        if (new File(PATH).exists())
        {
          insertBtn.setEnabled(true);
        }
      }
    };

    IntentFilter filter = new IntentFilter(GDBSyncService.ACTION_SYNC_GDB_COMPLETE);
    this.registerReceiver(mOnSyncComplete, filter, GDBSyncService.PRIVATE_BROADCAST, null);
```
By calling a permission with the receiver and the broadcast intent, we are ensuring that we are able to safely receive the intents without others spoofing the call and running unintended tasks within our app.

## Scheduling the task
JobScheduler was introduced at API level 21 with Android.  What it does is when certain criteria is met, the job will run.  This can be useful for scheduling tasks that require a sync, therefore, if you wanted to sync your geodatabase every morning, you may want to ensure that you have network, the device is charging, and that it is only run once every 24 hours. Using the AlarmManager would schedule it at the system level and would perhaps run without ensuring that the aforementioed conditions are met.  It is prefereable to use the JobScheduler for networking tasks rather than the alarm manager as this could cause the device to use unwanted amounts of data to be used if you do not meet the network requirements.

## Known issues with this sample:
* This sample was also written using the Beta Release 2 of the ArcGIS Runtime Version 100 API.  All sample code shown here is subject to change up to the final release of ArcGIS Runtime Version 100.

* It does not check for a network connection before running.  This will attempt to run whether or not it is on Wifi as well as whether or not it is connected to a network.  No pause has been implemented in case the network drops while trying to upload.  This will cause an error.

* The sample service is from my ArcGIS Online account and might get deleted.  May update to a more reliable sync service.

* This is targeting SDK version 22.  This was so I would not have to work with runtime permissions at this release.  Future releases will have runtime permissions modifiable.

## Useful References:

* Android Programming: The Big Nerd Ranch Guide (Chapter 26: Background Services) (ISBN-13: 978-0134171456)
* [AlarmManager](https://developer.android.com/reference/android/app/AlarmManager.html)
* [IntentService](https://developer.android.com/reference/android/app/IntentService.html)
* [Notifications](https://developer.android.com/guide/topics/ui/notifiers/notifications.html)
* [BroadcastReceiver](https://developer.android.com/reference/android/content/BroadcastReceiver.html)
* [ArcGIS Runtime Version 100 Beta](https://developers.arcgis.com/android/beta/)
* [Android JobScheduler](https://developer.android.com/reference/android/app/job/JobScheduler.html)
