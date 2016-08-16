using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Windows.Forms;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.DataSourcesFile;
using ESRI.ArcGIS.DataSourcesGDB;
using ESRI.ArcGIS.Geometry;

namespace ArcMapAddin_SpatialReference
{
    public class SpatialReferenceTest : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public SpatialReferenceTest()
        {
        }

        protected override void OnClick()
        {
            IWorkspaceFactory workspaceFactory = new FileGDBWorkspaceFactoryClass();
            IWorkspace workspace = workspaceFactory.OpenFromFile(@"C:\temp\data.gdb", 0);
            IFeatureWorkspace featureWorkspace = (IFeatureWorkspace)workspace;
            IFeatureClass featureClass = featureWorkspace.OpenFeatureClass("PolygonFC");

            ISpatialReferenceFactory3 spatialFact = new SpatialReferenceEnvironmentClass();
            IQueryFilter filter = new QueryFilterClass();
            filter.WhereClause = "";
            // The Geotransformation to use while performing the projection
            IGeoTransformation pGeoTransB = spatialFact.CreateGeoTransformation(
                (int)esriSRGeoTransformationType.esriSRGeoTransformation_NAD1983_To_WGS1984_1) as IGeoTransformation;
            // The target spatial reference. WGS_1984: WKID = 4326 (EPSG)
            ISpatialReference toSpatialReference = spatialFact.CreateSpatialReference(4326);
            //create the search cursor to go through each and every feature in the featureclass
            IFeatureCursor featureCursor = featureClass.Search(filter, true);
            IFeature feature = featureCursor.NextFeature();
            string areaText = null; 
            while (feature != null)
            {
                // Project the feature (geometry) from its current coordinate system into the one specified (UTMz11N_WGS84)
                ((IGeometry5)feature.Shape).ProjectEx(toSpatialReference, esriTransformDirection.esriTransformReverse, pGeoTransB, false, 0.0, 0.0);
                IPolygon polygon = (IPolygon)feature.Shape;
                // Compute the area 
                IArea area = polygon as IArea;
                // Build a string to output to a message box
                areaText += "OID = " + feature.OID + " , " + "Area =" + area.Area.ToString() + " \n";
                feature = featureCursor.NextFeature();
            }
            MessageBox.Show(areaText);
            ArcMap.Application.CurrentTool = null;
        }
    }

}
