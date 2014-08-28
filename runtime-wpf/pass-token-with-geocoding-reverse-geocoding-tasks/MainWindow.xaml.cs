using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using ESRI.ArcGIS.Client;
using ESRI.ArcGIS.Client.Geometry;
using ESRI.ArcGIS.Client.Tasks;
using ESRI.ArcGIS.Client.Toolkit;

namespace ArcGISWPFSDK


{

/// <summary>
    ///    Overview: This sample code is a demo on how to pass token to geocoding and reverse geocoding service on AGOL. This is a requirement if one want to store th geometry. "According to ArcGIS REST API, 
    ///    "Applications are contractually prohibited from storing the results of single geocode transactions. This restriction applies to the Find, findAddressCandidates, 
    ///    and reverseGeocode methods. However, by passing the forStorage parameter with value "true" in a geocode request, a client application is allowed to store the results."
    ///    
    ///    Author:Shriram Bhutada

/// </summary>

    public partial class AddressToLocation : UserControl
    {
        GraphicsLayer _candidateGraphicsLayer;
        GraphicsLayer _locationGraphicsLayer;
        private static ESRI.ArcGIS.Client.Projection.WebMercator _mercator =
                new ESRI.ArcGIS.Client.Projection.WebMercator();

        public AddressToLocation()
        {
            

            InitializeComponent();

            

            ESRI.ArcGIS.Client.Geometry.Envelope initialExtent =
                                     new ESRI.ArcGIS.Client.Geometry.Envelope(
                             _mercator.FromGeographic(
                                     new ESRI.ArcGIS.Client.Geometry.MapPoint(-122.554, 37.615)) as MapPoint,
                             _mercator.FromGeographic(
                                     new ESRI.ArcGIS.Client.Geometry.MapPoint(-122.245, 37.884)) as MapPoint);

            initialExtent.SpatialReference = new SpatialReference(3857);
            
            MyMap.Extent = initialExtent;

            _locationGraphicsLayer = MyMap.Layers["LocationGraphicsLayer"] as GraphicsLayer;
            _candidateGraphicsLayer = MyMap.Layers["CandidateGraphicsLayer"] as GraphicsLayer;
        }

        private void FindAddressButton_Click(object sender, RoutedEventArgs e)

        {
   

            Locator locatorTask = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

            locatorTask.AddressToLocationsCompleted += LocatorTask_AddressToLocationsCompleted;
            locatorTask.Failed += LocatorTask_Failed;
            AddressToLocationsParameters addressParams = new AddressToLocationsParameters();
            
            Dictionary<string, string> address = addressParams.Address;

            if (!string.IsNullOrEmpty(Address.Text))
                address.Add("Address", Address.Text);
            if (!string.IsNullOrEmpty(City.Text))
                address.Add("City", City.Text);
            if (!string.IsNullOrEmpty(State.Text))
                address.Add("Region", State.Text);
            if (!string.IsNullOrEmpty(Zip.Text))
                address.Add("Postal", Zip.Text);
            address.Add("forStorage", "true");
            address.Add("token","pgPwo32cfo-kLf0ABYjV9RZjxGNfFB4--xSkGLOY4bUx0UhmFMc0-06KJCPtx4uRsIGuO_9xn_cxI2G2w9IoD3hX7Q-LGulIg2VhKUcvklXu7CblMg1--yg5kznhXjSF");
            locatorTask.AddressToLocationsAsync(addressParams);
        }

        private void LocatorTask_AddressToLocationsCompleted(object sender, ESRI.ArcGIS.Client.Tasks.AddressToLocationsEventArgs args)
        {
            _candidateGraphicsLayer.Graphics.Clear();
            CandidateListBox.Items.Clear();

            List<AddressCandidate> returnedCandidates = args.Results;

            foreach (AddressCandidate candidate in returnedCandidates)
            {
                if (candidate.Score >= 80)
                {
                    CandidateListBox.Items.Add(candidate.Address);

                    Graphic graphic = new Graphic()
                    {
                        Symbol = LayoutRoot.Resources["DefaultMarkerSymbol"] as ESRI.ArcGIS.Client.Symbols.Symbol,
                        Geometry = candidate.Location
                    };

                    graphic.Attributes.Add("Address", candidate.Address);

                    string latlon = String.Format("{0}, {1}", candidate.Location.X, candidate.Location.Y);
                    graphic.Attributes.Add("LatLon", latlon);

                    if (candidate.Location.SpatialReference == null)
                    {
                        candidate.Location.SpatialReference = new SpatialReference(4326);
                    }

                    if (!candidate.Location.SpatialReference.Equals(MyMap.SpatialReference))
                    {
                        if (MyMap.SpatialReference.Equals(new SpatialReference(3857)) && candidate.Location.SpatialReference.Equals(new SpatialReference(4326)))
                            graphic.Geometry = _mercator.FromGeographic(graphic.Geometry);
                        else if (MyMap.SpatialReference.Equals(new SpatialReference(4326)) && candidate.Location.SpatialReference.Equals(new SpatialReference(3857)))
                            graphic.Geometry = _mercator.ToGeographic(graphic.Geometry);
                        else if (MyMap.SpatialReference != new SpatialReference(4326))
                        {
                            GeometryService geometryService =
                                    new GeometryService("http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

                            geometryService.ProjectCompleted += (s, a) =>
                            {
                                graphic.Geometry = a.Results[0].Geometry;
                            };

                            geometryService.Failed += (s, a) =>
                            {
                                MessageBox.Show("Projection error: " + a.Error.Message);
                            };

                            geometryService.ProjectAsync(new List<Graphic> { graphic }, MyMap.SpatialReference);
                        }
                    }

                    _candidateGraphicsLayer.Graphics.Add(graphic);
                }
            }

            if (_candidateGraphicsLayer.Graphics.Count > 0)
            {
                CandidatePanelGrid.Visibility = Visibility.Visible;
                CandidateListBox.SelectedIndex = 0;
            }
        }

        void _candidateListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            int index = (sender as ListBox).SelectedIndex;
            if (index >= 0)
            {
                MapPoint candidatePoint = _candidateGraphicsLayer.Graphics[index].Geometry as MapPoint;
                double displaySize = MyMap.MinimumResolution * 30;

                ESRI.ArcGIS.Client.Geometry.Envelope displayExtent = new ESRI.ArcGIS.Client.Geometry.Envelope(
                        candidatePoint.X - (displaySize / 2),
                        candidatePoint.Y - (displaySize / 2),
                        candidatePoint.X + (displaySize / 2),
                        candidatePoint.Y + (displaySize / 2));

                MyMap.ZoomTo(displayExtent);
            }
        }

        private void LocatorTask_Failed(object sender, TaskFailedEventArgs e)
        {
            MessageBox.Show("Locator service failed: " + e.Error);
        }
        private string url1;
        private void button1_Click(object sender, RoutedEventArgs e)
        {
           // url1 = "http://geocode.arcgis.com/arcgis/rest";
            ESRI.ArcGIS.Client.IdentityManager identityManager = ESRI.ArcGIS.Client.IdentityManager.Current;
            //identityManager.ChallengeMethod = (url, callback, options) => identityManager.GenerateCredentialAsync(url, "NHaney_ess", "H1a2n3e4y5#", callback, options);

        }

        private void MyMap_MouseClick(object sender, ESRI.ArcGIS.Client.Map.MouseEventArgs e)
        {
            Locator locatorTask = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
            locatorTask.LocationToAddressCompleted += LocatorTask_LocationToAddressCompleted;
            locatorTask.Failed += LocationToAddressLocatorTask_Failed;
            Dictionary<string, string> address = new Dictionary<string, string>();
            address.Add("forStorage", "true");
            address.Add("token", "pgPwo32cfo-kLf0ABYjV9RZjxGNfFB4--xSkGLOY4bUx0UhmFMc0-06KJCPtx4uRsIGuO_9xn_cxI2G2w9IoD3hX7Q-LGulIg2VhKUcvklXu7CblMg1--yg5kznhXjSF");

            locatorTask.CustomParameters = address;


            // Tolerance (distance) specified in meters
            double tolerance = 30;

            locatorTask.LocationToAddressAsync(e.MapPoint, tolerance, e.MapPoint);
        }

        private void LocatorTask_LocationToAddressCompleted(object sender, AddressEventArgs args)
        {
            Address address = args.Address;
            Dictionary<string, object> attributes = address.Attributes;

            Graphic graphic = new Graphic()
            {
                Symbol = LayoutRoot.Resources["DefaultMarkerSymbol"] as ESRI.ArcGIS.Client.Symbols.Symbol,
                Geometry = args.UserState as MapPoint
            };

            string latlon = String.Format("{0}, {1}", address.Location.X, address.Location.Y);
            string address1 = attributes["Address"].ToString();
            string address2 = String.Format("{0}, {1} {2}", attributes["City"], attributes["Region"], attributes["Postal"]);

            graphic.Attributes.Add("LatLon", latlon);
            graphic.Attributes.Add("Address1", address1);
            graphic.Attributes.Add("Address2", address2);

            _locationGraphicsLayer.Graphics.Add(graphic);
        }

        private void LocationToAddressLocatorTask_Failed(object sender, TaskFailedEventArgs e)
        {
            MessageBox.Show("Unable to determine an address. Try selecting a location closer to a street.");
        }
    }
}


