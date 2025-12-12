import { useEffect } from 'react';
import { type AllWidgetProps } from 'jimu-core';
import type { IMConfig } from '../config';
import "@esri/calcite-components/components/calcite-button";
import "@esri/calcite-components/components/calcite-text-area";
import "./style.css"

const Widget = (props: AllWidgetProps<IMConfig>) => {

  function renderHtmlInSandbox(htmlContent, containerElementId) 
  {
      const container = document.getElementById(containerElementId);
      if (!container) {
          console.error(`Container element with ID '${containerElementId}' not found.`);
          return;
      }
      const iframe = document.getElementById("iframe-container"+props.id);
      iframe.srcdoc = htmlContent
  }

  function renderIframe()
  {
      let textInput = document.getElementById("text-input"+props.id);
      renderHtmlInSandbox(textInput.value,"iframe-container"+props.id);
  }

  useEffect(() => {
    let contentDiv = document.getElementById("content-div"+props.id);
    contentDiv.style.display = "flex";
    contentDiv.style.flexDirection = "row";

    let textInput = document.getElementById("text-input"+props.id);
    textInput.style.border = '1px solid #ccc';
    textInput.style.resize = 'horizontal';
    textInput.style.height = "100vh";
    textInput.style.width = "50%";
    textInput.value = htmlContent;

    let iframeContainer = document.getElementById("iframe-container"+props.id);
    iframeContainer.style.resize = "both";
    iframeContainer.style.flexWrap = "wrap";
    iframeContainer.style.border = "1px solid #ccc";
    iframeContainer.style.backgroundColor = "#FFFFFF";
    iframeContainer.style.flexGrow = "1";
    iframeContainer.style.height = "100vh";
    iframeContainer.style.width = "50%";
  }, []);

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

export default Widget

const htmlContent = 
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>Intro to map components - Create a 2D map | Sample | ArcGIS Maps SDK for JavaScript</title>

    <style>
      html,
      body {
        height: 100%;
        margin: 0;
      }
    </style>
    <!-- Load Calcite components from CDN -->
    <script type="module" src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"></script>

    <!-- Load the ArcGIS Maps SDK for JavaScript from CDN -->
    <script src="https://js.arcgis.com/4.34/"></script>

    <!-- Load Map components from CDN-->
    <script type="module" src="https://js.arcgis.com/4.34/map-components/"></script>
  </head>

  <body>
    <arcgis-map basemap="topo-vector" zoom="4" center="15, 65">
      <arcgis-zoom slot="top-left"></arcgis-zoom>
    </arcgis-map>
    <script type="module">
      // Get a reference to the map component
      const viewElement = document.querySelector("arcgis-map");

      // Wait for when the component is ready
      await viewElement.viewOnReady();
      console.log("Map component is ready", event);
    </script>
  </body>
</html>`;