using ArcGIS.Core.CIM;
using ArcGIS.Core.Data;
using ArcGIS.Core.Geometry;
using ArcGIS.Desktop.Catalog;
using ArcGIS.Desktop.Core;
using ArcGIS.Desktop.Core.Geoprocessing;
using ArcGIS.Desktop.Editing;
using ArcGIS.Desktop.Extensions;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Dialogs;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using ArcGIS.Desktop.KnowledgeGraph;
using ArcGIS.Desktop.Layouts;
using ArcGIS.Desktop.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace geoprocessing_get_error_messages
{
    internal class GetGPErrorMessagesButton : Button
    {
        protected override async void OnClick()
        {
            // Temp parameters to on purposely throw an error.
            string in_raster = @"raster";
            string out_polygon_features = @"feature";

            // Set up the geoprocessing tool's parameter values.
            var args = Geoprocessing.MakeValueArray(in_raster, out_polygon_features);

            // The geoprocessing tool to run.
            string tool_path = "conversion.RasterToPolygon";

            System.Threading.CancellationTokenSource _cts = new System.Threading.CancellationTokenSource();

            var result2 = await Geoprocessing.ExecuteToolAsync(tool_path, args, null, _cts.Token, callback);
            // Exposing the "callback", instead of hiding it behind a lamda expression, for educational purposes.
            void callback(string event_name, object o)
            {
                switch (event_name)
                {
                    // Setup event cases.
                    case "OnValidate":
                        // Stops executing if any warnings or error messages.
                        if ((o as IGPMessage[]).Any(it => it.Type == GPMessageType.Warning))
                            _cts.Cancel();
                        // Add specific error message handling to view better information.
                        if ((o as IGPMessage[]).Any(it => it.Type == GPMessageType.Error))
                        {
                            // Get error message. It should be, "ERROR 000865: Input raster: raster does not exist."
                            string msg3 = (o as IGPMessage[]).ElementAtOrDefault(0).ToString();
                            // Show message to user.
                            System.Windows.MessageBox.Show(msg3);
                            _cts.Cancel();
                        }
                        break;
                    case "OnProgressMessage":
                        string msg = string.Format("{0}: {1}", new object[] { event_name, (string)o });
                        System.Windows.MessageBox.Show(msg);
                        _cts.Cancel();
                        break;
                    case "OnProgressPos":
                        string msg2 = string.Format("{0}: {1} %", new object[] { event_name, (int)o });
                        System.Windows.MessageBox.Show(msg2);
                        _cts.Cancel();
                        break;
                }
            }
        }
    }
}
