#Selection Widget / Dijit POC

This is a working sample that applies the dojo dijit framework making it possible to search for location and then define a
distance or a drive time to generate a useful geometry to then query a layer or layers of interest.  This tool is designed to
take the search characteristics found in the [Site Selector](http://tryitlive.arcgis.com/SiteSelector/) application
and deliver them in a single widget, see tool usage section below.

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)



[How to make a dijit / widget](https://github.com/Esri/arcgis-dijit-sample-js)

[Writing widgets](http://dojotoolkit.org/reference-guide/1.9/quickstart/writingWidgets.html)

[Live Sample](http://esri.github.io/developer-support/web-js/selection-dijit/index.html)

## Features

* Lots of programatic DOM element creation using dojo/dom-construct
* Geocode Widget events like select and clear
* Class based javascript pattern applied
* Suggestions appear while geocoding
* Advanced CSS rules overriding Dojo default styles


## Tool Usage

```
selectionWidget = new SelectionWidget({
			map : myMap
		}, "selectionTool");
selectionWidget.startup();

```

#Screen Grab

![Image of Selection Widget](https://raw.githubusercontent.com/Esri/developer-support/gh-pages/repository-images/selection-widget.png "Selection widget screenshot")



NOTE: Note not all the features may be completely implemented, as of 2/19.
