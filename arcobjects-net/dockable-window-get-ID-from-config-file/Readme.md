# How to create a dockable window in an an ArcMap Add-in project, and turn it off/on
This code sample shows how to create a dockable window in an an ArcMap Add-in project, and also shows how to make it
visible/invisible. 

The difference between this sample and another similar sample here on Github is that this sample:
1) clarifies that a dockable window can be created within the Add-In framework, using the template provided with the ArcObjects SDK for .NET.
    When createing a new ArcMap Add-In, select "dockable window" Add-In from the list in the template. This will lead to a dockable Window element 
    being added to the config.esriAddinX file.
2) shows that UID.Value can be set directly to the "ID" attribute value of the dockable window in the config.esriaddinX file. 
3) shows you how to use IDockableWindow.IsVisible() method to check if the dockable window is currently visible (open) in ArcMap.

Author: Sami E.

[Documentation on Dockable Windows]
(http://resources.arcgis.com/en/help/arcobjects-net/conceptualhelp/#/Creating_dockable_windows/00010000014w000000/)

## Features
* Uses IDockableWindow
* Uses IDockableWindowManager
* Uses UID
