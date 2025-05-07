using ArcGIS.Core.CIM;
using ArcGIS.Core.Geometry;
using ArcGIS.Core.Internal.Geometry;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using ArcGIS.Desktop.Mapping;
using System;
using System.Collections.Generic;

namespace createCurve
{
    internal class Button1 : Button
    {
        protected override void OnClick()
        {
            QueuedTask.Run(() =>
            {
                // Projected spatial reference in meters
                var webMercator = SpatialReferences.WebMercator;

                // Seattle coordinates (WGS84)
                var seattleWgs = MapPointBuilder.CreateMapPoint(-122.3321, 47.6062, SpatialReferences.WGS84);

                // Project to Web Mercator (meters)
                var startPoint = (MapPoint)GeometryEngine.Instance.Project(seattleWgs, webMercator);

                // Shared arc parameters
                double radius = 1000;
                double chordLength = 800;

                // Define bearings and colors
                var configs = new List<(double bearing, CIMColor color)>
                {
                    (0 * 0.01745327777,    ColorFactory.Instance.RedRGB),
                    (45 * 0.01745327777,   ColorFactory.Instance.GreenRGB),
                    (90 * 0.01745327777,   ColorFactory.Instance.BlueRGB),
                    (180 * 0.01745327777,  ColorFactory.Instance.CreateRGBColor(255, 165, 0)) // Orange
                };

                foreach (var (bearing, color) in configs)
                {
                    // Create arc
                    var arc = EllipticArcBuilderEx.CreateCircularArc(
                        startPoint,
                        chordLength,
                        bearing,
                        radius,
                        ArcOrientation.ArcCounterClockwise,
                        MinorOrMajor.Minor,
                        webMercator);

                    var polyline = PolylineBuilderEx.CreatePolyline(arc);

                    // Create symbol
                    var lineSymbol = SymbolFactory.Instance.ConstructLineSymbol(color, 2.0, SimpleLineStyle.Solid);
                    var symbolRef = new CIMSymbolReference { Symbol = lineSymbol };

                    // Add overlay to map
                    MapView.Active?.AddOverlay(polyline, symbolRef);
                }

                // Optional: zoom to show the curves clearly
                MapView.Active?.ZoomTo(startPoint.Extent.Expand(1000, 1000, false), TimeSpan.FromSeconds(0.5));

            });
        }
    }
}
