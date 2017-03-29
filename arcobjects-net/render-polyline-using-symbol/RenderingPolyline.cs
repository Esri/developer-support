using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Display;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;


namespace RenderingPolyline
{
    public class RenderingPolyline : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public RenderingPolyline()
        {
        }

        protected override void OnClick()
        {
            // Access a feature layer from ArcMap
             IMap map = ArcMap.Document.FocusMap;
            IFeatureLayer featureLayer = map.Layer[0] as IFeatureLayer;
            IFeatureClass featureclass = featureLayer.FeatureClass;

            IRgbColor lineColor = new RgbColorClass();
            lineColor.Red = 255;
            lineColor.Green = 255;
            lineColor.Blue = 0;

            ISimpleLineSymbol lineSymbol = new SimpleLineSymbolClass();
            lineSymbol.Color = lineColor;
            lineSymbol.Width = 3.0;

            ISimpleRenderer simpleRenderer = new SimpleRendererClass();
            simpleRenderer.Label = "Taper";
            simpleRenderer.Symbol = lineSymbol as ISymbol;

            IGeoFeatureLayer geoFL = featureLayer as IGeoFeatureLayer;
            geoFL.Renderer = simpleRenderer as IFeatureRenderer;
            ArcMap.Document.ActivatedView.Refresh();
            ArcMap.Document.ActivatedView.PartialRefresh(esriViewDrawPhase.esriViewGeography, geoFL, ArcMap.Document.ActivatedView.Extent);
            ArcMap.Document.UpdateContents();

        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
