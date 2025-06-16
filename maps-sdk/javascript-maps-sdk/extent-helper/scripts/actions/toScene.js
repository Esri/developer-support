import { layer, shared } from '../sharedStates.js';
import { clearDrawing } from './clearDrawing.js';

export function toScene() {
    clearDrawing();

    shared.sceneEl.addLayer(layer);

    shared.mapEl.style.display = "none";
    shared.sceneEl.style.display = "inline";

    // Set the position of the camera to be where the map last was
    if (shared.isFirstLoad) { // Scene doesn't seem to load when you set display: "none", so now we have to wait for it to load when it's first displayed. Anytime after this "first load", it's good to go.
        shared.sceneEl.addEventListener("arcgisViewReadyChange", () => {
            shared.sceneEl.goTo({
                center: shared.mapEl.center,
                zoom: shared.mapEl.zoom
            }, {animate: false})

            shared.isFirstLoad = false;
        });
    } else {
        shared.sceneEl.goTo({
            center: shared.mapEl.center,
            zoom: shared.mapEl.zoom
        }, {animate: false}) 
    }

    document.querySelector('[data-action-id=to-scene]').style.display = "none";
    document.querySelector('[data-action-id=to-map]').style.display = "inline";

    document.querySelector('[data-action-id=switch-projection]').disabled = true;

    shared.isScene = true;
}

export default toScene;