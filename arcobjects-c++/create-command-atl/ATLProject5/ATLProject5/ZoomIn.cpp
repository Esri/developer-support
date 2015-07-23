// ZoomIn.cpp : Implementation of CZoomIn

#include "stdafx.h"
#include "ZoomIn.h"


// CZoomIn

IHookHelperPtr m_ipHookHelper;
STDMETHODIMP CZoomIn::get_Enabled(VARIANT_BOOL *Enabled)
{
	if (Enabled == NULL)
		return E_POINTER;

	*Enabled = VARIANT_TRUE; // Enable the tool always

	return S_OK;
}

CZoomIn::CZoomIn()
{
	m_hBitmap = ::LoadBitmap(_AtlBaseModule.GetResourceInstance(), MAKEINTRESOURCE(IDB_BITMAP1));
}

CZoomIn::~CZoomIn()
{
	DeleteObject(m_hBitmap);
}

STDMETHODIMP CZoomIn::get_Name(BSTR *Name)
{
	if (Name == NULL)
		return E_POINTER;

	*Name = ::SysAllocString(L"ZoomIn x 0.5");
	return S_OK;
}

STDMETHODIMP CZoomIn::get_Caption(BSTR *Caption)
{
	if (Caption == NULL)
		return E_POINTER;

	*Caption = ::SysAllocString(L"ZoomIn x 0.5 VC8");
	return S_OK;
}

STDMETHODIMP CZoomIn::get_Category(BSTR *Category)
{
	if (Category == NULL)
		return E_POINTER;

	*Category = ::SysAllocString(L"Developer Samples");
	return S_OK;
}

STDMETHODIMP CZoomIn::get_Bitmap(OLE_HANDLE *Bitmap)
{
	if (Bitmap == NULL)
		return E_POINTER;

	*Bitmap = (OLE_HANDLE)m_hBitmap;

	return S_OK;
}

STDMETHODIMP CZoomIn::OnCreate(IDispatch *hook)
{
	m_ipHookHelper.CreateInstance(CLSID_HookHelper);
	HRESULT hr = m_ipHookHelper->putref_Hook(hook);

	return hr;
}

STDMETHODIMP CZoomIn::OnClick()
{
	// HRESULT checking omitted for clarity
	IActiveViewPtr ipActiveView;
	m_ipHookHelper->get_ActiveView(&ipActiveView);

	IEnvelopePtr ipEnv;
	ipActiveView->get_Extent(&ipEnv);
	ipEnv->Expand(0.5, 0.5, VARIANT_TRUE);
	ipActiveView->put_Extent(ipEnv);
	ipActiveView->Refresh();

	return S_OK;
}