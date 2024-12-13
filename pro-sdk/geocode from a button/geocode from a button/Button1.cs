using ArcGIS.Core.Geometry;
using ArcGIS.Core.CIM;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using ArcGIS.Desktop.Mapping;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;
using ArcGIS.Core.Internal.Geometry;

namespace geocode_from_a_button
{
    internal class Button1 : Button
    {
        private const string GeocodingServiceUrl =
            "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";

        protected override async void OnClick()
        {
            try
            {
                string address = PromptForAddress();
                if (string.IsNullOrEmpty(address)) return;

                await QueuedTask.Run(async () =>
                {
                    var location = await GeocodeAddressAsync(address);
                    if (location != null)
                    {
                        AddPointToMap(location);
                    }
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}");
            }
        }

        private string PromptForAddress()
        {
            return Microsoft.VisualBasic.Interaction.InputBox(
                "Enter an address to geocode:",
                "Geocode Address",
                "380 New York St, Redlands, CA");
        }

        private async Task<MapPoint> GeocodeAddressAsync(string address)
        {
            using (HttpClient client = new HttpClient())
            {
                string requestUrl = $"{GeocodingServiceUrl}?f=json&SingleLine={Uri.EscapeDataString(address)}&outFields=*&maxLocations=1";
                HttpResponseMessage response = await client.GetAsync(requestUrl);
                response.EnsureSuccessStatusCode();

                string json = await response.Content.ReadAsStringAsync();
                JObject parsedJson = JObject.Parse(json);

                var candidates = parsedJson["candidates"];
                if (candidates.HasValues)
                {
                    var location = candidates[0]["location"];
                    double x = (double)location["x"];
                    double y = (double)location["y"];

                    return MapPointBuilder.CreateMapPoint(x, y, SpatialReferences.WGS84);
                }

                MessageBox.Show("No matching address found.");
                return null;
            }
        }

        private void AddPointToMap(MapPoint point)
        {
            // Create a simple marker symbol
            var color = ColorFactory.Instance.CreateRGBColor(255, 0, 0);
            var markerSymbol = SymbolFactory.Instance.ConstructPointSymbol(color, 10, SimpleMarkerStyle.Circle);

            // Create a CIMPointGraphic
            var pointGraphic = new CIMPointGraphic
            {
                Location = point,
                Symbol = markerSymbol.MakeSymbolReference()
            };

            // Add the graphic to the map as an overlay
            MapView.Active.AddOverlay(pointGraphic);
        }
    }
}
