#include "stdafx.h"
//This include contains my license information
#include "LicenseUtilities.h"
#include <ArcSDK.h>

int _tmain(int argc, _TCHAR* argv[])
{
	//This comes from the LicenseUtilities.h, not included with this code.
	if (!InitializeApp())
	{
		AoExit(0);
	}

	try{
		//These are the fields I am updating in addition to the location of the feature and the feature itself.
		const CComBSTR dataPath = "C:\\Users\\alex7370\\Documents\\CPPSample.gdb";
		const CComBSTR featureClassName = "PointFeature";
		const CComBSTR helloField = "Hello";

		std::cerr << "Environmental Systems Reasearch Institute" << std::endl << std::endl;

		std::cerr << "Creating the workspace..." << std::endl;
		IWorkspaceFactory2Ptr workspacePtr(CLSID_FileGDBWorkspaceFactory);
		IWorkspacePtr workspace;
		HRESULT hr = workspacePtr->OpenFromFile(dataPath, 0, &workspace);
		if (FAILED(hr) || workspace == 0)
		{
			std::cerr << "Could not open the workspace." << std::endl;
			return E_FAIL;
		}
		std::cerr << "Casting to a feature workspace..." << std::endl;
		IFeatureWorkspacePtr featureWorkspace = workspace;
		IFeatureClassPtr featureClass;
		std::cerr << "Opening the feature class..." << std::endl;
		hr = featureWorkspace->OpenFeatureClass(featureClassName, &featureClass);
		if (FAILED(hr) || featureClass == 0)
		{
			std::cerr << "Could not open the feature class." << std::endl;
			return E_FAIL;
		}
		IFeatureBufferPtr featureBuffer;
		std::cerr << "Creating the feature buffer..." << std::endl;
		hr = featureClass->CreateFeatureBuffer(&featureBuffer);
		if (FAILED(hr) || featureClass == 0)
		{
			std::cerr << "Could not create the feature class." << std::endl;
			return E_FAIL;
		}

		IFeatureCursorPtr cursor;
		std::cerr << "Opening the feature Cursor..." << std::endl;
		hr = featureClass->Insert(VARIANT_TRUE, &cursor);
		if (FAILED(hr) || cursor == 0)
		{
			std::cerr << "Could not create the feature cursor." << std::endl;
			return E_FAIL;
		}
		IFieldsPtr fields;
		long index;
		CComVariant helloFieldMessage("Hello World");

		std::cerr << "Finding Hello Field and placing value..." << std::endl;
		 featureBuffer->get_Fields(&fields);
		fields->FindField(helloField, &index);
		featureBuffer->put_Value(index, helloFieldMessage);

		std::cerr << "Creating the point geometry to place in my feature class..." << std::endl;
		IPointPtr point(CLSID_Point);
		point->put_X(0);
		point->put_Y(0);
		IGeometryPtr geometry = point;

		std::cerr << "Placing the point in the buffer..." << std::endl;
		featureBuffer->putref_Shape(geometry);
		VARIANT id;
		std::cerr << "Inserting buffer into the table..." << std::endl;
		cursor->InsertFeature(featureBuffer, &id);
		std::cerr << "Feature " << id.intVal << " inserted..." << std::endl;
		cursor->Flush();


		std::cerr << "Done." << std::endl;
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
