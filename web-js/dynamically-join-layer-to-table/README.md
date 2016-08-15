#Join a Table in SDE to a Map Service Layer Using Dynamic Workspaces

##About
ArcGIS Server allows connections to different data sources through the use of dynamic workspaces. This functionality can be used to display multiple datasets using only one map service. This can reduce the number of services on your ArcGIS Server and allow your JavaScript applications to be more flexible. What makes dynamic workspaces even more powerful is that they can be used to join non-spatial tables to spatial data. Thus you can publish a service without performing multiple joins to non-spatial tables in ArcMap and instead perform the joins dynamically. In addition to supporting dynamic workspaces ArcGIS Server also supports dynamic layers. Dynamic layers allow the symbology of the layer to be changed on the fly. More information on how to enable dynamic workspaces and dynamic layers for a map service [can be found here](http://server.arcgis.com/en/server/latest/publish-services/windows/about-dynamic-layers.htm). This sample uses dynamic layers and dynamic workspaces to join non-spatial tables to a mapservice and symbolize the layer with a ClassbreaksRenderer using dynamic layers.


##How It Works
Because this sample allows the user to select one of two non-spatial tables to join to the map serivce, create two objects containing the join information.
```javascript
var join1 = {'leftTableKey':'JoinField', 'rightTableKey':'JoinField', 'rightTableName':'Editing.DBO.FakeData1','renderingField':'Editing.DBO.FakeData1.TheDatas', 'popupField':'TheDatas'};
var join2 = {'leftTableKey':'JoinField', 'rightTableKey':'JoinField', 'rightTableName':'Editing.DBO.FakeData2','renderingField':'Editing.DBO.FakeData2.TheDatas2', 'popupField':'TheDatas2'};
```
Create the JoinDataSource object. This information determines how the non-spatial table will be joined to the map service.
```javascript
var joinDataSource = new JoinDataSource({
	joinType: "left-outer-join",
	leftTableSource: new LayerMapSource({
		type: "mapLayer",
		mapLayerId: 0
	}),
	leftTableKey: joinOptions.leftTableKey,
	rightTableKey: joinOptions.rightTableKey,
	rightTableSource: new LayerDataSource({
		dataSource: new TableDataSource({
			type: "table",
			workspaceId: "SQLServer",
			dataSourceName: joinOptions.rightTableName
		})
	})
});
```
Create the LayerDataSource and DynamicLayerInfosArray objects needed to set the DynamicWorkspace for the ArcGISDynamicMapServiceLayer
```javascript
var dynamicLayerDataSource = new LayerDataSource({
	dataSource: joinDataSource
});
						
var dynamicLayerInfosArray = layer.createDynamicLayerInfosFromLayerInfos();
var dynamicLayerInfo = dynamicLayerInfosArray.find(function(dynamicLayerInfoItem){
	return dynamicLayerInfoItem.name === "DynamicLayerPolys";
});
						
dynamicLayerInfo.source = dynamicLayerDataSource;
layer.setDynamicLayerInfos([dynamicLayerInfo], true);
```
Create the ClassBreaksRenderer that will be used to symbolize the layer. Create the LayerDrwingOptions object and set it's renderer property. Finally set the layerDrawingOptions parameter of the ArcGISDynamicMapServiceLayer to utilize the dynamic layers property of the export operation.
```javascript
var renderer = new ClassBreaksRenderer(sfs,joinOptions.renderingField);
var optionsArray = [];
var drawingOptions = new LayerDrawingOptions();
drawingOptions.renderer = renderer;
optionsArray[0] = drawingOptions;
layer.setLayerDrawingOptions(optionsArray);	
```