using System;
using System.Collections.Generic;
using System.Text;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.DataSourcesRaster;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;

namespace rasterCellSize
{
    class Program
    {
        private static LicenseInitializer m_AOLicenseInitializer = new rasterCellSize.LicenseInitializer();

        [STAThread()]
        static void Main(string[] args)
        {
            //ESRI License Initializer generated code.
            m_AOLicenseInitializer.InitializeApplication(new esriLicenseProductCode[] { esriLicenseProductCode.esriLicenseProductCodeAdvanced },
            new esriLicenseExtensionCode[] { });
            //ESRI License Initializer generated code.


            //Get a path to the raster workspace and create a RasterWorkspace object
            Type factoryType = Type.GetTypeFromProgID("esriDataSourcesRaster.RasterWorkspaceFactory");
            IWorkspaceFactory workspaceFactory = Activator.CreateInstance(factoryType) as IWorkspaceFactory;
            IRasterWorkspace2 rasterWorkspace = (IRasterWorkspace2) workspaceFactory.OpenFromFile("\\\\Filepath\\ToRaster\\Folder", 0);
            IRasterDataset rasterDataset = rasterWorkspace.OpenRasterDataset("DEM_Resample.tif");

            //Create a raster layer to get the raster object from it
            IRasterLayer rasterLayer = new RasterLayer();
            rasterLayer.CreateFromDataset(rasterDataset);
            IRaster raster = rasterLayer.Raster;

            //Get the raster properties so we can modify them later and get details about them if we so choose.
            IRasterProps rasterProps = raster as IRasterProps;
            double cellSize = 60;

            //Declate a new spatial reference if you want to change the spatial reference used.
            ISpatialReferenceFactory srFactory = new SpatialReferenceEnvironment();
            ISpatialReference2 srReference = srFactory.CreateProjectedCoordinateSystem(26917) as ISpatialReference2;

            //Create an IRasterGeometryProc object as this has the projectFast method we are looking for.
            IRasterGeometryProc rasterGeometryProc = new RasterGeometryProc();
            rasterGeometryProc.ProjectFast(rasterProps.SpatialReference, rstResamplingTypes.RSP_NearestNeighbor, ((object)cellSize), raster);

            //Create a new rasterBandCollection to store the raster in and save it there.
            IRasterBandCollection rasterBandCollection = raster as IRasterBandCollection;
            String outName = "NewImage.tif";

            String outType = "TIFF";
            rasterBandCollection.SaveAs(outName, ((IWorkspace)rasterWorkspace), outType);

            Console.WriteLine("DONE");
            Console.ReadLine();
            //Do not make any call to ArcObjects after ShutDownApplication()
            m_AOLicenseInitializer.ShutdownApplication();
        }
    }
}
