using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Display;
using ESRI.ArcGIS.ArcMapUI;

namespace Addin_CreatePolylines
{
    public class CreatePolylineFromPoints : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public CreatePolylineFromPoints()
        {
        }

        protected override void OnClick()
        {
            // Create two points. 
            IPoint fromPoint = new Point();
            fromPoint.PutCoords(1300757, 554219);
            IPoint toPoint = new Point();
            toPoint.PutCoords(1300759, 554217);
            // Note: Spatial Reference = NAD_1983_StatePlane_Washington_North_FIPS_4601_Feet

            // ****** No Need to go through IPointCollection  ****

            //// Add the points to a point collection
            //object missing = Type.Missing;
            //IPointCollection pointCollection = new Multipoint();
            //pointCollection.AddPoint(fromPoint, ref missing, ref missing);  
            //pointCollection.AddPoint(toPoint, ref missing, ref missing);

            // ****** No Need to go through IPointCollection  ****


            // Get a reference to a feature class from ArcMap
            IMap map = ArcMap.Document.ActiveView as IMap;
            ILayer layer = map.get_Layer(0);
            IFeatureLayer featureLayer = layer as FeatureLayer;
            IFeatureClass featureClass = featureLayer.FeatureClass;
            IFeature feature = featureClass.CreateFeature();

            IPolyline polyline = new PolylineClass();
            polyline.FromPoint = fromPoint;
            polyline.ToPoint = toPoint;

            //IPolyline polyline = pointCollection as IPolyline; // This leads to a null polyline
            feature.Shape = polyline as IGeometry;
            feature.Store();

            // ---- Symbolize the polyline with the ArrorMarker at both ends of the line -----------
            // See: http://resources.arcgis.com/en/help/arcobjects-net/conceptualhelp/index.html#//0001000008w8000000  

            ICartographicLineSymbol ipArrowLineSymbol = new CartographicLineSymbol();

            // the line color will be red
            IRgbColor ipRgbRedColor = new RgbColorClass();
            ipRgbRedColor.Red = 192;

            // the arrow will be black
            IRgbColor ipRgbBlackColor = new RgbColorClass();
            ipRgbBlackColor.RGB = 0;

            // set up the arrow that will be displayed along the line
            IArrowMarkerSymbol ipArrowMarker = new ArrowMarkerSymbolClass();
            ipArrowMarker.Style = esriArrowMarkerStyle.esriAMSPlain;
            ipArrowMarker.Length = 18;
            ipArrowMarker.Width = 12;
            ipArrowMarker.Color = ipRgbBlackColor;

            // set up the line itself
            ipArrowLineSymbol.Width = 4;
            ipArrowLineSymbol.Color = ipRgbRedColor;

            // decorate the line with the arrow symbol
            ISimpleLineDecorationElement ipSimpleLineDecorationElement = new SimpleLineDecorationElementClass();
            ipSimpleLineDecorationElement.Rotate = true;
            ipSimpleLineDecorationElement.PositionAsRatio = true;
            ipSimpleLineDecorationElement.MarkerSymbol = ipArrowMarker;
            ipSimpleLineDecorationElement.AddPosition(0.0);
            ipSimpleLineDecorationElement.AddPosition(1.0);
            ipSimpleLineDecorationElement.FlipFirst = true;
            ILineDecoration ipLineDecoration = new LineDecorationClass();
            ipLineDecoration.AddElement(ipSimpleLineDecorationElement);
            ((ILineProperties)ipArrowLineSymbol).LineDecoration = ipLineDecoration;

            // Create renderer and apply it to the layer
            ISimpleRenderer simpleRenderer = new SimpleRendererClass();
            simpleRenderer.Symbol = ipArrowLineSymbol as ISymbol;
            IGeoFeatureLayer geoFeatureLayer = featureLayer as IGeoFeatureLayer;
            geoFeatureLayer.Renderer = simpleRenderer as IFeatureRenderer;

            IMxDocument mxDocument = ArcMap.Application.Document as IMxDocument;
            mxDocument.ActiveView.Refresh();
            mxDocument.ActiveView.PartialRefresh(esriViewDrawPhase.esriViewGeography, geoFeatureLayer, mxDocument.ActiveView.Extent);
            mxDocument.UpdateContents();

            // ---- Symbolize the polyline with the ArrorMarker at both ends of the line -----------



            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
