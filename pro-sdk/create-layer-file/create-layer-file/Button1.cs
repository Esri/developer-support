using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArcGIS.Core.CIM;
using ArcGIS.Core.Data;
using ArcGIS.Core.Geometry;
using ArcGIS.Desktop.Catalog;
using ArcGIS.Desktop.Core;
using ArcGIS.Desktop.Editing;
using ArcGIS.Desktop.Extensions;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Dialogs;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using ArcGIS.Desktop.Mapping;

namespace create_layer_file
{
    internal class Button1 : Button
    {
        protected override void OnClick()
        {
            //TODO: Update this value to the path where you want the layer file saved
            string layerfilePath = @"C:\Temp";
            CreateLYRXAsync(layerfilePath);
        }

        private async void CreateLYRXAsync(string lyrxOutputPath)
        {
            //Access an array of the selected layers in the table of contents
            IReadOnlyList<Layer> lstSelectedMapLayers = MapView.Active.GetSelectedLayers();

            //Check that end user selected layers
            if (lstSelectedMapLayers.Count == 0)
            {
                //If no layers were selected, return
                MessageBox.Show("Please select a layer in the Contents Pane.");
                return;
            }
            try
            {
                //Grab the first layer in the selected layers
                Layer selectedMapLayer = lstSelectedMapLayers[0];
                await QueuedTask.Run(() =>
                {
                    //Since creating the layer document is trying to access the CIM, this call needs to be run on the MCT
                    //These should be inside the QueuedTask.Run method

                    //Create a new layer document object from the selected layer
                    LayerDocument layerDoc = new LayerDocument(selectedMapLayer);
                    //Save this layer as a new file in the path specified above
                    layerDoc.Save(System.IO.Path.Combine(lyrxOutputPath, "TestFile.lyrx"));
                });
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }
        }
    }
}
