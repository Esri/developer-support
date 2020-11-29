# Display user`s license level from ArcGIS Enterprise or ArcGIS Online 
## About
Organizations can use, create, and share a wide range of geographic content, including maps, scenes, apps, layers, and analytics. The ability of individual organization members to access and work with content in different ways depends on the privileges they have in the organization. "Levels" allow organizations to control the scope of privileges that can be assigned to members through roles.

"Level 1" membership is for members who only need privileges to view content, such as maps and apps, that has been shared with them through the organization, as well as join groups within the organization. "Level 2" membership is for members who need to view, create, and share content and own groups, in addition to other tasks.

This sample displays a user`s license Level, granted to their account on ArcGIS Enterprise or ArcGIS Online.

Levels, roles, and privileges: https://enterprise.arcgis.com/en/portal/10.6/administer/windows/roles.htm

## How it works
The class AGSLicense provides the property "licenseLevel" to access the user`s Level granted on ArcGIS platform.

```
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
print("Enterprise member Licence level ------> ",AGSArcGISRuntimeEnvironment.license().licenseLevel.rawValue)
self.licenseLevel = AGSArcGISRuntimeEnvironment.license().licenseLevel.rawValue
```

## How to run the sample
1. Open the sample in XCode
2. Add your portal on line #16 of "ViewController.swift" file
3. Add the credentials on line #17 and #18
4. Run the app
5. After clicking the "login" button, the app will display the license level
6. Also, in the XCode`s console, you can see the license string and portal access token 
