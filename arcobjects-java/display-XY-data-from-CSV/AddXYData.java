import java.io.IOException;
import java.net.UnknownHostException;

import com.esri.arcgis.addins.desktop.Button;
import com.esri.arcgis.arcmapui.IMxDocument;
import com.esri.arcgis.carto.FeatureLayer;
import com.esri.arcgis.carto.IFeatureLayer;
import com.esri.arcgis.carto.ILayer;
import com.esri.arcgis.carto.ILayerProxy;
import com.esri.arcgis.carto.esriViewDrawPhase;
import com.esri.arcgis.cartoUI.IFeatureLayerSourcePageExtension;
import com.esri.arcgis.datasourcesGDB.FileGDBWorkspaceFactory;
import com.esri.arcgis.datasourcesoledb.TextFileWorkspaceFactory;
import com.esri.arcgis.framework.IApplication;
import com.esri.arcgis.geodatabase.IDataset;
import com.esri.arcgis.geodatabase.IDatasetProxy;
import com.esri.arcgis.geodatabase.IFeatureClass;
import com.esri.arcgis.geodatabase.IFeatureClassProxy;
import com.esri.arcgis.geodatabase.IFeatureWorkspace;
import com.esri.arcgis.geodatabase.IFeatureWorkspaceProxy;
import com.esri.arcgis.geodatabase.ITable;
import com.esri.arcgis.geodatabase.IWorkspace;
import com.esri.arcgis.geodatabase.IWorkspaceFactory;
import com.esri.arcgis.geodatabase.IWorkspaceProxy;
import com.esri.arcgis.geodatabase.IXYEvent2FieldsProperties;
import com.esri.arcgis.geodatabase.IXYEventSource;
import com.esri.arcgis.geodatabase.IXYEventSourceName;
import com.esri.arcgis.geodatabase.IXYEventSourceProxy;
import com.esri.arcgis.geodatabase.WorkspaceFactory;
import com.esri.arcgis.geodatabase.XYEvent2FieldsProperties;
import com.esri.arcgis.geodatabase.XYEventSourceName;
import com.esri.arcgis.geometry.ISpatialReference;
import com.esri.arcgis.geometry.ISpatialReferenceFactory;
import com.esri.arcgis.geometry.ISpatialReferenceResolution;
import com.esri.arcgis.geometry.ISpatialReferenceTolerance;
import com.esri.arcgis.geometry.SpatialReferenceEnvironment;
import com.esri.arcgis.geometry.esriSRGeoCSType;
import com.esri.arcgis.interop.AutomationException;
import com.esri.arcgis.system.IName;
import com.esri.arcgis.system.INameProxy;


public class AddXYData extends Button {

	/**
	 * Called when the button is clicked.
	 *
	 * @exception java.io.IOException if there are interop problems.
	 * @exception com.esri.arcgis.interop.AutomationException if the component throws an ArcObjects exception.
	 */

	private static String dataPath = "E:\\Java\\DisplayXYData\\";
	private static String fileName = "testData.csv";
	private static String xFieldName = "POINT_X";
	private static String yFieldName = "POINT_Y";

	private static IApplication app;
	private static IMxDocument mxDoc;


	@Override
	public void init(IApplication app) {
	    AddXYData.app = app;
	  }

	public boolean isChecked() {
	    return false;
	  }

	  // Returns whether this button is enabled
	  public boolean isEnabled() {
	    return true;
	  }

	@Override
	public void onClick()  {
		// TODO Auto-generated method stub
		try{
		IWorkspaceFactory workspaceFactory = new TextFileWorkspaceFactory();
		IWorkspace workspace = workspaceFactory.openFromFile(dataPath, 0);

		IFeatureWorkspace featureWorkspace = new IFeatureWorkspaceProxy(workspace);
		ITable table = featureWorkspace.openTable(fileName);
		ISpatialReference sRef = CreateSpatialReference(4326);

		IFeatureClass featureClass = CreateXYEventFeature(table, xFieldName, yFieldName, sRef);
		IFeatureLayer featureLayer = new FeatureLayer();
		featureLayer.setFeatureClassByRef(featureClass);
		featureLayer.setName("CSV XY EVENT TABLE");

		ILayer layer = new ILayerProxy(featureLayer);
		mxDoc = (IMxDocument) app.getDocument();
		mxDoc.getFocusMap().addLayer(layer);
		mxDoc.getActiveView().partialRefresh(esriViewDrawPhase.esriViewGeography, layer, null);
		}catch(Exception expc){
			System.out.println("ERROR: "+ expc.getMessage());
		}
	}

	private static IFeatureClass CreateXYEventFeature(ITable xyTable, String xField, String yField, ISpatialReference spatialReference) throws UnknownHostException, IOException
	{
		IXYEvent2FieldsProperties xyEventProperties = new XYEvent2FieldsProperties();
		xyEventProperties.setXFieldName(xField);
		xyEventProperties.setYFieldName(yField);

		IDataset xyTableDataset = new IDatasetProxy(xyTable);

		IXYEventSourceName xyEventSourceName = new XYEventSourceName();
		xyEventSourceName.setEventPropertiesByRef(xyEventProperties);
		xyEventSourceName.setEventTableNameByRef(xyTableDataset.getFullName());
		xyEventSourceName.setSpatialReferenceByRef(spatialReference);

		IName name = new INameProxy(xyEventSourceName);
		IXYEventSource xyEventSource = new IXYEventSourceProxy(name.open());
		return new IFeatureClassProxy(xyEventSource);
	}

	private static ISpatialReference CreateSpatialReference(int coordinateSystem) throws UnknownHostException, IOException
	{
		ISpatialReferenceFactory sRefFactory = new SpatialReferenceEnvironment();
		ISpatialReferenceResolution sRefResolution = (ISpatialReferenceResolution)(sRefFactory.createGeographicCoordinateSystem(coordinateSystem));

		sRefResolution.constructFromHorizon();
		((ISpatialReferenceTolerance)sRefResolution).setDefaultXYTolerance();
		return (ISpatialReference)sRefResolution;
	}

}
