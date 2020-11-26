using System;
using System.IO;
using System.Linq;
using ArcGIS.Core.CIM;
using ArcGIS.Core.Data;
using ArcGIS.Core.Data.Raster;
using ArcGIS.Core.Geometry;
using ArcGIS.Desktop.Core;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using ArcGIS.Desktop.Mapping;

namespace ProCreateRaster_CS
{
    internal class Button1 : Button
    {
        // Location to the raster dataset - change if necessary.
        private static string mPath = "C:\\rasters";

        // Names for the rasters and raster dataset.
        private static string mTempRasterName = "TempRasterPro";
        private static string mFinalRasterName = "FinalRasterPro";
        private static string mRasterDatasetName = "RasterDatasetPro.tif";

        protected override void OnClick()
        {
            MakeRaster();
        }

        public async void MakeRaster()
        {
            await QueuedTask.Run(() =>
            {
                // Open initial raster dataset.
                Raster tempRaster = OpenRasterFromDataset(mPath, mRasterDatasetName);

                // Make temp raster and Save As.
                tempRaster = SetupRaster(tempRaster);
                ExportRaster(tempRaster, mPath, mTempRasterName);

                // Open temp raster as raster dataset into final raster.
                Raster FinalRaster = OpenRasterFromDataset(mPath, mTempRasterName + ".tif");

                // Make final raster and Save As.
                FinalRaster = WritePixelValues(FinalRaster);
                ExportRaster(FinalRaster, mPath, mFinalRasterName);

                // Close rasters.
                tempRaster.Dispose();
                FinalRaster.Dispose();
            });

            // Delete temp raster.
            DeleteTempRaster(mPath, mTempRasterName);
        }

        private Raster OpenRasterFromDataset(string path, string rasterDatasetFileName)
        {
            Raster raster;
            FileSystemConnectionPath connectionPath =
                    new FileSystemConnectionPath(new Uri(path), FileSystemDatastoreType.Raster);
            using (FileSystemDatastore datastore = new FileSystemDatastore(connectionPath))
            {
                using (RasterDataset rasterDataset = datastore.OpenDataset<RasterDataset>(rasterDatasetFileName))
                {
                    // Create a full raster from the raster dataset.
                    raster = rasterDataset.CreateFullRaster();
                    rasterDataset.Dispose();
                }
                datastore.Dispose();
            }

            return raster;
        }

        private Raster SetupRaster(Raster raster, int size = 50)
        {
            // Set raster size.
            var evExtent = new EnvelopeBuilder(0, 0, size * 300, size * 300);
            raster.SetExtent(evExtent.ToGeometry());
            raster.SetHeight(size);
            raster.SetWidth(size);

            raster.SetResamplingType(ArcGIS.Core.CIM.RasterResamplingType.NearestNeighbor);

            raster.SetNoDataValue(0);

            return raster;
        }

        private Raster WritePixelValues(Raster raster)
        {
            // Calculate size of pixel block to create. Use 128 or height/width of the raster, whichever is smaller.
            int pixelBlockHeight = raster.GetHeight() > 128 ? 128 : raster.GetHeight();
            int pixelBlockWidth = raster.GetWidth() > 128 ? 128 : raster.GetWidth();

            // Create a new (blank) pixel block.
            PixelBlock currentPixelBlock = raster.CreatePixelBlock(pixelBlockWidth, pixelBlockHeight);

            // Read pixel values from the raster dataset into the pixel block starting from the given top left corner.
            raster.Read(0, 0, currentPixelBlock);

            // For each plane (band) in the pixel block
            for (int plane = 0; plane < currentPixelBlock.GetPlaneCount(); plane++)
            {
                // Get a copy of the array of pixels from the pixel block corresponding to the current plane.
                Array sourcePixels = currentPixelBlock.GetPixelData(plane, true);

                // Get the height and width of the pixel block.
                int pBHeight = currentPixelBlock.GetHeight();
                int pBWidth = currentPixelBlock.GetWidth();

                // Iterate through the pixels in the array.
                for (int i = 0; i < pBHeight; i++)
                {
                    for (int j = 0; j < pBWidth; j++)
                    {
                        // Get the pixel value from the array and process it
                        //  (add 5 to the value and add the value x2).
                        // Note: This is assuming the pixel type is Unisigned 8bit.
                        int pixelValue = Convert.ToInt16(sourcePixels.GetValue(j, i)) + 5 + i * 2;

                        // Make sure the pixel value does not go above the range of the pixel type.
                        pixelValue = pixelValue > 254 ? 254 : pixelValue;

                        // Set the new pixel value to the array.
                        // Note: This is assuming the pixel type is Unisigned 8bit.
                        sourcePixels.SetValue(Convert.ToByte(pixelValue), j, i);
                    }
                }

                // Set the modified array of pixels back to the pixel block.
                currentPixelBlock.SetPixelData(plane, sourcePixels);

                // Check pixel blocks.
                Array testPixels_cp = currentPixelBlock.GetPixelData(0, true);
                Array testPixels_rf = currentPixelBlock.GetPixelData(0, false);

            }

            // Write the pixel block to the raster dataset starting from the given top left corner.
            raster.Write(0, 0, currentPixelBlock);

            // Check raster.
            int pixelValueTest = Convert.ToInt16(raster.GetPixelValue(0, 0, 1));
            PixelBlock checkPixelBlock = raster.CreatePixelBlock(pixelBlockWidth, pixelBlockHeight);
            raster.Read(0, 0, checkPixelBlock);
            Array testSourcePixels_cp = checkPixelBlock.GetPixelData(0, true);
            Array testSourcePixels_rf = checkPixelBlock.GetPixelData(0, false);

            return raster;
        }

        private void ExportRaster(Raster raster, string path, string fileName)
        {
            // Open data store.
            FileSystemConnectionPath connectionPath =
                    new FileSystemConnectionPath(new Uri(path), FileSystemDatastoreType.Raster);
            using (FileSystemDatastore datastore = new FileSystemDatastore(connectionPath))
            {
                using (raster.SaveAs(fileName + ".tif", datastore, "TIFF"))
                {
                    datastore.Dispose();
                    raster.Dispose();
                }

                datastore.Dispose();
            }
        }

        private void DeleteTempRaster(string path, string fileNameToDelete)
        {
            string[] fileList = System.IO.Directory.GetFiles(path, "*" + fileNameToDelete + "*");
            foreach (string file in fileList)
            {
                System.Diagnostics.Debug.WriteLine(file + " will be deleted");
                System.IO.File.Delete(file);
            }
        }
    }
}
