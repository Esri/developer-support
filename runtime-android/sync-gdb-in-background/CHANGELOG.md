# Changelog
#### 21 July 2016
* Moved from an Alarm Service that called an IntentService to using just a service.
* App can now be completely closed when synchronization occurs.  Additionally, app does not run at a set interval when synchronizing.
* Notification construction was moved out of the GDBSyncService and instead moved into static methods in Notifications.java.
* Previous logic to start the service was removed as it has changed to be more service oriented.
* GDBService was renamed to GDBSyncService and is no longer extending an IntentService but instead extends a Service.
* Logic was added to test whether or not the geodatabase exists before allowing the user to press the insert location button.  Now the user will not error before it runs.
* Added a dynamically registered BroadcastReceiver in code so that when the SyncService is finished, it will send out a broadcast intent that the application can handle.

#### Known issues / To do list
* Make the Service more modular and be able to pass the feature service URL to the service and storage location rather than having that be generated inside the activity.
* Mimic the implementation of the [GeotriggerBroadcastReceiver](https://developers.arcgis.com/geotrigger-service/guide/android-handling-events/) so users can implement their own logic when the synchronization has completed.  Seperate class needs to be created.
