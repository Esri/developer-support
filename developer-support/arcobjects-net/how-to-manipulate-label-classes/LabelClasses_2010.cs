using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;

namespace ArcMapAddin1_LabelClasses_2010
{
    public class LabelClasses_2010 : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public LabelClasses_2010()
        {
        }

        protected override void OnClick()
        {
            IMap map = ArcMap.Document.ActiveView as IMap;
            IGeoFeatureLayer geoFeatureLayer = map.get_Layer(0) as IGeoFeatureLayer;
            IAnnotateLayerPropertiesCollection annotateLayerPropertiesCollection = geoFeatureLayer.AnnotationProperties;

            LabelEngineLayerProperties labelEngineLayerProperties = new LabelEngineLayerProperties();
            IAnnotateLayerProperties annotateLayerProperties = labelEngineLayerProperties as IAnnotateLayerProperties;

            IElementCollection placedElements = new ElementCollection();
            IElementCollection unplacedElements = new ElementCollection();

            annotateLayerPropertiesCollection.QueryItem(1, out annotateLayerProperties, out placedElements, out unplacedElements); // 0 = default, 1 = 1st Class

            string className = annotateLayerProperties.Class;
            System.Diagnostics.Debug.WriteLine("Class Name: " + className);

            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
