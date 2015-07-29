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

#include "stdafx.h"
#include "LicenseUtilities.h"

// Initialize the application and check out a license if needed.
bool InitializeApp(esriLicenseExtensionCode license)
{
	::AoInitialize(NULL);
	IAoInitializePtr ipInit(CLSID_AoInitialize);

	if (license == 0)
	{
		// Try to init as engine, then engineGeoDB, then Basic, 
		//    then Standard, then Advanced 
		if (!InitAttemptWithoutExtension(esriLicenseProductCodeEngine))
			if (!InitAttemptWithoutExtension(esriLicenseProductCodeBasic))
				if (!InitAttemptWithoutExtension(esriLicenseProductCodeStandard))
					if (!InitAttemptWithoutExtension(esriLicenseProductCodeAdvanced))
					{
						// No appropriate license is available
						std::cerr << "LicenseUtilities::InitializeApp -- "
							<< "Unable to initialize ArcObjects "
							<< "(no appropriate license available)."
							<< std::endl;
						return false;
					}

		return true;
	}

	// Try to init as engine, then engineGeoDB, then Basic, 
	//    then Standard, then Advanced 
	if (!InitAttemptWithExtension(esriLicenseProductCodeEngine, license))
		if (!InitAttemptWithExtension(esriLicenseProductCodeBasic, license))
			if (!InitAttemptWithExtension(esriLicenseProductCodeStandard, license))
				if (!InitAttemptWithExtension(esriLicenseProductCodeAdvanced, license))
				{
					// No appropriate license is available
					std::cerr << "LicenseUtilities::InitializeApp -- "
						<< "Unable to initialize ArcObjects "
						<< "(no appropriate license available)."
						<< std::endl;
					return false;
				}

	return true;
}

// Attempt to initialize without an extension
bool InitAttemptWithoutExtension(esriLicenseProductCode product)
{
	IAoInitializePtr ipInit(CLSID_AoInitialize);

	esriLicenseStatus status = esriLicenseFailure;
	ipInit->Initialize(product, &status);
	return (status == esriLicenseCheckedOut);
}

// Attempt to initialize with an extension
bool InitAttemptWithExtension(esriLicenseProductCode product,
	esriLicenseExtensionCode extension)
{
	IAoInitializePtr ipInit(CLSID_AoInitialize);

	esriLicenseStatus licenseStatus = esriLicenseFailure;
	ipInit->IsExtensionCodeAvailable(product, extension, &licenseStatus);
	if (licenseStatus == esriLicenseAvailable)
	{
		ipInit->Initialize(product, &licenseStatus);
		if (licenseStatus == esriLicenseCheckedOut)
			ipInit->CheckOutExtension(extension, &licenseStatus);
	}
	return (licenseStatus == esriLicenseCheckedOut);
}

// Shutdown the application and check in the license if needed.
HRESULT ShutdownApp(esriLicenseExtensionCode license)
{
	HRESULT hr;

	// Scope ipInit so released before AoUninitialize call
	{
		IAoInitializePtr ipInit(CLSID_AoInitialize);
		esriLicenseStatus status;
		if (license != NULL)
		{
			hr = ipInit->CheckInExtension(license, &status);
			if (FAILED(hr) || status != esriLicenseCheckedIn)
				std::cerr << "License Check-in failed." << std::endl;
		}
		hr = ipInit->Shutdown();
	}

	::AoUninitialize();
	return hr;
}




