# Overview
This project demonstrates how to toggle between a 2D map and a 3D scene using the ArcGIS Maps SDK for JavaScript. The application includes a simple HTML page with a button that allows users to switch between the two views.

## Files
- **index.html**: The main HTML file containing the structure and logic for the map and scene toggle functionality.

## Dependencies
- ArcGIS Maps SDK for JavaScript
- Calcite Components
- ArcGIS Map Components

## How It Works

### HTML Structure
- The HTML file includes two main components: an `<arcgis-map>` element for the 2D map and an `<arcgis-scene>` element for the 3D scene.
- A `<calcite-button>` element is used to toggle between the map and scene views.

### CSS Styling
- The CSS ensures that the map and scene components fill the entire browser window.
- The toggle button is styled to be positioned at the top-left corner of the viewport.

### JavaScript Logic
- The JavaScript code initializes the state by displaying the map and hiding the scene.
- An event listener is added to the toggle button to switch between the map and scene views when clicked.
- The button's class is updated to reflect the current view (either "2D" or "3D").

## Usage
1. Open `index.html` in a web browser.
2. Click the "Toggle View" button to switch between the 2D map and the 3D scene.

## Conclusion
This project provides a simple example of how to use the ArcGIS Maps SDK for JavaScript to create an interactive map and scene toggle functionality. It can be extended and customized further based on specific requirements.