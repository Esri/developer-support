# Remove clustering information from Legend

## About

This sample shows how to remove clustering information from the Legend. This sample is a modification of [this sample](https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster/). Other minor modifications include:

- Implementation of [Map components](https://developers.arcgis.com/javascript/latest/references/map-components/)
- [Module loading via CDN](https://developers.arcgis.com/javascript/latest/get-started-cdn/#module-loading-via-cdn)
- Replacing the SimpleRenderer with [ClassBreaksRenderers](https://developers.arcgis.com/javascript/latest/api-reference/esri-renderers-ClassBreaksRenderer.html)

## How It Works

1. Create a function that hides cluster information

```javascript
function hideClusterInformation() {
    // Add code here

} 
```

2. Inside the function, first clone the layer's featureReduction object

```javascript
function hideClusterInformation() {
    const featureReductionTemplate = layer.featureReduction.clone();

} 
```

3. Add the same renderer, but include a new visualVariables property. Set showLegend to false inside the legendOptions property

```javascript
function hideClusterInformation() {
    const featureReductionTemplate = layer.featureReduction.clone();

    featureReductionTemplate.renderer = {
        type: "class-breaks",
        field: "mag",
        classBreakInfos: classBreakInfos, // classBreakInfos obtained from unique-value-symbol-config.js
        visualVariables: [{
            type: "size",
            field: "cluster_count",
            legendOptions: {
                showLegend: false
            },
            minDataValue: 2,
            maxDataValue: 400,
            minSize: 18,
            maxSize: 54
        }]
    }

} 
```

4. Wait for layer to finish loading before calling the hideClusterInformation() function

```javascript
mapElement.whenLayerView(layer).then(() => {
    hideClusterInformation();
});
```

5. Add the same function to the toggle button functionality. It is important that you set the layer.featureReduction to clusterConfig before calling the hideClusterInformation() function.

```javascript
toggleButton.addEventListener("click", () => {
    let fr = layer.featureReduction;

    if  (fr && fr.type === "cluster") {
        layer.featureReduction = null;
        toggleButton.innerText = "Enable Clustering";
                
    } else {
        layer.featureReduction = clusterConfig;
        hideClusterInformation(); 
        toggleButton.innerText = "Disable Clustering";
    }
});
```

## Related Documentation

- [FeatureReductionCluster](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-support-FeatureReductionCluster.html)
- [VisualVariables.legendOptions](https://developers.arcgis.com/javascript/latest/api-reference/esri-renderers-visualVariables-VisualVariable.html#legendOptions)

## Live Samples

- [Remove Clustering Info From Legend](https://esri.github.io/developer-support/maps-sdk/javascript-maps-sdk/remove-cluster-info-from-legend)
