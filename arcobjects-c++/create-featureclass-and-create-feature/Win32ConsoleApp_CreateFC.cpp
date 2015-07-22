// Win32ConsoleApp_CreateFC.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "Win32ConsoleApp_CreateFC.h"

// Signature declaration - CreateFeatureClass Method (put it in the stdafx.h file)
// Signature declaration - CreateFeature Method (put it in the stdafx.h file)


int _tmain(int argc, _TCHAR* argv[])
{
	// Initialize ArcObjects
	if (!InitializeApp())
	{
		AoExit(0);
	}

	// Get a reference to a feature workspace through a workspace factory
	IWorkspaceFactoryPtr ipWorkspaceFactory(CLSID_ShapefileWorkspaceFactory);
	IWorkspacePtr ipWorkspace;
	CComBSTR inPath = CComBSTR("C:\\Temp\\"); // Note that L is an encoding prefix, it stands for "wide Character", wchar_t
	HRESULT hr = ipWorkspaceFactory->OpenFromFile(inPath, 0, &ipWorkspace);
	if (FAILED(hr) || ipWorkspace == 0)
	{
		std::cerr << "Could not open the workspace." << std::endl;
		return E_FAIL;
	}
	IFeatureWorkspacePtr ipFeatureWorkspace = ipWorkspace;

	// Create the spatial reference
	ISpatialReferenceFactory4Ptr ipSpatialReferenceFactory4(CLSID_SpatialReferenceEnvironment);
	IProjectedCoordinateSystemPtr proj_CS_UTMz15N_WGS84;
	ipSpatialReferenceFactory4->CreateProjectedCoordinateSystem((long)esriSRProjCSType::esriSRProjCS_WGS1984UTM_15N, &proj_CS_UTMz15N_WGS84);
	ISpatialReferencePtr ipSpatialReference = proj_CS_UTMz15N_WGS84;


	try
	{
		IFeatureDatasetPtr ipFeatureDataset = NULL;

		//To use the CreateFeatureClass() Method, you need some default values for the following parameters
		// -------------------------

		//Create a CLASS-ID (UID) for the CreateFeatureClass method
		IUIDPtr ipFeatureClassUID(CLSID_UID);
		ipFeatureClassUID->Generate();
		//Create Extension CLASS-ID as for CreateFeatureClass method
		IUIDPtr ipClassExtensionUID(CLSID_UID);
		ipClassExtensionUID->Generate();

		//Define the field(s) needed to create your featureclass

		// Set up a simple fields collection
		IFieldsPtr ipFields(CLSID_Fields);			// new IFields
		IFieldsEditPtr ipFieldsEdit = ipFields;		// Cast IFields to IFieldsEdit
		IFieldPtr ipField(CLSID_Field);				// new IField
		IFieldEditPtr ipFieldEdit = ipField;		// Cast IField to IFieldEdit

		// Make and add the shape field. It will need a geometry definition 
		//    and a spatial reference
		char* shapeFieldName = "Shape";
		ipFieldEdit->put_Name(CComBSTR(shapeFieldName));
		ipFieldEdit->put_Type(esriFieldTypeGeometry);
		IGeometryDefPtr ipGeomDef(CLSID_GeometryDef);
		IGeometryDefEditPtr ipGeomDefEdit = ipGeomDef;
		ipGeomDefEdit->put_GeometryType(esriGeometryPolyline);
		//ISpatialReferencePtr ipUnkSpatial(CLSID_UnknownCoordinateSystem);
		ipGeomDefEdit->putref_SpatialReference(ipSpatialReference);
		ipFieldEdit->putref_GeometryDef(ipGeomDef);
		ipFieldsEdit->AddField(ipField);

		// Add another miscellanesous text field
		ipField = IFieldPtr(CLSID_Field);
		ipFieldEdit = ipField;
		ipFieldEdit->put_Length(30);
		ipFieldEdit->put_Name(CComBSTR(L"Text Field"));
		ipFieldEdit->put_Type(esriFieldTypeString);
		ipFieldsEdit->AddField(ipField);

		// Create the shapefile
		CComBSTR FeatureClassNameBStr = CComBSTR("NewFeatureClass2.shp");
		IFeatureClassPtr ipFeatureClass;
		hr = ipFeatureWorkspace->CreateFeatureClass(FeatureClassNameBStr, ipFields, 
													ipFeatureClassUID, ipClassExtensionUID, // NULL, NULL also works
													esriFeatureType::esriFTSimple, 
													CComBSTR(shapeFieldName), 
													CComBSTR(L""), 
													&ipFeatureClass);


		// Create a Polyline Feature from IPoints in an IPointCollection
		IPolylinePtr ipPolyline(CLSID_Polyline);
		IPointCollectionPtr ipPointCollection = ipPolyline;
		for (int i = 0; i < 5; i++)
		{
			IPointPtr ipPoint(CLSID_Point);
			ipPoint->put_X(i * 100.0);
			ipPoint->put_Y(i * 50.0);
			hr = ipPointCollection->AddPoint(ipPoint);
		}

		// Create Feature
		// ============================================
		IFeaturePtr ipFeature(CLSID_Feature);
		hr = ipFeatureClass->CreateFeature(&ipFeature);
		// IGeometry ipGeometry = ipPolyline; // This is not allowed because IGeometry is an abstract class
		hr = ipFeature->putref_Shape(ipPolyline); // Pass in ipPolyline instead of IGeometry. This works.
		// Update an attribute field
		long FieldIndex;
		hr = ipFeatureClass->FindField(CComBSTR("Text Field"), &FieldIndex);
		CComVariant value("Sami");
		hr = ipFeature->put_Value(FieldIndex, value);
		ipFeature->Store();
		// ============================================

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


	return 0;
}


