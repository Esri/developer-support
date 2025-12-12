## Editor Component

This sample widget utilizes Map components from the ArcGIS Maps SDK for JavaScript to edit features in a web map. This widget was tested with version 1.19.

## Contents

- `manifest.json` - Defines widget metadata and EXB version and the enables the dependency for jimu-arcgis importing the ArcGIS Maps SDK for JavaScript.
- `src/runtime/widget.tsx` - Functional runtime component that renders the Editor component editing features in a web map.
- `src/setting/setting.tsx` - Builder settings panel containing just a simple text box and description.

## Prerequisites

- ArcGIS Experience Builder Developer Edition versions 1.19.
- Node.js version 22

## Installation

1. [Download Experience Builder Developer Edition version 1.19.](https://developers.arcgis.com/experience-builder/guide/downloads/)
2. Add the editor-component folder to the \client\your-extensions\widgets folder.
3. [Follow the EXB installation guide for the server service and the client service.](https://developers.arcgis.com/experience-builder/guide/install-guide/)
3. Restart (or rebuild) the EXB dev environment if required.
4. Add the widget to an experience which should immediatly render a web map and the Editor component.

## How it works

The editor-component widget imports the Map components from @arcgis/map-components and renders them into the main widget container.

## Code snippet

```typescript
const Widget = (props: AllWidgetProps<IMConfig>) => {
  return (
    <arcgis-map item-id="4793230052ed498ebf1c7bed9966bd35">
      <arcgis-editor slot="top-right"></arcgis-editor>
    </arcgis-map>
  )
}
```

## Note:

This widget is based on the same Editor component sample app from the ArcGIS Maps SDK for JavaScript [documentation](https://developers.arcgis.com/javascript/latest/sample-code/editor-basic/).