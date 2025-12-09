# LayerList with Attribute Table Toggle

## RETIREMENT NOTICE
There is a new version of this sample (see [here](https://github.com/Esri/developer-support/tree/master/maps-sdk/javascript-maps-sdk/layer-list-with-attribute-table-toggle)).

This sample currently uses a retired version of the ArcGIS Maps SDK for JavaScript (4.16).

If you would like to learn more about retired versions of this product, visit the [ArcGIS Maps SDK for JavaScript Product Life Cycle page](https://support.esri.com/en-us/products/arcgis-maps-sdk-for-javascript/life-cycle). 

## About

This sample shows how to add an [ActionToggle](https://developers.arcgis.com/javascript/latest/api-reference/esri-support-actions-ActionToggle.html) to the [Layerlist widget](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-LayerList.html) that toggles on and off the attribute table of layers.

## How It Works

1. Define available actions in the LayerList widget.

```javascript
function defineActions(event) {
  let item = event.item;
  item.actionsSections = [
    [
      {
        title: "Attribute Table",
        className: "esri-icon-table",
        id: "attributes",
        type: "toggle",
      },
    ],
    // ...
  ];
}

var layerList = new LayerList({
  view: view,
  listItemCreatedFunction: defineActions,
});
```

2. Create a FeatureTable for the attribute table.

```javascript
const tableContainer = document.getElementById("tableContainer");

async function createTable(layer) {
  const tableDiv = document.createElement("div");
  tableContainer.appendChild(tableDiv);

  featureTable = new FeatureTable({
    view: view,
    layer: layer,
    container: tableDiv,
  });
}
```

3. Define a function that toggles the table on/off

```javascript
function toggleFeatureTable(showTable) {
  // Check if the table is displayed, if so, toggle off. If not, display.
  showTable
    ? tableContainer.classList.remove("hidden")
    : tableContainer.classList.add("hidden");
}
```

4. Listent to the "trigger-action" event of the LayerList.

```javascript
layerList.on("trigger-action", function (event) {
  const item = event.item;
  // Capture the action id.
  const id = event.action.id;

  if (id === "attributes") {
    // Toggle the feature table widget based on the selected table,
    // If the toggled on
    if (event.action.value) {
      // Check if the Feature Table is already created if so, don't recreate
      if (featureTable) {
        // If the table is already created, make sure that the featuretable toggle reflects the correct layer.
        // If toggling on a different layer, create the featuretable for that layer and toggle on
        if (item.layer.title != featureTable.layer.title) {
          // destroy the featuretable and recreate with new tablediv
          featureTable.destroy();

          // Load the FeatureTable based on whatever is clicked
          createTable(item.layer).then(function () {
            toggleFeatureTable(true);
          });
        } else {
          // if the table is the same one stored in featureTable, i.e. toggling on/of the same table, no need to recreate.
          toggleFeatureTable(true);
        }

        // If the featuretable is not already created, create a new one and toggle it on
      } else {
        // Create the table if not already created
        createTable(item.layer).then(function () {
          toggleFeatureTable(true);
        });
      }
    } else {
      // Toggle the table off
      toggleFeatureTable(false);
    }
  } else if (id === "information") {
    window.open(item.layer.url);
  }
});
```

## Related Documentation

- [Layerlist widget](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-LayerList.html)
- [ActionToggle](https://developers.arcgis.com/javascript/latest/api-reference/)
- [Sample Code: LayerList widget with actions](https://developers.arcgis.com/javascript/latest/sample-code/widgets-layerlist-actions/index.html)
- [Sample Code: TableList widget](https://developers.arcgis.com/javascript/latest/sample-code/widgets-tablelist/index.html)

## [Live Sample](https://esri.github.io/developer-support/web-js/4.x/LayerList-with-attribute-table-toggle/)
