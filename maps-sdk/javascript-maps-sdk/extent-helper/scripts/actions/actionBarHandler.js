import { layer, shared } from '../sharedStates.js';
import drawExtent from './drawExtent.js';
import getExtent from './getExtent.js';
import clearDrawing from './clearDrawing.js';
import toScene from './toScene.js';
import toMap from './toMap.js';

/* ==========================================================
Handle Action Button Clicks
========================================================== */ 
var activeAction;

const handleActionBarClick = ({ target }) => {
    if (target.tagName !== "CALCITE-ACTION") {
        return;
    }

    // This will occur if the user has already selected an action button.
    if (activeAction) {
        document.querySelector(`[data-action-id=${activeAction}]`).active = false;

        // If an existing panel is opened, close it.
        let activePanel = document.querySelector(`[data-panel-id=${activeAction}]`)
        if (activePanel) {
            activePanel.closed = true;
        }

        // Cancel any active sketch
        shared.sketchVM.cancel();
    }

    // This will determine if the user is clicking on a new action or if they are clicking on the old action to close it
    const nextAction = target.dataset.actionId;

    if (nextAction !== activeAction) {
        document.querySelector(`[data-action-id=${nextAction}]`).active = true;
        activeAction = nextAction;
    } else {
        activeAction = null;
    }

    /* ==========================================================
    Draw Extent Button
    ========================================================== */ 
    if (activeAction == "draw-extent") {
        // Main logic located in './drawExtent.js'
        drawExtent();
    }

    /* ==========================================================
    Input Extent Button
    ========================================================== */ 
    if (activeAction == "input-extent") {
        // Main logic located in './inputExtent.js'

        // Open the panel
        document.querySelector(`[data-panel-id=${activeAction}]`).closed = false;
        document.querySelector(`[data-panel-id=${activeAction}]`).querySelector("calcite-input-text").setFocus();


        document.querySelector(`[data-panel-id=${activeAction}]`).setFocus();
    }

    /* ==========================================================
    Get Extent Button
    ========================================================== */ 
    if (activeAction == "get-extent") {
        // Main logic located in './getExtent.js'
        getExtent();

        // Open the panel
        document.querySelector(`[data-panel-id=${activeAction}]`).closed = false;
        document.querySelector(`[data-panel-id=${activeAction}] calcite-button`).setFocus();
    }

    /* ==========================================================
    Clear Drawing Button
    ========================================================== */ 
    if (activeAction == "clear-drawing") {
        // Main logic located in './clearDrawing.js'
        clearDrawing();
        activeAction = null;
    }

    /* ==========================================================
    To Scene Button
    ========================================================== */ 
    if (activeAction == "to-scene") {
        // Main logic located in './toScene.js'
        toScene();
        
        document.querySelector(`[data-action-id=${activeAction}]`).active = false;
        document.querySelector(`[data-action-id=to-map]`).setFocus();
        
        // Action is complete
        activeAction = null;
    }

    /* ==========================================================
    To Map Button
    ========================================================== */ 
    if (activeAction == "to-map") {
        // Main logic located in './toMap.js'
        toMap();
        
        document.querySelector(`[data-action-id=${activeAction}]`).active = false;
        document.querySelector(`[data-action-id=to-scene]`).setFocus();

        // Action is complete
        activeAction = null;
    }

    /* ==========================================================
    Switch Projection Button
    ========================================================== */ 
    if (activeAction == "switch-projection") {
        // Main logic located in './switchProjection.js'

        // Open the panel
        document.querySelector(`[data-panel-id=${activeAction}]`).closed = false;
        document.querySelector(`[data-panel-id=${activeAction}]`).setFocus();
    }

    // About section
    if (activeAction == "about") {
        // Open the panel
        document.querySelector(`[data-panel-id=${activeAction}]`).closed = false;
        document.querySelector(`[data-panel-id=${activeAction}]`).setFocus();
    }
}

/* ==========================================================
Event Listeners
========================================================== */ 

// Enable click events on calcite-action-bar
document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

// Logic for closing calcite-dialog
// document.querySelector("calcite-dialog").addEventListener("calciteDialogClose", () => {
//     document.querySelector(`[data-action-id=${activeAction}]`).active = false;
//     document.querySelector(`[data-action-id=${activeAction}]`).setFocus();
//     activeAction = null;
// })

// Logic for closing all calcite-panels
document.querySelectorAll("calcite-panel").forEach(function (currentValue, currentIndex, listObj) {
    currentValue.addEventListener("calcitePanelClose", () => {
        document.querySelector(`[data-action-id=${activeAction}]`).active = false;
        document.querySelector(`[data-action-id=${activeAction}]`).setFocus();

        // Action is complete
        activeAction = null;
    })
})

// When view first loads, resize element to account for Calcite Action Bar size.
shared.mapEl.addEventListener("arcgisViewReadyChange", (event) => {
    shared.mapEl.constraints = {
        rotationEnabled: false,
    }

    shared.mapEl.view.padding = {
        left: 170
    };

    shared.sceneEl.view.padding = {
        left: 170
    };

    shared.mapEl.addLayer(layer);
});

var actionBarExpanded = true;

// Resize view element based on expanded status for Calcite Action Bar
document.addEventListener("calciteActionBarToggle", event => {
    actionBarExpanded = !actionBarExpanded;
    shared.mapEl.view.padding = {
        left: actionBarExpanded ? 170 : 49
    };

    shared.sceneEl.view.padding = {
        left: actionBarExpanded ? 170 : 49
    };
});

