import java.awt.BorderLayout;
import java.awt.Color;
import java.io.IOException;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.SwingUtilities;

import com.esri.client.local.LocalMapService;
import com.esri.client.local.LocalServiceStartCompleteEvent;
import com.esri.client.local.LocalServiceStartCompleteListener;
import com.esri.client.local.WorkspaceInfo;
import com.esri.client.local.WorkspaceInfoSet;
import com.esri.core.map.DrawingInfo;
import com.esri.core.map.DynamicLayerInfo;
import com.esri.core.map.DynamicLayerInfoCollection;
import com.esri.core.map.LayerDataSource;
import com.esri.core.map.TableDataSource;
import com.esri.core.renderer.SimpleRenderer;
import com.esri.core.symbol.SimpleLineSymbol;
import com.esri.map.ArcGISDynamicMapServiceLayer;
import com.esri.map.JMap;
import com.esri.map.LayerInitializeCompleteEvent;
import com.esri.map.LayerInitializeCompleteListener;
import com.esri.map.MapOptions;
import com.esri.map.MapOptions.MapType;

public class ConnectToSDE {

	//Change this to the path to your SDE connection file created in ArcMap
	private static final String connectionFileLocation= "<PATH TO SDE CONNECTION FILE>"; 
	private JFrame frame;
	private JMap map;
	private JButton button;
	private WorkspaceInfo workspaceInfo;
	//Change this to the path to your blank MPK
	private final String pathToMpk = "<PATH TO A BLANK MPK>";
	private LocalMapService localServer;
	private WorkspaceInfoSet workspaceInfoSet;
	private SimpleRenderer simpleRenderer = new SimpleRenderer(new SimpleLineSymbol(new Color(0, 100, 250), 3));

	public ConnectToSDE(){
		createUI();
	}

	//UI Stuff
	private void createUI() {
		
		frame = new JFrame("Connect to SDE");
		map = new JMap(new MapOptions(MapType.NATIONAL_GEOGRAPHIC));
		
		frame.setSize(900, 400);
		frame.getContentPane().add(map, BorderLayout.CENTER);
		button = new JButton("Connect to SDE");
		frame.getContentPane().add(button, BorderLayout.SOUTH);
		//After the button is clicked connect to the SDE
		button.addActionListener((e)->{
			testConnection();
		});
		frame.setVisible(true);
		
	}
	
	private void testConnection() {
		try{
			//Create a new workspace info object
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
		}catch(IOException ex){
			ex.printStackTrace();
		}finally{
			System.out.println("Working..");
		}
	}
	
	private void addLocalLayer() {
		//Create a local dynamic map service layer and point to the local map service
		final ArcGISDynamicMapServiceLayer localDynamicLayer = new ArcGISDynamicMapServiceLayer(localServer.getUrlMapService());
		//Wait for the local layer to initialize
		localDynamicLayer.addLayerInitializeCompleteListener(new LayerInitializeCompleteListener() {
			@Override
			public void layerInitializeComplete(LayerInitializeCompleteEvent e) {
				//Check to see if the layer has been created successfully 
				if(e.getID() == LayerInitializeCompleteEvent.LOCALLAYERCREATE_COMPLETE) {
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
				}
			}
		});
		map.getLayers().add(localDynamicLayer);	
	}

	public static void main(String[] args){
		SwingUtilities.invokeLater(()->{
			ConnectToSDE sdeTest = new ConnectToSDE();
		});
	}

}
