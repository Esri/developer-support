//Updated to C# from VBA by Brian C. and Alexander N.
using System.Collections.ObjectModel;
using System.Windows.Forms;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Framework;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Editor;

namespace PopulateCrossStreetsAddin
{
    public class PopulateCrossStreetNames : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public PopulateCrossStreetNames()
        {
        }
        //The fields that we are looking for declared as constants.
        private const string sCrossAFldName = "Cross_From";
        private const string sCrossBFldName = "Cross_To";
        private const string sStreetFldName = "Full_Stree";
        private const string sJoin = " & ";

        protected override void OnClick()
        {
            //
            //  TODO: Sample code showing how to access button host
            //
            ArcMap.Application.CurrentTool = null;

            IMap map = ArcMap.Document.ActivatedView.FocusMap;

            //Check to make sure the map contains a layer
            if (map.LayerCount < 1)
            {
                MessageBox.Show("Must have a layer in your map...");
                return;
            }

            //Get the selected layer
            ILayer selectedLayer = ArcMap.Document.SelectedLayer;
            //Checl that there is a selected layer in the table of contents
            if (selectedLayer == null)
            {
                MessageBox.Show("You must have a layer highlighted in the table of contents.");
                return;
            }
            //Check that the selected layer is a featuer layer
            if (!(selectedLayer is IFeatureLayer))
            {
                MessageBox.Show("The highlighted layer in the TOC must be a feature layer.");
                return;
            }

            IFeatureLayer featureLayer = selectedLayer as IFeatureLayer;
            IFeatureClass featureClass = featureLayer.FeatureClass;
            //Check that the features shape is a line
            if (featureClass.ShapeType != esriGeometryType.esriGeometryPolyline)
            {
                MessageBox.Show("The highlighted layer in the TOC must be a polyline.");
                return;
            }
            //Check that features are selected in the table of contents
            IFeatureSelection featureSelection = featureLayer as IFeatureSelection;
            if (featureSelection.SelectionSet.Count < 1)
            {
                MessageBox.Show("The highlighted layer in the TOC must have some features selected.");
                return;
            }

            ISelectionSet2 selectionSet = featureSelection.SelectionSet as ISelectionSet2;

            int streetFieldIndex = featureClass.FindField(sStreetFldName);
            //Check that the street name exists in the table.
            if (streetFieldIndex < 0)
            {
                MessageBox.Show(sStreetFldName + " was not found in highlighted layer.");
                return;
            }

            int crossA = featureClass.FindField(sCrossAFldName);
            //Check that the cross from field was found in the table
            if (crossA < 1)
            {
                MessageBox.Show(sCrossAFldName + " was not found in highlighted layer.");
                return;
            }
            //Check that the cross to field was found in the table
            int crossB = featureClass.FindField(sCrossBFldName);
            if (crossB < 1)
            {
                MessageBox.Show(sCrossBFldName + " was not found in highlighted layer.");
                return;
            }
            //Find the editor
            UID id = new UID();
            id.Value = "esriEditor.Editor";

            IApplication application = ArcMap.Application;
            IEditor3 editorExtension = application.FindExtensionByCLSID(id) as IEditor3;
            //Make sure that an active edit session is happening
            if (!(editorExtension.EditState == esriEditState.esriStateEditing))
            {
                MessageBox.Show("Must be in an edit session");
                return;
            }
            //Update the status bar
            application.StatusBar.Message[0] = "Populating Cross Streets...";
            editorExtension.StartOperation();
            IQueryFilter queryFilter = new QueryFilter();
            queryFilter.AddField(sCrossAFldName);
            queryFilter.AddField(sCrossBFldName);
            ICursor featureCursor;
            selectionSet.Update(null, false, out featureCursor);
            IFeature feature = featureCursor.NextRow() as IFeature;
            string total = selectionSet.Count.ToString();
            int count = 0;
            //Iterate through the features until all of the selected ones have been tested
            do
            {
                count++;
                application.StatusBar.Message[0] = "Populating cross streets... " + count.ToString() + " of " + total;
                string street = feature.Value[streetFieldIndex] as string;
                IGeometry geometry = feature.Shape;
                ICurve curve = geometry as ICurve;
                IPoint point = curve.FromPoint;
                string sCrossA = FindStreets(point, featureClass, streetFieldIndex, street, sJoin);
                point = curve.ToPoint;
                string sCrossB = FindStreets(point, featureClass, streetFieldIndex, street, sJoin);

                feature.Value[crossA] = sCrossA;
                feature.Value[crossB] = sCrossB;
                IRow row = feature;

                featureCursor.UpdateRow(feature);

                feature = featureCursor.NextRow() as IFeature;
            } while (!(feature == null));
            editorExtension.StopOperation("Populate Cross Streets");
        }

        //Start the logic for finding the cross streets.
        public string FindStreets(IPoint point, IFeatureClass featureClass, int StreetField, string StreetName, string join)
        {
            ISpatialFilter pSFilter = new SpatialFilter();
            IFeatureCursor pFCursor;
            IFeature pFeature = default(IFeature);
            Collection<string> cValues = new Collection<string>();
            string sValue = null;
            string sResult = null;
            bool bFound = false;

            pSFilter.GeometryField = featureClass.ShapeFieldName;
            pSFilter.Geometry = point;
            pSFilter.SpatialRel = esriSpatialRelEnum.esriSpatialRelIntersects;

            pFCursor = featureClass.Search(pSFilter, false);
            pFeature = pFCursor.NextFeature();
            do
            {

                sValue = (string)pFeature.Value[StreetField];
                if (sValue != StreetName)
                {
                    bFound = false;
                    for(int i = 0; i <cValues.Count; i++)
                    {
                        if (sValue == cValues[i])
                        {
                            bFound = true;
                            break;
                        }
                    }


                    if (!bFound)
                    {
                        cValues.Add(sValue);
                        if (cValues.Count == 1)
                        {
                            sResult = sValue;
                        }
                        else
                        {
                            sResult = sResult + sJoin + sValue;
                        }
                    }
                }
                pFeature = pFCursor.NextFeature();

            } while (!(pFeature == null));

            return sResult;
        }

        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
