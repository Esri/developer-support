# Change Cursor When Navigating

## About

This sample shows how to change the cursor while the MapView is being panned/zoomed (navigating).

![Demo](https://github.com/Esri/developer-support/blob/master/runtime-net/100.x/change-cursor-when-navigating-view/demo-gif.gif)

## How It Works

Note: All the logic is contained in the MainWindow.xaml.cs file.

1. Create an event handler to wire into the DrawStatusChanged event to be notifed when the map is re-drawn and an event handler to wire into the NaviagationCompleted event to be notified when the map is done navigating.
```csharp
MyMapView.DrawStatusChanged += MyMapView_DrawStatusChanged;

MyMapView.NavigationCompleted += MyMapView_NavigationCompleted;
```
2. Within the DrawStatusChanged event, check if the MapView is currently navigating and if it is, change the cursor using the .NET Cursor Class.
```csharp
private void MyMapView_DrawStatusChanged(object sender, Esri.ArcGISRuntime.UI.DrawStatusChangedEventArgs e)
{
    if (MyMapView.IsNavigating)
    {
        this.Cursor = Cursors.Hand;
    }

}
```
3. Once the view completes navigation, change the cursor back in the NaviagationCompleted event handler.
```csharp
private void MyMapView_NavigationCompleted(object sender, EventArgs e)
{
	//Uses the predefined .NET cursors
	this.Cursor = Cursors.Arrow;
}
```

## How to Run the Sample
1. Create a basic ArcGIS Runtime SDK for .NET [WPF application](https://developers.arcgis.com/net/latest/wpf/guide/develop-your-first-map-app.htm) that displays a map.
2. Replace the MainWindow.xaml and MainWindow.xaml.cs files in the application created above with the files from this sample.
3. Save and run the solution.
4. Pan and zoom - note the cursor changes.

## Related Documentation
- [DrawStatusChanged Event](https://developers.arcgis.com/net/latest/wpf/api-reference/html/E_Esri_ArcGISRuntime_UI_Controls_GeoView_DrawStatusChanged.htm)
- [NaviagationCompleted Event](https://developers.arcgis.com/net/latest/wpf/api-reference/html/E_Esri_ArcGISRuntime_UI_Controls_GeoView_NavigationCompleted.htm)
- [.NET Cursor Class](https://docs.microsoft.com/en-us/dotnet/api/system.windows.input.cursor?view=net-5.0)