// Copyright 2021 Esri
// Licensed under the Apache License, Version 2.0

using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

using Esri.ArcGISRuntime.Geometry;
using Esri.ArcGISRuntime.Mapping;

namespace DisplayAScene
{
    class SceneViewModel : INotifyPropertyChanged
    {
        public SceneViewModel()
        {
            SetupScene();
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged(
            [CallerMemberName] string propertyName = "")
        {
            PropertyChanged?.Invoke(
                this,
                new PropertyChangedEventArgs(propertyName));
        }

        private Scene? _scene;

        public Scene? Scene
        {
            get { return _scene; }
            set
            {
                _scene = value;
                OnPropertyChanged();
            }
        }

        private void SetupScene()
        {
            // Create a new scene with imagery.
            Scene scene =
                new Scene(BasemapStyle.ArcGISImageryStandard);

            // Elevation source.
            string elevationServiceUrl =
                "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";

            ArcGISTiledElevationSource elevationSource =
                new ArcGISTiledElevationSource(
                    new Uri(elevationServiceUrl));

            // Surface.
            Surface elevationSurface = new Surface();

            elevationSurface.ElevationSources.Add(
                elevationSource);

            elevationSurface.ElevationExaggeration = 2.5;

            scene.BaseSurface = elevationSurface;

            // Camera positioned far enough away
            // to see most of the continental U.S.
            MapPoint cameraLocation =
                new MapPoint(
                    -98.0,
                    39.0,
                    7000000.0,
                    SpatialReferences.Wgs84);

            Camera sceneCamera =
                new Camera(
                    locationPoint: cameraLocation,
                    heading: 0.0,
                    pitch: 0.0,
                    roll: 0.0);

            // Center of United States.
            MapPoint sceneCenterPoint =
                new MapPoint(
                    -98.0,
                    39.0,
                    SpatialReferences.Wgs84);

            Viewpoint initialViewpoint =
                new Viewpoint(
                    sceneCenterPoint,
                    sceneCamera);

            scene.InitialViewpoint =
                initialViewpoint;

            Scene = scene;
        }
    }
}