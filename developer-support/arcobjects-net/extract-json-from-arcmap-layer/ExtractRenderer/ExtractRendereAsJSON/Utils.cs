using ESRI.ArcGIS.Server;
using ESRI.ArcGIS.GISClient;
using ESRI.ArcGIS.Geoprocessor;
using ESRI.ArcGIS.Geoprocessing;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Display;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Windows;

namespace ExtractRendereAsJSON
{
    class Utils
    {
        public static string ConvertMXDToMSD(string mxdfile, string convertMXDtoMSDtoolboxPath)
        {
            if (!File.Exists(convertMXDtoMSDtoolboxPath))
            {
                MessageBox.Show(string.Format("GP Toolbox {0} to convert mxd to msd is not found", convertMXDtoMSDtoolboxPath), "Convert MXD to MSD", MessageBoxButton.OK, MessageBoxImage.Error);
                return null;
            }

            Geoprocessor gp = new Geoprocessor()
            {
                OverwriteOutput = true
            };
            gp.AddToolbox(convertMXDtoMSDtoolboxPath);
            IVariantArray gpparams = new VarArrayClass();
            gpparams.Add(mxdfile);

            IGeoProcessorResult gpresult = null;
            try
            {
                gpresult = gp.Execute(Properties.Settings.Default.toolname, gpparams, null) as IGeoProcessorResult;
            }
            catch (Exception)
            {
                object sev = 2;
                System.Windows.MessageBox.Show(gp.GetMessages(ref sev));
                return null;
            }

            string msdfile = ((IGPString)gpresult.GetOutput(0)).Value;
            //MessageBox.Show(msdfile);

            gp = null;
            gpresult = null;

            return msdfile;
        }

        /// <summary>
        /// co-create optimized mapserver.
        /// </summary>
        /// <param name="msdfile"></param>
        public static IMapServer ConstructMapServer(String msdfile)
        {
            try
            {
                IMapServer pMapServer = Activator.CreateInstance(Type.GetTypeFromProgID("esriCartoX.MapServerX")) as IMapServer;
                IMapServerInit2 mapServerInit = (IMapServerInit2)pMapServer;
                mapServerInit.PhysicalOutputDirectory = System.IO.Path.GetTempPath();
                mapServerInit.VirtualOutputDirectory = System.IO.Path.GetTempPath();
                mapServerInit.Connect(msdfile);
                return pMapServer;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error CoCreating MapServer objection" + Environment.NewLine + ex.Message);
                return null;
            }

        }

        /// <summary>
        /// Extracts renderer information from a layer resource
        /// </summary>
        /// <param name="layerResource">json representation of layer</param>
        /// <returns></returns>
        public static string GetRendererFromLayer(String layerResource)
        {
            String jsonRenderer = "";
            IJSONObject jObject = new JSONObject();
            jObject.ParseString(layerResource);

            IJSONObject joDrawingInfo = new JSONObject();
            jObject.TryGetValueAsObject("drawingInfo", out joDrawingInfo);

            //if no drawingInfo found, say for group layers
            if (joDrawingInfo == null)
                return jsonRenderer;

            jsonRenderer = joDrawingInfo.ToJSONString(null);
            return jsonRenderer;
        }

        /// <summary>
        /// Retrieve layers resource from map server
        /// </summary>
        /// <returns></returns>
        public static String GetLayersResource(IMapServer pMapServer)
        {
            String resourceName =  "layers";
            String operationName = "";
            String operationInput = "";
            String restOutput = HandleRESTRequest(pMapServer, resourceName, operationName, operationInput);
            return restOutput;
        }

        /// <summary>
        /// rest request handler on mapserver.
        /// </summary>
        /// <param name="resourceName">resource name</param>
        /// <param name="operationName">operation name</param>
        /// <param name="operationInput">operation input - json string.</param>
        /// <returns></returns>
        private static String HandleRESTRequest(IMapServer pMapServer, String resourceName, String operationName, String operationInput)
        {
            IRESTRequestHandler restHandler = (IRESTRequestHandler)pMapServer;
            String requestProperties = "";
            String outputFormat = "";
            String responseProperties;
            String capabilities = "map,query,data";
            byte[] restRequestOutput = restHandler.HandleRESTRequest(capabilities, resourceName, operationName, operationInput, outputFormat, requestProperties, out responseProperties);

            String restOutput;
            System.Text.UTF8Encoding utf8Encoding = new System.Text.UTF8Encoding();
            restOutput = utf8Encoding.GetString(restRequestOutput);
            return restOutput;
        }

        public static void DeleteMSDfile(string msdfile)
        {
            try
            {
                System.IO.File.Delete(msdfile);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string ValidateFileName(string fileName) 
        {
            char[] invalChars = System.IO.Path.GetInvalidFileNameChars();
            if (fileName.IndexOfAny(invalChars) > -1)
                foreach (char c in invalChars)
                    if (fileName.Contains(c))
                        fileName = fileName.Replace(c, '_');

            return fileName;
        }
    }
}
