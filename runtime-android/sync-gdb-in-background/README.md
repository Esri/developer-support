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
<service android:name=".GDBService"
  android:process=":somenamehere"/> <!-- somenamehere can replaced with whatever process you wish to call it -->
```

## Known issues with this sample:
* There is not a broadcast receiver to receive when the geodatabase is initially downloaded.  At the time, if the geodatabase is not already on the device, the insert point will be greyed out and unclickable.  If it does exist on the device, it will be clickable.  Therefore, if the geodatabase is downladed, the activity will need to be restarted.

* This sample was also written using the Beta Release 2 of the Quartz API.  All sample code shown here is subject to change up to the final release of Quartz.

* It does not check for a network connection before running.  This will attempt to run whether or not it is on Wifi as well as whether or not it is connected to a network.  No pause has been implemented in case the network drops while trying to upload.  This will cause an error.

* The sample service is from my ArcGIS Online account and might get deleted.  May update to a more reliable sync service.

* This is targeting SDK version 22.  This was so I would not have to work with runtime permissions at this release.  Future releases will have runtime permissions modifiable.

## Useful References:

* Android Programming: The Big Nerd Ranch Guide (Chapter 26: Background Services) (ISBN-13: 978-0134171456)
* [AlarmManager](https://developer.android.com/reference/android/app/AlarmManager.html)
* [IntentService](https://developer.android.com/reference/android/app/IntentService.html)
* [Notifications](https://developer.android.com/guide/topics/ui/notifiers/notifications.html)
* [BroadcastReceiver](https://developer.android.com/reference/android/content/BroadcastReceiver.html)
* [ArcGIS Runtime Quartz Beta](https://developers.arcgis.com/android/beta/)
