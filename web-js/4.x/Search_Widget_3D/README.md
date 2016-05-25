#Search Widget 3D

##About
This is a sample 3D application focusing on the Search widget, to be discussed in the Esri Support Blog: https://blogs.esri.com/esri/supportcenter/

[Live Sample](http://noashx.github.io/blog/Search_Widget_3D.html)

##Usage Notes

You can input a location in the Search widget and either select a result from the drop-down suggestions, or press Enter on the keyboard to go to the first place on the list.
Then, the view will zoom to that location and place a picture marker symbol on the map. If you open the Developer Tools in the web browser, you will see some helpful console log messages indicating the progress of the Search widget.
In the code, there are many helpful comments describing the functionality, with links to references to find more information.
The Map and SceneView constructors might be new, but they are very straightforward.
What I want to focus on here are two things: the SearchViewModel (beginning on line 88), and the view.ui (beginning on line 117).
One of the new awesome features of 4.0 is the separation of the styling and the business logic. Similar to the Map and View concept described previously, all widgets have their own version of the view, called the ViewModel.
A typical widget constructor has some basic properties, and the ViewModel handles the styling and configurations.


##How it works:
The following snippets highlight the important portions of the code.

One of the new awesome features of 4.0 is the separation of the styling and the business logic. Similar to the Map and View concept described previously, all widgets have their own version of the view, called the ViewModel. A typical widget constructor has some basic properties, and the ViewModel handles the styling and configurations. For example, let’s look at the Search widget in the code:
```javascript
var searchWidget = new Search({
    visible: true,

    // one of the new awesome features of 4.0 is the separation of the styling and the business logic, such that
    // all widgets now have their own ViewModel, similar to what is shown below
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-SearchViewModel.html
    viewModel: new SearchVM({
      view: view, // reference to the SceneView
      autoNavigate: true, // automatically navigate to the selected result once selected
      maxResults: 5, // the maximum number of search results to return, the default value is 6     
      maxSuggestions: 3, // maximum number of suggestions returned by the widget
      popupEnabled: true, // display the Popup when the feature is clicked
      popupOpenOnSelect: false, // will not show the Popup when a result is selected from the Search results

      // define which services will be used for the search
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-SearchViewModel.html#sources
      sources: [{
        locator: new Locator("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
        singleLineFieldName: "SingleLine",
        outFields: ["Addr_type"],
        placeholder: "JavaScript 4.0",
        resultSymbol: new PictureMarkerSymbol({
           url: "http://noashx.github.io/img/support.png",
           size: 50,
           width: 50,
           height: 50,
           xoffset: 0,
           yoffset: 0
        }) // closes resultSymbol
      }] // closes sources
    }) // closes viewModel
 }); // closes searchWidget
```
The actual widget constructor was used for naming the widget and setting the visibility to true (default is true anyway). The SearchViewModel handles all the configurations that were set to customize the user experience and interface the way I needed (see the sample for comments). What’s interesting about this ViewModel system is that it’s now way easier to share business logic amongst widgets and code bases, because it’s separated from the widget constructor. Here is some more information about the SearchViewModel here: https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-SearchViewModel.html

The second interesting aspect of 4.0 I will discuss here is how we add the Search widget to the app. Let’s look at the code snippet from 4.0 and from 3.x. Currently, we can add the widget directly to the view’s user interface without creating a separate div element. This is an efficient (and dare I say, elegant) workflow.

```javascript
//4.x
view.ui.add(searchWidget, {
    position: "top-left",
    index: 0
});
```
At the 3.x versions, we need to create a div element, reference that div when we create the widget, and reference it again inside the html body tag. For more information about adding widgets to the view, you can reference this documentation: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-UI.html.

```javascript
//3.x
#search {
    display: block;
    position: absolute;
    z-index: 2;
    top: 20px;
    left: 74px;
}
...
...
var search = new Search({
    map: map
}, "search");
...
...
<div id="search"></div>
```
