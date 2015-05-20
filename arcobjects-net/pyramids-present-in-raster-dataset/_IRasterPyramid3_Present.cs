using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.DataSourcesRaster;
using ESRI.ArcGIS.Geodatabase;
using System.Windows.Forms;

namespace Addin_IRasterPyramid3_Present
{
    public class _IRasterPyramid3_Present : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public _IRasterPyramid3_Present()
        {
        }

        protected override void OnClick()
        {
            Type factoryType = Type.GetTypeFromProgID("esriDataSourcesRaster.RasterWorkspaceFactory");
            IWorkspaceFactory wsFactory = (IWorkspaceFactory)Activator.CreateInstance(factoryType);
            string filePath = @"C:\Temp\raster\"; // NAme of File = LC80400362014321LGN00.jpg
            IWorkspace workspace = wsFactory.OpenFromFile(filePath, 0);
            IRasterWorkspace rasterWorkspace = workspace as IRasterWorkspace;
            IRasterDataset rasterDataset = rasterWorkspace.OpenRasterDataset("Landsat_8_Redlands_LC80400362013142LGN01.jpg");

            IRasterPyramid3 rasterPyramid3 = rasterDataset as IRasterPyramid3;
            bool presentBool = rasterPyramid3.Present;
            MessageBox.Show("presentBool = " + presentBool);

            ArcMap.Application.CurrentTool = null;
        }

        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
