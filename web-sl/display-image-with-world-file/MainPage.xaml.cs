using ESRI.ArcGIS.Client;
using ESRI.ArcGIS.Client.Geometry;
using ESRI.ArcGIS.Client.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Browser;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Resources;

namespace ESRIStandardMapApplication7
{
    public partial class MainPage : UserControl
    {
        //the path to the image
        string pathToFile = "http://csc-nhaney7d.esri.com/images/Cooper.jpg";
        //extension used by the world file
        string worldFileExtention = ".jgw";
        double imageHeight;
        double imageWidth;
        ElementLayer myElementLayer;
        Image image;

        public MainPage()
        {
            InitializeComponent();
        }

        private void WorldFileLoaded(object sender, DownloadStringCompletedEventArgs e)
        {
            //Checks to see if there was an error
            if (e.Error == null)
            {
                //grab the data from the world file
                string myData = e.Result;
                //split string into an array based on new line characters
                string[] lines = myData.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
                //convert the strings into doubles
                double[] coordValues = new double[6];
                for(int i = 0; i < 6; i++) {
                    coordValues[i] = Convert.ToDouble(lines[i]);
                }
                //calculate the pixel height and width in real world coordinates
                double pixelWidth = Math.Sqrt(Math.Pow(coordValues[0], 2) + Math.Pow(coordValues[1], 2));
                double pixelHeight = Math.Sqrt(Math.Pow(coordValues[2], 2) + Math.Pow(coordValues[3], 2));

                //Create a map point for the top left and bottom right
                MapPoint topLeft = new MapPoint(coordValues[4], coordValues[5]);
                MapPoint bottomRight = new MapPoint(coordValues[4] + (pixelWidth * imageWidth), coordValues[5] + (pixelHeight * imageHeight));
                //create an envelope for the elmently layer
                Envelope extent = new Envelope(topLeft.X, topLeft.Y, bottomRight.X, bottomRight.Y);
                ElementLayer.SetEnvelope(image, extent);
                //Zoom to the extent of the image
                MyMap.Extent = extent;
            }
        }

        //Wait for the element layer to initialize
        private void ElementLayer_Initialized(object sender, EventArgs e)
        {
            //Grab the element layer
            myElementLayer = MyMap.Layers["ElementLayer"] as ElementLayer;
            //Create a new bitmap image from the image file
            BitmapImage bitImage = new BitmapImage(new Uri(pathToFile));
            //When the image has successfully been opened
            bitImage.ImageOpened += (sender1, e1) =>
            {
                //grab the image height and width
                imageHeight = bitImage.PixelHeight;
                imageWidth = bitImage.PixelWidth;
                //Create a new web client to send the request for the world file
                WebClient myClient = new WebClient();
                //The event handler for when the world file has been loaded
                myClient.DownloadStringCompleted += new DownloadStringCompletedEventHandler(WorldFileLoaded);
                //Replaces the .jpg extension with the .jgw extension
                String pathToWorldFile = (pathToFile.Remove(pathToFile.Length - 4, 4)) + worldFileExtention;
                //Download the world file
                myClient.DownloadStringAsync(new Uri(pathToWorldFile));
            };
            //Create a new image element
            image = new Image();
            image.Source = bitImage;
            //Set the envelope for the image. Note the extent is merely a placeholder, we will replace it in a momment.
            ElementLayer.SetEnvelope(image, new Envelope(100, 100, 100, 100));
            //Add the image to element layer
            myElementLayer.Children.Add(image);
        }
    }
}
