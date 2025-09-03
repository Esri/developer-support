# Open Popups using HitTest

## About

This sample shows how to open pop-ups using HitTest.

## How It Works

1. Set up the interface for your popup from viewElement. For this sample, the popup is docked to the top-right of the screen and all action buttons are turned off.

```javascript
viewElement.popup = new Popup({
    dockEnabled: true,
    dockOptions: {
        buttonEnabled: false,
        position: "top-right",
        breakpoint: false
    },
    visibleElements: {
        actionBar: false,
        closeButton: false,
        collapseButton: false,
        featureMenuHeading: false,
        featureNavigation: false,
    }
})
```

2. When displaying your layer as a cluster, you can set a popupTemplate for your cluster configuration

```javascript
const clusterConfig = {
    type: "cluster",
    ...
    popupTemplate: {
        title: "This is a cluster of incidents",
        content: `<p>This cluster represents <b>{cluster_count}</b> incidents.`,
    },
    ...
}
```

3. Handle the HitTest logic on your layers. You can learn more about HitTest from this sample: [https://developers.arcgis.com/javascript/latest/sample-code/map-component-hittest/](https://developers.arcgis.com/javascript/latest/sample-code/map-component-hittest/)

4. While handling HitTest, call viewElement.openPopup()

```javascript
graphics = response.results[0].graphic;
...
viewElement.openPopup({
    features: [graphics]
})
```

5.  Also ensure that you close the popup if no results are returned from the HitTest

```javascript
if (!response.results.length) {
    ...
    viewElement.closePopup();
    return;
}
```

## Related Documentation

- [MapView.popup](https://developers.arcgis.com/javascript/latest/references/map-components/arcgis-map/#popup)
- [MapView.openPopup()](https://developers.arcgis.com/javascript/latest/references/map-components/arcgis-map/#openPopup)
- [MapView.closePopup()](https://developers.arcgis.com/javascript/latest/references/map-components/arcgis-map/#closePopup)
- [HitTest Sample](https://developers.arcgis.com/javascript/latest/sample-code/map-component-hittest/)
- [Cluster Sample](https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster/)
- [FeatureReductionCluster](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-support-FeatureReductionCluster.html)
- [FeatureReductionCluster.popupTemplate](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-support-FeatureReductionCluster.html#popupTemplate)

## Live Samples

- [Open popups with HitTest](https://esri.github.io/developer-support/maps-sdk/javascript-maps-sdk/open-popups-with-hittest)
