#include "stdafx.h"
#include <iostream>
#include "myTool.h"

MyTool::MyTool(){ // Constructor code.. }
MyTool::~MyTool(){ // Destructor code.. }

STDMETHODIMP MyTool::OnClick()
{
	 HRESULT hr;

	 CComBSTR szFileName; 
	 szFileName = L"raster.tif";
	 CComBSTR szPath;
	 szPath = L"C:\\temp\\raster";
		
	 try
	 {
		IWorkspaceFactoryPtr ipWorkspaceFactory(CLSID_RasterWorkspaceFactory);
		IWorkspacePtr ipWorkspace;
		HRESULT hr = ipWorkspaceFactory->OpenFromFile(szPath, 0, &ipWorkspace);
		if (FAILED(hr) || ipWorkspace == 0)
		{
			std::cerr << "Could not open the workspace." << std::endl;
			return E_FAIL;
		}
		IRasterWorkspacePtr ipRasterWorkspace;

		ipRasterWorkspace = ipWorkspace; // Implicit cast from IWorkspace to IRasterWorkspace
		IRasterDatasetPtr RD;
		ipRasterWorkspace->OpenRasterDataset(szFileName,&RD);
		IConversionOpPtr ipConversionOp(CLSID_RasterConversionOp);

		CComBSTR Path = "C:\\temp\\output"; //directory or subdirectory to contain the output feature class
		IWorkspaceFactoryPtr ipWSF(CLSID_ShapefileWorkspaceFactory);
		IWorkspacePtr ipWS;
		hr = ipWSF->OpenFromFile(Path, 0, &ipWS);
		CComBSTR FileName;
		FileName=L"VC_zeroAsBackground_TRUE";
		IGeoDatasetPtr outgeodataset; 
		VARIANT minDangle;
		minDangle.vt = VT_I2;	// vt means Value type tag. 
								// VT_I2 means: either the specified type, or the type of the element or 
								// contained field MUST be a 2-byte signed integer. See:
								// http://msdn.microsoft.com/en-us/library/cc237865.aspx 
		minDangle.uiVal = 0; // uiVal means: Unsigned Short value
						// See: http://msdn.microsoft.com/en-us/library/windows/desktop/aa380072(v=vs.85).aspx

		hr=ipConversionOp->RasterDataToLineFeatureData(
			(IGeoDatasetPtr)RD,	// input dataset
			ipWS,				// directory to contain output feature class
			FileName,			// name of output feature class
			true,				// zeroAsBackground
			false,				// weed tolerance to be applied to reduce the number of vertices. Uses Douglas-Pueker algorithm
			&minDangle,&outgeodataset	// minimum length of dangling polylines that will be retained. Default is zero.
		);	
		// The output of the above method is a feature class stored in the folder ipWS, named FileName. 
		// In this this case, this is "C:\\temp\\output\\VC.shp"
		

	 }
	 catch (_com_error e)
	 {
		TCHAR str[255]; 
		BSTR bstr = BSTR(e.Description()); 
		if (bstr) 
			wsprintf(str,_T("Known Error : \n %ls"),bstr); 
		else
			wsprintf(str, _T("Unknown Error..\n"));
		return E_FAIL;
	 }

	return S_OK;
}
