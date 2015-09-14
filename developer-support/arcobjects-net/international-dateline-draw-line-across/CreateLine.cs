using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.DataSourcesFile;


namespace ArcMapAddin_InternationalDateLine
{
    public class CreateLine : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public CreateLine()
        {
        }

        protected override void OnClick()
        {
            //
            //  TODO: Sample code showing how to access button host
            //

            var referenceFactory2 = (ISpatialReferenceFactory2)new SpatialReferenceEnvironment();
            ISpatialReference WGS84 = referenceFactory2.CreateSpatialReference((int)esriSRGeoCSType.esriSRGeoCS_WGS1984);
            IPointCollection pointCollection = new PolylineClass();

            // ------------- Ensure that both points have negative longitude values -------------------
            IPoint point = new PointClass();
            point.PutCoords(-170, 10); // Equivalent to 170 degrees WEST
            point.SpatialReference = WGS84;
            pointCollection.AddPoint(point);


            point = new PointClass();
            point.PutCoords(-200, 10); // Equivalent to 160 degrees EAST
            point.SpatialReference = WGS84;
            pointCollection.AddPoint(point);
            // -----------------------------------------------------------------------

            IPolyline polyline = (IPolyline)pointCollection;
            polyline.SpatialReference = WGS84;

            var geometryDefEdit = (IGeometryDefEdit)new GeometryDef();
            geometryDefEdit.GeometryType_2 = esriGeometryType.esriGeometryPolyline;
            geometryDefEdit.SpatialReference_2 = WGS84;

            var field = (IFieldEdit)new Field();
            field.Name_2 = "Shape";
            field.Type_2 = esriFieldType.esriFieldTypeGeometry;
            field.GeometryDef_2 = geometryDefEdit;

            var fields = (IFieldsEdit)new Fields();
            fields.AddField(field);

            IWorkspaceFactory workspaceFactory = new ShapefileWorkspaceFactory();
            var featureWorkspace = (IFeatureWorkspace)workspaceFactory.OpenFromFile("C:\\Temp\\", 0);
            IFeatureClass featureClass = featureWorkspace.CreateFeatureClass
                        ("test3.shp", fields, null, null, esriFeatureType.esriFTSimple, "Shape", "");

            var feature = featureClass.CreateFeature();
            feature.Shape = polyline;
            feature.Store();


            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
