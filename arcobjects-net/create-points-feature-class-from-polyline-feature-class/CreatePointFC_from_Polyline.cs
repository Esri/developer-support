using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;


namespace CreatePointFC_from_Polyline
{
    public class CreatePointFC_from_Polyline : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public CreatePointFC_from_Polyline()
        {
        }

        protected override void OnClick()
        {
            IMap map = ArcMap.Document.ActiveView as IMap;
            ILayer lineLayer = map.Layer[0];
            IFeatureLayer lineFeatureLayer = lineLayer as IFeatureLayer;
            IFeatureClass lineFeatureClass = lineFeatureLayer.FeatureClass;

            ILayer pointLayer = map.Layer[1];
            IFeatureLayer pointFeatureLayer = pointLayer as IFeatureLayer;
            IFeatureClass pointFeatureClass = pointFeatureLayer.FeatureClass;


            // Get Feature from 1st layer in ArcMap's TOC - check Object ID
            IFeature lineFeature = lineFeatureClass.GetFeature(1);
            IPolyline polyline = lineFeature.Shape as IPolyline;

            IPointCollection pointCollection = polyline as IPointCollection;
            for (int i=0; i < pointCollection.PointCount; i++)
            {
                // Add point to a Points feature class
                IPoint point = pointCollection.get_Point(i);
                IFeature pointFeature = pointFeatureClass.CreateFeature();
                pointFeature.Shape = point;
                pointFeature.Store();
            }

            ArcMap.Document.ActiveView.Refresh();
            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
