using System.Windows;
using ESRI.ArcGIS.Client;
using System.Windows.Media;
using ESRI.ArcGIS.Client.Symbols;

namespace LabelTest
{

    public partial class MainWindow : Window
    {
        private ArcGISDynamicMapServiceLayer dynamicLayer;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            dynamicLayer = (ArcGISDynamicMapServiceLayer)MyMap.Layers[0];

            LabelClassCollection lcc = getLabelClassCollection();

            LayerDrawingOptionsCollection options = new LayerDrawingOptionsCollection();
            options.Add(new LayerDrawingOptions() { LayerID = 0, ShowLabels = true, LabelClasses = lcc });

            dynamicLayer.LayerDrawingOptions = options;

            dynamicLayer.Refresh();
        }

        private LabelClassCollection getLabelClassCollection()
        {
            LabelClassCollection lcc = new LabelClassCollection();

            LabelOptions lo = new LabelOptions()
            {
                FontSize = 12,
                FontStyle = TextStyle.Normal,
                Color = Colors.Black,
                FontFamily = new System.Windows.Media.FontFamily("Arial")
            };

            LabelClass lc = new LabelClass()
            {
                LabelOptions = lo,
                LabelExpression = "[AREANAME]",
                LabelPlacement = ESRI.ArcGIS.Client.LabelPlacement.PointLabelPlacementAboveCenter
            };

            lcc.Add(lc);

            return lcc;
        }
    }
}
