// Copyright 2010 ESRI
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// You may freely redistribute and use this sample code, with or
// without modification, provided you include the original copyright
// notice and use restrictions.
//
// See the use restrictions at http://help.arcgis.com/en/sdk/10.0/usageRestrictions.htm
//

#import <UIKit/UIKit.h>
#import <ArcGIS/ArcGIS.h>

//contants for data layers
#define kTiledMapServiceURL @"http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer"
#define kDynamicMapServiceURL @"http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"

@interface MapViewDemoViewController : UIViewController <AGSMapViewLayerDelegate,AGSLayerDelegate> {
	
	//container for map layers
	AGSMapView *_mapView;
	
	//this map has a dynamic layer, need a view to act as a container for it
	AGSDynamicMapServiceLayer * _dynamicLayer;
    AGSTiledMapServiceLayer * _tiledLayer;
    UILabel *_lbl;
}

//map view is an outlet so we can associate it with UIView
//in IB
@property (nonatomic, strong) IBOutlet AGSMapView *mapView;
@property (nonatomic, strong) AGSDynamicMapServiceLayer *dynamicLayer;
@property (nonatomic, strong) AGSTiledMapServiceLayer *tiledLayer;
@property (nonatomic, strong) UILabel *lbl;

- (IBAction)opacitySliderValueChanged:(id)sender;

@end

