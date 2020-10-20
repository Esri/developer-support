using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
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
using ArcGIS.Desktop.Tests.APIHelpers.SharingDataContracts;
using System.Runtime.Serialization.Json;
using System.IO;

namespace SearchPortalTest
{
    internal class ReadWebMap : Button
    {
        protected override void OnClick()
        {
            // Create an HttpClient Object
            EsriHttpClient httpClient = new EsriHttpClient();
            
            // Web map json rest endpoint
            string webMapUrl = @"https://ess.maps.arcgis.com/sharing/rest/content/items/79d429008d7946fb98463d117aeaa4aa/data";

            try
            {
                // Get request to the web map rest endpoint
                EsriHttpResponseMessage response = httpClient.Get(webMapUrl.ToString());

                // Read the content of response object.
                string outStr = response.Content.ReadAsStringAsync().Result;

                WebMapLayerInfo webMap = null;
                // Encode response string to Unicode
                using (var ms = new MemoryStream(Encoding.Unicode.GetBytes(outStr)))
                {
                    //De-serialize the response in JSON into a usable object.
                    DataContractJsonSerializer deserializer = new DataContractJsonSerializer(typeof(WebMapLayerInfo));

                    // Read object and cast to WebMapLayerInfo
                    webMap = deserializer.ReadObject(ms) as WebMapLayerInfo;

                    MessageBox.Show("Number Operational Layers: " + webMap.operationalLayers.Count().ToString(), "Info", System.Windows.MessageBoxButton.OK,System.Windows.MessageBoxImage.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Error);
            }
        }
    }
}
