using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Geodatabase;

namespace DeleteFeaturesTest2
{
    public class DeleteFeaturesTest2 : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public DeleteFeaturesTest2()
        {
        }

        protected override void OnClick()
        {
            IMap map = ArcMap.Document.FocusMap;
            IFeatureLayer featureLayer = map.get_Layer(0) as IFeatureLayer;
            IFeatureClass featureClass = featureLayer.FeatureClass;
            IFeatureCursor featureCursor = featureClass.Search(null, false);
            IFeature feature;
            while ((feature = featureCursor.NextFeature()) != null)
            {
                feature.Delete();
            }
            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
