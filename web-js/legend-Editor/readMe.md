# Legend and Editor

## About
This sample combines the legend widget and editor widget in an accordion pane.

[Legend widget sample](https://developers.arcgis.com/javascript/jssamples/widget_legend.html)

[Editor widget with simple toolbar](https://developers.arcgis.com/javascript/jssamples/ed_simpletoolbar.html)

[Live Sample](http://esri.github.io/developer-support/web-js/legend-Editor/legendEditor.html)

## Usage notes:
This sample demonstrates how include the editor widget in the second accordion pane of the the legend sample.

Add the legend:
```javascript
map.on("layers-add-result", function(evt) {
    var layerInfo = arrayUtils.map(evt.layers, function(layer, index) {
        return {
            layer: layer.layer,
            title: layer.layer.name
        };
    });
    if (layerInfo.length > 0) {
        var legendDijit = new Legend({
            map: map,
            layerInfos: layerInfo
        }, "legendDiv");
        legendDijit.startup();
    }
});

```
Add the editor widget:
```javascript
var params = {
    settings: settings
};
var myEditor = new Editor(params, 'editorDiv');
//define snapping options
var symbol = new SimpleMarkerSymbol(
    SimpleMarkerSymbol.STYLE_CROSS, 15,
    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 5), null);
map.enableSnapping({
    snapPointSymbol: symbol,
    tolerance: 20,
    snapKey: keys.ALT
});
myEditor.startup();

```
Activate the editor pane when the application loads:
```html
<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Editing Tools', selected:true">
    Editing Tool Pane
    <div id="templateDiv"></div>
    <div id="editorDiv"></div>
</div>
```
