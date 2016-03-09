
// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently,
// but are changed infrequently

#pragma once

#ifndef VC_EXTRALEAN
#define VC_EXTRALEAN            // Exclude rarely-used stuff from Windows headers
#endif

#include "targetver.h"

#define _ATL_CSTRING_EXPLICIT_CONSTRUCTORS      // some CString constructors will be explicit

// turns off MFC's hiding of some common and often safely ignored warning messages
#define _AFX_ALL_WARNINGS

#include <afxwin.h>         // MFC core and standard components
#include <afxext.h>         // MFC extensions


#include <afxdisp.h>        // MFC Automation classes



#ifndef _AFX_NO_OLE_SUPPORT
#include <afxdtctl.h>           // MFC support for Internet Explorer 4 Common Controls
#endif
#ifndef _AFX_NO_AFXCMN_SUPPORT
#include <afxcmn.h>             // MFC support for Windows Common Controls
#endif // _AFX_NO_AFXCMN_SUPPORT

#include <afxcontrolbars.h>     // MFC support for ribbons and control bars









#ifdef _UNICODE
#if defined _M_IX86
#pragma comment(linker,"/manifestdependency:\"type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='x86' publicKeyToken='6595b64144ccf1df' language='*'\"")
#elif defined _M_X64
#pragma comment(linker,"/manifestdependency:\"type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='amd64' publicKeyToken='6595b64144ccf1df' language='*'\"")
#else
#pragma comment(linker,"/manifestdependency:\"type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='*' publicKeyToken='6595b64144ccf1df' language='*'\"")
#endif
#endif

#import "C:\Program Files (x86)\Common Files\ArcGIS\bin\ArcGISVersion.dll" raw_interfaces_only, raw_native_types, no_namespace, named_guids, rename("esriProductCode", "esriVersionProductCode")

#pragma warning(push)
#pragma warning(disable : 4192) /* Ignore warnings for types that are
duplicated in win32 header files */
#pragma warning(disable : 4146) /* Ignore warnings for use of minus on unsigned
types */
#pragma warning(disable: 4278)

//#import "esriSystem.olb" raw_interfaces_only raw_native_types no_namespace named_guids exclude("OLE_COLOR", "OLE_HANDLE", "VARTYPE")
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriSystem.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids, exclude("OLE_COLOR", "OLE_HANDLE", "VARTYPE")
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriSystemUI.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids, exclude ("ICommand") exclude ("IProgressDialog")
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriGeometry.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriDisplay.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriOutput.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriGeoDatabase.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids, rename("IRow", "IRow2"), exclude ("ICursor")
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriGISClient.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids exclude ("UINT_PTR")
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriDataSourcesRaster.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriCarto.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids exclude ("ITableDefinition") exclude ("UINT_PTR")
#import "c:\Program Files (x86)\ArcGIS\Engine10.3\com\esriControls.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids exclude ("ITableDefinition") exclude ("UINT_PTR")
#pragma warning(pop)