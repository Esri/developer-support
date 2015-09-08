import java.io.IOException;

import javax.swing.JOptionPane;

import com.esri.arcgis.addins.desktop.Button;
import com.esri.arcgis.arcmapui.IMxDocument;
import com.esri.arcgis.carto.ILayer;
import com.esri.arcgis.carto.ILayerEffects;
import com.esri.arcgis.display.IDisplayFilterManager;
import com.esri.arcgis.display.ITransparencyDisplayFilter;
import com.esri.arcgis.display.TransparencyDisplayFilter;
import com.esri.arcgis.framework.IApplication;
import com.esri.arcgis.interop.AutomationException;

public class SetLayerTransparency extends Button {

	/**
	 * Called when the button is clicked.
	 * 
	 * @exception java.io.IOException if there are interop problems.
	 * @exception com.esri.arcgis.interop.AutomationException if the component throws an ArcObjects exception.
	 */
	
	private static IApplication app;
	private static IMxDocument mxDoc;
	
	@Override 
	public void init(IApplication app) {
		SetLayerTransparency.app = app;
	  }
	
	public boolean isChecked() {
	    return false;
	  }
	
	public boolean isEnabled() {
	    return true;
	  }
	
	@Override
	public void onClick() throws IOException, AutomationException {
		try{
			mxDoc = (IMxDocument) app.getDocument();
			if(mxDoc.getFocusMap().getLayerCount() < 1)
			{
				JOptionPane.showMessageDialog(null, 0, "You MUST have at least one layer to use this tool", 0);
				return;
			}
			
			ILayer layer = mxDoc.getFocusMap().getLayer(0);
			ILayerEffects layerEffects = (ILayerEffects)layer;
			if(!layerEffects.isSupportsTransparency()) return;
			
			IDisplayFilterManager filterManager = (IDisplayFilterManager) layer;
			ITransparencyDisplayFilter filter = new TransparencyDisplayFilter();
			filter.setTransparency((short) 75);
			
			filterManager.setDisplayFilter(filter);
			
			mxDoc.getActiveView().refresh();
			
		}catch(Exception expc){
			System.out.println("ERROR: "+ expc.getMessage());
		}

	}

}
