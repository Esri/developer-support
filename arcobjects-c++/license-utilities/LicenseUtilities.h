// Copyright 2014 ESRI
// 
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
// 
// You may freely redistribute and use this sample code, with or
// without modification, provided you include the original copyright
// notice and use restrictions.
// 
// See the use restrictions at <your ArcGIS install location>/DeveloperKit10.3/userestrictions.txt.
// 


#ifndef __LICENSEUTLITIES_ESRICPP_h__
#define __LICENSEUTLITIES_ESRICPP_h__

#include <iostream>
#include <ArcSDK.h>

// Initialize the application and check out a license if needed.
bool InitializeApp(esriLicenseExtensionCode license =
	(esriLicenseExtensionCode)0);

// Attempt to initialize
bool InitAttemptWithoutExtension(esriLicenseProductCode product);
bool InitAttemptWithExtension(esriLicenseProductCode product,
	esriLicenseExtensionCode extension);

// Shutdown the application and check in the license if needed.
HRESULT ShutdownApp(esriLicenseExtensionCode license =
	(esriLicenseExtensionCode)0);

#endif    // __LICENSEUTLITIES_ESRICPP_h__



