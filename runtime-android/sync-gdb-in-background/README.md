# Sync Geodatabase in Background

## Use case:
You have a large geodatabase that you are syncing with your Android device.  While your activity is destroyed, stopped, or paused, this will run to make sure your geodatabase is synced.  Since syncing is a long running process, it is good to have the ability to sync in the background as to allow you to perform other operations on your device.  Additionally, it is good to have it sync at a set interval so every morning, you do not need to re-sync the device, it is already to go.

## What is in this sample:
#### MainActivity.java
This is the main activity that the user runs in their application.  This is what starts the background service on this line:

```java
GDBService.setServiceInterval(getApplicationContext(), !serviceOn);
```

#### GDBService.java
* This is the service itself.  This service is invoked via the ```setServiceInterval``` method which turns the service on at a set interval.
* The current interval is set via the constant **SYNC_INTERVAL**.
* We used setInexactRepeating with the AlarmManager so as to be easier on the battery.  Therefore, if the device is currently on snooze, we are not going to send out a update until the device *wakes up* again.

## Known issues with this sample:
* There is not a broadcast receiver to turn on the service on device restarts.  This could be implemented via the manifest.

* This sample was also written using the Beta Release 2 of the Quartz API.  All sample code shown here is subject to change up to the final release of Quartz.

* It does not check for a network connection before running.  This will attempt to run whether or not it is on Wifi as well as whether or not it is connected to a network.

* The sample service is from my ArcGIS Online account and might get deleted.  May update to a more reliable sync service.

## Useful References:

* Android Programming: The Big Nerd Ranch Guide (Chapter 26: Background Services) (ISBN-13: 978-0134171456)
* [AlarmManager](https://developer.android.com/reference/android/app/AlarmManager.html)
* [IntentService](https://developer.android.com/reference/android/app/IntentService.html)
* [Notifications](https://developer.android.com/guide/topics/ui/notifiers/notifications.html)
* [ArcGIS Runtime Quartz Beta](https://developers.arcgis.com/android/beta/)
