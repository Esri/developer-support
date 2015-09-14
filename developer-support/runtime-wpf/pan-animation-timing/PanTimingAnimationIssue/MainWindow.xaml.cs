using System.Windows;
using ESRI.ArcGIS.Client;
using ESRI.ArcGIS.Client.Projection;
using System;
using ESRI.ArcGIS.Client.Geometry;
using System.Windows.Controls;

namespace PanTimingAnimationIssue
{

    public partial class MainWindow : Window
    {
        public WebMercator webmercator;
        public Random random;

        public MainWindow()
        {
            // License setting and ArcGIS Runtime initialization is done in Application.xaml.cs.

            InitializeComponent();
            webmercator = new WebMercator();
            random = new Random();
            TimeSpan interval = new TimeSpan(0, 0, 40);
            MyMap.PanDuration = interval;
            startTimer();
            
        }

        private void startTimer()
        {
            System.Windows.Threading.DispatcherTimer dispatcherTimer = new System.Windows.Threading.DispatcherTimer();
            dispatcherTimer.Tick += new EventHandler(dispatcherTimer_Tick);
            dispatcherTimer.Interval = new TimeSpan(0, 0, 3);
            dispatcherTimer.Start();
        }

        private void dispatcherTimer_Tick(object sender, EventArgs e)
        {
            int lat = random.Next(32, 36);
            int lng = random.Next(-116, -114);
            Geometry geom = webmercator.FromGeographic(new MapPoint(lng, lat));
            startAutoPan(geom);
        }

        private void startAutoPan(Geometry geom)
        {
            
            MyMap.PanTo(geom);
            
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            TimeSpan interval = new TimeSpan(0, 0, 0);
            MyMap.PanDuration = interval;
        }

        private void updatePanAnimation(object sender, System.Windows.Controls.TextChangedEventArgs e)
        {
            var tb = sender as TextBox;
            int time = int.Parse(tb.Text);
            TimeSpan interval = new TimeSpan(0, 0, time);
            MyMap.PanDuration = interval;

        }
    }
}
