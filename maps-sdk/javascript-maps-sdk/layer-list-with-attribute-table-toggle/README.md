# LayerList with Attribute Table Toggle

## About

This sample shows how to add an [ActionToggle](https://developers.arcgis.com/javascript/latest/api-reference/esri-support-actions-ActionToggle.html) to the [Layerlist widget](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-LayerList.html) that toggles on and off the attribute table of layers.

To use this sample, open the Layer List widget located at the top right of the map. You can toggle the attribute table of each layer by selecting the '...' option and selecting 'Show Table'.

## How It Works

1. Define available actions in the LayerList component.

```javascript
arcgisLayerList.listItemCreatedFunction = (event) => {
    const { item } = event;

    item.actionsSections = new Collection([
        new Collection([
        new ActionToggle({
            title: "Show Table",
            icon: "table",
            id: "show-table",
        }),
        new ActionButton({
            title: "Layer information",
            icon: "information",
            id: "information",
        }),
        ])
    ]);

};
```

2. Add an event listener to check if an ActionToggle is selected

```javascript
arcgisLayerList.addEventListener("arcgisTriggerAction", (event) => {
    // Get a reference to the action id.
    const actionItem = event.detail.action;

    // Get a reference to the item the action was performed on
    const layerItem = event.detail.item.layer;

    // If the show-table action is triggered then
    // open the feature table for the specific layer
    if (actionItem.id === "show-table") {
        ...
    }

    // If the information action is triggered, then
    // open the item details page of the service layer
    if (actionItem.id === "information") {
        window.open(layerItem.url);
    }
});
```

3. Togle the table on and off when the show-table action is triggered

```javascript
...
if (actionItem.id === "show-table") {
    if (layerItem == currentItemDisplayedOnTable) {
    // Close the table, reset toggle text and clean currentItemDisplayedOnTable
    tableElement.style = "display:none";
    viewElement.style = "height: 100%";

    actionItem.title = "Show table";
    actionItem.icon = "table";

    currentItemDisplayedOnTable = null;

    } else {
    // Set layer on table
    tableElement.layer = layerItem;
    currentItemDisplayedOnTable = layerItem;
    actionItem.title = "Hide table";
    actionItem.icon = "hide-empty";

    // This ensures that the previous item's toggle is 
    // turned off when the table displays a different layer
    if (previousAction && previousAction != actionItem) {
        previousAction.value = false;
        previousAction.title = "Show table";
        previousAction.icon = "table";
    }

    tableElement.style = "display:block";
    viewElement.style = "height:60%";
    }

    // Remembers the previous action so that the toggle can be turned off
    previousAction = actionItem;
}
...
```

## Related Documentation

- [Layerlist Component](https://developers.arcgis.com/javascript/latest/references/map-components/arcgis-layer-list/)
- [Feature Table Component](https://developers.arcgis.com/javascript/latest/references/map-components/arcgis-feature-table/)
- [ActionButton](https://developers.arcgis.com/javascript/latest/api-reference/esri-support-actions-ActionButton.html)
- [ActionToggle](https://developers.arcgis.com/javascript/latest/api-reference/esri-support-actions-ActionToggle.html)
- [Additional Sample Code for LayerList widget with actions](https://developers.arcgis.com/javascript/latest/sample-code/layer-list-actions/)

## [Live Sample](https://esri.github.io/developer-support/maps-sdk/javascript-maps-sdk/layer-list-with-attribute-table-toggle)
