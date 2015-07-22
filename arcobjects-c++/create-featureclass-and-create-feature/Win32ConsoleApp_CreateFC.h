// Copyright 2011 ESRI
// 
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
// 
// You may freely redistribute and use this sample code, with or
// without modification, provided you include the original copyright
// notice and use restrictions.
// 
// See the use restrictions at http://resourcesbeta.arcgis.com/en/help/arcobjects-net/usagerestrictions.htm
// 


#ifndef __Win32ConsoleApp_CreateFC_SAMPLE_H__
#define __Win32ConsoleApp_CreateFC_SAMPLE_H__

#include "stdafx.h"
#include <iostream>
#include "LicenseUtilities.h"
#include "PathUtilities.h"
using std::cerr;
using std::endl;

// ArcObjects Headers 
// Engine
#include <ArcSDK.h>

HRESULT Create(char* fullpath);

#endif   // __Win32ConsoleApp_CreateFC_SAMPLE_H__
