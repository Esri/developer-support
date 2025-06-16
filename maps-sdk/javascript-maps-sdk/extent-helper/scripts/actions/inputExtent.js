import { Graphic, layer, shared } from '../sharedStates.js';

// Draw extent based on user's input
document.querySelector("[data-panel-id=input-extent] calcite-button").addEventListener("click", () => {

    var span = document.querySelector("[data-panel-id=input-extent] span");

    let inp = document.querySelector("[data-panel-id=input-extent] calcite-input-text").value;
    
    try {
        span.hidden = true;

        let inpJSON = JSON.parse(inp);

        // This should work for both 2D and 3D polygons. There is currently a warning in 4.32 about missing rings, but it seems the polygon3D draws.
        let inputGraphic = new Graphic({
            geometry: {
                type: "polygon",
                rings: [
                    [
                        [inpJSON.xmin, inpJSON.ymin], 
                        [inpJSON.xmax, inpJSON.ymin], 
                        [inpJSON.xmax, inpJSON.ymax], 
                        [inpJSON.xmin, inpJSON.ymax]
                    ]
                ],
                spatialReference: inpJSON.spatialReference,
            },
            symbol: shared.isScene ? shared.symbol_3D : shared.symbol_2D
        });

        // Clear any existing graphics first
        layer.removeAll();

        // Draw the graphic
        layer.add(inputGraphic);

        shared.extentDrawn = true;
        span.innerHTML = "";

        // Once the graphic is drawn, animate to it.
        shared.isScene ? shared.sceneEl.goTo(inputGraphic) : shared.mapEl.goTo(inputGraphic);

        // Once graphic is drawn, enable Clear Drawing action
        if (shared.extentDrawn) {
            document.querySelector('[data-action-id=clear-drawing]').disabled = false;
            document.querySelector('[data-action-id=clear-drawing]').active = false;
        }

    } catch (err) {
        console.log(err);
        span.style.color = "red";
        span.innerHTML = `Error, please try again: ${err}`;
        span.hidden = false;
    }
})