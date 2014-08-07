//
//  ViewController.h
//
//  Created by Garima Dhakal on 7/31/14. Thanks to Nathan and Feng.
//

/* Header file
 * This project demonstrates how the user can change the basemap of public webmap by clicking the button labeled
 * "Change Basemap" using switchBaseMapOnMapView method of AGSWebMap class.
 */

#import <UIKit/UIKit.h>
#import <ArcGIS/ArcGIS.h>

@interface ViewController : UIViewController<AGSWebMapDelegate>
//Create UIView and change it to map view
@property (strong, nonatomic) IBOutlet AGSMapView* mapView;

//Create UIButton with text "Change Basemap" (or something else you like) and connect it to the property changeBasemapBTN
@property(retain) IBOutlet UIButton *changeBasemapBTN;

//Action for the button so that we can click it to change the basemap of the webmap
- (IBAction)changeBasemap:(id)sender;
@end