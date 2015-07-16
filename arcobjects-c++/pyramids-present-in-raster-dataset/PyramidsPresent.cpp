#include "stdafx.h"
//Used to initalize the application on line 16.  Custom header used in initialization
#include "LicenseUtilities.h"
#include <ArcSDK.h>





int _tmain(int argc, _TCHAR* argv[])
{
	/*
	 * License initialization occurs here, left out of code to shorten length.
	 */
	if (!InitializeApp())
	{
		AoExit(0);
	}

	std::cerr << "Environmental Systems Reasearch Institute" << std::endl << std::endl;

	CComBSTR filePath;
	filePath = "E:\\Data";
	CComBSTR rasterDataset;
	rasterDataset = "Tester1234.tif";

	std::cerr << "Starting analysis..." << std::endl;
	try
	{
		std::cerr << "Opening workspace..." << std::endl;

		IWorkspaceFactoryPtr ipWorkspaceFactory(CLSID_RasterWorkspaceFactory);

		IWorkspacePtr ipWorkspace;
		HRESULT hr = ipWorkspaceFactory->OpenFromFile(filePath, 0, &ipWorkspace);

		if (FAILED(hr) || ipWorkspace == 0)
		{
			std::cerr << "Could not open the workspace." << std::endl;
			return E_FAIL;
		}
		std::cerr << "Opening Raster..." << std::endl;
		IRasterWorkspacePtr ipRasterWorkspace = ipWorkspace;
		IRasterDatasetPtr ipRasterDataset;
		hr = ipRasterWorkspace->OpenRasterDataset(rasterDataset, &ipRasterDataset);
		if (FAILED(hr) || ipWorkspace == 0)
		{
			std::cerr << "Could not open the dataset." << std::endl;
			return E_FAIL;
		}

		std::cerr << "Checking to see if pyramids are present..." << std::endl;
		IRasterPyramid3Ptr rasterPyramid = ipRasterDataset;
		VARIANT_BOOL presentPyramids;

		rasterPyramid->get_Present(&presentPyramids);

		presentPyramids == VARIANT_FALSE ? std::cerr << "Prescense of raster pyramids = false" << std::endl : std::cerr << "Prescense of raster pyramids = true" << std::endl;



	}
	catch (_com_error e)
	{
		TCHAR str[255];
		BSTR bstr = BSTR(e.Description());
		if (bstr)
			wsprintf(str, _T("Known Error : \n %ls"), bstr);
		else
			wsprintf(str, _T("Unknown Error..\n"));
		return E_FAIL;
	}


	AoExit(0);
	return 0;
}
