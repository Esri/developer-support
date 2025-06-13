import { layer, shared } from '../sharedStates.js';

export function drawExtent() {
    // Clear any existing graphics first
    layer.removeAll();

    // Change sketchVM settings based on map on scene
    if (shared.isScene) {
        shared.sketchVM.view = shared.sceneEl.view;
        shared.sketchVM.polygonSymbol = shared.symbol_3D;

    } else {
        shared.sketchVM.view = shared.mapEl.view;
        shared.sketchVM.polygonSymbol = shared.symbol_2D;
    }

    // User can create a rectangle using click and drag
    shared.sketchVM.create("rectangle", {mode: "freehand"});

    // Once sketching is complete, the Clear Drawing action button will be available for the user
    shared.sketchVM.on("create", function(event) {
        if (event.state === "complete") {
            document.querySelector('[data-action-id=clear-drawing]').disabled = false;
            document.querySelector('[data-action-id=clear-drawing]').active = false;
            shared.extentDrawn = true;
        }
    });
}

export default drawExtent;