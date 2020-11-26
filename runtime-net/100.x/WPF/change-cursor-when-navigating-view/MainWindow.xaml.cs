using Esri.ArcGISRuntime.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CursorTest
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            //Add map to MapView
            Map map = new Map(Basemap.CreateTopographic());
            MyMapView.Map = map;

            //Wire into the DrawStatusChanged Event to watch
            //whenever the redrawing of the map occurs.
            MyMapView.DrawStatusChanged += MyMapView_DrawStatusChanged;

            //Wire into the NavigationCompelted Event to watch
            //when the navigation of the map completes. (Any zooming/panning)
            MyMapView.NavigationCompleted += MyMapView_NavigationCompleted;
        }

        private void MyMapView_NavigationCompleted(object sender, EventArgs e)
        {
            //Once the navigation of the MapView is completed, change the cursor back to normal
            //Uses the predefined WPF cursors
            this.Cursor = Cursors.Arrow;
        }

        private void MyMapView_DrawStatusChanged(object sender, Esri.ArcGISRuntime.UI.DrawStatusChangedEventArgs e)
        {
            if (MyMapView.IsNavigating)
            {
                //While the MapView is navigating, change the cursor
                //Uses the predefined WPF cursors
                //You can use your own image by using
                //a Cursor constructor: https://docs.microsoft.com/en-us/dotnet/api/system.windows.input.cursor?view=net-5.0
                this.Cursor = Cursors.Hand;
            }

        }

    }
}
