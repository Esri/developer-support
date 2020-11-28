//
//  ViewController.swift
//  Licensing Sample app
//
//  Created by Raj on 23/08/19.
//  Copyright © 2019 Raj. All rights reserved.
//

import UIKit
import ArcGIS

class ViewController: UIViewController {
    
    var licenseLevel = 0
    var portal: AGSPortal?
    
    let portalURL:String = "https://kghime.esri.com/portal"
    let userName:String = ""
    let password:String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        NotificationCenter.default.addObserver(self, selector: #selector(self.logout), name: NSNotification.Name(rawValue: "Logout"), object: nil)
    }
    
    @IBAction func loginAction(_ sender: Any) {
        self.portalAuthenticateCall(completion: {(status) in
            self.loadLicenseAndGotoNextController(completion: {(status) in
                if status{
                    DispatchQueue.main.async {
                        let logoutVC = self.storyboard?.instantiateViewController(withIdentifier: "SecondViewController") as! SecondViewController
                        logoutVC.getLicenseLevel = String(self.licenseLevel)
                        self.navigationController?.pushViewController(logoutVC, animated: true)
                    }
                }
            })
        })
    }
    
    @objc func logout(){
        self.portal!.logout()
    }
    
    func portalAuthenticateCall(completion:@escaping (Bool)->()){
        
        do {
            let portal = AGSPortal(url: URL(string: self.portalURL)!, loginRequired: true)
            self.portal = portal
            self.portal!.requestConfiguration?.requestCachePolicy = .reloadIgnoringLocalCacheData
            self.portal!.requestConfiguration?.shouldCacheResponse = false
            let cred = AGSCredential(user: self.userName, password: self.password)
            self.portal!.credential = cred
            
            self.portal!.load { (error) -> Void in
                if let error = error {
                    print(error)
                    completion(false)
                }
                else {
                    completion(true)
                    print("Portal Access Token -",(self.portal!.credential?.token)!)
                }
            }
        }
    }
    
    func loadLicenseAndGotoNextController(completion:@escaping (Bool)->()){
        let licenseInfo = self.portal?.portalInfo?.licenseInfo
        var status = false
        if licenseInfo != nil{
            do {
                // Setting the License Info
                let result = try AGSArcGISRuntimeEnvironment.setLicenseInfo(licenseInfo!)
                switch result.licenseStatus{
                case .valid:
                    do {
                        status = true
                    }
                    break
                default:
                    break
                }
                print("Licence level ------> ",AGSArcGISRuntimeEnvironment.license().licenseLevel.rawValue)
                self.licenseLevel = AGSArcGISRuntimeEnvironment.license().licenseLevel.rawValue
                var licenseDictionary: NSDictionary?
                do {licenseDictionary = try licenseInfo?.toJSON() as! NSDictionary?
                    print("License String ------>",licenseDictionary as! NSDictionary)
                } catch {
                    print("LicenseInfo not available")
                }
                completion(status)
            }
            catch let error as NSError {
                print("error: \(error.localizedDescription)")
                completion(false)
            }
        }else{
            completion(false)
        }
    }
}

