// ModifyBtn.cpp : Implementation of CModifyBtn

#include "stdafx.h"
#include "ModifyBtn.h"


// CModifyBtn

IHookHelperPtr m_ipHookHelper;
STDMETHODIMP CModifyBtn::get_Enabled(VARIANT_BOOL *Enabled)
{
	if (Enabled == NULL)
		return E_POINTER;

	*Enabled = VARIANT_TRUE; // Enable the tool always

	return S_OK;
}

CModifyBtn::CModifyBtn()
{
	m_hBitmap = ::LoadBitmap(_AtlBaseModule.GetResourceInstance(), MAKEINTRESOURCE(IDB_BITMAP1));
}

CModifyBtn::~CModifyBtn()
{
	DeleteObject(m_hBitmap);
}

STDMETHODIMP CModifyBtn::get_Name(BSTR *Name)
{
	if (Name == NULL)
		return E_POINTER;

	*Name = ::SysAllocString(L"Modify Transparency");
	return S_OK;
}

STDMETHODIMP CModifyBtn::get_Caption(BSTR *Caption)
{
	if (Caption == NULL)
		return E_POINTER;

	*Caption = ::SysAllocString(L"Modify Transparency");
	return S_OK;
}

STDMETHODIMP CModifyBtn::get_Category(BSTR *Category)
{
	if (Category == NULL)
		return E_POINTER;

	*Category = ::SysAllocString(L"Developer Support");
	return S_OK;
}

STDMETHODIMP CModifyBtn::get_Bitmap(OLE_HANDLE *Bitmap)
{
	if (Bitmap == NULL)
		return E_POINTER;

	*Bitmap = (OLE_HANDLE)m_hBitmap;

	return S_OK;
}

STDMETHODIMP CModifyBtn::OnCreate(IDispatch *hook)
{
	m_ipHookHelper.CreateInstance(CLSID_HookHelper);
	HRESULT hr = m_ipHookHelper->putref_Hook(hook);

	return hr;
}

STDMETHODIMP CModifyBtn::OnClick()
{
	// HRESULT checking omitted for clarity
	IActiveViewPtr ipActiveView;
	m_ipHookHelper->get_ActiveView(&ipActiveView);
	IMapPtr map;
	ipActiveView->get_FocusMap(&map);
	ILayerPtr layer;
	map->get_Layer(0, &layer);
	ILayerEffectsPtr layerEffects = layer;
	VARIANT_BOOL transparency;
	layerEffects->get_SupportsTransparency(&transparency);
	if (transparency == VARIANT_FALSE)
	{
		return S_OK;
	}
	else
	{
		IDisplayFilterManagerPtr filterManager = layer;
		IDisplayFilterPtr displayFilter;
		filterManager->get_DisplayFilter(&displayFilter);
		ITransparencyDisplayFilterPtr transDisplayFilter(CLSID_TransparencyDisplayFilter);
		transDisplayFilter->put_Transparency(75);
		filterManager->put_DisplayFilter(transDisplayFilter);
	}
	ipActiveView->Refresh();

	return S_OK;
}
