define(["require", "exports", "esri/request", "esri/geometry/geometryEngine", "esri/Color", "esri/Map", "esri/Graphic", "esri/layers/GraphicsLayer", "esri/views/MapView", "esri/geometry/Point", "esri/geometry/Polygon", "esri/geometry/Polyline", "esri/PopupTemplate", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol"], function (require, exports, esriRequest, geometryEngine, Color, EsriMap, Graphic, GraphicsLayer, MapView, Point, Polygon, Polyline, PopupTemplate, SimpleFillSymbol, SimpleMarkerSymbol) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pointsLayer = new GraphicsLayer();
    var coverageLayer = new GraphicsLayer();
    var fieldsLayer = new GraphicsLayer();
    var map = new EsriMap({
        basemap: "satellite"
    });
    map.addMany([fieldsLayer, coverageLayer, pointsLayer]);
    var view = new MapView({
        map: map,
        container: "viewDiv"
    }).then(readJSONFiles);
    function readJSONFiles(thisView) {
        var promises = [esriRequest("app/SprayTruckPoints.json", {
                responseType: "json",
                method: "get"
            }), esriRequest("app/FieldPolygons.json", {
                responseType: "json",
                method: "get"
            })];
        Promise.all(promises).then(function (results) {
            createCoverages(results[0].data, results[1].data, thisView);
        });
    }
    function createCoverages(pointsJSON, fieldsJSON, thisView) {
        var fieldSymbol = new SimpleFillSymbol({
            color: new Color([38, 115, 0, 0.79])
        });
        var fieldTemplate = new PopupTemplate({
            title: "Field #{FieldNumbe}",
            content: "<b>Area<b>: {area} acres<br/><b>Area Missed</b>: {missed} acres<br/><b>Coverage<b>: {coverage} %<br/><b>Waste<b>: {wasted} acres"
        });
        var fields = addGraphicsToMap(fieldsJSON.features, thisView.spatialReference, fieldTemplate, fieldSymbol, fieldsLayer, "polygon");
        var pointSymbol = new SimpleMarkerSymbol({
            size: 4,
            color: new Color([255, 255, 255, 1])
        });
        var pointTemplate = new PopupTemplate({
            title: "Spray Point #{FID}",
            content: "<b>Spray Width<b>: {SprayWidth} feet<br/><b>Spraying?: {Spraying}"
        });
        var points = addGraphicsToMap(pointsJSON.features, thisView.spatialReference, pointTemplate, pointSymbol, pointsLayer, "point");
        var bufferSymbol = new SimpleFillSymbol({
            color: new Color([92, 92, 92, 0.84])
        });
        var coverageTemplate = new PopupTemplate({
            title: "Coverage",
            content: "<b>Coverage Area<b>: {area} acres"
        });
        var coverages = calculateCoverages(points, thisView, bufferSymbol, coverageLayer, coverageTemplate);
        coverageLayer.addMany(coverages);
        findTotalAreaCovered(fieldsLayer, coverages);
        thisView.goTo(fieldsLayer.graphics.getItemAt(0).geometry.extent);
    }
    function addGraphicsToMap(features, spatialReference, template, symbol, layer, type) {
        var graphicsArray = [];
        for (var _i = 0, features_1 = features; _i < features_1.length; _i++) {
            var feature = features_1[_i];
            var geometry = null;
            if (type == "point") {
                geometry = new Point({
                    x: feature.geometry.x,
                    y: feature.geometry.y,
                    spatialReference: spatialReference
                });
            }
            else if (type == "polygon") {
                geometry = new Polygon({
                    rings: feature.geometry.rings,
                    spatialReference: spatialReference
                });
                feature.attributes["area"] = geometryEngine.geodesicArea(geometry, "acres").toFixed(2);
                ;
            }
            var graphic = new Graphic({
                geometry: geometry,
                symbol: symbol,
                attributes: feature.attributes,
                popupTemplate: template
            });
            graphicsArray.push(graphic);
            layer.add(graphic);
        }
        return graphicsArray;
    }
    function calculateCoverages(points, thisView, bufferSymbol, bufferLayer, template) {
        var currentWidth = null;
        var currentPolyline = null;
        var buffers = [];
        for (var i = 0; i < points.length; i++) {
            if (!currentWidth && points[i].attributes.Spraying == 1) {
                currentPolyline = new Polyline(points[i].geometry.spatialReference);
                currentPolyline.addPath([[points[i].geometry.x, points[i].geometry.y]]);
                currentWidth = points[i].attributes.SprayWidth;
            }
            else if (currentWidth == points[i].attributes.SprayWidth && points[i].attributes.Spraying == 1) {
                currentPolyline.insertPoint(0, currentPolyline.paths[0].length, points[i].geometry);
            }
            else {
                if (currentPolyline) {
                    var bufferGraphic = createBufferGraphic(currentPolyline, currentWidth, buffers, bufferSymbol, template);
                    buffers.push(bufferGraphic);
                    currentWidth = points[i].attributes.SprayWidth;
                    currentPolyline = null;
                }
                if (points[i].attributes.Spraying == true) {
                    currentPolyline = new Polyline(points[i].geometry.spatialReference);
                    currentPolyline.addPath([[points[i].geometry.x, points[i].geometry.y]]);
                }
            }
        }
        if (currentPolyline) {
            var bufferGraphic = createBufferGraphic(currentPolyline, currentWidth, buffers, bufferSymbol, template);
            buffers.push(bufferGraphic);
        }
        return buffers;
    }
    function createBufferGraphic(line, width, buffers, symbol, template) {
        var buffer = geometryEngine.geodesicBuffer(line, (width / 2), "feet");
        if (buffers.length > 0) {
            if (geometryEngine.overlaps(buffer, buffers[buffers.length - 1].geometry)) {
                buffer = geometryEngine.union([buffer, buffers[buffers.length - 1].geometry]);
                buffers.pop();
            }
        }
        var area = geometryEngine.geodesicArea(buffer, "acres").toFixed(2);
        return new Graphic({ geometry: buffer, symbol: symbol, attributes: { "area": area }, popupTemplate: template });
    }
    function findTotalAreaCovered(fields, buffers) {
        for (var i = 0; i < buffers.length; i++) {
            var field = fields.graphics.shift();
            var wastedAreaGeometry = geometryEngine.difference(buffers[i].geometry, field.geometry);
            field.attributes["wasted"] = geometryEngine.geodesicArea(wastedAreaGeometry, "acres").toFixed(2);
            field.attributes["coverage"] = (((buffers[i].attributes.area - field.attributes.wasted) / field.attributes.area) * 100).toFixed(2);
            field.attributes["missed"] = (field.attributes.area - (buffers[i].attributes.area - field.attributes.wasted)).toFixed(2);
            fields.graphics.push(field);
        }
    }
});
//# sourceMappingURL=main.js.map