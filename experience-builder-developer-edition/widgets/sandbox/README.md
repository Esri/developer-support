## Sandbox Widget

This sample widget demonstrates how to utilize a sandbox environment to render HTML code in an Iframe. This widget was tested with version 1.19.

## Contents

- `manifest.json` - Defines widget metadata and EXB version.
- `src/runtime/widget.tsx` - Functional runtime component that renders the UI components for the text input and Iframe.
- `src/setting/setting.tsx` - Builder settings panel containing just a simple text box and description.

## Prerequisites

- ArcGIS Experience Builder Developer Edition versions 1.19.
- Node.js version 22

## Installation

1. [Download Experience Builder Developer Edition version 1.19.](https://developers.arcgis.com/experience-builder/guide/downloads/)
2. Add the sandbox-widget folder to the \client\your-extensions\widgets folder.
3. [Follow the EXB installation guide for the server service and the client service.](https://developers.arcgis.com/experience-builder/guide/install-guide/)
3. Restart (or rebuild) the EXB dev environment if required.
4. Add the widget to an experience and click the Run button to render the HTML code in the Iframe.

## How it works

The sandbox widget utilizes a textarea component for editing HTML text and an Iframe to render the code.

## Code snippet

```typescript
const Widget = (props: AllWidgetProps<IMConfig>) => {

 ...

  return (
    <div id="main-widget-div">
      <div id="header-div">
        <div><calcite-button icon-start="play" onClick={renderIframe}>Run</calcite-button></div>
        <h1 id="header-text">Experience Builder Sandbox</h1>
      </div>
      <div id={"content-div"+props.id}>
        <textarea id={"text-input"+props.id} title="text-area" placeholder=""></textarea>
        <iframe id={"iframe-container"+props.id} sandbox='allow-scripts allow-forms' ></iframe>
      </div>
    </div>
  )
}
```

## Limitations

This widget can only render data that is publicly-accessible. Iframes cannot be used with configuring OAuth 2.0 to setup authentication from the ArcGIS Maps SDK for JavaScript to load a secured web map for example.