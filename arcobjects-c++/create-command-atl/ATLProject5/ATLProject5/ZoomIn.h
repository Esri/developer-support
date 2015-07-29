// ZoomIn.h : Declaration of the CZoomIn

#pragma once
#include "resource.h"       // main symbols



#include "ATLProject5_i.h"



#if defined(_WIN32_WCE) && !defined(_CE_DCOM) && !defined(_CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA)
#error "Single-threaded COM objects are not properly supported on Windows CE platform, such as the Windows Mobile platforms that do not include full DCOM support. Define _CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA to force ATL to support creating single-thread COM object's and allow use of it's single-threaded COM object implementations. The threading model in your rgs file was set to 'Free' as that is the only threading model supported in non DCOM Windows CE platforms."
#endif

using namespace ATL;


// CZoomIn

class ATL_NO_VTABLE CZoomIn :
	public CComObjectRootEx<CComSingleThreadModel>,
	public CComCoClass<CZoomIn, &CLSID_ZoomIn>,
	public IZoomIn,
	public ICommand
{
public:
	CZoomIn();
	~CZoomIn();

	DECLARE_REGISTRY_RESOURCEID(IDR_ZOOMIN)


	BEGIN_COM_MAP(CZoomIn)
		COM_INTERFACE_ENTRY(IZoomIn)
		COM_INTERFACE_ENTRY(ICommand)
	END_COM_MAP()

	struct __declspec(uuid("B56A7C42-83D4-11d2-A2E9-080009B6F22B")) CATID_MxCommands;

	BEGIN_CATEGORY_MAP(__uuidof(CATID_ControlsCommands))
		IMPLEMENTED_CATEGORY(__uuidof(CATID_MxCommands))
	END_CATEGORY_MAP()



	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		return S_OK;
	}

	void FinalRelease()
	{
	}

public:




	// ICommand Methods
public:
	STDMETHOD(get_Enabled)(VARIANT_BOOL * Enabled);
	STDMETHOD(get_Checked)(VARIANT_BOOL * Checked)
	{
		return E_NOTIMPL;
	}
	STDMETHOD(get_Name)(BSTR * Name);
	STDMETHOD(get_Caption)(BSTR * Caption);
	STDMETHOD(get_Tooltip)(BSTR * Tooltip)
	{
		return E_NOTIMPL;
	}
	STDMETHOD(get_Message)(BSTR * Message)
	{
		return E_NOTIMPL;
	}
	STDMETHOD(get_HelpFile)(BSTR * HelpFile)
	{
		return E_NOTIMPL;
	}
	STDMETHOD(get_HelpContextID)(long * helpID)
	{
		return E_NOTIMPL;
	}
	STDMETHOD(get_Bitmap)(OLE_HANDLE * Bitmap);
	STDMETHOD(get_Category)(BSTR * categoryName);
	STDMETHOD(OnCreate)(LPDISPATCH Hook);
	STDMETHOD(OnClick)();

private:
	HBITMAP m_hBitmap;

};

OBJECT_ENTRY_AUTO(__uuidof(ZoomIn), CZoomIn)
