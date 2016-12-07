#Connect to a FeatureClass in SDE using Java Runtime
##About
ArcGIS Server allows connections to different data sources through the use of dynamic workspaces. The ArcGIS Runtime SDKs use a scaled down version of ArcGIS Server 10.2.1 to read MPKs, TPKs and GPKs. This "Local Server" also supports dynamic workspaces but how it interacts with dynamic workspaces is a little different. In the full ArcGIS Server, dynamic workspaces must be configured when the service is published using an SDE connection file. After the service is published the dynamic workspace cannot be changed. Local Server behaves differently as you cannot publish layers to it. Instead Local Server is started with a LocalMapService pointing to a specfic data package which serves as the data source for the service. As the service is created at runtime it is possible to set or change the dynamic workspace connection string each time the Local Server is launched. While it is true that ArcGIS Runtime does not support direct connections to SDE, it is possible to connect to an SDE using dynamic workspaces and Local Server.

##The Logic
Create the WorkspaceInfo object using the SDE connection file. This file is found in the following location in Windows: "C:\Users\<USER>\AppData\Roaming\ESRI\Desktop10.4\ArcCatalog"

Create the LocalMapService used to launch local server with a blank map package, enable dynamic workspaces and set the dynamic workspace information. Next add an event listener to call the addLocalLayer function after the service has started. Finally start the local server instance.
```Java
	workspaceInfo = WorkspaceInfo.CreateSDEConnectionFromFilePath("0", connectionFileLocation);
	//Set the path to the MPK and instantiate the map service
	localServer = new LocalMapService(pathToMpk);
	//THIS IS KEY
	localServer.setEnableDynamicLayers(true);
	workspaceInfoSet = new WorkspaceInfoSet(localServer);
	workspaceInfoSet.add(workspaceInfo);
	//Set the dynamic workspace info for the local server
	localServer.setDynamicWorkspaces(workspaceInfoSet);
	//After the local map service has started, add the local layer to the map
	localServer.addLocalServiceStartCompleteListener(new LocalServiceStartCompleteListener() {
		@Override
		public void localServiceStartComplete(LocalServiceStartCompleteEvent e) {
			addLocalLayer();
		}
	});
	//Start the local server
	localServer.startAsync();
}
```
Create an ArcGISDynamicMapServiceLayer using the url of the map service on local server. Add a layer initialization listener to the layer.
```Java
	final ArcGISDynamicMapServiceLayer localDynamicLayer = new ArcGISDynamicMapServiceLayer(localServer.getUrlMapService());
	localDynamicLayer.addLayerInitializeCompleteListener(new LayerInitializeCompleteListener() {});
```
Create a new DynamicLayerInfo collection and set the drawing information for the map service. Set the datasource for the layer using a TableDataSource to reference the desired FeatureClass in the SDE. Then set the LayerSource for the dynamic layer and refresh the layer to fetch the data from the SDE
```Java
	//Create the dynamic layer info collection
	DynamicLayerInfoCollection layerInfos = localDynamicLayer.getDynamicLayerInfos();
	DynamicLayerInfo layerInfo = layerInfos.get(0);
	DrawingInfo drawingInfo = new DrawingInfo(simpleRenderer, 50);
	layerInfo.setDrawingInfo(drawingInfo);
					
	//Use a TableDataSource object to connect to a FeatureClass
	TableDataSource dataSource = new TableDataSource();
	dataSource.setWorkspaceId("0");
	dataSource.setDataSourceName("<NAME OF YOUR FEATURE CLASS IN THE SDE>");
					
	LayerDataSource layerDataSource = new LayerDataSource();
	layerDataSource.setDataSource(dataSource);
	layerInfo.setLayerSource(layerDataSource);
					
	//Force the dynamic layer to redraw and use the data from the FeatureClass
	localDynamicLayer.refresh();
```
