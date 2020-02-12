//
//  ViewController.m
//  MapViewDemo
//

#import "ViewController.h"
#import <ArcGIS/ArcGIS.h>

@interface ViewController ()<AGSMapViewLayerDelegate>

@property (weak, nonatomic) IBOutlet AGSMapView *mapView;


@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    // set the delegate for the map view
    self.mapView.layerDelegate = self;
    
    //create an instance of a tiled map service layer
    AGSTiledMapServiceLayer *tiledLayer = [[AGSTiledMapServiceLayer alloc] initWithURL:[NSURL URLWithString:@"http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"]];
    
    //Add it to the map view
    [self.mapView addMapLayer:tiledLayer withName:@"Tiled Layer"];

}

-(void) CreateGeometry{
    
    //https://developers.arcgis.com/ios/api-reference/interface_a_g_s_geometry.html
    
    //AGSGeometry has 5 subclass for implementing geometry objects. Each of them has a mutable version.
    //When creating or updating the geometry, use the mutable version
    
    //AGSEnvelope/AGSMutableEnvelope
    AGSEnvelope* env = [AGSEnvelope envelopeWithXmin:10 ymin:10 xmax:30 ymax:30 spatialReference:[AGSSpatialReference spatialReferenceWithWKID:4326]];
    
    //AGSMultipoint/AGSMutableMultipoint
    AGSMutableMultipoint* multiPoint = [[AGSMutableMultipoint alloc] initWithSpatialReference:[AGSSpatialReference spatialReferenceWithWKID:4326]];
    [multiPoint addPoint: [AGSPoint pointWithX:10 y:10 spatialReference:nil]];
    [multiPoint addPoint: [AGSPoint pointWithX:20 y:20 spatialReference:nil]];
    [multiPoint addPoint: [AGSPoint pointWithX:30 y:30 spatialReference:nil]];
    
    //AGSPoint/AGSMutablePoint
    AGSPoint* point = [AGSPoint pointWithX:114.0 y:30.0 spatialReference:[AGSSpatialReference spatialReferenceWithWKID:4326]];
    AGSMutablePoint* mutable = [point mutableCopy];
    [mutable updateWithX:120.0 y:20.0];
    
    //AGSPolyline/AGSMutablePolyline
    AGSMutablePolyline* polyline = [[AGSMutablePolyline alloc] initWithSpatialReference:[AGSSpatialReference spatialReferenceWithWKID:4326]];
    [polyline addPathToPolyline];
    [polyline addPointToPath:[AGSPoint pointWithX:10 y:10 spatialReference:nil]];
    [polyline addPointToPath:[AGSPoint pointWithX:30 y:10 spatialReference:nil]];
    [polyline addPointToPath:[AGSPoint pointWithX:30 y:30 spatialReference:nil]];
    
    //AGSPolyline/AGSMutablePolygon
    AGSMutablePolygon* poly = [[AGSMutablePolygon alloc]initWithSpatialReference:[AGSSpatialReference spatialReferenceWithWKID:4326]];
    [poly addRingToPolygon];
    [poly addPoint:[AGSPoint pointWithX:-121.665219928 y:38.169285281 spatialReference:nil] toRing:0];
    [poly addPoint:[AGSPoint pointWithX:-124.206444444 y:41.997647912 spatialReference:nil] toRing:0];
    [poly addPoint:[AGSPoint pointWithX:-114.461436322 y:32.84542251 spatialReference:nil] toRing:0];
    [poly addPoint:[AGSPoint pointWithX:-121.665219928 y:38.169285281 spatialReference:nil] toRing:0];
    
    [poly addRingToPolygon];
    [poly addPoint:[AGSPoint pointWithX:-119.867823257 y:34.0752286490001 spatialReference:nil] toRing:1];
    [poly addPoint:[AGSPoint pointWithX:-119.523095554 y:34.034590613 spatialReference:nil] toRing:1];
    [poly addPoint:[AGSPoint pointWithX:-119.847275401 y:33.9684159340001 spatialReference:nil] toRing:1];
    [poly addPoint:[AGSPoint pointWithX:-119.867823257 y:34.0752286490001 spatialReference:nil] toRing:1];
    
    [poly addRingToPolygon];
    [poly addPoint:[AGSPoint pointWithX:-120.167386086 y:33.9241621960001 spatialReference:nil] toRing:2];
    [poly addPoint:[AGSPoint pointWithX:-120.238548701 y:34.010885241 spatialReference:nil] toRing:2];
    [poly addPoint:[AGSPoint pointWithX:-119.963385936 y:33.947763158 spatialReference:nil] toRing:2];
    [poly addPoint:[AGSPoint pointWithX:-120.167386086 y:33.9241621960001 spatialReference:nil] toRing:2];
    
    [poly addRingToPolygon];
    [poly addPoint:[AGSPoint pointWithX:-118.594780502 y:33.480818356 spatialReference:nil] toRing:3];
    [poly addPoint:[AGSPoint pointWithX:-118.304036434 y:33.3074940430001 spatialReference:nil] toRing:3];
    [poly addPoint:[AGSPoint pointWithX:-118.455386786 y:33.3247859790001 spatialReference:nil] toRing:3];
    [poly addPoint:[AGSPoint pointWithX:-118.594780502 y:33.480818356 spatialReference:nil] toRing:3];
    
    [poly addRingToPolygon];
    [poly addPoint:[AGSPoint pointWithX:-118.350958201 y:32.8191952320001 spatialReference:nil] toRing:4];
    [poly addPoint:[AGSPoint pointWithX:-118.420105889 y:32.8061145340001 spatialReference:nil] toRing:4];
    [poly addPoint:[AGSPoint pointWithX:-118.599517215 y:33.02102197 spatialReference:nil] toRing:4];
    [poly addPoint:[AGSPoint pointWithX:-118.350958201 y:32.8191952320001 spatialReference:nil] toRing:4];
    
}

#pragma mark AGSMapViewLayerDelegate methods

-(void) mapViewDidLoad:(AGSMapView*)mapView {
    
    // Enable location display on the map
    [self.mapView.locationDisplay startDataSource];
    self.mapView.locationDisplay.autoPanMode = AGSLocationDisplayAutoPanModeDefault;
    
   
}



@end
