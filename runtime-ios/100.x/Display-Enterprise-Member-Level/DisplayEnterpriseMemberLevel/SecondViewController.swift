//
//  SecondViewController.swift
//  DisplayEnterpriseMemberLevel
//
//  Created by Kavish Ghime on 11/28/20.
//

import Foundation
import UIKit

class SecondViewController: UIViewController {
    
    
    @IBOutlet weak var licenseLevelLabel: UILabel!
    
    
    var getLicenseLevel: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.licenseLevelLabel.text = "Your Enterprise License Level: " + self.getLicenseLevel!
        // Do any additional setup after loading the view.
    }


    @IBAction func logoutAction(_ sender: Any) {
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "Logout"), object: nil, userInfo: nil)
        self.navigationController?.popViewController(animated: true)
    }
    
}
