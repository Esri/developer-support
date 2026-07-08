using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

using Esri.ArcGISRuntime.Geometry;
using Esri.ArcGISRuntime.Mapping;
using Esri.ArcGISRuntime.Symbology;
using Esri.ArcGISRuntime.UI;

namespace DisplayAScene
{
    /// <summary>
    /// ViewModel for a 3D SceneView.
    ///
    /// This sample demonstrates:
    /// - Displaying a 3D scene with terrain elevation.
    /// - Capturing user clicks on the terrain.
    /// - Building a polyline from clicked locations.
    /// - Densifying the polyline to improve terrain sampling.
    /// - Using ApplyElevationAsync() to assign terrain heights.
    /// - Displaying both route vertices and the terrain-following route.
    /// </summary>
    class SceneViewModel : INotifyPropertyChanged
    {
        // Stores user-selected route vertices.
        private readonly List<MapPoint> _clickedPoints = new List<MapPoint>();

        // Graphic used to render the route line.
        private readonly Graphic _lineGraphic;

        // Graphics overlay used to display both the route and route vertices.
        private readonly GraphicsOverlay _drawingOverlay;

        /// <summary>
        /// Constructor.
        /// Creates the graphics overlay and route graphic.
        /// </summary>
        public SceneViewModel()
        {
            // Create an overlay that will contain
            // all user-generated graphics.
            _drawingOverlay = new GraphicsOverlay
            {
                Id = "UserDrawingOverlay"
            };

            // Render graphics relative to the terrain surface.
            // This keeps terrain-following graphics visible in a 3D scene.
            _drawingOverlay.SceneProperties.SurfacePlacement =
                SurfacePlacement.Relative;

            // Create the route graphic.
            // The geometry will be assigned later as the user clicks.
            _lineGraphic = new Graphic
            {
                Symbol = new SimpleLineSymbol(
                    SimpleLineSymbolStyle.Solid,
                    System.Drawing.Color.Red,
                    10)
            };

            // Add the route graphic to the overlay.
            _drawingOverlay.Graphics.Add(_lineGraphic);

            // Create the GraphicsOverlay collection exposed to the SceneView.
            GraphicsOverlays = new GraphicsOverlayCollection
            {
                _drawingOverlay
            };

            // Build the scene and terrain surface.
            SetupScene();
        }

        #region INotifyPropertyChanged

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged(
            [CallerMemberName] string propertyName = "")
        {
            PropertyChanged?.Invoke(
                this,
                new PropertyChangedEventArgs(propertyName));
        }

        #endregion

        #region Bindable Properties

        private Scene? _scene;

        /// <summary>
        /// Scene displayed by the SceneView.
        /// </summary>
        public Scene? Scene
        {
            get { return _scene; }
            set
            {
                _scene = value;
                OnPropertyChanged();
            }
        }

        private GraphicsOverlayCollection? _graphicsOverlays;

        /// <summary>
        /// Graphics overlays displayed by the SceneView.
        /// </summary>
        public GraphicsOverlayCollection? GraphicsOverlays
        {
            get { return _graphicsOverlays; }
            set
            {
                _graphicsOverlays = value;
                OnPropertyChanged();
            }
        }

        #endregion

        /// <summary>
        /// Creates the scene, terrain surface,
        /// and initial camera viewpoint.
        /// </summary>
        private void SetupScene()
        {
            // Create a scene using ArcGIS imagery.
            Scene scene =
                new Scene(BasemapStyle.ArcGISImageryStandard);

            // WorldElevation3D service used to provide elevation values.
            string elevationServiceUrl =
                "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";

            ArcGISTiledElevationSource elevationSource =
                new ArcGISTiledElevationSource(
                    new Uri(elevationServiceUrl));

            // Create the scene's base surface.
            Surface elevationSurface = new Surface();

            elevationSurface.ElevationSources.Add(elevationSource);

            // Increase terrain exaggeration so elevation changes
            // are easier to see during demonstrations.
            elevationSurface.ElevationExaggeration = 2.5;

            scene.BaseSurface = elevationSurface;

            // Initial camera location.
            MapPoint cameraLocation =
                new MapPoint(
                    -118.804,
                    33.909,
                    5330.0,
                    SpatialReferences.Wgs84);

            Camera sceneCamera = new Camera(
                locationPoint: cameraLocation,
                heading: 355.0,
                pitch: 72.0,
                roll: 0.0);

            // Initial scene center point (Santa Monica Mountains).
            MapPoint sceneCenterPoint =
                new MapPoint(
                    -118.805,
                    34.027,
                    SpatialReferences.Wgs84);

            Viewpoint initialViewpoint =
                new Viewpoint(sceneCenterPoint, sceneCamera);

            scene.InitialViewpoint = initialViewpoint;

            Scene = scene;
        }

        /// <summary>
        /// Adds a new user-selected point to the route.
        ///
        /// Workflow:
        /// 1. Store the clicked location.
        /// 2. Build a polyline from all clicked points.
        /// 3. Densify the polyline.
        /// 4. Sample terrain elevation for every vertex.
        /// 5. Update the displayed route graphic.
        /// </summary>
        /// <param name="clickedLocation">
        /// Map location selected by the user.
        /// </param>
        public async Task AddPointToSurfaceLineAsync(
            MapPoint clickedLocation)
        {
            if (Scene?.BaseSurface == null)
            {
                return;
            }

            // Store the X/Y coordinates of the selected location.
            // Terrain elevation will be added later.
            MapPoint point2D = new MapPoint(
                clickedLocation.X,
                clickedLocation.Y,
                clickedLocation.SpatialReference);

            _clickedPoints.Add(point2D);

            // A line requires at least two vertices.
            if (_clickedPoints.Count < 2)
            {
                await AddVertexMarkerAsync(point2D);
                return;
            }

            // Build a polyline from the collected route vertices.
            PolylineBuilder builder =
                new PolylineBuilder(point2D.SpatialReference);

            foreach (MapPoint point in _clickedPoints)
            {
                builder.AddPoint(point);
            }

            Polyline polylineWithoutZ = builder.ToGeometry();

            // Add intermediate vertices every 25 meters.
            //
            // Densification produces a smoother route and allows
            // ApplyElevationAsync() to sample the terrain more frequently.
            Polyline densePolyline =
                (Polyline)GeometryEngine.DensifyGeodetic(
                    polylineWithoutZ,
                    25,
                    LinearUnits.Meters,
                    GeodeticCurveType.Geodesic);

            // Query the terrain surface and populate z-values
            // for all vertices in the route.
            Geometry elevatedGeometry =
                await Scene.BaseSurface.ApplyElevationAsync(
                    densePolyline);

            // Update the displayed route.
            _lineGraphic.Geometry = elevatedGeometry;

            System.Diagnostics.Debug.WriteLine(
                $"Geometry type: {_lineGraphic.Geometry.GeometryType}");

            // Draw a marker at the selected vertex.
            await AddVertexMarkerAsync(point2D);
        }

        /// <summary>
        /// Displays a marker at a user-selected route vertex.
        /// </summary>
        private async Task AddVertexMarkerAsync(
            MapPoint point2D)
        {
            if (Scene?.BaseSurface == null)
            {
                return;
            }

            // Sample terrain elevation so the marker sits
            // directly on the ground surface.
            Geometry elevatedPointGeometry =
                await Scene.BaseSurface.ApplyElevationAsync(
                    point2D);

            // Create a yellow circular marker.
            SimpleMarkerSymbol markerSymbol =
                new SimpleMarkerSymbol(
                    SimpleMarkerSymbolStyle.Circle,
                    System.Drawing.Color.Yellow,
                    8.0);

            Graphic markerGraphic =
                new Graphic(
                    elevatedPointGeometry,
                    markerSymbol);

            _drawingOverlay.Graphics.Add(markerGraphic);
        }

        /// <summary>
        /// Removes all route vertices and clears the route graphic.
        /// </summary>
        public void ClearSurfaceLine()
        {
            // Reset stored vertices.
            _clickedPoints.Clear();

            // Remove all route graphics and markers.
            _drawingOverlay.Graphics.Clear();

            // Remove the route geometry.
            _lineGraphic.Geometry = null;

            // Re-add the route graphic so it can be reused.
            _drawingOverlay.Graphics.Add(_lineGraphic);
        }
    }
}