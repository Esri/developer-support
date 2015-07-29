using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Geodatabase;
//using ESRI.ArcGIS.ADF.Connection.Local;
using ESRI.ArcGIS.ADF;
using System.Runtime.InteropServices;


namespace ArcMapAddin_EditingArcSDE
{
    public class _CreateFeature : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public _CreateFeature()
        {
        }

        protected override void OnClick()
        {
            IActiveView activeView = ArcMap.Document.ActiveView;
            
            IMap map = activeView as IMap;
            ILayer layer = map.get_Layer(0);
            IFeatureLayer featureLayer = layer as IFeatureLayer;
            IFeatureClass featureClass = featureLayer.FeatureClass;

            IPoint point = new PointClass();
            point.PutCoords(-117.1, 34.075); //(LONG, LAT)

            IWorkspace workspace = GetWorkspace();
            IWorkspaceEdit workspaceEdit = workspace as IWorkspaceEdit;

            workspaceEdit.StartEditing(true);
            workspaceEdit.StartEditOperation();

            // -------------- Perform your editing tests here ------------------
            CreateFeature(featureClass, point);     
            //UpdateFeature(featureClass);
            //DeleteFeature(featureClass);

            // -----------------------------------------------------------------

            workspaceEdit.StopEditOperation();
            workspaceEdit.StopEditing(true);

            ArcMap.Application.CurrentTool = null;
        }

        public static void CreateFeature(IFeatureClass featureClass, IPoint point)
        {
            // Build the feature
            IFeature feature = featureClass.CreateFeature();
            feature.Shape = point;

            //Update a value on string field - name of the new feature (city)
            int fieldIndex = featureClass.FindField("AREANAME");
            feature.set_Value(fieldIndex, "Mentone");

            //Commit the new feature to the geodatabase
            feature.Store();
        }

        public static void UpdateFeature(IFeatureClass featureClass)
        {
            // Create a COM releaser for cursor management
            using (ComReleaser comReleaser = new ComReleaser())
            {
                // Use IFeatureClass.Update to create an update cursor
                IFeatureCursor featureCursor = featureClass.Update(null, true);
                comReleaser.ManageLifetime(featureCursor);

                // find the index of the field named "country"
                int fieldIndex = featureClass.FindField("Country");

                IFeature feature = null;
                while ((feature = featureCursor.NextFeature()) != null)
                {
                    feature.set_Value(fieldIndex, "USA");
                    featureCursor.UpdateFeature(feature); // Do not use IFeature.Store with UpdateCursors
                }
            }
        }

        public static void DeleteFeature(IFeatureClass featureclass)
        {
            // define a constraint on the feature to be deleted
            IQueryFilter queryFilter = new QueryFilter();
            queryFilter.WhereClause = "AREANAME = 'Mentone'";

            //create a ComReleaser for cursor management
            using (ComReleaser comReleaser = new ComReleaser())
            {
                // Create and Manage a cursor
                IFeatureCursor featureCursor = featureclass.Search(queryFilter, false);
                comReleaser.ManageLifetime(featureCursor);

                // Delete the retrieved features
                IFeature feature = null;
                while ((feature = featureCursor.NextFeature()) != null)
                {
                    feature.Delete();
                }
            }
        }

        public static IWorkspace GetWorkspace()
        {
            Type factoryType = Type.GetTypeFromProgID("esriDataSourcesGDB.SdeWorkspaceFactory");
            IWorkspaceFactory workspaceFactory = (IWorkspaceFactory)Activator.CreateInstance(factoryType);
            IWorkspace workspace = workspaceFactory.OpenFromFile(@"C:\Users\YourUserName\AppData\Roaming\ESRI\Desktop10.3\ArcCatalog\express2014@samigdb.sde", 0);
            return workspace;
        }

        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
