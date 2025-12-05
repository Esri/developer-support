using System;
using System.Net.Http;
using System.Collections.Specialized;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Server;
using ESRI.Server.SOESupport;

namespace seeEditInfo
{
    /// <summary>
    /// Server Object Extension (SOE) that:
    /// 1. Discovers its own REST URL at runtime using IServerEnvironment2.Properties.
    /// 2. Converts the MapServer URL to the corresponding FeatureServer URL.
    /// 3. Calls the FeatureServer layer's REST endpoint to read editFieldsInfo
    ///    (editor tracking field names).
    /// 4. Uses those field names to pull the actual editor-tracking values
    ///    for a given feature from the underlying feature class.
    ///
    /// Exposed REST operation:
    ///   /exts/seeEditInfo/logEditInfo?layerId=0&objectId=1&f=json
    /// </summary>
    [ComVisible(true)]
    [Guid("f36109c9-b1e8-4c29-bb2b-dd7a0c2e929a")]
    [ClassInterface(ClassInterfaceType.None)]
    [ServerObjectExtension(
        "MapServer",
        AllCapabilities = "",
        DefaultCapabilities = "",
        Description = "",
        DisplayName = "seeEditInfo",
        Properties = "",
        SupportsREST = true,
        SupportsSOAP = false,
        SupportsSharedInstances = false)]
    public class seeEditInfo :
        IServerObjectExtension,
        IObjectConstruct,
        IRESTRequestHandler
    {
        private readonly string _soeName;
        private readonly ServerLogger _logger;

        private IServerObjectHelper _serverObjectHelper;
        private IRESTRequestHandler _reqHandler;

        // One static HttpClient per SOE instance to avoid socket exhaustion.
        private static readonly HttpClient _httpClient = new HttpClient();

        public seeEditInfo()
        {
            _soeName = GetType().Name;
            _logger = new ServerLogger();

            // SoeRestImpl wires your REST schema to the ArcGIS Server REST handler.
            // This SDK version does NOT expose AllowRequestProperties.
            _reqHandler = new SoeRestImpl(_soeName, CreateRestSchema());
        }

        #region SOE lifecycle

        /// <summary>
        /// Called by the server when the SOE is instantiated for a service.
        /// We just hang on to the helper so we can access the MapServer later.
        /// </summary>
        public void Init(IServerObjectHelper pSOH)
        {
            _serverObjectHelper = pSOH;
        }

        public void Shutdown() { }

        public void Construct(IPropertySet props) { }

        #endregion

        #region IRESTRequestHandler forwarders

        public string GetSchema()
        {
            return _reqHandler.GetSchema();
        }

        public byte[] HandleRESTRequest(
            string capabilities,
            string resourceName,
            string operationName,
            string operationInput,
            string outputFormat,
            string requestProperties,
            out string responseProperties)
        {
            // Delegate all REST plumbing to SoeRestImpl – we only care about our handlers.
            return _reqHandler.HandleRESTRequest(
                capabilities, resourceName, operationName,
                operationInput, outputFormat, requestProperties,
                out responseProperties);
        }

        #endregion

        #region REST schema

        /// <summary>
        /// Defines the SOE root resource and the logEditInfo operation.
        /// </summary>
        private RestResource CreateRestSchema()
        {
            // Root resource for /exts/seeEditInfo
            RestResource root = new RestResource(_soeName, false, RootHandler);

            // logEditInfo operation:
            // /exts/seeEditInfo/logEditInfo?layerId=&objectId=&f=json
            root.operations.Add(
                new RestOperation(
                    "logEditInfo",
                    new[] { "layerId", "objectId" },
                    new[] { "json" },
                    LogEditInfoHandler
                )
            );

            return root;
        }

        /// <summary>
        /// Simple root handler so you can hit /exts/seeEditInfo?f=json
        /// and get back a basic health check.
        /// </summary>
        private byte[] RootHandler(
            NameValueCollection boundVars,
            string outputFormat,
            string requestProps,
            out string responseProps)
        {
            responseProps = null;
            return Encoding.UTF8.GetBytes("{\"status\":\"ok\"}");
        }

        #endregion

        #region logEditInfo operation

        /// <summary>
        /// Main REST operation:
        ///  - Input:  layerId, objectId
        ///  - Output: editFieldsInfo from the FeatureServer + actual field values from the FC
        ///
        /// Steps:
        ///  1. Discover the SOE's own URL from IServerEnvironment2.Properties.
        ///  2. Convert the MapServer URL to a FeatureServer layer metadata URL.
        ///  3. Call that URL to get editFieldsInfo (field names).
        ///  4. Get the feature (OBJECTID = objectId) from the map's data source.
        ///  5. Use the editFieldsInfo names to read the editor-tracking values.
        /// </summary>
        private byte[] LogEditInfoHandler(
            NameValueCollection boundVars,
            JsonObject input,
            string outputFormat,
            string requestPropsJson,
            out string responseProps)
        {
            responseProps = null;

            // Validate & parse inputs
            if (!input.TryGetAsLong("layerId", out long? layerIdN) || layerIdN == null)
                throw new ArgumentNullException("layerId");
            if (!input.TryGetAsLong("objectId", out long? objectIdN) || objectIdN == null)
                throw new ArgumentNullException("objectId");

            int layerId = (int)layerIdN.Value;
            int objectId = (int)objectIdN.Value;

            try
            {
                // 1) Get THIS SOE's full URL from the server environment
                string soeUrl = GetSoeRequestUrl();
                if (soeUrl == null)
                    throw new Exception("Could not determine SOE request URL from environment.");

                // 2) Convert MapServer → FeatureServer for the given layer
                string layerMetadataUrl = BuildFeatureServerUrl(soeUrl, layerId);

                _logger.LogMessage(
                    ServerLogger.msgType.infoStandard,
                    "logEditInfo",
                    9001,
                    $"Fetching editFieldsInfo from: {layerMetadataUrl}");

                // 3) Download metadata: editFieldsInfo
                EditFieldsInfo editInfo = FetchEditFieldsInfo(layerMetadataUrl);
                if (editInfo == null)
                    throw new Exception("editFieldsInfo missing on FeatureServer.");

                // 4) Query feature from the MapServer data source
                var mapServer = (IMapServer)_serverObjectHelper.ServerObject;
                var da = (IMapServerDataAccess)mapServer;

                var ds = da.GetDataSource(mapServer.DefaultMapName, layerId);
                var fc = ds as IFeatureClass;
                if (fc == null)
                    throw new Exception("Layer is not a feature layer.");

                IFeature f = fc.GetFeature(objectId);

                // Resolve indices using the field names we got from editFieldsInfo
                int idxCreator = fc.FindField(editInfo.CreatorField);
                int idxCreateDate = fc.FindField(editInfo.CreationDateField);
                int idxEditor = fc.FindField(editInfo.EditorField);
                int idxEditDate = fc.FindField(editInfo.EditDateField);

                if (idxCreator < 0 || idxCreateDate < 0 || idxEditor < 0 || idxEditDate < 0)
                    throw new Exception("One or more editor-tracking fields were not found in the schema.");

                // Build response object
                var result = new
                {
                    layerId,
                    objectId,
                    editFields = editInfo,
                    creator = f.get_Value(idxCreator),
                    creationDate = f.get_Value(idxCreateDate),
                    editor = f.get_Value(idxEditor),
                    editDate = f.get_Value(idxEditDate)
                };

                return Encoding.UTF8.GetBytes(JsonSerializer.Serialize(result));
            }
            catch (Exception ex)
            {
                _logger.LogMessage(
                    ServerLogger.msgType.error,
                    "logEditInfo",
                    9999,
                    ex.ToString());

                var errorPayload = new
                {
                    status = "error",
                    message = ex.Message
                };

                return Encoding.UTF8.GetBytes(JsonSerializer.Serialize(errorPayload));
            }
        }

        #endregion

        #region URL reconstruction using IServerEnvironment2.Properties

        /// <summary>
        /// Reads IServerEnvironment2.Properties and finds the entry that contains
        /// this SOE's full REST URL, e.g.:
        ///
        ///   https://host/arcgis/rest/services/EditorTrackingTest/MapServer/exts/seeEditInfo
        ///
        /// The properties bag includes many URLs; we look for ones containing
        /// "/MapServer/exts/" and, if possible, our SOE name.
        /// </summary>
        private string GetSoeRequestUrl()
        {
            // This works in the Enterprise SDK – no legacy ArcObjects EnvironmentManager.
            IServerEnvironment2 env =
                ServerUtilities.GetServerEnvironment() as IServerEnvironment2;

            if (env == null)
                return null;

            IPropertySet props = env.Properties;
            if (props == null)
                return null;

            object namesObj, valuesObj;
            props.GetAllProperties(out namesObj, out valuesObj);

            var names = namesObj as object[];
            var values = valuesObj as object[];
            if (names == null || values == null || names.Length != values.Length)
                return null;

            string fallback = null;

            for (int i = 0; i < names.Length; i++)
            {
                string key = names[i] as string;
                string val = values[i] as string;

                if (string.IsNullOrEmpty(val))
                    continue;

                // We want entries like:
                //   https://.../arcgis/rest/services/<ServiceName>/MapServer/exts/<SOEName>
                bool hasExts = val.IndexOf("/MapServer/exts/", StringComparison.OrdinalIgnoreCase) >= 0;
                if (!hasExts)
                    continue;

                // Prefer the one that explicitly contains our SOE name.
                if (!string.IsNullOrEmpty(_soeName) &&
                    val.IndexOf("/exts/" + _soeName, StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    return val;
                }

                // Otherwise keep the first MapServer/exts URL we encounter as a fallback.
                if (fallback == null)
                    fallback = val;
            }

            return fallback;
        }

        /// <summary>
        /// Converts the SOE URL under the MapServer to the corresponding FeatureServer
        /// layer metadata URL.
        ///
        /// Input example:
        ///   https://host/arcgis/rest/services/EditorTrackingTest/MapServer/exts/seeEditInfo
        /// Output for layerId = 0:
        ///   https://host/arcgis/rest/services/EditorTrackingTest/FeatureServer/0?f=pjson
        /// </summary>
        private string BuildFeatureServerUrl(string soeUrl, int layerId)
        {
            int idx = soeUrl.IndexOf("/exts/", StringComparison.OrdinalIgnoreCase);
            if (idx <= 0)
                throw new Exception("Could not locate '/exts/' in SOE URL: " + soeUrl);

            // Up to and including /MapServer
            string mapServerUrl = soeUrl.Substring(0, idx);

            // Swap MapServer → FeatureServer
            string fsBase = mapServerUrl.Replace("/MapServer", "/FeatureServer");

            return $"{fsBase}/{layerId}?f=pjson";
        }

        #endregion

        #region JSON metadata DTOs + fetch helper

        /// <summary>
        /// Strongly-typed representation of the editFieldsInfo JSON object
        /// returned by the FeatureServer layer endpoint.
        /// </summary>
        private sealed class EditFieldsInfo
        {
            [JsonPropertyName("creationDateField")]
            public string CreationDateField { get; set; }

            [JsonPropertyName("creatorField")]
            public string CreatorField { get; set; }

            [JsonPropertyName("editDateField")]
            public string EditDateField { get; set; }

            [JsonPropertyName("editorField")]
            public string EditorField { get; set; }
        }

        /// <summary>
        /// Root object for layer JSON – we only care about the editFieldsInfo property.
        /// </summary>
        private sealed class FeatureLayerInfoRoot
        {
            [JsonPropertyName("editFieldsInfo")]
            public EditFieldsInfo EditFieldsInfo { get; set; }
        }

        /// <summary>
        /// Calls the FeatureServer layer REST endpoint (…/FeatureServer/{layerId}?f=pjson)
        /// and extracts the editFieldsInfo block.
        /// </summary>
        private EditFieldsInfo FetchEditFieldsInfo(string url)
        {
            // Note: .Result is fine here – SOEs are already running on worker threads.
            string json = _httpClient.GetStringAsync(url).Result;

            var opts = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer
                .Deserialize<FeatureLayerInfoRoot>(json, opts)
                ?.EditFieldsInfo;
        }

        #endregion
    }
}
