# README

## ArcGIS Maps SDK for JavaScript: Add a Vector Tile Layer

This project demonstrates how to add a vector tile layer to a web map using the ArcGIS Maps SDK for JavaScript. It also includes functionality to dynamically change the paint properties of the vector tile layer based on selected attributes and restore the default styling.

### Features

- Load a vector tile layer with a popup template.
- Dynamically apply custom paint properties based on attribute selection.
- Restore the vector tile layer to its default style.
- Interactive dropdown for attribute selection.
- Button to restore default styling.

### Requirements

- Web browser with JavaScript enabled.
- Internet connection to access ArcGIS resources.
- Basic understanding of HTML, CSS, and JavaScript.

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/arcgis-vector-tile-layer.git
   cd arcgis-vector-tile-layer
   ```

2. **Host the code locally**:
   - Use any local development server like Python HTTP server, Live Server in VS Code, etc.

   Example using Python:
   ```bash
   python -m http.server 8000
   ```

   Open the browser at `http://localhost:8000`.

3. **Edit the code (if needed)**:
   - Open the `index.html` file in your favorite text editor to modify the vector tile layer URL or any other settings.

4. **Open the application**:
   - Open the `index.html` file in a web browser, or visit the hosted link if deployed online.

### File Structure

```plaintext
.
├── index.html   # Main HTML file with JavaScript for the app
└── README.md    # Documentation for the project
```

### Example Usage

- Select an attribute from the dropdown to change the paint properties of the vector tile layer.
- Click the "Restore Default Styling" button to reset the paint properties to their default values.

### Technologies Used

- **ArcGIS Maps SDK for JavaScript**: For mapping and layer functionality.
- **HTML/CSS**: For structure and styling.
- **JavaScript**: For interactivity and logic.

### Contribution

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-new-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-new-feature
   ```
5. Open a pull request.

### License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy building with the ArcGIS Maps SDK for JavaScript!
