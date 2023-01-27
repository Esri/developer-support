# Sketch widget snippets

This is just a sample app with a collection of code of code snippets that I found useful to keep and share with the community.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Code snippets** 

- [Disable drag basemap and zoom](#disable-drag-basemap-and-zoom)
- [Remove default box outline (orange) in the active geometry](#remove-default-box-outline-orange-in-the-active-geometry)
- [Get last selected graphics](#get-last-selected-graphics)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Disable drag basemap and zoom

But allow draw, edit and drag sketched geometries

```js
view.on("drag", ["Shift"], function (event) {
    if (sketch.state !== "active") {
    event.stopPropagation();
    }
});

view.on("drag", function (event) {
    event.stopPropagation();
}, -1);

view.constraints.minZoom = view.constraints.maxZoom = view.zoom;
```


##  Remove default box outline (orange) in the active geometry

```js
sketch.viewModel.watch('activeTool', (tool) => {
    if (tool === "transform") {
        sketch.viewModel.activeComponent.backgroundGraphic.symbol.outline.color = [0, 0, 0, 0];
    }
});
```

## Get last selected graphics

```js
sketch.on(["update"], function(event) {
    console.log("last selected graphics", event.graphics);
}); 
```
