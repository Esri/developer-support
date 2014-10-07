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

#import "MapViewDemoViewController.h"

#define kTilePackageName @"Taiwan"

@implementation MapViewDemoViewController

@synthesize mapView = _mapView;
@synthesize dynamicLayer = _dynamicLayer;
@synthesize tiledLayer = _tiledLayer;

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
	
	// set the delegate for the map view
	self.mapView.layerDelegate = self;
    
    //Add the basemap layer from a tile package
    self.localTiledLayer =  [AGSLocalTiledLayer localTiledLayerWithName:kTilePackageName];
    
    self.localTiledLayer.delegate = self;
    
    [self.mapView addMapLayer:self.localTiledLayer];
    
    NSMutableArray *lFeaturetableLayer = [[NSMutableArray alloc]init];
    //self.localFeatureTableLayer = [@[lFeaturetableLayer] mutableCopy];
    
    NSError *error;
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *gdbPath = [paths objectAtIndex:0];
    gdbPath = [gdbPath stringByAppendingPathComponent:@"TW_generlized.geodatabase"];
    
    AGSGDBGeodatabase *gdb = [[AGSGDBGeodatabase alloc] initWithPath:gdbPath error:&error];
    
    if (error) {
        NSLog(@"%@", error.localizedDescription);
    }
    
    else{
        if ([[NSFileManager defaultManager] fileExistsAtPath:gdbPath]) {
            
            NSLog(@"_gdb.featureTables.count =%lu", (unsigned long)gdb.featureTables.count);
        
            for (AGSFeatureTable* fTable in gdb.featureTables) {
                if ([fTable hasGeometry]) {
                    AGSFeatureTableLayer *fTableLayer = [[AGSFeatureTableLayer alloc]initWithFeatureTable:fTable];
                    
                    [lFeaturetableLayer addObject:fTableLayer];
                    
                    fTableLayer.delegate = self;
                    [self.mapView addMapLayer:fTableLayer withName:[NSString stringWithFormat:@"Offline Feature Layer#%lu - %@", lFeaturetableLayer.count-1, fTableLayer.name]];
                    NSLog(@"%@", [NSString stringWithFormat:@"Offline Feature Layer#%lu - %@", lFeaturetableLayer.count-1, fTableLayer.name]);
                }
            }
        }
    }

   }

// Override to allow orientations other than the default portrait orientation.
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    // Return YES for supported orientations
    return interfaceOrientation != UIInterfaceOrientationPortraitUpsideDown;
}
- (void)didReceiveMemoryWarning {
	// Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
	
	// Release any cached data, images, etc that aren't in use.
}

- (void)viewDidUnload {
    self.mapView = nil;
	self.dynamicLayer = nil;
}


#pragma mark AGSMapViewLayerDelegate methods

-(void) mapViewDidLoad:(AGSMapView*)mapView {

    
    //Check the gdb location type "po geodatabase.path
    NSLog(@"%@",[[NSBundle mainBundle] bundlePath]);
}

- (void)layer:(AGSLayer *)layer didFailToLoadWithError:(NSError *)error{
    NSLog(@"failed");
}

- (void)layerDidLoad:(AGSLayer *)layer{
    NSLog(@"success");
}
@end
