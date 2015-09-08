// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently,
// but are changed infrequently

#pragma once

#ifndef STRICT
#define STRICT
#endif

#include "targetver.h"

#define _ATL_APARTMENT_THREADED

#define _ATL_NO_AUTOMATIC_NAMESPACE

#define _ATL_CSTRING_EXPLICIT_CONSTRUCTORS	// some CString constructors will be explicit


#define ATL_NO_ASSERT_ON_DESTROY_NONEXISTENT_WINDOW

#include "resource.h"
#include <atlbase.h>
#include <atlcom.h>
#include <atlctl.h>

#pragma warning(push)
#pragma warning(disable : 4192)
//disables warning: automatically excluding 'name' while importing type library 'library'

//import esriSystem.olb
#import "libid:5E1F7BC3-67C5-4AEE-8EC6-C4B73AAC42ED" raw_interfaces_only raw_native_types no_namespace named_guids exclude("OLE_COLOR", "OLE_HANDLE", "VARTYPE", "XMLSerializer")

//import esriSystemUI.olb
#import "libid:4ECCA6E2-B16B-4ACA-BD17-E74CAE4C150A" raw_interfaces_only raw_native_types no_namespace named_guids exclude("OLE_HANDLE", "OLE_COLOR")

//import esriGeometry.olb
#import "libid:C4B094C2-FF32-4FA1-ABCB-7820F8D6FB68" raw_interfaces_only raw_native_types no_namespace named_guids exclude("OLE_HANDLE", "OLE_COLOR", "ISegment")

//import esriDisplay.olb
#import "libid:59FCCD31-434C-4017-BDEF-DB4B7EDC9CE0" raw_interfaces_only raw_native_types no_namespace named_guids exclude("OLE_HANDLE", "OLE_COLOR")

//import esriGeoDatabase.olb
#import "libid:0475BDB1-E5B2-4CA2-9127-B4B1683E70C2" raw_interfaces_only raw_native_types no_namespace named_guids

//import esriCarto.olb
#import "libid:45AC68FF-DEFF-4884-B3A9-7D882EDCAEF1" raw_interfaces_only raw_native_types no_namespace named_guids exclude("UINT_PTR")

//import esriControls.olb
#import "libid:033364CA-47F9-4251-98A5-C88CD8D3C808" raw_interfaces_only raw_native_types no_namespace named_guids
#import "C:\Program Files (x86)\ArcGIS\Desktop10.3\com\esriSystemUI.olb" raw_interfaces_only, raw_native_types, no_namespace, named_guids, auto_search

#pragma warning(pop)