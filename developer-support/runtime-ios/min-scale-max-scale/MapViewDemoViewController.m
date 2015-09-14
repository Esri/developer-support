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

@implementation MapViewDemoViewController

@synthesize mapView = _mapView;
@synthesize dynamicLayer = _dynamicLayer;
@synthesize tiledLayer = _tiledLayer;
@synthesize lbl = _lbl;

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
    //Add an observer to set the dynamicLayer not display
    //[[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(mapZoomed:) name:AGSMapViewDidEndZoomingNotification object:_mapView];
	
	// set the delegate for the map view
	self.mapView.layerDelegate = self;
    
	//create an instance of a tiled map service layer
	self.tiledLayer = [[AGSTiledMapServiceLayer alloc] initWithURL:[NSURL URLWithString:kTiledMapServiceURL]];

	//Add it to the map view
	[self.mapView addMapLayer:self.tiledLayer withName:@"Tiled Layer"];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(respondToEnvChange:) name:AGSMapViewDidEndZoomingNotification object:nil];
    
    self.lbl = [[UILabel alloc] init];
    self.lbl.frame = CGRectMake(20, 20, 250, 30);
    self.lbl.backgroundColor = [UIColor whiteColor];
    self.lbl.textColor = [UIColor blackColor];
    self.lbl.font = [UIFont fontWithName:@"AppleGothic" size:12];
    self.lbl.text = @"Level";
    [self.view addSubview:self.lbl];
    
	//create an instance of a dynmaic map layer
    self.dynamicLayer = [[AGSDynamicMapServiceLayer alloc] initWithURL:[NSURL URLWithString:kDynamicMapServiceURL]];
		
	//name the layer. This is the name that is displayed if there was a property page, tocs, etc...
	[self.mapView addMapLayer:self.dynamicLayer withName:@"Dynamic Layer"];
    self.dynamicLayer.delegate = self;
    self.dynamicLayer.opacity = 0.8;
    }

- (void)mapViewDidLoad:(AGSMapView *)mapView  {
    
    [self.mapView.locationDisplay startDataSource];
    self.mapView.locationDisplay.autoPanMode = AGSLocationDisplayAutoPanModeDefault;
    
    // register for pan notifications
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(respondToEnvChange:)
                                                 name:AGSMapViewDidEndPanningNotification object:nil];
    // register for zoom notifications
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(respondToEnvChange:)
                                                 name:AGSMapViewDidEndZoomingNotification object:nil];
}

- (void)respondToEnvChange: (NSNotification*) notification {
    
    NSLog(@"map scale = %f", self.mapView.mapScale);

    NSString *str1 = @"Scale:";
    double scale = self.mapView.mapScale;
    //double scale = [self.tlayer currentLOD].scale;
    NSString *strScale = [NSString stringWithFormat:@"%.0lf\n", scale];
    self.lbl.text = [str1 stringByAppendingString:strScale];
}

#pragma mark AGSLayerDelegate

- (void)layerDidLoad:(AGSLayer *)layer{
    layer.maxScale = 10;
    self.mapView.maxScale = 10;
    
    self.dynamicLayer.minScale = 10000000;

    AGSEnvelope *envelope = [AGSEnvelope envelopeWithXmin:-124.83145667 ymin:30.49849464 xmax:-113.91375495  ymax:44.69150688  spatialReference:_mapView.spatialReference];
    [self.mapView zoomToEnvelope:envelope animated:NO];
    
}

- (void)layer:(AGSLayer *)layer didFailToLoadWithError:(NSError *)error{
    NSLog(@"Layer failed to load");
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

- (IBAction)opacitySliderValueChanged:(id)sender {
	// set the layer's opacity based on the value of the slider
	self.dynamicLayer.opacity = ((UISlider *)sender).value;
}

- (void)viewDidUnload {
    self.mapView = nil;
	self.dynamicLayer = nil;
    self.tiledLayer = nil;

}

- (void)dealloc {
	
}

@end