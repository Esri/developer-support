
import java.awt.Color;
import java.awt.EventQueue;
import javax.swing.JFrame;
import javax.swing.SwingUtilities;

import java.awt.BorderLayout;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import com.esri.runtime.ArcGISRuntime;
import com.esri.map.ArcGISDynamicMapServiceLayer;
import com.esri.map.ArcGISTiledMapServiceLayer;
import com.esri.map.JMap;
import com.esri.map.LayerInitializeCompleteEvent;
import com.esri.map.LayerInitializeCompleteListener;

import com.esri.client.local.ArcGISLocalDynamicMapServiceLayer;
import com.esri.core.internal.value.DynamicLayerInfo;
import com.esri.core.map.DrawingInfo;
import com.esri.core.map.LabelPlacement;
import com.esri.core.map.LabelingInfo;
import com.esri.core.symbol.TextSymbol;

public class TestLabelSimple {

    private JFrame window;
    private JMap map;
    private ArcGISDynamicMapServiceLayer dynamicLayer;
    
    private DrawingInfo drawingInfo; 
    private LabelingInfo labelingInfo; 
    private TextSymbol labelTextSymbol; 

    public TestLabelSimple() {
        window = new JFrame();
        window.setSize(800, 600);
        window.setLocationRelativeTo(null); // center on screen
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.getContentPane().setLayout(new BorderLayout(0, 0));

        // dispose map just before application window is closed.
        window.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent windowEvent) {
                super.windowClosing(windowEvent);
                map.dispose();
            }
        });

        map = new JMap();
        window.getContentPane().add(map);
        
        dynamicLayer = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"); 
        dynamicLayer.addLayerInitializeCompleteListener(new LayerInitializeCompleteListener() { 
           
          @Override 
          public void layerInitializeComplete(LayerInitializeCompleteEvent e) { 
            // update labeling info and UI 
            initLabelingInfo(); 
          } 
        }); 
        
        map.getLayers().add(dynamicLayer);
    }

    /**
     * @param args
     */
    public static void main(String[] args) {
        EventQueue.invokeLater(new Runnable() {
          
            @Override
            public void run() {
                try {
                    TestLabelSimple application = new TestLabelSimple();
                    application.window.setVisible(true);
                    
                    
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    
    private void initLabelingInfo() { 
        // create labeling info 
        labelingInfo = new LabelingInfo(); 
        labelingInfo.setLabelPlacement(LabelPlacement.POINT_BELOW_RIGHT); 
        labelingInfo.setLabelExpression("[areaname]"); 
        labelingInfo.setMinScale(600000); 
        labelingInfo.setMaxScale(30000); 
        labelTextSymbol = new TextSymbol(10, null, Color.BLACK); 
        labelingInfo.setSymbol(labelTextSymbol); 
   
        // add labeling info to drawing info 
        drawingInfo = new DrawingInfo(); 
        drawingInfo.setShowLabels(true); 
        drawingInfo.setLabelingInfo(new LabelingInfo[] {labelingInfo}); 
   
        // update layer info to use the new drawing info 
        DynamicLayerInfo labelLayerInfo = (dynamicLayer.getDynamicLayerInfos()).get(0); 
        labelLayerInfo.setDrawingInfo(drawingInfo); 
   
        // update the layer 
        dynamicLayer.refresh(); 
      } 
}
