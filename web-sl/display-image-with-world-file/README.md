#Display An Image With a World File in the Correct Location
##About
In the Silverlight API it is possible to display georeferenced images using the ElementLayer control. However to use this layer you must hard code the coordinates for the layer. This would create problems if you needed an application which allowed the customer to upload images to display. To solve this problem I created an application that would load and parse a world file.
##Usage Notes
This application makes the assumption the image and the world file have the same file name and are in the same location. In the code behind the path to the file and the world file extension must be set.
##The Logic
Wait for the ElementLayer control to initialize, generate a bitmap image from the image file, and set the content of the element layer.
```C#
//Wait for the element layer to initialize
private void ElementLayer_Initialized(object sender, EventArgs e)
{
    //Grab the element layer
    myElementLayer = MyMap.Layers["ElementLayer"] as ElementLayer;
    //Create a new bitmap image from the image file
    BitmapImage bitImage = new BitmapImage(new Uri(pathToFile));
    //Create a new image element
    image = new Image();
    image.Source = bitImage;
    //Set the envelope for the image. Note the extent is merely a placeholder, we will replace it in a momment.
    ElementLayer.SetEnvelope(image, new Envelope(100, 100, 100, 100));
    //Add the image to element layer
    myElementLayer.Children.Add(image);
}

```
When the image has been opened, make a request to get the world file
```C#
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
```
After the world file has been loaded, parse the file, calculate the extent of the image and update the extent of the element layer.
```C#
//Delay the visibility of the tiles until all have loaded
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
```