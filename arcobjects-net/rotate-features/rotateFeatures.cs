using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.IO;
using System.Windows.Forms;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Editor;
using ESRI.ArcGIS.Framework;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;

namespace ArcMapAddin1
{
    public class Button1 : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public Button1()
        {
        }
        protected override void OnClick()
        {
            //
            //  TODO: Sample code showing how to access button host
            //
            

            UID id = new UID();
            id.Value = "esriEditor.Editor";

            IApplication application = ArcMap.Application;
            IEditor editor = application.FindExtensionByCLSID(id) as IEditor;
            if (editor.EditState != esriEditState.esriStateEditing)
            {
                MessageBox.Show("MUST BE IN EDIT SESSION");
                return;
            }
            editor.StartOperation();
            for (int i = 0; i < ArcMap.Document.ActiveView.FocusMap.LayerCount; i++)
            {
                if (ArcMap.Document.ActiveView.FocusMap.Layer[i] is IFeatureLayer)
                {
                    IFeatureLayer layer = (IFeatureLayer)ArcMap.Document.ActiveView.FocusMap.Layer[i];
                    IFeatureSelection featureSelection = layer as IFeatureSelection;
                    if (featureSelection.SelectionSet.Count > 0)
                    {
                        ISelectionSet selectionSet = featureSelection.SelectionSet as ISelectionSet2;
                        IFeature feature;
                        IEnumFeature features = editor.EditSelection;
                        while ((feature = features.Next()) != null)
                        {
                            IPoint point = new Point
                            {
                                X = (((feature.Shape.Envelope.XMax + feature.Shape.Envelope.XMin)/2.0)),
                                Y = (((feature.Shape.Envelope.YMax + feature.Shape.Envelope.YMin)/2.0)),
                                SpatialReference = feature.Shape.SpatialReference
                            };
                            Double radians = .5*Math.PI;
                            IGeometry geometry = feature.ShapeCopy;
                            ((ITransform2D)geometry).Rotate(point ,radians);
                            feature.Shape = geometry;
                            feature.Store();
                        }
                    }
                }
            }
            editor.StopOperation("DONE");
            ArcMap.Document.ActiveView.Refresh();
            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }
}
