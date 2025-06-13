import { layer, shared } from '../sharedStates.js';

let copyButton = document.querySelector("[data-panel-id=get-extent] calcite-button");
const carousel = document.querySelector("calcite-carousel");

let textTemplate;
var mapExtentItem = document.getElementById("carouselContent");

export function getExtent() {
    var carouselItems = document.querySelectorAll("calcite-carousel-item");
    
    // Reset carousel items
    if (carouselItems.length > 1) {
        carouselItems.item(0).remove();
    }

    getLiveExtent();

    // If there is a drawn graphic, add a new carousel item with drawn extent.
    if (shared.extentDrawn) {
        textTemplate = JSON.stringify(layer.graphics.items[0].geometry.extent.toJSON());
        textTemplate = textTemplate.replace(/,/g, ', ');

        var drawnExtentItem = document.importNode(document.getElementById("carouselContent"), true);
        drawnExtentItem.querySelector("h2").textContent = "Drawn Extent";
        drawnExtentItem.querySelector(".custom-content span").textContent = textTemplate;
        carousel.insertBefore(drawnExtentItem, mapExtentItem);
    }
}

function getLiveExtent() {
    // Resets copy button's text
    copyButton.innerHTML = "Copy to clipboard";

    // Add Zoom and Center values
    let centerSpan = document.getElementById("centerSpan");
    let zoomSpan = document.getElementById("zoomSpan");

    if (!shared.isScene) {
        textTemplate = JSON.stringify(shared.mapEl.view.extent.toJSON());
        textTemplate = textTemplate.replace(/,/g, ', ');

        mapExtentItem.querySelector("h2").textContent = "Map Extent";

        centerSpan.innerHTML = `[${Math.round(shared.mapEl.center.latitude*1000)/1000}, ${Math.round(shared.mapEl.center.longitude*1000)/1000}]`;
        zoomSpan.innerHTML = shared.mapEl.zoom;
    } else {
        textTemplate = JSON.stringify(shared.sceneEl.view.extent.toJSON());
        textTemplate = textTemplate.replace(/,/g, ', ');

        mapExtentItem.querySelector("h2").textContent = "Scene Extent";
        centerSpan.innerHTML = `[${Math.round(shared.sceneEl.center.latitude*1000)/1000}, ${Math.round(shared.sceneEl.center.longitude*1000)/1000}]`;
        zoomSpan.innerHTML = shared.sceneEl.zoom;
    }

    mapExtentItem.querySelector(".custom-content span").textContent = textTemplate;
}

/* ==========================================================
Handle live extent
========================================================== */ 
shared.mapEl.addEventListener("arcgisViewReadyChange", () => {
    shared.mapEl.addEventListener("arcgisViewChange", () => {
        // console.log("arcgisViewChange triggered");
        getLiveExtent();
    });

    shared.mapEl.addEventListener("arcgisViewDrag", () => {
        // console.log("arcgisViewDrag triggered");
        getLiveExtent();
    });

    window.addEventListener("resize", () => {
        // console.log("window.resize triggered");
        getLiveExtent();
    });
})

shared.sceneEl.addEventListener("arcgisViewReadyChange", () => {
    shared.sceneEl.addEventListener("arcgisViewChange", () => {
        // console.log("arcgisViewChange triggered");
        getLiveExtent();
    });

    shared.sceneEl.addEventListener("arcgisViewDrag", () => {
        // console.log("arcgisViewDrag triggered");
        getLiveExtent();
    });

    window.addEventListener("resize", () => {
        // console.log("window.resize triggered");
        getLiveExtent();
    });
})

/* ==========================================================
Handle copy button
========================================================== */ 
copyButton.addEventListener("click", async () => {
    let carouselItem = document.querySelector("calcite-carousel").selectedItem;

    await navigator.clipboard.writeText(carouselItem.querySelector(".custom-content span").innerHTML);
    copyButton.innerHTML = "Copied!"

})

// Reset copy button when carousel changes
carousel.addEventListener("calciteCarouselChange", () => {
    copyButton.innerHTML = "Copy to clipboard";
})


export default getExtent;