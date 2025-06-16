export const [Basemap, SketchViewModel, GraphicsLayer, Graphic] = await $arcgis.import(["@arcgis/core/Basemap.js", "@arcgis/core/widgets/Sketch/SketchViewModel.js", "@arcgis/core/layers/GraphicsLayer.js", "@arcgis/core/Graphic.js"])

export var layer = new GraphicsLayer({
    elevationInfo: {
        mode: "relative-to-ground"
    }
})

export var shared = {
    mapEl: document.querySelector("arcgis-map"),
    sceneEl: document.querySelector("arcgis-scene"),

    isScene: false,
    extentDrawn: false,
    isFirstLoad: true,

    activeAction: null,

    symbol_2D: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        outline: {
            color: [194,0,0,1],
            style: "solid",
            width: 4
        },
        style: "none"
    },

    symbol_3D: {
        type: "polygon-3d",  // autocasts as new PolygonSymbol3D()
        symbolLayers: [{
            type: "extrude",  // autocasts as new ExtrudeSymbol3DLayer()
            size: 5000, 
            material: [255,255,255,0.5],
            edges: {
                type: "solid",
                color: [194,0,0,1],
                size: 4
            }
        }]
    },

    sketchVM: new SketchViewModel({
        layer: layer,
        defaultCreateOptions: {
            hasZ: true
        },
        defaultUpdateOptions: {
            enableZ: true
        },
        tooltipOptions: {
            enabled: true,
            helpMessage: "Click and drag to create your rectangle.",
            visibleElements: {
                area: false,
                coordinates: true,
                direction: false,
                distance: false,
                elevation: false,
                header: false,
                helpMessage: true,
                orientation: false,
                radius: false,
                rotation: false,
                scale: false,
                size: false,
                totalLength: false,
            }
        }
    })
};