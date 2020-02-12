import java.awt.BorderLayout;
import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JFrame;

import com.esri.core.geometry.Envelope;
import com.esri.core.geometry.Geometry;
import com.esri.core.map.DrawingInfo;
import com.esri.core.map.DynamicLayerInfo;
import com.esri.core.map.DynamicLayerInfoCollection;
import com.esri.core.map.LayerMapSource;
import com.esri.map.ArcGISDynamicMapServiceLayer;
import com.esri.map.JMap;
import com.esri.map.LayerInfo;
import com.esri.map.MapOptions;
import com.esri.map.MapOptions.MapType;

public class ReorderLayers {

  private JFrame window;
  private JMap map;

  private ArcGISDynamicMapServiceLayer layerOrder;
  boolean revert = true;
  
  public ReorderLayers() {
	  
    window = new JFrame();
    window.setSize(800, 600);
    window.setLocationRelativeTo(null);
    window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    window.getContentPane().setLayout(new BorderLayout(0, 0));

    window.addWindowListener(new WindowAdapter() {
      @Override
      public void windowClosing(WindowEvent windowEvent) {
        super.windowClosing(windowEvent);
        map.dispose();
      }
    });

    MapOptions mapOptions = new MapOptions(MapType.TOPO);
    String url = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";


    layerOrder = new ArcGISDynamicMapServiceLayer(url);
    map = new JMap(mapOptions);
    Geometry extent = new Envelope(-8244708.072664759,4969963.315045763,-8229420.667007745,4977368.152160879);
    map.setExtent(extent);
    map.getLayers().add(layerOrder);

    window.getContentPane().add(map, BorderLayout.CENTER);
    
    JButton button = new JButton ("change order");
    button.addActionListener(new ActionListener() {
		
		@Override
		public void actionPerformed(ActionEvent e) {
			changeOrder();
			
		}
	});
    
    window.getContentPane().add(button, BorderLayout.SOUTH);

  }
  
  //Function to change the order of sublayers
  protected void changeOrder(){
	  //Get the sublayers of the map service
	  Collection<LayerInfo> layerInfoCollection = layerOrder.getLayersList();
	  
	  //Create a new dynamic layer info list to hold the current dynamic layer infos of each sub layer
	  List<DynamicLayerInfo> dynamicLayerInfoList = new ArrayList<DynamicLayerInfo>();
	  for(DynamicLayerInfo dynamicLayerInfo : layerOrder.getDynamicLayerInfos()){
		  dynamicLayerInfoList.add(dynamicLayerInfo);
	  }
	  
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
	  layerOrder.setDynamicLayerInfos(myCollection);
	  layerOrder.refresh();
  }

  public static void main(String[] args) {
    EventQueue.invokeLater(new Runnable() {

      @Override
      public void run() {
        try {
          ReorderLayers application = new ReorderLayers();
          application.window.setVisible(true);
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }
}