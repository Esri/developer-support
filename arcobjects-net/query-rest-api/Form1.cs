using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Script.Serialization;
using System.Windows.Forms;

namespace HowToQueryAgainstRestApi
{
    public partial class Form1 : Form
    {
        DataGridView MyDataGridView { get; set; }
        NumericUpDown MyNumericUpDown { get; set; }

        public Form1()
        {
            InitializeComponent();
            MyDataGridView = this.dataGridView;
            MyNumericUpDown = this.popNumericUpDown;

            MyDataGridView.Columns.Add("ID", "OID");
            MyDataGridView.Columns.Add("STATE", "STATE");
            MyDataGridView.Columns.Add("POP2000", "POP2000");

            MyDataGridView.Columns[0].AutoSizeMode
                = MyDataGridView.Columns[1].AutoSizeMode
                    = MyDataGridView.Columns[2].AutoSizeMode = DataGridViewAutoSizeColumnMode.Fill;
        }

        private void requestButton_Click(object sender, EventArgs e)
        {
            const string requestUri =
                "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/5/";

            StringBuilder data = new StringBuilder();
            data.AppendFormat("query?text={0}&geometry={1}&geometryType={2}&inSR={3}", string.Empty, string.Empty, "esriGeometryPoint", string.Empty);
            data.AppendFormat("&spatialRel-{0}&relationParam={1}&objectIds={2}", "esriSpatialRelIntersects", string.Empty, string.Empty);
            data.AppendFormat("&where={0}", System.Web.HttpUtility.UrlEncode("POP2000>" + MyNumericUpDown.Value.ToString(CultureInfo.InvariantCulture)));
            data.AppendFormat("&time={0}&returnCountOnly={1}&returnIdsOnly={2}&returnGeometry={3}", string.Empty, "false", "false", "false");
            data.AppendFormat("&maxAllowableOffset={0}&outSR={1}&outFields={2}&f={3}", string.Empty, string.Empty, "*", "json");

            HttpWebRequest request = WebRequest.Create(requestUri + data) as HttpWebRequest;

            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                StreamReader reader = new StreamReader(response.GetResponseStream());
                string responseString = reader.ReadToEnd();

                // JavaScriptSerializer in System.Web.Extensions.dll
                JavaScriptSerializer jss = new JavaScriptSerializer();

                IDictionary<string, object> results = jss.DeserializeObject(responseString) as IDictionary<string, object>;

                if (results == null || !results.ContainsKey("features")) return;

                IEnumerable<object> features = results["features"] as IEnumerable<object>;
                foreach (IDictionary<string, object> record in from IDictionary<string, object> feature in features select feature["attributes"] as IDictionary<string, object>)
                {
                    MyDataGridView.Rows.Add(new[] {record["ObjectID"], record["STATE_NAME"], record["POP2000"]});
                }

                MyDataGridView.Update();
            }
        }
    }
}
