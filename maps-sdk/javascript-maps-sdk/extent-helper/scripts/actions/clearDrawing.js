import { layer, shared } from '../sharedStates.js';

export function clearDrawing() {
    layer.removeAll();
    shared.extentDrawn = false;

    document.querySelector('[data-action-id=draw-extent]').active = false;
    document.querySelector('[data-action-id=clear-drawing]').disabled = true;
}

export default clearDrawing;