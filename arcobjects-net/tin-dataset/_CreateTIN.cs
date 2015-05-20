using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.DataSourcesFile;
using System.Windows.Forms;
using ESRI.ArcGIS.Display;


namespace ArcMapAddin_CreateTIN
{
    public class _CreateTIN : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public _CreateTIN()
        {
        }

        protected override void OnClick()
        {
            try
            {
                string shpFilePath = string.Format(@"C:\temp\contour datas");
                string shpFileName = "contour2.shp"; // height data

                IWorkspaceFactory workspaceFactory = new ESRI.ArcGIS.DataSourcesFile.ShapefileWorkspaceFactoryClass();
                IWorkspace workspace = workspaceFactory.OpenFromFile(shpFilePath, 0);
                IFeatureWorkspace featureWorkspace = (IFeatureWorkspace)workspace;
                IFeatureClass pFeatureClass = featureWorkspace.OpenFeatureClass(shpFileName);
                IFeatureLayer pFeatureLayer = new FeatureLayerClass();
                pFeatureLayer.FeatureClass = pFeatureClass;
                IQueryFilter pQueryFilter = new QueryFilterClass();
                pQueryFilter.WhereClause = "";

                IEnvelope pEnv = pFeatureLayer.AreaOfInterest;
                IGeoDataset pGDS = (IGeoDataset)pFeatureLayer.FeatureClass;
                ISpatialReference pSR = pGDS.SpatialReference;
                IGeometry pGeom = pEnv;
                pGeom.Project(pSR);
                ITinEdit pTinEdit = new TinClass();
                pTinEdit.InitNew(pEnv);
                IFields pFields = pFeatureClass.Fields;
                IField pFiled = pFields.get_Field(pFields.FindField("HSL"));
                object Missing = Type.Missing;
                esriTinSurfaceType pTinSurface = esriTinSurfaceType.esriTinHardLine;
                pTinEdit.AddFromFeatureClass(pFeatureClass, pQueryFilter, pFiled, pFiled, pTinSurface, ref Missing);
                string outputFolderPath = @"C:\temp\Output\";
                string tinFolderName = "tin_data";
                pTinEdit.SaveAs(outputFolderPath + tinFolderName, ref Missing);
                MessageBox.Show("end");
            }
            catch (System.Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
