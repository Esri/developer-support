#Re-order sublayers of an ArcGISDynamicMapServiceLayer
##About
Re-ordering the sublayers of an ArcGISDynamicMapServiceLayer is sometimes necessary to display data in a visual pleasing manner. However the workflow to do this is not intuitive. This sample demonstrates how to successful re-order sublayers.
##The Logic
Create a List of DynamicLayerInfos containing the current DynamicLayer information for the sublayers.
```Java
//Get the sublayers of the map service
Collection<LayerInfo> layerInfoCollection = layerOrder.getLayersList();
//Create a new dynamic layer info list to hold the current dynamic layer infos of each sub layer
List<DynamicLayerInfo> dynamicLayerInfoList = new ArrayList<DynamicLayerInfo>();
for(DynamicLayerInfo dynamicLayerInfo : layerOrder.getDynamicLayerInfos()){
	dynamicLayerInfoList.add(dynamicLayerInfo);
}
```
Create a new DynamicLayerInfoCollection and add the current dynamic layer infos to the collection. To reorder the sublayers create new DynamicLayerInfo objects containing the same information except the LayerMapSource has been re-ordered.
```Java
//Create a new dynamiclayerinfo collection
DynamicLayerInfoCollection myCollection = new DynamicLayerInfoCollection(layerInfoCollection);
//Loop through the dynamiclayerinfos and reverse their order
for(int i = 0; i < dynamicLayerInfoList.size(); i++) {
	int x = (dynamicLayerInfoList.size() -(1 + i));
	DrawingInfo temp = dynamicLayerInfoList.get(i).getDrawingInfo();
	//THIS IS KEY! You must reorder the layer map source to re order the sublayers!
	LayerMapSource tempSource = new LayerMapSource(i);
	//Create a new dynamiclayerinfo
	DynamicLayerInfo tempInfo = new DynamicLayerInfo(x, temp, tempSource);
	//Add the new dynamiclayerinfo into the collection
	myCollection.add(tempInfo);
}
```
Set the DynamicLayerInfos property for the layer and refresh the layer to show the changes
```Java
//Delay the visibility of the tiles until all have loaded
layerOrder.setDynamicLayerInfos(myCollection);
layerOrder.refresh();
```