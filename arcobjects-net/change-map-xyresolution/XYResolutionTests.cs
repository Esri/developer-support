using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Windows.Forms;
using System.Diagnostics;

using ESRI.ArcGIS.ArcMapUI;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Framework;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;

namespace XYResolutionTests
{
    public class XYResolutionTests : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public XYResolutionTests()
        {
        }

        protected override void OnClick()
        {
            //
            //  TODO: Sample code showing how to access button host
            //
            ArcMap.Application.CurrentTool = null;
            TestXYResolution();
        }

        public void TestXYResolution()
        {
            // Map layer.
            IMap map = (ArcMap.Application.Document as IMxDocument).FocusMap;

            // Map spatial reference and domain extent values.
            ISpatialReference mapSpatialReference = map.SpatialReference as ISpatialReference;
            double mapXMin1, mapXMax1, mapYMin1, mapYMax1;
            mapSpatialReference.GetDomain(out mapXMin1, out mapXMax1, out mapYMin1, out mapYMax1);

            // Map resolution 
            ISpatialReferenceResolution mapSpatialReferenceResolution = mapSpatialReference as ISpatialReferenceResolution;         
            double mapResolution = mapSpatialReferenceResolution.XYResolution[false];

            // Get feature class for map layers 
            IEnumLayer enumLayer = map.Layers;
            ILayer layer = enumLayer.Next();
            IFeatureLayer featureLayer = layer as IFeatureLayer;
            IFeatureClass featureClass = featureLayer.FeatureClass;
            IGeoDataset geoDataset = featureClass as IGeoDataset;

            // Feature class spatial reference and domain extent values.
            ISpatialReference datasetSpatialReference = geoDataset.SpatialReference as ISpatialReference;

            double fClassXMin, fClassXMax, fClassYMin, fClassYMax;
            datasetSpatialReference.GetDomain(out fClassXMin, out fClassXMax, out fClassYMin, out fClassYMax);

            // Feature class resolution
            ISpatialReferenceResolution datasetSRResolution = datasetSpatialReference as ISpatialReferenceResolution;
            double datasetResolution = datasetSRResolution.XYResolution[false];

            // Set map spatial reference domain extent to the feature class domain extent values
            mapSpatialReference.SetDomain(fClassXMin, fClassXMax, fClassYMin, fClassYMax);
            double mapXMin2, mapXMax2, mapYMin2, mapYMax2;
            mapSpatialReference.GetDomain(out mapXMin2, out mapXMax2, out mapYMin2, out mapYMax2);

            // New map resolution
            mapSpatialReferenceResolution = mapSpatialReference as ISpatialReferenceResolution;
            double mapResolution2 = mapSpatialReferenceResolution.XYResolution[false];

            // Show results in a message box.
            MessageBox.Show(
                $"Map Resolution Before:  {mapResolution}\n" +
                $"Dataset Resolution: {datasetResolution}\n" +
                $"Map Resolution After:  {mapResolution2}\n" +
                $"Map Domain Before -> Xmin: {mapXMin1}, XMax: {mapXMax1}, YMin: {mapYMin1}, YMax: {mapYMax1}\n" +
                $"Data Domain -> Xmin: {fClassXMin}, XMax: {fClassXMax}, YMin: {fClassYMin}, YMax: {fClassYMax}\n" +
                $"Map Domain After -> Xmin: {mapXMin2}, XMax: {mapXMax2}, YMin: {mapYMin2}, YMax: {mapYMax2}");

        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
