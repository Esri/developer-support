using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.DataSourcesRaster;

namespace Addin_SetNoDataValue
{
    public class _SetNoDataValueButton : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public _SetNoDataValueButton()
        {
        }

        protected override void OnClick()
        {
            String path = @"c:\temp";
            String fileName = "testRasterFileCreated_NoDataEquals15.tif";

            IRasterDataset rasterDataset = CreateRasterDataset(path, fileName); 

            setNoDataValueForASpecificBand(rasterDataset);

            ArcMap.Application.CurrentTool = null;
        }

        // From ArcObjects Help: How to Create a Raster dataset
        // http://resources.arcgis.com/en/help/arcobjects-net/conceptualhelp/index.html#/How_to_create_a_raster_dataset/000100000464000000/
        public static IRasterDataset CreateRasterDataset(string Path, string FileName)
        {
            try
            {
                IRasterWorkspace2 rasterWs = OpenRasterWorkspace(Path); // This is a custom method that's at the bottom of this code.
                //Define the spatial reference of the raster dataset.
                ISpatialReference sr = new UnknownCoordinateSystemClass();
                //Define the origin for the raster dataset, which is the lower left corner of the raster.
                IPoint origin = new PointClass();
                origin.PutCoords(15.0, 15.0);
                //Define the dimensions of the raster dataset.
                int width = 100; //This is the width of the raster dataset.
                int height = 100; //This is the height of the raster dataset.
                double xCell = 30; //This is the cell size in x direction.
                double yCell = 30; //This is the cell size in y direction.
                int NumBand = 1; // This is the number of bands the raster dataset contains.
                //Create a raster dataset in TIFF format.
                IRasterDataset rasterDataset = rasterWs.CreateRasterDataset(FileName, "TIFF",
                    origin, width, height, xCell, yCell, NumBand, rstPixelType.PT_UCHAR, sr,
                    true);

                //If you need to set NoData for some of the pixels, you need to set it on band 
                //to get the raster band.
                IRasterBandCollection rasterBands = (IRasterBandCollection)rasterDataset;
                IRasterBand rasterBand;
                IRasterProps rasterProps;
                rasterBand = rasterBands.Item(0);
                rasterProps = (IRasterProps)rasterBand;
                //Set NoData if necessary. For a multiband image, a NoData value needs to be set for each band.
                rasterProps.NoDataValue = 255;
                //Create a raster from the dataset.
                IRaster raster = ((IRasterDataset2)rasterDataset).CreateFullRaster();

                //Create a pixel block using the weight and height of the raster dataset. 
                //If the raster dataset is large, a smaller pixel block should be used. 
                //Refer to the topic "How to access pixel data using a raster cursor".
                IPnt blocksize = new PntClass();
                blocksize.SetCoords(width, height);
                IPixelBlock3 pixelblock = raster.CreatePixelBlock(blocksize) as IPixelBlock3;

                //Populate some pixel values to the pixel block.
                System.Array pixels;
                pixels = (System.Array)pixelblock.get_PixelData(0);
                for (int i = 0; i < width; i++)
                    for (int j = 0; j < height; j++)
                        if (i == j)
                            pixels.SetValue(Convert.ToByte(255), i, j);
                        else
                            pixels.SetValue(Convert.ToByte((i * j) / 255), i, j);

                pixelblock.set_PixelData(0, (System.Array)pixels);

                //Define the location that the upper left corner of the pixel block is to write.
                IPnt upperLeft = new PntClass();
                upperLeft.SetCoords(0, 0);

                //Write the pixel block.
                IRasterEdit rasterEdit = (IRasterEdit)raster;
                rasterEdit.Write(upperLeft, (IPixelBlock)pixelblock);

                //Release rasterEdit explicitly.
                System.Runtime.InteropServices.Marshal.ReleaseComObject(rasterEdit);

                return rasterDataset;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
                return null;
            }
        }

        public static IRasterWorkspace2 OpenRasterWorkspace(string PathName)
        {
            //This function opens a raster workspace.
            try
            {
                IWorkspaceFactory workspaceFact = new RasterWorkspaceFactoryClass();
                return workspaceFact.OpenFromFile(PathName, 0) as IRasterWorkspace2;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
                return null;
            }
        }

        public static void setNoDataValueForASpecificBand(IRasterDataset rasterDataset)
        {
            IRasterBandCollection rasterBandCollection = (IRasterBandCollection)rasterDataset;
            IRasterBand rasterBand = rasterBandCollection.Item(0);
            IRasterProps rasterProps = (IRasterProps)rasterBand;
            rasterProps.NoDataValue = 15;
        }

        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
