using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Net.Http;
using Newtonsoft.Json;
using System.Text;
using Esri.ArcGISRuntime.Http;
using Esri.ArcGISRuntime.Data;
using Esri.ArcGISRuntime.Layers;

namespace HTTPClientGenerateGeodatabase
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
		//Url to FeatureService
        private string featureServiceURL = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Sync/WildfireSync/FeatureServer";

        public MainWindow()
        {
            InitializeComponent();
            GenerateGeodatabaseREST();
        }

        private async void GenerateGeodatabaseREST()
        {
			//Create an instance of HttpClient
            using (var client = new HttpClient())
            {
				//Create an new HttpRequestMessage object for the createReplica operation
                var request = new HttpRequestMessage(HttpMethod.Post, featureServiceURL + "/createReplica");
				//Add all request parameters to a string
                var requestString = "f=json"
                        + "&layers=0,1"
                        + "&replicaName=DEReplica"
                        + "&layerQueries={'0':{'where':'1=1','queryOption':'useFilter'},'1':{'where':'1=1','queryOption':'useFilter'}}"
                        + "&geometryType=esriGeometryEnvelope"
                        + "&geometry={'xmin':-170,'ymin':0,'xmax':0,'ymax':80,'spatialReference':{'wkid':4326}}"
                        + "&inSR={'wkid':4326}"
                        + "&replicaSR={'wkid':102100,'latestWkid':3857}"
                        + "&transportType=esriTransportTypeUrl"
                        + "&returnAttachments=false"
                        + "&async=true"
                        + "&syncModel=perLayer"
                        + "&dataFormat=sqlite"
                        + "&clientTime=" + DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();
				//Set the Content parameter of the request. Setting the content time to x-www-form-urlencoded is very important
                request.Content = new StringContent(requestString, Encoding.UTF8, "application/x-www-form-urlencoded");
				
				//Use HttpClient to send an async request to the createReplica endpoint
                var result = await client.SendAsync(request);
                string resultContent = await result.Content.ReadAsStringAsync();
				//Using Json.net deserialize the string into JSON
                var jsonResult = JsonConvert.DeserializeObject<dynamic>(resultContent);
				//Pass the status url to the CheckGeodatabaseStatus method
                CheckGeodatabaseStatus(jsonResult["statusUrl"].Value);
            }
        }

        private async void CheckGeodatabaseStatus(string url)
        {
            Boolean success = false;
            string outputUrl = "";

			//Check the status of the job in a loop
            while(!success)
            {
				//Pause the execution for two seconds
                await DelayRequest();
				//Use HttpClient again to send the request
                using (var client = new HttpClient())
                {
                    Console.WriteLine("Pinging Server");
					//Make a GET request to check the status of the job
                    var result = await client.GetAsync(url + "?f=json");
                    string resultContent = await result.Content.ReadAsStringAsync();
                    var jsonResult = JsonConvert.DeserializeObject<dynamic>(resultContent);
                    Console.WriteLine("Status: " + jsonResult["status"].Value);
					//Check to see if the job is finished
                    if (jsonResult["status"].Value == "Completed")
                    {
                        success = true;
						//access the result Url
                        outputUrl = jsonResult["resultUrl"].Value;
                        Console.WriteLine("Output URL: " + outputUrl);
                    }
                }
            }

            DownloadGeodatabase(outputUrl);
        }

        private async void DownloadGeodatabase(string url)
        {
            Console.WriteLine("Download Started");
			//Create an instance of ArcGISHttpClient
            var client = new ArcGISHttpClient();
            var geodatabaseStream = client.GetOrPostAsync(url, null);
			//Path on disk where the geodatabase will be downloaded to
            var geodatabasePath = @"<Path to location on Disk>\name.geodatabase";
            await Task.Factory.StartNew(async delegate
            {
                using(var stream = System.IO.File.Create(geodatabasePath))
                {
                    await geodatabaseStream.Result.Content.CopyToAsync(stream);
                    Console.WriteLine("Download Complete");
					AddFeatureLayerToMap(geodatabasePath);
                }
            });
        }
		
		private async void AddFeatureLayerToMap(string path)
        {
            try
            {
				//Open the .geodatabase file
                var gdb = await Geodatabase.OpenAsync(path);
				//Loop through each table in the geodatabase
                foreach (var table in gdb.FeatureTables)
                {
					//Create a new featurelayer from each feature table
                    var flayer = new FeatureLayer()
                    {
                        ID = table.Name,
                        DisplayName = table.Name,
                        FeatureTable = table
                    };
					
					//Add each featurelayer to the map
                    MyMapView.Map.Layers.Add(flayer);
                }
            } catch (Exception ex)
            {
                Console.WriteLine("Cannot Add Layers");
            }
        }

        private async Task DelayRequest()
        {
			//Wait for two seconds
            await Task.Delay(2000);
        }
    }
}