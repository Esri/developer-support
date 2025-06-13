import { Basemap, layer, shared } from '../sharedStates.js';

// Switch projection
let radioButtonGroup = document.querySelector("calcite-radio-button-group");

radioButtonGroup.addEventListener("calciteRadioButtonGroupChange", () => {
    layer.removeAll();
    shared.extentDrawn = false;

    // 2D Basemaps
    var basemapWGS84_2D = new Basemap({
        portalItem: {
            id: "eb303185d14e45e9be8bbbc1c0daf7ab",
        }
    })

    var basemapWebMercator_2D = Basemap.fromId("streets-navigation-vector");

    // Set SR of map
    shared.mapEl.spatialReference = {
        wkid: radioButtonGroup.selectedItem.value
    }

    // Set new basemaps
    radioButtonGroup.selectedItem.value == 4326 ? shared.mapEl.basemap = basemapWGS84_2D : shared.mapEl.basemap = basemapWebMercator_2D;
})