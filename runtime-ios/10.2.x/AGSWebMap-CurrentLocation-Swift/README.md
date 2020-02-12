# WebMap Center Current Location

## About

Using ArcGIS Runtime SDK for iOS 10.2.5 to load a webmap, and then use GPS/GPX location to center your current location on the webmap mapview.

This sample will guide you how to add your current location and display on webmap mapview. 

Demo:

![](https://media.giphy.com/media/3ds6viyCiEaOs/giphy.gif)

## Usage Notes

This sample require to have iOS version >= 8.0.

Using the latest version of ArcGIS Runtime SDK for iOS 10.2.5. You can use any version of Xcode 7,8 with iOS 9,10 SDK or Xcode 6 with iOS 8 SDK.

We recommend that you use the latest version of Xcode to ensure that you have Apple's latest bug fixes, language support, and enhancements to both Xcode and the iOS SDKs.

For more information about system requirements, please check: [System requirement  - ArcGIS Runtime SDK for iOS](https://developers.arcgis.com/ios/swift/guide/system-reqs.htm)

## How it works:

1. Use AGSWebMap to load the webmap id

2. Start displaying the location in viewDidLoad, and add webmap delegate here

```swift
 override func viewDidLoad() {
        super.viewDidLoad()
        self.webmap.delegate = self
        self.webmap.openIntoMapView(self.mapView)
```

3. Use AGSWebMapDelegate to trigger this method "webMap:didLoadLayer:", then pass the current GPS/GPX location

```swift
 func webMap(webMap: AGSWebMap!, didLoadLayer layer: AGSLayer!) {
        currentLocation = self.mapView.locationDisplay.location
        print(currentLocation)
```

4. Use webmap.switchBasemapOnMapView to switch the basemap for webmap 

## Resources

* [Displaying the location on a map](https://developers.arcgis.com/ios/swift/guide/map-gps.htm)
* [AGSWebMapDelegate - ArcGIS Runtime for iOS 10.2.5](https://developers.arcgis.com/ios/api-reference/protocol_a_g_s_web_map_delegate-p.html#a8ca3a486faf767a78a74bd7f0e678e36)
* [Android AsyncTask](https://developer.android.com/reference/android/os/AsyncTask.html)