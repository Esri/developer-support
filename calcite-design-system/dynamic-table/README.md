# Dynamic Table with Calcite Design System

## About
This sample shows how to create and manipulate a dynamic table created using Calcite Design System.

## How It Works
Manually add to the table based on your own inputs or use the 'Autofill table' button to automatically populate the table


### Setting up the table in HTML

1. Create the initial table

```html
<calcite-table id="results">
    <calcite-table-row slot="table-header">
        <calcite-table-header heading="City"></calcite-table-header>
        <calcite-table-header heading="Country"></calcite-table-header>
    </calcite-table-row>
</calcite-table>
```

2. Add a <slot> for new rows to be dynamically added.

```html
<calcite-table id="results">
    ...
    <!-- New rows to be added here -->
    <slot></slot>

</calcite-table>
```

3. Add a <template> for new rows to follow

```html
<calcite-table id="results">
    ...
    <!-- Row template -->
    <template id="rowContent">
        <calcite-table-row>
            <calcite-table-cell>{{ city }}</calcite-table-cell>
            <calcite-table-cell>{{ country }}</calcite-table-cell>
        </calcite-table-row>
    </template>

</calcite-table>
```

### Dynamically add data to the table

1. Import row template

```javascript
var newRow = document.importNode(document.getElementById("rowContent").content, true);
```

2. Access and manipulate cells using querySelector()

```javascript
newRow.querySelector("calcite-table-cell").textContent = city;
newRow.querySelector("calcite-table-cell:nth-child(2)").textContent = country;
```

3. Add the new row to the table's slot

```javascript
document.getElementById("results").querySelector("slot").appendChild(newRow);
```

### Showcasing getElementsByTagName to filter table

1. Loop through each row in the table

```javascript
const table = document.getElementById("results");
for (const tr of table.getElementsByTagName("calcite-table-row")) {

}
```

2. Obtain specific cell to compare to filter value

```javascript
const cityCell = tr.getElementsByTagName("calcite-table-cell")[0]; // Column 1
const countryCell = tr.getElementsByTagName("calcite-table-cell")[1]; // Column 2
```

3. Hide or show results based on filter value

```javascript
if (cityTextValue.toLowerCase().startsWith(filter) || countryTextValue.toLowerCase().startsWith(filter)) {
    tr.style.display = ""; // Show matching rows
} else {
    tr.style.display = "none"; // Hide non-matching rows
}
```

## Related Documentation

- [<calcite-table>](https://developers.arcgis.com/calcite-design-system/components/table/)
- [<calcite-input>](https://developers.arcgis.com/calcite-design-system/components/input/)
- [<calcite-button>](https://developers.arcgis.com/calcite-design-system/components/button/)
- [Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)

## Live Samples
https://esri.github.io/developer-support/calcite-design-system/dynamic-table