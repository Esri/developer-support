using System.Windows;
using ESRI.ArcGIS.Client;
using ESRI.ArcGIS.Client.Tasks;
using ESRI.ArcGIS.Client.Geometry;
using System.Collections.Generic;
using System;

namespace multiproject
{

    public partial class MainWindow : Window
    {
        GeometryService geometryService;
        GraphicsLayer graphicsLayer;


        public MainWindow()
        {
            // License setting and ArcGIS Runtime initialization is done in Application.xaml.cs.
            //Converting from WGS1984(WKID4326) to Web Mercator(WKID 102100)
            //Expected output:
            //outstring	"contains 9 points\n
            //-16760359.2704728 17285613.0087787\n
            //-47750.2729367931 -382002.488729203\n
            //18479370.4320312 -18240618.8875065\n
            //18192868.5717715 16999110.8145016\n
            //-15900853.6896935 -17476613.9857872\n
            //-10552818.7793126 10696069.8481236\n
            //12653832.4583238 10791570.3324641\n
            //-9979815.0587931 -11937577.7150823\n
            //13417837.4932295 -11651075.9091873\n


            InitializeComponent();

            geometryService = new GeometryService("http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            geometryService.ProjectCompleted += geometryService_ProjectCompleted;
            geometryService.Failed += geometryService_Failed;

            graphicsLayer = MyMap.Layers["MyGraphicsLayer"] as GraphicsLayer;

            List<Graphic> listgraphic = new List<Graphic>();
            MapPoint inp1 = new MapPoint(-150.560869, 82.387691, new SpatialReference(4326));

            MapPoint inp2 = new MapPoint(-0.428948, -3.429537, new SpatialReference(4326));
            MapPoint inp3 = new MapPoint(166.003009, -83.443769, new SpatialReference(4326));
            MapPoint inp4 = new MapPoint(163.429319, 82.039054, new SpatialReference(4326));
            MapPoint inp5 = new MapPoint(-142.839799, -82.61164, new SpatialReference(4326));
            MapPoint inp6 = new MapPoint(-94.797584, 68.823145, new SpatialReference(4326));
            MapPoint inp7 = new MapPoint(113.671311, 69.130903, new SpatialReference(4326));
            MapPoint inp8 = new MapPoint(-89.650204, -72.504886, new SpatialReference(4326));
            MapPoint inp9 = new MapPoint(120.534485, -71.714384, new SpatialReference(4326));

            listgraphic.Add(new Graphic() { Geometry = inp1 });
            listgraphic.Add(new Graphic() { Geometry = inp2 });
            listgraphic.Add(new Graphic() { Geometry = inp3 });
            listgraphic.Add(new Graphic() { Geometry = inp4 });
            listgraphic.Add(new Graphic() { Geometry = inp5 });
            listgraphic.Add(new Graphic() { Geometry = inp6 });
            listgraphic.Add(new Graphic() { Geometry = inp7 });
            listgraphic.Add(new Graphic() { Geometry = inp8 });
            listgraphic.Add(new Graphic() { Geometry = inp9 });

            geometryService.ProjectAsync(listgraphic, new SpatialReference(102100));
        }

        private void geometryService_Failed(object sender, TaskFailedEventArgs e)
        {
            throw new System.NotImplementedException();
        }

        private void geometryService_ProjectCompleted(object sender, GraphicsEventArgs e)
        {
            IList<Graphic> resultlist = e.Results;
            string outstring = "";
            outstring += String.Format("contains {0} points", resultlist.Count);
            outstring += "\n";
            for (int i = 0; i < resultlist.Count; i++)
            {
                MapPoint resultpoint = resultlist[i].Geometry as MapPoint;
                outstring += resultpoint.X + " " + resultpoint.Y + "\n";
            }

            MessageBox.Show(outstring);
        }
    }
}
