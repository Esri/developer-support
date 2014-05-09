//
//  ViewController.m
//  UpdateRendererAtScale
//
//  Created by Doug Carroll on 5/29/13.
//  Copyright (c) 2013 Doug Carroll. All rights reserved.
//

#import "ViewController.h"

@interface ViewController () {
    AGSTiledMapServiceLayer *basemapLayer;
    AGSFeatureLayer *featLayer;
    AGSSimpleRenderer *renderer;
}

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mapZoomed:) name:AGSMapViewDidEndZoomingNotification object: _mapView];
    
    NSURL *basemapURL = [NSURL URLWithString:@"http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"];    
    NSURL *featureLayerURL = [NSURL URLWithString:@"http://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/MapServer/0"];
    
    basemapLayer = [AGSTiledMapServiceLayer tiledMapServiceLayerWithURL:basemapURL];
    featLayer = [AGSFeatureLayer featureServiceLayerWithURL:featureLayerURL mode: AGSFeatureLayerModeSnapshot];
    [self.mapView addMapLayer:basemapLayer];
    [self.mapView addMapLayer:featLayer];
    [self.mapView zoomToEnvelope:[AGSEnvelope envelopeWithXmin:-14142034.9164115
                                                          ymin:653091.4809220894
                                                          xmax:-7880313.55929153
                                                          ymax:9654315.931782043
                                              spatialReference:[AGSSpatialReference spatialReferenceWithWKID:102100]]
                        animated:YES];
    AGSSimpleMarkerSymbol* myMarkerSymbol = [AGSSimpleMarkerSymbol simpleMarkerSymbol];
	myMarkerSymbol.color = [UIColor blueColor];
	myMarkerSymbol.style = AGSSimpleMarkerSymbolStyleDiamond;
	myMarkerSymbol.outline.color = [UIColor whiteColor];
	myMarkerSymbol.outline.width = 3;
    
    renderer = [AGSSimpleRenderer simpleRendererWithSymbol:myMarkerSymbol];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)mapZoomed:(NSNotification*)note{
    NSLog(@"Zoom event happened...");
    NSNumberFormatter *nf = [[NSNumberFormatter alloc]init];
    nf.maximumFractionDigits = 0;
    nf.usesGroupingSeparator = YES;
    nf.groupingSize = 3;
    self.mapScaleLabel.text = [NSString stringWithFormat:@"Map Scale  -  1 : %@", [nf stringFromNumber:@(self.mapView.mapScale)]];
    if (self.mapView.mapScale <= 100000){
        featLayer.renderer= renderer;
    }
}

@end
