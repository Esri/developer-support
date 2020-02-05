# Unique Value Renderer for a Stream Service

## Background
Using the ArcGIS GeoEvent Extension, you can create stream services which allows users to work with real time event data. This new type of service utilizes WebSocket technology (full-duplex, bi-directional communication) which can be incorporated into GIS applications and analyses.

[Click here](https://server.arcgis.com/en/geoevent-extension/latest/process-event-data/stream-services.htm#GUID-B2A2BF7A-3946-4CBC-BA07-A657524EE5BE) to learn more regarding Stream Services.

[Live Sample](http://esri.github.io/developer-support/web-js/stream-service-uniqueValueRenderer/streamLayerUniqueVRend.html)

## Requirements
Please note that this sample requires you to publish your own Stream Service. For assistance please refer to the following [tutorial](http://www.arcgis.com/home/item.html?id=b087b8193b55465cb94d4c451dd541ac).

In order to see the service, the Simulator must be running.

## Usage notes:
This sample demonstrates how to apply a unique value renderer on a Stream Service.
```javascript
//CategoryCode is the field that the renderer is being applied
var uniqueValueRenderer = new UniqueValueRenderer(new SimpleMarkerSymbol("circle", 8,
            new SimpleLineSymbol("solid",
            new Color( [255, 0, 0, 0] ), 1),
            new Color( [255, 0, 0, 0.4] )
          ), "CategoryCode");

        uniqueValueRenderer.addValue("14", new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5])));
        uniqueValueRenderer.addValue("11", new SimpleMarkerSymbol().setColor(new Color([0, 255, 0, 0.5])));
        uniqueValueRenderer.addValue("3", new SimpleMarkerSymbol().setColor(new Color([0, 0, 255, 0.5])));

        streamLayer.setRenderer(uniqueValueRenderer);
//add layer to map
map.addLayer(streamLayer);
```
