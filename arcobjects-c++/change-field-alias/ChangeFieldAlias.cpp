// ChangeFieldAlias.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "LicenseUtilities.h"
#include <ArcSDK.h>

int _tmain(int argc, _TCHAR* argv[])
{
	if (!InitializeApp())
	{
		AoExit(0);
	}

	try{

		CONST CComBSTR MapDocLocation = "C:\\Users\\alex7370\\Desktop\\mxdFont.mxd";
		CONST CComBSTR MapDocPassword = "";
		CONST IMapDocumentPtr MapDoc(CLSID_MapDocument);
		CONST CComBSTR expectedAlias = "Int";
		CONST CComBSTR desiredAlias = "INT";

		std::cerr << "Loading the map document..." << std::endl;
		MapDoc->Open(MapDocLocation, MapDocPassword);
		std::cerr << "Finding the correct layer..." << std::endl;
		IActiveViewPtr activeView;
		MapDoc->get_ActiveView(&activeView);
		IMapPtr map;
		activeView->get_FocusMap(&map);
		ILayerPtr layer;
		map->get_Layer(0, &layer);
		std::cerr << "Layer found!" << std::endl;
		std::cerr << "Looking for fields in layer..." << std::endl << "Updating as necessary..." << std::endl;
		ILayerFieldsPtr layerFields = layer;
		long fieldCount;
		layerFields->get_FieldCount(&fieldCount);
		for (int i = 0; i < fieldCount; i++)
		{
			IFieldInfoPtr fieldInfo;
			layerFields->get_FieldInfo(i, &fieldInfo);
			CComBSTR fieldAlias;
			fieldInfo->get_Alias(&fieldAlias);
			if (fieldAlias == expectedAlias)
			{
				fieldInfo->put_Alias(desiredAlias);
				std::cerr << "Replaced!" << std::endl;
			}
		}
		std::cerr << "Attempting to save...";

		MapDoc->Save(VARIANT_FALSE, VARIANT_TRUE);

		std::cerr << "Saved!" << std::endl << "Done!" << std::endl;

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
