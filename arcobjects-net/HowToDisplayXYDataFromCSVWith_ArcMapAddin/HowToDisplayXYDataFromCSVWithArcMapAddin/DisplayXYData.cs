using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.CartoUI;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.LocationUI;
using System;
using System.Reflection;
using Path = System.IO.Path;

namespace HowToDisplayXYDataFromCSVWithArcMapAddin
{
    public class DisplayXYData : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        private static string DataPath
        {
            get { return Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"data"); }
        }

        protected override void OnClick()
        {
            string tablePath = Path.Combine(DataPath, @"File-Based\MajorCities.csv");
            string tableName = Path.GetFileName(tablePath);

            Type factoryType = Type.GetTypeFromProgID("esriDataSourcesFile.TextFileWorkspaceFactory");
            IWorkspaceFactory workspaceFactory = Activator.CreateInstance(factoryType) as IWorkspaceFactory;
            IWorkspace workspace = workspaceFactory.OpenFromFile(Path.GetDirectoryName(tablePath), 0);

            ITable table = ((IFeatureWorkspace) workspace).OpenTable(tableName);
            ISpatialReference sRef = CreateSpatialReference(esriSRGeoCSType.esriSRGeoCS_WGS1984);

            IFeatureClass featureClass = CreateXYEventFeature(table, "POINT_X", "POINT_y", sRef);
            IFeatureLayer featureLayer = new FeatureLayerClass
            {
                FeatureClass = featureClass,
                Name = "CSV XY Event Table"
            };

            IFeatureLayerSourcePageExtension sourcePageExtension = new XYDataSourcePageExtensionClass();
            ((ILayerExtensions) featureLayer).AddExtension(sourcePageExtension);

            ArcMap.Document.FocusMap.AddLayer(featureLayer);
            ArcMap.Document.UpdateContents();
        }

        private static IFeatureClass CreateXYEventFeature(ITable xyTable, string xField, string yField, ISpatialReference spatialReference)
        {
            IXYEvent2FieldsProperties xyEventProperties = new XYEvent2FieldsPropertiesClass
            {
                XFieldName = xField,
                YFieldName = yField
            };
            
            IXYEventSourceName xyEventSourceName = new XYEventSourceNameClass
            {
                EventProperties = xyEventProperties,
                EventTableName = ((IDataset) xyTable).FullName,
                SpatialReference = spatialReference
            };

            IName name = xyEventSourceName as IName;
            IXYEventSource xyEventSource = name.Open() as IXYEventSource;
            return xyEventSource as IFeatureClass;
        }

        private static ISpatialReference CreateSpatialReference(esriSRGeoCSType coordinateSystem)
        {
            ISpatialReferenceFactory sRefFactory = new SpatialReferenceEnvironmentClass();
            ISpatialReferenceResolution sRefResolution =
                sRefFactory.CreateGeographicCoordinateSystem(Convert.ToInt32(coordinateSystem)) as
                    ISpatialReferenceResolution;

            sRefResolution.ConstructFromHorizon();
            ((ISpatialReferenceTolerance) sRefResolution).SetDefaultXYTolerance();
            return sRefResolution as ISpatialReference;
        }
    }
}
