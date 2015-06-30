package com.esri.samples;

import com.esri.arcgis.carto.IElement;
import com.esri.arcgis.carto.IElementProperties3;
import com.esri.arcgis.carto.IGraphicsContainer;
import com.esri.arcgis.carto.IMap;
import com.esri.arcgis.carto.IMapDocument;
import com.esri.arcgis.carto.IMarkerElement;
import com.esri.arcgis.carto.MapDocument;
import com.esri.arcgis.carto.MarkerElement;
import com.esri.arcgis.carto.esriAnchorPointEnum;
import com.esri.arcgis.display.IColor;
import com.esri.arcgis.display.ISimpleMarkerSymbol;
import com.esri.arcgis.display.RgbColor;
import com.esri.arcgis.display.SimpleMarkerSymbol;
import com.esri.arcgis.display.esriSimpleMarkerStyle;
import com.esri.arcgis.geometry.Envelope;
import com.esri.arcgis.geometry.IEnvelope;
import com.esri.arcgis.geometry.IPoint;
import com.esri.arcgis.geometry.ISpatialReference;
import com.esri.arcgis.geometry.ISpatialReferenceFactory;
import com.esri.arcgis.geometry.Point;
import com.esri.arcgis.geometry.SpatialReferenceEnvironment;
import com.esri.arcgis.geometry.esriSRGeoCSType;
import com.esri.arcgis.system.EngineInitializer;


public class SetCoordinateSystemAndAddPoint {

	private static String MapDocumentPath = "C:\\Users\\alex7370\\Desktop\\TestingForSami.mxd";
	private static IMapDocument mapDoc;

	public static void main(String[] args) {
		EngineInitializer.initializeEngine();
		initializeArcGISLicenses();

		try {


			mapDoc = new MapDocument();
			mapDoc.open(MapDocumentPath, "");

			AddPPGeocodedPoint(34.013, -118.494);


		} catch (Exception e) {
			System.out.println("ERROR : " + e.getMessage());
		}

		System.out.println("DONE");
	}

	private static void AddPPGeocodedPoint(double lat, double lng)
	{
		try {
			mapDoc.getActiveView().getFocusMap().setSpatialReferenceByRef(DefineGCS());
			mapDoc.getActiveView().refresh();

			IPoint ipoint = new Point();
			ipoint.setSpatialReferenceByRef(DefineGCS());
			ipoint.setX(lng);
			ipoint.setY(lat);

			IMap map = (IMap)mapDoc.getActiveView();
			IGraphicsContainer graphicsContainer = (IGraphicsContainer)map;
			IElement element = null;

			//Set the point Color
			IColor pointColor = new RgbColor();
			pointColor.setRGB(255000000);

			ISimpleMarkerSymbol simpleMarkerSymbol = new SimpleMarkerSymbol();
			simpleMarkerSymbol.setColor(pointColor);
			simpleMarkerSymbol.setOutline(true);
			simpleMarkerSymbol.setOutlineColor(pointColor);
			simpleMarkerSymbol.setSize(10);
			simpleMarkerSymbol.setStyle(esriSimpleMarkerStyle.esriSMSCircle);

			IMarkerElement markerElement = new MarkerElement();
			markerElement.setSymbol(simpleMarkerSymbol);
			markerElement.getSymbol().setColor(pointColor);

			element = (IElement)markerElement;
			IElementProperties3 elemProperties = (IElementProperties3)element;
			elemProperties.setName(String.format("{0}, {1}", lng, lat));
			elemProperties.setAnchorPoint(esriAnchorPointEnum.esriCenterPoint);

			if(!(element == null))
			{
				element.setGeometry(ipoint);
				graphicsContainer.addElement(element, 0);
				IEnvelope envelope = new Envelope();
				envelope = mapDoc.getActiveView().getExtent();
				envelope.centerAt(ipoint);
				map.setMapScale(5000);
				mapDoc.getActiveView().refresh();
			}

			mapDoc.save(false, true);

		} catch (Exception e) {
			System.out.println("ERROR : " + e.getMessage());
		}
	}

	private static ISpatialReference DefineGCS()
	{
		ISpatialReference gcs = null;
		try {
			ISpatialReferenceFactory srFactory = new SpatialReferenceEnvironment();
			gcs = srFactory.createGeographicCoordinateSystem((int)esriSRGeoCSType.esriSRGeoCS_NAD1983);
		} catch (Exception e) {
			System.out.println("ERROR : " + e.getMessage());
		}
		return gcs;
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
