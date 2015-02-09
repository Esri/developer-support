using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.DataSourcesGDB;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.SystemUI;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Text;
using System.Windows.Forms;

namespace GetSecureFeatureServiceTest
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //add data from REST request
            string url = "http://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/SampleMapOpsDashboardSDK/FeatureServer/0/query?where=1%3D1&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=&returnGeometry=true&returnIdsOnly=false&returnCountOnly=false&f=json";
            
            //Get Feature class from feature service and add as a layer
            IFeatureLayer fl = new FeatureLayer();
            fl.FeatureClass = getFeatureClass(url, "myUserName", @"C:\temp\test.gdb", "SomeName");

            axMapControl1.AddLayer(fl);
        }

        private IFeatureClass getFeatureClass(string serviceURL, string userName, string gdbPath, string fcName)
        {
            IFeatureClass fc = null;

            //will leverage the user that is currently signed on or prompt
            string tok = "";
            int to = 60;
            IArcGISSingleSignon p = new ArcGISSingleSignonClass() as IArcGISSingleSignon;
            p.GetToken(this.Handle.ToInt32(), ref tok, serviceURL, ref to, ref userName);

            string url = String.Format(serviceURL + "&token={0}", tok);

            WebClient requestHelper = new WebClient();
            string responseString = requestHelper.DownloadString(new Uri(url));

            IWorkspaceFactory wf = new FileGDBWorkspaceFactoryClass();
            IWorkspace w = wf.OpenFromFile(gdbPath, 0);

            fc = jsonToFeatureClass(responseString, w, fcName);

            return fc;
        }

        private IFeatureClass jsonToFeatureClass(string jsonRecordSet, IWorkspace workspace, string newFCName)
        {
            IJSONReader jsonReader = new JSONReaderClass();
            jsonReader.ReadFromString(jsonRecordSet);

            IJSONConverterGdb jsonConverterGdb = new JSONConverterGdbClass();
            IPropertySet originalToNewFieldMap;
            IRecordSet recorset;
            jsonConverterGdb.ReadRecordSet(jsonReader, null, null, out recorset, out originalToNewFieldMap);

            IRecordSet2 recordSet2 = recorset as IRecordSet2;
            IFeatureClass featureClass = (IFeatureClass)recordSet2.SaveAsTable(workspace, newFCName);

            Console.WriteLine(featureClass.FeatureCount(null) + " features written to: " + newFCName);

            return featureClass;
        }

    }
}
