import java.awt.BorderLayout;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLayeredPane;
import javax.swing.SwingUtilities;

import com.esri.core.geometry.GeometryEngine;
import com.esri.core.geometry.Point;
import com.esri.core.geometry.SpatialReference;
import com.esri.map.ArcGISTiledMapServiceLayer;
import com.esri.map.JMap;

public class WrapAround {

  JMap map;
  //xMax and xMin of the coordinate system
  Double coordXMax = 20037507.067;
  Double coordXMin = -20037507.067;

  public WrapAround(
) {}
  
  private JMap createMap() {

    final JMap jMap = new JMap();

    ArcGISTiledMapServiceLayer tiledLayer = new ArcGISTiledMapServiceLayer(
        "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
    jMap.getLayers().add(tiledLayer);
    jMap.setWrapAroundEnabled(true); 
    
    jMap.addMouseListener(new MouseListener() {

		@Override
		public void mouseClicked(MouseEvent arg0) {
			//Convert the screen coordinates of the click location to a map point
            Point point = jMap.toMapPoint(arg0.getX(), arg0.getY());
            //Make sure the spatial reference of the map is 102100 (otherwise this won't work)
            if(jMap.getSpatialReference().equals(SpatialReference.create(102100))) {
            	//Create a multiplier value to use when converting the coordinate. The key is to round the value then cast it as an int
            	int multiplier = (int) Math.round((Math.abs(point.getX()) / (coordXMax * 2)));
            	//In case the multiplier is 0 (because we cast it to an in) set it to 1
            	if(multiplier == 0) multiplier = 1;
            	//If the point is larger than the coordinate system's xMax
            	if(point.getX() > coordXMax) {
            		//Convert the coordinate
            		point.setX(point.getX() - ((coordXMax * 2) * multiplier));
            	}
            	//If the point is smaller than the coordinate system's xMin
            	else if(point.getX() < coordXMin) {
            		//Convert the coordinate
            		point.setX(point.getX() + ((coordXMax * 2) * multiplier));
            	}
            }
            //Convert the coordinate to lat long (to make it easier to read
        	Point newPoint = (Point) GeometryEngine.project(point, jMap.getSpatialReference(), SpatialReference.create(4326));
        	//Print the coordinate to the console
            System.out.println("X: " + String.valueOf(newPoint.getX()) + ", Y: " + String.valueOf(newPoint.getY()));
		}

		@Override
		public void mouseEntered(MouseEvent arg0) {}

		@Override
		public void mouseExited(MouseEvent arg0) {}

		@Override
		public void mousePressed(MouseEvent arg0) {}

		@Override
		public void mouseReleased(MouseEvent arg0) {}
    });

    return jMap;
  }

  public static void main(String[] args) {
    SwingUtilities.invokeLater(new Runnable() {
      @Override
      public void run() {
        try {
          WrapAround wmsApp = new WrapAround();

          JFrame appWindow = wmsApp.createWindow();
          appWindow.add(wmsApp.createUI());
          appWindow.setVisible(true);
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }

  public JComponent createUI() {
    JComponent contentPane = createContentPane();
    map = createMap();
    contentPane.add(map);
    return contentPane;
  }

  private JFrame createWindow() {
    JFrame window = new JFrame("WMS Layer");
    window.setBounds(100, 100, 1000, 700);
    window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    window.getContentPane().setLayout(new BorderLayout(0, 0));
    window.addWindowListener(new WindowAdapter() {
      @Override
      public void windowClosing(WindowEvent windowEvent) {
        super.windowClosing(windowEvent);
        map.dispose();
      }
    });
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