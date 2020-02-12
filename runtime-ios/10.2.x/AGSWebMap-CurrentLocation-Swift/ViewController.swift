//
//  ViewController.swift
//  MapViewDemo-Swift
//  Nathan Wu

import UIKit
import ArcGIS

class ViewController: UIViewController , AGSWebMapDelegate, AGSMapViewLayerDelegate {
    
    @IBOutlet weak var switchBtn: UISwitch!
    @IBOutlet weak var mapView: AGSMapView!
    var currentLocation: AGSLocation!
    let webmap = AGSWebMap(itemId: "f553d4b86e354c05917ad269de26f6f0", credential: nil)
    let switchBasemapWebmap = AGSWebMap(itemId: "d94dcdbe78e141c2b2d3a91d5ca8b9c9", credential: nil)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.webmap.delegate = self
        self.switchBtn.setOn(false, animated: false)
        
        self.webmap.openIntoMapView(self.mapView)
        self.mapView.locationDisplay.startDataSource()
        
    }
    
    func webMapDidLoad(webMap: AGSWebMap!) {
        
        print("Load webmap!")
    }
    
    func webMap(webMap: AGSWebMap!, didLoadLayer layer: AGSLayer!) {
        
        currentLocation = self.mapView.locationDisplay.location
        print(currentLocation)
        
        let projectedMapPoint = AGSGeometryEngine.defaultGeometryEngine().projectGeometry(currentLocation.point, toSpatialReference: AGSSpatialReference.webMercatorSpatialReference()) as! AGSPoint;
        self.webmap.mapView.centerAtPoint(projectedMapPoint, animated: true)
        
    }
    @IBAction func switchBasemap(sender: UISwitch) {
        if switchBtn.on {
            print("Button is on")
            self.webmap.switchBaseMapOnMapView(self.switchBasemapWebmap.baseMap!)
        } else {
            print("Button is off")
            self.webmap.switchBaseMapOnMapView(self.webmap.baseMap!)
        }
    }

    func webMap(webMap: AGSWebMap!, didSwitchBaseMap baseMap: AGSWebMapBaseMap!, onMapView mapView: AGSMapView!) {
        print("Basemap did switch : \(self.webmap.baseMap.title)")
    }
    
    func webMap(webMap: AGSWebMap!, didFailToLoadWithError error: NSError!) {
        print("Error while loading webmap: \(error.localizedDescription)")
    }
    
}