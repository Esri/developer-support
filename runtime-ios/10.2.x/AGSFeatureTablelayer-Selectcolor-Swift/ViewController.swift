//
//  ViewController.swift
//  MapViewDemo-Swift
//

import UIKit
import ArcGIS

class ViewController: UIViewController , AGSMapViewLayerDelegate, AGSMapViewTouchDelegate{

    //instantiate variables in order to convert AGSfeatureLayer to AGSGDBFeatureServiceTable, and then use AGSGDBFeatureServiceTable to create an AGSFeatureTableLayer
    var featureServiceTable: AGSGDBFeatureServiceTable!
    var ftLayer: AGSFeatureTableLayer!
    var initalenvelope: AGSEnvelope!
    
    @IBOutlet weak var textView: UITextView!
    @IBOutlet weak var mapView: AGSMapView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        // set the delegate for the map view
        self.mapView.layerDelegate = self
        self.mapView.touchDelegate = self
        
        //create an instance of a tiled map service layer
        let tiledLayer = AGSTiledMapServiceLayer(URL: NSURL(string: "http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer"))
        
        //create url for AGSGDBFeatureServiceTable
        let url = NSURL(string: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0")
        
        //Add it to the map view
        self.initalenvelope = AGSEnvelope(xmin: -17806770.1093099, ymin: 7034011.499086942, xmax: -3991847.36516403,  ymax: 7963485.76303443,  spatialReference: mapView.spatialReference)
        self.mapView.zoomToEnvelope(initalenvelope, animated: true)
        
        self.mapView.addMapLayer(tiledLayer, withName: "Tiled Layer")
        
        //init AGSGDBFeatureServiceTable based on ArcGIS Feature service or Map service URL
        featureServiceTable = AGSGDBFeatureServiceTable.init(serviceURL: url, credential: nil, spatialReference: AGSSpatialReference.webMercatorSpatialReference())
        featureServiceTable = AG
        
        //create an local FeatureTableLayer based on featureServiceTable
        ftLayer = AGSFeatureTableLayer.init(featureTable: featureServiceTable)
        
        //define the selectionColor
        ftLayer.selectionColor = UIColor.greenColor()
        
        //add the AGSFeatureTableLayer to map
        self.mapView.addMapLayer(ftLayer, withName: "FeatureLayer")
    }

//MARK: AGSMapViewLayerDelegate methods
    
    func mapViewDidLoad(mapView: AGSMapView!){
        
        self.mapView.locationDisplay.autoPanMode = .Default
        self.mapView.locationDisplay.startDataSource()
        
    }
//#pragma mark - AGSMapViewTouchDelegate methods

    func mapView(mapView: AGSMapView!, didClickAtPoint screen: CGPoint, mapPoint mappoint: AGSPoint!, features: [NSObject : AnyObject]!) {
        
        ftLayer.clearSelection()
        ftLayer.mapView?.zoomToEnvelope(initalenvelope, animated: true)
        
        if features.count != 0 {
        
            //Need to define feature comes from which layer, by using featureservice's layer name
            let array = features["Cities"] as! [AGSFeature]
            let firstPointGeometry = array.first! as AGSFeature;
            print(firstPointGeometry)
            
            let projectedMapPoint = AGSGeometryEngine.defaultGeometryEngine().projectGeometry(mappoint, toSpatialReference: AGSSpatialReference.wgs84SpatialReference()) as! AGSPoint;
            
            
            for feature in array {
                ftLayer.setSelected(true, forFeature: feature)
                print(ftLayer)
                textView.textColor = UIColor.blackColor()
                textView.text = "Is the feature selected?\r\(ftLayer.isFeatureSelected(feature))\r\rHow many features selected?\r\(ftLayer.selectedFeatures().count)\r\rYour click location on map is:\r\rLatitude: \(projectedMapPoint.y) Lontitude: \(projectedMapPoint.x)"
                
               
                print("Is the feature selected?, Answer: \(ftLayer.isFeatureSelected(feature))")
            }
            
            self.mapView.zoomToGeometry(firstPointGeometry.geometry, withPadding: 10, animated: true)
            
        } else {
            print("No feature selected around your click.")
            textView.textColor = UIColor.redColor()
            textView.text = "No feature selected around your click. And return to the initial map extent"
            
        }
    }
}