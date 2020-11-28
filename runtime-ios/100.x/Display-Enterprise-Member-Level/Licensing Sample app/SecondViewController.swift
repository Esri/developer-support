//
//  SecondViewController.swift
//  Licensing Sample app
//
//  Created by Raj on 23/08/19.
//  Copyright © 2019 Raj. All rights reserved.
//

import UIKit

class SecondViewController: UIViewController {
    
    @IBOutlet weak var licenseLevelLabel: UILabel!
    var getLicenseLevel: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.licenseLevelLabel.text = "Your license level is:" + self.getLicenseLevel!
        // Do any additional setup after loading the view.
    }
    
    @IBAction func logoutAction(_ sender: Any) {
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "Logout"), object: nil, userInfo: nil)
        self.navigationController?.popViewController(animated: true)
    }
    


}
