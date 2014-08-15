using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Display;

namespace ArcMapAddin_IElementTest
{
    public class IElement_test : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public IElement_test()
        {
        }

        protected override void OnClick()
        {
            //AddPPGeocodedPoint(-469797.999,  -1956249.549); // North American Albers Equal Area Coordinates
            AddPPGeocodedPoint(34.013, -118.494); // GCS NAD 1983

            ArcMap.Application.CurrentTool = null;
        }

        internal void AddPPGeocodedPoint(double lat, double lng)
        {
            // Set the coordinate system of the data frame.
            ArcMap.Document.ActiveView.FocusMap.SpatialReference = DefineGCS(); 
            ArcMap.Document.ActiveView.Refresh();

            IPoint iPoint = new PointClass();
            // Set the coordinate system of your point to match your data frame
            iPoint.SpatialReference = DefineGCS();
            iPoint.X = lng;
            iPoint.Y = lat;

            IMap map = ArcMap.Document.ActiveView as IMap;
            IGraphicsContainer graphicsContainer = (IGraphicsContainer)map; // Explicit Cast
            IElement element = null;

            // set the point color
            IColor pointColor = new RgbColor();
            //pointColor.RGB = 255255255;
            pointColor.RGB = 255000000;

            // Marker symbols
            ESRI.ArcGIS.Display.ISimpleMarkerSymbol simpleMarkerSymbol = new SimpleMarkerSymbolClass();
            simpleMarkerSymbol.Color = pointColor;
            simpleMarkerSymbol.Outline = true;
            simpleMarkerSymbol.OutlineColor = pointColor;
            simpleMarkerSymbol.Size = 10;
            simpleMarkerSymbol.Style = esriSimpleMarkerStyle.esriSMSCircle;

            // Marker element
            IMarkerElement markerElement = new MarkerElementClass();
            markerElement.Symbol = simpleMarkerSymbol;
            markerElement.Symbol.Color = pointColor;

            element = (IElement)markerElement; // Explicit Cast

            // set the element name
            IElementProperties3 elemProperties = element as IElementProperties3;
            elemProperties.Name = string.Concat(lng, " ,", lat);
            elemProperties.AnchorPoint = esriAnchorPointEnum.esriCenterPoint;

            // Add the element to a graphics container and refresh the ActiveView
            if (!(element == null))
            {
                element.Geometry = iPoint;
                graphicsContainer.AddElement(element, 0);
                IEnvelope envelope = new EnvelopeClass();
                envelope = ArcMap.Document.ActiveView.Extent;
                envelope.CenterAt(iPoint);
                //ArcMap.Document.ActiveView.Extent = envelope;
                //map.MapScale = 2400;
                map.MapScale = 5000;
                ArcMap.Document.ActiveView.Refresh();
            }
        }

        private ISpatialReference DefineGCS()
        {
            ISpatialReferenceFactory srFactory = new SpatialReferenceEnvironmentClass();
            //ISpatialReference gcs = srFactory.CreateGeographicCoordinateSystem(wkid); 
            //ISpatialReference gcs = srFactory.CreateProjectedCoordinateSystem((int)esriSRProjCSType.esriSRProjCS_NAD1983N_AmericaAlbers);
            ISpatialReference gcs = srFactory.CreateGeographicCoordinateSystem((int)esriSRGeoCSType.esriSRGeoCS_NAD1983);
                
                // wkid = 4269 (GCS_NAD_1983)
                // wkid = 102008 (North American Albers Equal Area Conic)

            return gcs;
        }
       
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
