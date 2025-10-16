# Show loading icon

## About

For layers with a large number of features and details, sometimes it might take a bit while for them to be fully drawn on the view. This sample shows how to display a loading icon to indicate whether the view is updating. 

This sample is a modification of an [older sample](https://github.com/Esri/developer-support/tree/master/web-js/4.x/show-loading-icon). These modifications include:
- Migration from version 4.16 to 4.32
- Implementation of [Map components](https://developers.arcgis.com/javascript/latest/references/map-components/)
- [Module loading via CDN](https://developers.arcgis.com/javascript/latest/4.32/#module-loading-via-cdn)
- Using [Calcite Design System](https://developers.arcgis.com/calcite-design-system/)

## How It Works

1. Add Calcite Scrim to the body. If you would like more customization over how the loader looks, consider using [Calcite Loader](https://developers.arcgis.com/calcite-design-system/components/loader/) instead.

```html
<calcite-scrim loading></calcite-scrim>
```

2. Wait for viewElement to load

```javascript
viewElement.addEventListener("arcgisViewReadyChange", (event) => {
    ...
});
```

3. Use the reactiveUtils class to watch the value of viewElement.updating. Hide the loader if updating is false.

```javascript
reactiveUtils.watch(
    // getValue function
    () => viewElement.updating,
    // callback
    (updating) => {
        scrim.style.display = 'none';
    });
```

## Related Documentation

- [Calcite Scrim](https://developers.arcgis.com/calcite-design-system/components/scrim/)
- [Calcite Loader](https://developers.arcgis.com/calcite-design-system/components/loader/)
- [reactiveUtils](https://developers.arcgis.com/javascript/latest/api-reference/esri-core-reactiveUtils.html)

## Live Samples

- [Show loading icon](https://esri.github.io/developer-support/maps-sdk/javascript-maps-sdk/show-loading-icon)