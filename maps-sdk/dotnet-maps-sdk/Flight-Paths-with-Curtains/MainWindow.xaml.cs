using Esri.ArcGISRuntime.Data;
using Esri.ArcGISRuntime.Geometry;
using Esri.ArcGISRuntime.Mapping;
using Esri.ArcGISRuntime.Symbology;
using Esri.ArcGISRuntime.UI;
using Esri.ArcGISRuntime.UI.Controls;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;

using DrawingColor = System.Drawing.Color;

namespace DisplayAScene
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private GraphicsOverlay? _flightOverlay;
        private GraphicsOverlay? _curtainOverlay;

        private Graphic? _selectedFlightPathGraphic;

        private readonly Dictionary<Graphic, List<MapPoint>> _flightPathPoints =
            new Dictionary<Graphic, List<MapPoint>>();

        private readonly Dictionary<Graphic, DrawingColor> _flightPathColors =
            new Dictionary<Graphic, DrawingColor>();

        private readonly HashSet<Graphic> _routesWithCurtains = new();

        public MainWindow()
        {
            InitializeComponent();

            Loaded += MainWindow_Loaded;
            MainSceneView.GeoViewTapped += MainSceneView_GeoViewTapped;
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            AddFlightPaths();

            _curtainOverlay = new GraphicsOverlay();

            _curtainOverlay.SceneProperties.SurfacePlacement =
                SurfacePlacement.Relative;

            MainSceneView.GraphicsOverlays.Add(_curtainOverlay);
        }


        /// <summary>
        /// Creates the flight path graphics that are displayed
        /// in the scene at application startup.
        /// </summary>
        private void AddFlightPaths()
        {
            _flightOverlay = new GraphicsOverlay();

            _flightOverlay.SceneProperties.SurfacePlacement =
                SurfacePlacement.Relative;

            MainSceneView.GraphicsOverlays.Add(_flightOverlay);

            //------------------------------------------------------
            // RED
            // LA -> NEW YORK
            //------------------------------------------------------

            List<MapPoint> newYorkPath =
                GenerateFlightPath(
                    -118.2437,
                    34.0522,
                    -74.0060,
                    40.7128,
                    12000,
                    40,
                    2.0);

            AddFlightPath(
                _flightOverlay,
                DrawingColor.Red,
                newYorkPath,
                "LA to New York");

            //------------------------------------------------------
            // BLUE
            // LA -> CHICAGO
            //------------------------------------------------------

            List<MapPoint> chicagoPath =
                GenerateFlightPath(
                    -118.2437,
                    34.0522,
                    -87.6298,
                    41.8781,
                    12000,
                    28,
                    1.5);

            AddFlightPath(
                _flightOverlay,
                DrawingColor.Blue,
                chicagoPath,
                "LA to Chicago");

            //------------------------------------------------------
            // YELLOW
            // LA -> MIAMI
            //------------------------------------------------------

            List<MapPoint> miamiPath =
                GenerateFlightPath(
                    -118.2437,
                    34.0522,
                    -80.1918,
                    25.7617,
                    12000,
                    38,
                    -2.0);

            AddFlightPath(
                _flightOverlay,
                DrawingColor.Yellow,
                miamiPath,
                "LA to Miami");
        }


        /// <summary>
        /// Creates a polyline graphic representing a flight route
        /// and adds it to the flight overlay.
        /// </summary>
        private void AddFlightPath(
            GraphicsOverlay overlay,
            DrawingColor color,
            List<MapPoint> points,
            string routeName)
        {
            // Build a polyline from the supplied vertices.
            PolylineBuilder builder =
                new PolylineBuilder(SpatialReferences.Wgs84);

            foreach (MapPoint point in points)
            {
                builder.AddPoint(point);
            }

            Polyline polyline = builder.ToGeometry();

            SimpleLineSymbol symbol =
                new SimpleLineSymbol(
                    SimpleLineSymbolStyle.Solid,
                    color,
                    5);

            Graphic graphic =
                new Graphic(polyline, symbol);

            graphic.Attributes["RouteName"] = routeName;

            overlay.Graphics.Add(graphic);

            // Save route metadata for future selection and
            // curtain generation operations.
            _flightPathPoints[graphic] = points;
            _flightPathColors[graphic] = color;
        }

        /// <summary>
        /// Generates a synthetic flight path between two cities.
        /// The route includes climb, cruise, and descent phases,
        /// as well as a horizontal curve to avoid appearing as a
        /// perfectly straight line.
        /// </summary>
        private List<MapPoint> GenerateFlightPath(
            double startLon,
            double startLat,
            double endLon,
            double endLat,
            double cruiseAltitude,
            int vertexCount,
            double curveAmplitudeDegrees)
        {
            List<MapPoint> points = new List<MapPoint>();

            for (int i = 0; i <= vertexCount; i++)
            {
                // Normalized distance along the route.
                double t = (double)i / vertexCount;

                double lon =
                    startLon + ((endLon - startLon) * t);

                double lat =
                    startLat + ((endLat - startLat) * t);

                // Apply a sinusoidal curve to simulate route
                // deviations caused by air traffic or weather.
                lat += Math.Sin(t * Math.PI * 2.0)
                     * curveAmplitudeDegrees;

                double altitude;

                // Simulate a typical flight profile:
                //
                // 0-20%   = climb
                // 20-80%  = cruise
                // 80-100% = descent
                if (t < 0.20)
                {
                    // Climb during first 20 percent of route.
                    altitude =
                        cruiseAltitude * (t / 0.20);
                }
                else if (t > 0.80)
                {
                    // Descend during final 20 percent of route.
                    altitude =
                        cruiseAltitude *
                        ((1.0 - t) / 0.20);
                }
                else
                {
                    // Cruise, with a small altitude variation.
                    altitude =
                        cruiseAltitude +
                        (Math.Sin(t * Math.PI * 8.0) * 300.0);
                }

                points.Add(
                    new MapPoint(
                        lon,
                        lat,
                        altitude,
                        SpatialReferences.Wgs84));
            }

            return points;
        }

        /// <summary>
        /// Handles mouse clicks in the scene and determines
        /// whether a flight route was selected.
        /// </summary>
        private async void MainSceneView_GeoViewTapped(
            object sender,
            GeoViewInputEventArgs e)
        {
            if (_flightOverlay == null)
            {
                return;
            }

            // Perform a hit-test against the flight overlay.
            IdentifyGraphicsOverlayResult identifyResult =
                await MainSceneView.IdentifyGraphicsOverlayAsync(
                    _flightOverlay,
                    e.Position,
                    20,
                    false);

            Graphic? clickedGraphic =
                identifyResult.Graphics.FirstOrDefault();

            if (clickedGraphic == null)
            {
                ClearSelectedFlightPath();
                return;
            }

            SelectFlightPath(clickedGraphic);
        }


        /// <summary>
        /// Highlights the selected route.
        /// </summary>
        private void SelectFlightPath(Graphic selectedGraphic)
        {
            ClearSelectedFlightPath();

            _selectedFlightPathGraphic = selectedGraphic;

            // Draw a thicker white line to indicate selection.
            SimpleLineSymbol selectedSymbol =
                new SimpleLineSymbol(
                    SimpleLineSymbolStyle.Solid,
                    DrawingColor.White,
                    8);

            selectedGraphic.Symbol = selectedSymbol;
        }


        /// <summary>
        /// Restores the appearance of the previously selected route.
        /// </summary>
        private void ClearSelectedFlightPath()
        {
            if (_selectedFlightPathGraphic == null)
            {
                return;
            }

            if (_flightPathColors.TryGetValue(
                    _selectedFlightPathGraphic,
                    out DrawingColor originalColor))
            {
                _selectedFlightPathGraphic.Symbol =
                    new SimpleLineSymbol(
                        SimpleLineSymbolStyle.Solid,
                        originalColor,
                        5);
            }

            _selectedFlightPathGraphic = null;
        }

        /// <summary>
        /// Creates a terrain curtain beneath the currently
        /// selected flight path.
        /// </summary>
        private void CreateCurtainButton_Click(
            object sender,
            RoutedEventArgs e)
        {

            // Prevent creating duplicate curtains for the same route.
            if (_routesWithCurtains.Contains(
                    _selectedFlightPathGraphic))
            {
                return;
            }


            if (_selectedFlightPathGraphic == null)
            {
                MessageBox.Show(
                    "Click a flight path first, then click Create Curtain.",
                    "No flight path selected",
                    MessageBoxButton.OK,
                    MessageBoxImage.Information);

                return;
            }

            // Retrieve the source vertices used by the selected route.
            if (!_flightPathPoints.TryGetValue(
                    _selectedFlightPathGraphic,
                    out List<MapPoint>? selectedPoints))
            {
                return;
            }

            CreateCurtainForSelectedFlightPath(selectedPoints);
        }

        /// <summary>
        /// Calculates the approximate distance in kilometers between two
        /// WGS84 map points using the haversine formula.
        /// </summary>
        private double CalculateDistanceKilometers(
            MapPoint pointA,
            MapPoint pointB)
        {
            const double earthRadiusKm = 6371.0;

            double lat1Radians = DegreesToRadians(pointA.Y);
            double lat2Radians = DegreesToRadians(pointB.Y);

            double deltaLatRadians =
                DegreesToRadians(pointB.Y - pointA.Y);

            double deltaLonRadians =
                DegreesToRadians(pointB.X - pointA.X);

            double a =
                Math.Sin(deltaLatRadians / 2.0) *
                Math.Sin(deltaLatRadians / 2.0) +
                Math.Cos(lat1Radians) *
                Math.Cos(lat2Radians) *
                Math.Sin(deltaLonRadians / 2.0) *
                Math.Sin(deltaLonRadians / 2.0);

            double c =
                2.0 * Math.Atan2(
                    Math.Sqrt(a),
                    Math.Sqrt(1.0 - a));

            return earthRadiusKm * c;
        }

        /// <summary>
        /// Converts degrees to radians.
        /// </summary>
        private double DegreesToRadians(double degrees)
        {
            return degrees * Math.PI / 180.0;
        }

        /// <summary>
        /// Interpolates a new MapPoint between two existing MapPoints.
        /// Longitude, latitude, and altitude are all interpolated.
        /// </summary>
        /// <param name="start">
        /// Start point of the segment.
        /// </param>
        /// <param name="end">
        /// End point of the segment.
        /// </param>
        /// <param name="t">
        /// Normalized position along the segment.
        /// 0 means start point, 1 means end point.
        /// </param>
        private MapPoint InterpolateMapPoint(
            MapPoint start,
            MapPoint end,
            double t)
        {
            double lon =
                start.X + ((end.X - start.X) * t);

            double lat =
                start.Y + ((end.Y - start.Y) * t);

            double z =
                start.Z + ((end.Z - start.Z) * t);

            return new MapPoint(
                lon,
                lat,
                z,
                SpatialReferences.Wgs84);
        }

        /// <summary>
        /// Creates a new list of curtain vertices spaced approximately every
        /// specified number of kilometers along the flight path.
        ///
        /// This is better than simply creating a fixed number of extra points
        /// between every pair of vertices because it avoids over-densifying
        /// parts of the route where vertices are already close together,
        /// such as sharp turns.
        /// </summary>
        /// <param name="sourcePoints">
        /// Original vertices defining the flight path.
        /// </param>
        /// <param name="spacingKilometers">
        /// Desired distance between curtain vertices, in kilometers.
        /// For this project, 25 km gives roughly four curtain panels
        /// per original 100 km route segment.
        /// </param>
        /// <returns>
        /// A new list of MapPoints spaced approximately every spacingKilometers
        /// along the route.
        /// </returns>
        private List<MapPoint> CreateCurtainPointsEveryKilometers(
            List<MapPoint> sourcePoints,
            double spacingKilometers)
        {
            List<MapPoint> curtainPoints = new List<MapPoint>();

            // A route needs at least two points to create a curtain.
            if (sourcePoints == null || sourcePoints.Count < 2)
            {
                return curtainPoints;
            }

            // Always include the first point of the route.
            curtainPoints.Add(sourcePoints[0]);

            // This value tracks how far we have traveled since the
            // last curtain point was created.
            double distanceSinceLastCurtainPoint = 0.0;

            for (int i = 0; i < sourcePoints.Count - 1; i++)
            {
                MapPoint segmentStart = sourcePoints[i];
                MapPoint segmentEnd = sourcePoints[i + 1];

                // Calculate the approximate surface distance between the two
                // route vertices using their latitude and longitude.
                double segmentLengthKm =
                    CalculateDistanceKilometers(
                        segmentStart,
                        segmentEnd);

                // If two points are extremely close together, skip the segment.
                if (segmentLengthKm <= 0.0)
                {
                    continue;
                }

                // This tracks how far along the current segment we have moved.
                double distanceAlongSegmentKm = 0.0;

                while (distanceSinceLastCurtainPoint +
                       (segmentLengthKm - distanceAlongSegmentKm) >= spacingKilometers)
                {
                    // Determine how much farther along this segment we need
                    // to travel before placing the next curtain point.
                    double remainingDistanceNeededKm =
                        spacingKilometers - distanceSinceLastCurtainPoint;

                    distanceAlongSegmentKm += remainingDistanceNeededKm;

                    // Convert the distance along this segment into a normalized
                    // interpolation value between 0 and 1.
                    double t =
                        distanceAlongSegmentKm / segmentLengthKm;

                    // Create a new point along the segment.
                    MapPoint newCurtainPoint =
                        InterpolateMapPoint(
                            segmentStart,
                            segmentEnd,
                            t);

                    curtainPoints.Add(newCurtainPoint);

                    // Reset the distance counter because a new curtain point
                    // was just placed.
                    distanceSinceLastCurtainPoint = 0.0;
                }

                // Add the leftover part of this segment to the distance counter.
                distanceSinceLastCurtainPoint +=
                    segmentLengthKm - distanceAlongSegmentKm;
            }

            // Always include the final destination point if it was not already added.
            MapPoint finalPoint = sourcePoints[sourcePoints.Count - 1];

            if (curtainPoints.Count == 0 ||
                curtainPoints[curtainPoints.Count - 1] != finalPoint)
            {
                curtainPoints.Add(finalPoint);
            }

            return curtainPoints;
        }


        /// <summary>
        /// Creates a semi-transparent curtain extending from
        /// the selected flight path down beneath the terrain.
        /// </summary>

        private void CreateCurtainForSelectedFlightPath(
            List<MapPoint> flightPathPoints)
        {
            if (_curtainOverlay == null)
            {
                return;
            }


            // Extend the curtain well below the terrain surface.
            // This ensures that the curtain visually reaches the
            // ground even in steep terrain or highly exaggerated
            // elevation scenes.
            const double curtainBottomZ = -12000.0;

            // Create curtain vertices at approximately fixed distance intervals.
            // This produces one curtain panel about every 25 kilometers instead
            // of blindly subdividing every original flight path segment.
            List<MapPoint> densePoints =
                CreateCurtainPointsEveryKilometers(
                    flightPathPoints,
                    25.0);

            DrawingColor routeColor =
                _flightPathColors[_selectedFlightPathGraphic];

            DrawingColor fillColor =
                DrawingColor.FromArgb(
                    70,
                    routeColor.R,
                    routeColor.G,
                    routeColor.B);

            DrawingColor outlineColor =
                DrawingColor.FromArgb(
                    180,
                    routeColor.R,
                    routeColor.G,
                    routeColor.B);

            SimpleLineSymbol outlineSymbol =
                new SimpleLineSymbol(
                    SimpleLineSymbolStyle.Solid,
                    outlineColor,
                    1);

            SimpleFillSymbol fillSymbol =
                new SimpleFillSymbol(
                    SimpleFillSymbolStyle.Solid,
                    fillColor,
                    outlineSymbol);


            SimpleLineSymbol ribSymbol =
                new SimpleLineSymbol(
                    SimpleLineSymbolStyle.Solid,
                    DrawingColor.FromArgb(
                        220,
                        routeColor.R,
                        routeColor.G,
                        routeColor.B),
                    1);


            // Create a rectangular polygon between each pair of
            // route vertices. Together these polygons form the
            // curtain surface.
            for (int i = 0; i < densePoints.Count - 1; i++)
            {
                MapPoint topStart = densePoints[i];
                MapPoint topEnd = densePoints[i + 1];

                MapPoint bottomEnd =
                    new MapPoint(
                        topEnd.X,
                        topEnd.Y,
                        curtainBottomZ,
                        SpatialReferences.Wgs84);

                MapPoint bottomStart =
                    new MapPoint(
                        topStart.X,
                        topStart.Y,
                        curtainBottomZ,
                        SpatialReferences.Wgs84);

                PolygonBuilder polygonBuilder =
                    new PolygonBuilder(SpatialReferences.Wgs84);

                polygonBuilder.AddPoint(topStart);
                polygonBuilder.AddPoint(topEnd);
                polygonBuilder.AddPoint(bottomEnd);
                polygonBuilder.AddPoint(bottomStart);
                polygonBuilder.AddPoint(topStart);

                Polygon curtainPanel =
                    polygonBuilder.ToGeometry();

                Graphic panelGraphic =
                    new Graphic(
                        curtainPanel,
                        fillSymbol);

                _curtainOverlay.Graphics.Add(panelGraphic);
            }


            // Add vertical rib lines at every curtain vertex.
            // These ribs improve visibility and create the
            // lattice-like appearance of the curtain.
            foreach (MapPoint topPoint in densePoints)
            {
                MapPoint bottomPoint =
                    new MapPoint(
                        topPoint.X,
                        topPoint.Y,
                        curtainBottomZ,
                        SpatialReferences.Wgs84);

                PolylineBuilder ribBuilder =
                    new PolylineBuilder(SpatialReferences.Wgs84);

                ribBuilder.AddPoint(topPoint);
                ribBuilder.AddPoint(bottomPoint);

                Graphic ribGraphic =
                    new Graphic(
                        ribBuilder.ToGeometry(),
                        ribSymbol);

                _curtainOverlay.Graphics.Add(ribGraphic);
            }

            // Mark this route as having an existing curtain.
            _routesWithCurtains.Add(
                _selectedFlightPathGraphic);

        }


    }


}