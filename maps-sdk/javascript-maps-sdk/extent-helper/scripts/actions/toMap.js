import { layer, shared } from '../sharedStates.js';
import { clearDrawing } from './clearDrawing.js';

export function toMap() {
    clearDrawing();

    shared.mapEl.addLayer(layer);

    shared.sceneEl.style.display = "none";
    shared.mapEl.style.display = "inline";

    // Set the position of the map to be where the scene last was
    shared.mapEl.goTo({
        center: shared.sceneEl.center,
        zoom: shared.sceneEl.zoom
    }, {animate: false})

    shared.sketchVM.view = shared.mapEl.view;

    document.querySelector('[data-action-id=to-map]').style.display = "none";
    document.querySelector('[data-action-id=to-scene]').style.display = "inline";

    document.querySelector('[data-action-id=switch-projection]').disabled = false;

    shared.isScene = false;
}

export default toMap;