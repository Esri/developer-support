# AGSFeatureTableLayer Selection with Color

## About

ArcGIS Runtime SDK for iOS provides the user multiple ways to interact with data on the map view. 
Typically, selecting features by tapping a location or a feature on the map to show more information. Using [AGSMapViewTouchDelegate](https://developers.arcgis.com/ios/api-reference/protocol_a_g_s_map_view_touch_delegate-p.html) will help the developer to trigger those touch event related actions happening on the map.

This sample will guide you how to add selection color around the features when you click on AGSFeatureTableLayer. 

Demo:

![](https://i.imgflip.com/17zwd7.gif)


## Usage Notes

This sample require to have iOS version >= 8.0.

Using the latest version of ArcGIS Runtime SDK for iOS 10.2.5. You can use any version of Xcode 7 with iOS 9 SDK or Xcode 6 with iOS 8 SDK.

We recommend that you use the latest version of Xcode to ensure that you have Apple's latest bug fixes, language support, and enhancements to both Xcode and the iOS SDKs.

For more information about system requirements, please check: [System requirement  - ArcGIS Runtime SDK for iOS](https://developers.arcgis.com/ios/swift/guide/system-reqs.htm)


## How it works:

The **selectioncolor** property is only available in [AGSFeatureTableLayer](https://developers.arcgis.com/ios/api-reference/interface_a_g_s_feature_table_layer.html#a39a9fc1e100d84a2932e66f5bcb6cd86) and [AGSGraphicsLayer](https://developers.arcgis.com/ios/api-reference/interface_a_g_s_graphics_layer.html#a53677677f06eb38f0b8b14bc80668266). Therefore, you want to make sure the feature that you click is coming from the supported layer.

&nbsp;

Instantiate variables in order to convert AGSfeatureLayer to AGSGDBFeatureServiceTable, and then use AGSGDBFeatureServiceTable to create an AGSFeatureTableLayer.

```swift
var featureServiceTable: AGSGDBFeatureServiceTable!  
var ftLayer: AGSFeatureTableLayer!  

//init AGSGDBFeatureServiceTable based on ArcGIS Feature service or Map service URL
featureServiceTable = AGSGDBFeatureServiceTable.init(serviceURL: url, credential: nil, spatialReference: AGSSpatialReference.webMercatorSpatialReference())
        
//create a local FeatureTableLayer based on featureServiceTable
ftLayer = AGSFeatureTableLayer.init(featureTable: featureServiceTable)
        
//define the selectionColor
ftLayer.selectionColor = UIColor.greenColor()
        
//add the AGSFeatureTableLayer to map
self.mapView.addMapLayer(ftLayer, withName: "FeatureLayer")
```
&nbsp;

Within the AGSMapViewTouchDelegate function [mapView:didClickAtPoint:mapPoint:features:](https://developers.arcgis.com/ios/api-reference/protocol_a_g_s_map_view_touch_delegate-p.html#acf2fb293c5b0c42c39b3b7f8f73dc7f2) define select feature with selectionColor
```swift
    func mapView(mapView: AGSMapView!, didClickAtPoint screen: CGPoint, mapPoint mappoint: AGSPoint!, features: [NSObject : AnyObject]!) {
...
	if features.count != 0 {
		//Need to define feature comes from which layer, by using featureservice's layer name
    	let array = features["Cities"] as! [AGSFeature]
    	...
    	for feature in array {
                ftLayer.setSelected(true, forFeature: feature)
		}
 	}
...
}
```
&nbsp;

Normally, if you want features with selection color in offline mode, you should use AGSFeatureTableLayer. The reason is because AGSFeatureTableLayer displays features from a local dataset to the map view. Whereas, if you want to use online mode, you should use AGSGraphicsLayer or AGSFeatureTableLayer. It depends on whether the features need to be editable or just view-only.

For AGSGraphicsLayer, you can either use this selectionColor , or follow this sample from Runtime Quartz [Feature layer selection](https://developers.arcgis.com/ios/beta/swift/sample-code/feature-layer-selection.htm). However, this sample is using another method "[selectFeaturesWithQuery:selectionMethod](https://developers.arcgis.com/ios/api-reference/interface_a_g_s_feature_layer.html#aee0dc946527a8e43930639dc8b6c176d)" 
from AGSFeatureLayer.

## Resources

* [Feature layer selection - Runtime Quartz for iOS sample](https://developers.arcgis.com/ios/beta/swift/sample-code/feature-layer-selection.htm)
* [Select features - ArcGIS Runtime SDK for iOS](https://developers.arcgis.com/ios/objective-c/guide/edit-features.htm#ESRI_SECTION1_4213B7F672304847B13FD6F9E38622B3)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)


