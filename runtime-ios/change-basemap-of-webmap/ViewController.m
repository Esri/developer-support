//
//  ViewController.m
//
//  Created by Garima Dhakal on 7/31/14. Thanks to Nathan and Feng.
//

/* Implementation file
 * Implements switchBaseMapOnMapView method of AGSWebMap class.
 */

#import "ViewController.h"

static NSString* const kPublicWebmapId = @"8a567ebac15748d39a747649a2e86cf4";

@interface ViewController ()
@property (strong, nonatomic) AGSWebMap* webMap;
@property(nonatomic, strong) NSString* webmapId;
@end

@implementation ViewController

- (void)viewDidLoad{
    [super viewDidLoad];
    
    self.webmapId = kPublicWebmapId;
    
	//Create a webmap using the ID
    self.webMap = [AGSWebMap webMapWithItemId:self.webmapId credential:nil];
    
    //Open the webmap
    [self.webMap openIntoMapView:self.mapView];
    
    //Set the webmap's delegate
    self.webMap.delegate = self;
}

//Action for the button click event. It changes the basemap of the webmap.
- (IBAction)changeBasemap:(id)sender{
    
    //Store JSON in string format
    NSString* myCustomJson = @"{\"operationalLayers\":[],\"baseMap\":{\"baseMapLayers\":[{\"id\":\"defaultBasemap\",\"opacity\":1,\"visibility\":true,\"url\":\"http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer\"}],\"title\":\"Topographic\"},\"version\":\"1.6\"}\"";
    
    //Convert string to data
    NSData* data = [myCustomJson dataUsingEncoding:NSUTF8StringEncoding];
    data = [data subdataWithRange:NSMakeRange(0, [data length]-1)];
    
    /* Instead, use JSON from URL
     
     NSURL* urlOfJson = [NSURL URLWithString: @"http://www.arcgis.com/sharing/content/items/0493b877e54c4308adc038191b0a85d9/data?f=pjson"];
     NSData* data = [NSData dataWithContentsOfURL:urlOfJson];
     
     */
    
    //use NSJSONSerialization
    NSError* error;
    NSDictionary* dictionaryFromJson = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
    
    //Get the JSON value for the baseMap key
    NSDictionary* baseMapJson = [dictionaryFromJson objectForKey:@"baseMap"];
    
    //Create an instance of AGSWebMapBaseMap
    AGSWebMapBaseMap* newWebmapBasemap = [[AGSWebMapBaseMap alloc]initWithJSON:baseMapJson];
    
    //Switch the basemap of webmap. The webmap should be completely loaded before this method is called.
    [self.webMap switchBaseMapOnMapView:newWebmapBasemap];
    
    //Hide the switch button
    [self.changeBasemapBTN setHidden:YES];
}


#pragma mark - AGSWebMapDelegate method
- (void) webMapDidLoad:(AGSWebMap *)webMap{
    NSLog(@"Webmap is successfully loaded.");
}

#pragma mark - AGSWebMapDelegate method
-(void)webMap:(AGSWebMap *)webMap didFailToLoadWithError:(NSError *)error{
    
    NSLog(@"Error occurred while loading the webmap: %@", [error localizedDescription]);
}

#pragma mark - AGSWebMapDelegate method
-(void)webMap:(AGSWebMap*)webMap didSwitchBaseMap:(AGSWebMapBaseMap*)baseMap onMapView:(AGSMapView*)mapView{
    NSLog(@"Tried to load basemap layer and add it to the map.");
}

#pragma mark - AGSWebMapDelegate method
-(void) webMap:(AGSWebMap *) webMap didFailToLoadLayer:(AGSWebMapLayerInfo *)layerInfo baseLayer:(BOOL)baseLayer federated:(BOOL)federated withError:(NSError *)error{
 
    NSLog(@"Error while loading layer: %@",[error localizedDescription]);
}
@end