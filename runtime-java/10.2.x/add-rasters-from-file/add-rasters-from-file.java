import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLayeredPane;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import javax.swing.border.LineBorder;

import com.esri.core.geometry.Envelope;
import com.esri.core.map.Graphic;
import com.esri.core.map.ResamplingProcessType;
import com.esri.core.raster.FileRasterSource;
import com.esri.core.renderer.Colormap;
import com.esri.core.renderer.ColormapRenderer;
import com.esri.core.renderer.RGBRenderer;
import com.esri.core.renderer.StretchParameters;
import com.esri.core.symbol.SimpleLineSymbol;
import com.esri.core.symbol.Symbol;
import com.esri.map.ArcGISTiledMapServiceLayer;
import com.esri.map.GraphicsLayer;
import com.esri.map.JMap;
import com.esri.map.Layer;
import com.esri.map.RasterLayer;

public class LocalRasterApp {
  private JMap map;
  private JButton button;
  private JLayeredPane contentPane;
  private static final String FSP = System.getProperty("file.separator");
  private List<Layer> rasters;
  private FileRasterSource rasterSource = null;
  
  public LocalRasterApp() { rasters = new ArrayList<>(); }
  /**
  * Checks a folder for files matching an extension
  * 
  * @throws Exception
  */
  private void addRaster() throws Exception {

	GraphicsLayer gLayer = new GraphicsLayer();
	map.getLayers().add(gLayer);
	
	//Add graphics layer to the array
	rasters.add(gLayer);
	gLayer.setName("Raster Layer");
	
	// Open the folder containing the images
	String baseFolder = "D:" + FSP + "Landsat_p114r75";
	System.out.println(baseFolder);
	File folder = new File(baseFolder);

	//Define footprints
	Symbol symbol = new SimpleLineSymbol(Color.magenta, 2);
	
        /* Create a graphics layer, add rasters to the graphics layer, 
         * add graphics layer to the map. */
	for (File rasterFile : folder.listFiles()) {
		try {
			if (!rasterFile.getName().endsWith(".tif")) {
				continue;
			}

	        	//New raster from file
			rasterSource = new FileRasterSource(rasterFile.getAbsolutePath());
			rasterSource.project(map.getSpatialReference());
				
	        	// new raster layer
			RasterLayer rasterLayer = new RasterLayer(rasterSource);
			rasterLayer.setName(rasterFile.getName());
				
	        	// Create a raster layer graphic.  Add the raster and footprint
			Graphic g = new Graphic(rasterLayer.getFullExtent(), symbol);
			gLayer.addGraphic(g);
			
	        	//Make sure it's not null or not in the map already
			if ((rasterLayer == null) || (!rasterLayer.isVisible())) {
			    return;
			}
				
	        	//Apply an RGBRenderer
			addRgbRenderer(rasterLayer, true);
				
			//Populate the layer array for looping (optional)
			rasters.add(rasterLayer);
	
	        	// Add the layer array to the map.
			map.getLayers().add(rasterLayer);
		
			//Zoom to the newly added raster layers.
			map.zoomTo(rasterLayer.getFullExtent());
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
		//Do something with the optional array of layers
		System.out.println("Layers added:");
		for (Layer layer : rasters) {
			System.out.println("\t" + layer.getName());
		}
  }
  
  public void addRgbRenderer(RasterLayer mRasterLayer, boolean isDefault) throws Exception{
	  //Basic stretch renderer usage
	  RGBRenderer renderer=new RGBRenderer();
	  if(isDefault){
		  renderer.setBandIds(new int[]{0,1,2});
	  }
	  else {
		  renderer.setBandIds(new int[]{0,2,1});
	  }

	  StretchParameters.MinMaxStretchParameters stretchParameters = new StretchParameters.MinMaxStretchParameters();
	  stretchParameters.setGamma(1);
	  renderer.setStretchParameters(stretchParameters);
      
	  mRasterLayer.setRenderer(renderer);
	  mRasterLayer.setBrightness(75.0f);
	  mRasterLayer.setContrast(75.0f);
	  mRasterLayer.setGamma(10.0f);
	}

  public static void main(String[] args) {
    SwingUtilities.invokeLater(new Runnable() {
      @Override
      public void run() {
        try {
          // instance of this application
          LocalRasterApp rasterApp = new LocalRasterApp();
          
          // create the UI, including the map, for the application.
          JFrame appWindow = createWindow();
          appWindow.add(rasterApp.createUI());
        } catch (Exception e) {
          // on any error, display the stack trace.
          e.printStackTrace();
        }
      }
    });
  }

  /** GUI Components **/
  public JComponent createUI() {
	// application content
	contentPane = createContentPane();
	
	// UI elements
	JPanel buttonPanel = createUserPanel();
	contentPane.add(buttonPanel);
	
	// map
	map = createMap();
	map.setHidingNoDataTiles(true);
	contentPane.add(map);
	
	return contentPane;
  }


  private JMap createMap() {
	final JMap jMap = new JMap();
	
	ArcGISTiledMapServiceLayer tiledLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
	jMap.getLayers().add(tiledLayer);
	jMap.setExtent(new Envelope(-19856505, -8827900, 18574809, 16806021));
	
	return jMap;
  }

  private JPanel createUserPanel() {
	JPanel panel = new JPanel();
	panel.setLayout(new BorderLayout(0, 0));
	panel.setSize(140, 35);
	panel.setLocation(10, 10);
	
	// button
	button = createButton();
	
	panel.add(button, BorderLayout.SOUTH);
	panel.setBackground(new Color(0, 0, 0, 0));
	panel.setBorder(new LineBorder(new Color(0, 0, 0, 80), 5, false));
	
	return panel;
  }

  private JButton createButton() {
	JButton button1 = new JButton("Add Raster");
	button1.addActionListener(new ActionListener() {
		@Override
		public void actionPerformed(ActionEvent arg0) {
		      try {
				addRaster();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	});
	return button1;
  }

  private static JFrame createWindow() {
	JFrame window = new JFrame();
	window.setBounds(100, 100, 1000, 700);
	window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	window.getContentPane().setLayout(new BorderLayout(0, 0));
	window.setVisible(true);
	return window;
  }

  private static JLayeredPane createContentPane() {
	JLayeredPane contentPane = new JLayeredPane();
	contentPane.setBounds(100, 100, 1000, 700);
	contentPane.setLayout(new BorderLayout(0, 0));
	contentPane.setVisible(true);
	return contentPane;
  }
}
