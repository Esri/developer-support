// Copyright 2013 ESRI
// 
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
// 
// You may freely redistribute and use this sample code, with or
// without modification, provided you include the original copyright
// notice and use restrictions.
// 
// See the use restrictions at <your ArcGIS install location>/DeveloperKit10.2/userestrictions.txt.
// 

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Collections.Specialized;

using System.Runtime.InteropServices;

using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Server;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.SOESupport;
using ESRI.ArcGIS.Display;

namespace NetSimpleRESTSOE
{
    [ComVisible(true)]
    [Guid("592d9b60-bb6f-49f9-9429-e9c720bca615")]
    [ClassInterface(ClassInterfaceType.None)]
    [ServerObjectExtension("MapServer",
        AllCapabilities = "",
        DefaultCapabilities = "",
        Description = ".NET Simple REST SOE Sample",
        DisplayName = ".NET Simple REST SOE",
        Properties = "",
        SupportsREST = true,
        SupportsSOAP = false)]
    public class NetSimpleRESTSOE : IServerObjectExtension, IRESTRequestHandler
    {
        private string soeName;
        private IServerObjectHelper soHelper;
        private ServerLogger serverLog;
        private IRESTRequestHandler _reqHandler;
        private IMapServerDataAccess mapServerDataAccess;
        private IMapLayerInfos layerInfos;
        private IMapServer3 ms;
        private IMapServerInfo mapServerInfo;
        private IMapDescription3 mapDesc;

        public NetSimpleRESTSOE()
        {
            soeName = this.GetType().Name;
            _reqHandler = new SoeRestImpl(soeName, CreateRestSchema()) as IRESTRequestHandler;
        }

        public void Init(IServerObjectHelper pSOH) 
        {
            this.soHelper = pSOH;
            this.serverLog = new ServerLogger();
            this.mapServerDataAccess = (IMapServerDataAccess) this.soHelper.ServerObject;
            ms = (IMapServer3) this.mapServerDataAccess;
            mapServerInfo = ms.GetServerInfo(ms.DefaultMapName);
            this.layerInfos = mapServerInfo.MapLayerInfos;
            this.mapDesc = (IMapDescription3)mapServerInfo.DefaultMapDescription;

            serverLog.LogMessage(ServerLogger.msgType.infoStandard, this.soeName + ".init()", 200, "Initialized " + this.soeName + " SOE.");
        }

        public void Shutdown() 
        {
            serverLog.LogMessage(ServerLogger.msgType.infoStandard, this.soeName + ".init()", 200, "Shutting down " + this.soeName + " SOE.");
            this.soHelper = null;
            this.serverLog = null;
            this.mapServerDataAccess = null;
            this.layerInfos = null;
        }

        private RestResource CreateRestSchema()
        {
            RestResource soeResource = new RestResource(soeName, false, RootResHandler);

            RestResource layerResource = new RestResource("layers", false, LayersResHandler);
            soeResource.resources.Add(layerResource);

            RestOperation getLayerCountByTypeOp = new RestOperation("getLayerCountByType",
                                                      new string[] { "addlayer" },
                                                      new string[] { "json" },
                                                      getLayerCountByType);
            soeResource.operations.Add(getLayerCountByTypeOp);
            return soeResource;
        }

        public string GetSchema()
        {
            return _reqHandler.GetSchema();
        }

        byte[] IRESTRequestHandler.HandleRESTRequest(string Capabilities,
            string resourceName,
            string operationName,
            string operationInput,
            string outputFormat,
            string requestProperties,
            out string responseProperties)
        {
            return _reqHandler.HandleRESTRequest(Capabilities, resourceName, operationName, operationInput, outputFormat, requestProperties, out responseProperties);
        }

        private byte[] RootResHandler(System.Collections.Specialized.NameValueCollection boundVariables,
            string outputFormat,
            string requestProperties,
            out string responseProperties)
        {
            responseProperties = null; 
    
            JSONObject json = new JSONObject();
	        json.AddString("name", ".Net Simple REST SOE");
	        json.AddString("description", "Simple REST SOE with 1 sub-resource called \"layers\" and 1 operation called \"getLayerCountByType\".");
	        json.AddString("usage", "The \"layers\" subresource returns all layers in the map service.\n"
			    + "The \"getLayerCountByType\" operation returns a count of layer of specified type. It accepts one of the following values as input: \"feature\", \"raster\", "
			    + "\"dataset\", and \"all\".");
	        return Encoding.UTF8.GetBytes(json.ToJSONString(null));
        }

        private byte[] LayersResHandler(NameValueCollection boundVariables, string outputFormat, string requestProperties, out string responseProperties)
        {
            responseProperties = "{\"Content-Type\" : \"application/json\"}";

            JSONArray layersArray = new JSONArray();
            for (int i = 0; i < this.layerInfos.Count; i++)
            {
                IMapLayerInfo layerInfo = layerInfos.get_Element(i);
                JSONObject jo = new JSONObject();
                jo.AddString("name", layerInfo.Name);
                jo.AddLong("id", layerInfo.ID);
                jo.AddBoolean("addlayer", false);
                jo.AddString("description", layerInfo.Description);
              
                layersArray.AddJSONObject(jo);
            }

            JSONObject result = new JSONObject();
            result.AddJSONArray("layers", layersArray);
            return Encoding.UTF8.GetBytes(result.ToJSONString(null));
        }

        private byte[] getLayerCountByType(System.Collections.Specialized.NameValueCollection boundVariables,
            ESRI.ArcGIS.SOESupport.JsonObject operationInput,
            string outputFormat,
            string requestProperties,
            out string responseProperties) 
        {
            IMapImage mapImage = null;

            bool? shouldAdd = null;
            operationInput.TryGetAsBoolean("addlayer", out shouldAdd);

            if (shouldAdd.HasValue)
            {
                if ((bool)shouldAdd)
                {
                    if (((IMapServerInfo4)mapServerInfo).SupportsDynamicLayers)
                    {
                        IRgbColor color = new RgbColor(){ Blue = 255};

                        ISimpleLineSymbol outline = new SimpleLineSymbol(){ 
                            Color = color, 
                            Width = 1, 
                            Style = esriSimpleLineStyle.esriSLSSolid
                        };

                        ISimpleFillSymbol sfs = new SimpleFillSymbol(){ 
                            Color = color, 
                            Outline = outline, 
                            Style = esriSimpleFillStyle.esriSFSSolid
                        };
                        
                        ISimpleRenderer sr = new SimpleRenderer(){ Symbol = (ISymbol)sfs };

                        IFeatureLayerDrawingDescription featureLayerDrawingDesc = new FeatureLayerDrawingDescription(){
                            FeatureRenderer = (IFeatureRenderer)sr
                        };

                        IMapServerSourceDescription mapServerSourceDesc = new TableDataSourceDescriptionClass();
                        ((IDataSourceDescription)mapServerSourceDesc).WorkspaceID = "MyFGDB";
                        ((ITableDataSourceDescription)mapServerSourceDesc).TableName = "B";

                        IDynamicLayerDescription dynamicLayerDesc = new LayerDescriptionClass(){
                            ID = 3,
                            Visible = true,
                            DrawingDescription = (ILayerDrawingDescription)featureLayerDrawingDesc,
                            Source = mapServerSourceDesc
                        };

                        mapDesc.HonorLayerReordering = true;
                        mapDesc.LayerDescriptions.Insert(0, (ILayerDescription)dynamicLayerDesc);

                        mapImage = exportMap();
                    }    
                }
                else
                {
                    mapImage = exportMap();
                }
            }
            responseProperties = null; 
  
        	JSONObject json = new JSONObject();
            json.AddString("URL", mapImage.URL);
            return Encoding.UTF8.GetBytes(json.ToJSONString(null));
        }

        private IMapImage exportMap()
        {
            //export the map using the current map description
            IImageType imageType = new ImageType()
            {
                Format = esriImageFormat.esriImagePNG32,
                ReturnType = esriImageReturnType.esriImageReturnURL
            };

            ImageDisplay id = new ImageDisplay()
            {
                Height = 400,
                Width = 400,
                DeviceResolution = 150
            };

            //sample has this from ImageDisplay also
            IImageDescription idesc = new ImageDescriptionClass();
            idesc.Display = id;
            idesc.Type = imageType;

            return ((IMapServer4)ms).ExportMapImage((IMapDescription)mapDesc, idesc);
        }

        private byte[] createErrorObject(int codeNumber, String errorMessageSummary, String[] errorMessageDetails)
        {
            if (errorMessageSummary.Length == 0 || errorMessageSummary == null)
            {
                throw new Exception("Invalid error message specified.");
            }

            JSONObject errorJSON = new JSONObject();
            errorJSON.AddLong("code", codeNumber);
            errorJSON.AddString("message", errorMessageSummary);

            if (errorMessageDetails == null)
            {
                errorJSON.AddString("details", "No error details specified.");
            }
            else
            {
                String errorMessages = "";
                for (int i = 0; i < errorMessageDetails.Length; i++)
                {
                    errorMessages = errorMessages + errorMessageDetails[i] + "\n";
                }

                errorJSON.AddString("details", errorMessages);
            }

            JSONObject error = new JSONObject();
            errorJSON.AddJSONObject("error", errorJSON);

            return Encoding.UTF8.GetBytes(errorJSON.ToJSONString(null));
        }
    }
}
