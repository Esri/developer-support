import com.esri.arcgis.datasourcesraster.IRasterPyramid3;
import com.esri.arcgis.datasourcesraster.IRasterWorkspace;
import com.esri.arcgis.datasourcesraster.RasterWorkspace;
import com.esri.arcgis.datasourcesraster.RasterWorkspaceFactory;
import com.esri.arcgis.geodatabase.IRasterDataset;
import com.esri.arcgis.geodatabase.IWorkspace;
import com.esri.arcgis.geodatabase.IWorkspaceFactory;
import com.esri.arcgis.system.EngineInitializer;


public class PyramidsPresent {

	public static String filePath = "E:\\Data";
	public static String rasterFileName = "Tester1234.tif";
	
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

	public static void main(String[] args) {

		System.out.println("Starting...");
		System.out.println("Initializing License...");
		EngineInitializer.initializeEngine();
		initializeArcGISLicenses();
		
		try {
			
			IWorkspaceFactory wsFactory = new RasterWorkspaceFactory();
			
			IWorkspace workspace = wsFactory.openFromFile(filePath, 0);
			IRasterWorkspace rasterWorkspace = new RasterWorkspace(workspace);
			IRasterDataset rasterDataset = rasterWorkspace.openRasterDataset(rasterFileName);
			IRasterPyramid3 rasterPyramid3 = (IRasterPyramid3)rasterDataset;
			boolean presentPyramids = rasterPyramid3.isPresent();
			
			System.out.println("Prescense of raster pyramids = " + presentPyramids);
			
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("ERROR: " + e.getMessage());
		}
	}

}
