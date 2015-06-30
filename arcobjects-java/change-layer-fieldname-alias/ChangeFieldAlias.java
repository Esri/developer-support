package com.esri.samples;

import com.esri.arcgis.arcmapui.IMxDocument;
import com.esri.arcgis.carto.ILayer;
import com.esri.arcgis.carto.ILayerFields;
import com.esri.arcgis.carto.ILayerFieldsProxy;
import com.esri.arcgis.carto.IMapDocument;
import com.esri.arcgis.carto.MapDocument;
import com.esri.arcgis.framework.IApplication;
import com.esri.arcgis.geodatabase.IFieldInfo;
import com.esri.arcgis.system.EngineInitializer;



public class ChangeFieldAlias {

	private static String MapDocumentLocation = "C:\\Users\\alex7370\\Desktop\\mxdFont.mxd";

	private static IApplication app;
	private static IMxDocument mxd;
	private static IMapDocument mapDoc;

	public static void main(String[] args) {
		EngineInitializer.initializeEngine();
		initializeArcGISLicenses();
		try {
			System.out.println("Loading map document....");
			mapDoc = new MapDocument();
			mapDoc.open(MapDocumentLocation, "");

			System.out.println("Finding Layer...");
			ILayer layer = mapDoc.getActiveView().getFocusMap().getLayer(0);
			System.out.println("Finding Layer Fields...");
			ILayerFields layerFields = new ILayerFieldsProxy(layer);
			System.out.println("Iterating fields in layer...\nUpdating Field Alias as necessary...");
			for (int i = 0; i < layerFields.getFieldCount(); i++)
			{
				IFieldInfo fieldInfo = layerFields.getFieldInfo(i);
				fieldInfo.setAlias(fieldInfo.getAlias().endsWith("Int") ? fieldInfo.getAlias().replace("Int", "INT") : fieldInfo.getAlias());
			}

			System.out.println("Done");

			mapDoc.save(false, true);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
		}
	}

	static void initializeArcGISLicenses() {
		try {
			com.esri.arcgis.system.AoInitialize ao = new com.esri.arcgis.system.AoInitialize();
			if (ao.isProductCodeAvailable(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeEngine) == com.esri.arcgis.system.esriLicenseStatus.esriLicenseAvailable)
				ao.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeEngine);
			else if (ao.isProductCodeAvailable(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeBasic) == com.esri.arcgis.system.esriLicenseStatus.esriLicenseAvailable)
				ao.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeBasic);
			else if (ao.isProductCodeAvailable(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeStandard) == com.esri.arcgis.system.esriLicenseStatus.esriLicenseAvailable)
				ao.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeStandard);
			else if (ao.isProductCodeAvailable(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeAdvanced) == com.esri.arcgis.system.esriLicenseStatus.esriLicenseAvailable)
				ao.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeAdvanced);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
