//
//  ViewController.h
//  UpdateRendererAtScale
//
//  Created by Doug Carroll on 5/29/13.
//  Copyright (c) 2013 Doug Carroll. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <ArcGIS/ArcGIS.h>

@interface ViewController : UIViewController
@property (strong, nonatomic) IBOutlet AGSMapView *mapView;
@property (weak, nonatomic) IBOutlet UILabel *mapScaleLabel;

@end
