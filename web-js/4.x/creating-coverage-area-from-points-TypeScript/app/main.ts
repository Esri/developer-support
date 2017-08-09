import esriRequest = require("esri/request");
import geometryEngine = require("esri/geometry/geometryEngine");

import Color = require("esri/Color");
import EsriMap = require("esri/Map");
import Geometry = require("esri/geometry/Geometry");
import Graphic = require("esri/Graphic");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import MapView = require("esri/views/MapView");
import Point = require("esri/geometry/Point");
import Polygon = require("esri/geometry/Polygon");
import Polyline = require("esri/geometry/Polyline");
import PopupTemplate = require("esri/PopupTemplate");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import SpatialReference = require("esri/geometry/SpatialReference");

const pointsLayer = new GraphicsLayer();
const coverageLayer = new GraphicsLayer();
const fieldsLayer = new GraphicsLayer();

const map = new EsriMap({
  basemap: "satellite"
});

map.addMany([fieldsLayer, coverageLayer, pointsLayer]);

const view = new MapView({
  map: map,
  container: "viewDiv"
}).then(readJSONFiles);

function readJSONFiles(thisView: MapView): void {
  let promises = [esriRequest(
     "app/SprayTruckPoints.json",
     {
		responseType: "json",
		method: "get"
     }
   ), esriRequest(
 	    "app/FieldPolygons.json",
      {
 		responseType: "json",
 		method: "get"
      }
    )];
   Promise.all(promises).then((results:Array<EsriRequestResponse>) => {
      createCoverages(results[0].data, results[1].data, thisView);
   });
}

function createCoverages(pointsJSON:FeatureCollectionJSON, fieldsJSON:FeatureCollectionJSON, thisView:MapView): void {
  let fieldSymbol = new SimpleFillSymbol({
    color: new Color([38, 115, 0, 0.79])
  });
  let fieldTemplate = new PopupTemplate({
    title: "Field #{FieldNumbe}",
    content: "<b>Area<b>: {area} acres<br/><b>Area Missed</b>: {missed} acres<br/><b>Coverage<b>: {coverage} %<br/><b>Waste<b>: {wasted} acres"
  });
  let fields = addGraphicsToMap(fieldsJSON.features, thisView.spatialReference, fieldTemplate, fieldSymbol, fieldsLayer, "polygon");

  let pointSymbol = new SimpleMarkerSymbol({
    size: 4,
    color: new Color([255, 255, 255, 1])
  });
  let pointTemplate = new PopupTemplate({
    title: "Spray Point #{FID}",
    content: "<b>Spray Width<b>: {SprayWidth} feet<br/><b>Spraying?: {Spraying}"
  });
  let points = addGraphicsToMap(pointsJSON.features, thisView.spatialReference, pointTemplate, pointSymbol, pointsLayer, "point");

  let bufferSymbol = new SimpleFillSymbol({
    color: new Color([92, 92, 92, 0.84])
  });
  let coverageTemplate = new PopupTemplate({
    title: "Coverage",
    content: "<b>Coverage Area<b>: {area} acres"
  });
  let coverages = calculateCoverages(points, thisView, bufferSymbol, coverageLayer, coverageTemplate);
  coverageLayer.addMany(coverages);

  findTotalAreaCovered(fieldsLayer, coverages);

  thisView.goTo(fieldsLayer.graphics.getItemAt(0).geometry.extent);
}

function addGraphicsToMap(features:Array<FeatureJSON>, spatialReference:SpatialReference, template:PopupTemplate, symbol:SimpleFillSymbol, layer:GraphicsLayer, type:string): Array<Graphic> {
  let graphicsArray = [];

  for(let feature of features) {
    let geometry = null;
    if(type == "point") {
      geometry = new Point({
        x:(feature.geometry as Point).x,
        y:(feature.geometry as Point).y,
        spatialReference: spatialReference
      });
    }
    else if(type =="polygon") {
      geometry = new Polygon({
        rings:(feature.geometry as Polygon).rings,
        spatialReference: spatialReference
      });
      feature.attributes["area"] = geometryEngine.geodesicArea(geometry, "acres").toFixed(2);;
    }
    let graphic = new Graphic({
        geometry:geometry,
        symbol:symbol,
        attributes:feature.attributes,
        popupTemplate:template
    });
    graphicsArray.push(graphic);
    layer.add(graphic);
  }
  return graphicsArray;
}

function calculateCoverages(points:Array<Graphic>, thisView:MapView, bufferSymbol:SimpleFillSymbol, bufferLayer:GraphicsLayer, template:PopupTemplate): Array<Graphic> {
  let currentWidth = null;
  let currentPolyline = null;
  let buffers = [];

  for(let i = 0; i < points.length; i++) {
    if(!currentWidth && points[i].attributes.Spraying == 1) {
      currentPolyline = new Polyline(points[i].geometry.spatialReference);
      currentPolyline.addPath([[(points[i].geometry as Point).x , (points[i].geometry as Point).y]]);
      currentWidth = points[i].attributes.SprayWidth;
    }
    else if(currentWidth == points[i].attributes.SprayWidth && points[i].attributes.Spraying == 1) {
      currentPolyline.insertPoint(0, currentPolyline.paths[0].length, points[i].geometry as Point);
    }
    else {
      if(currentPolyline) {
        let bufferGraphic = createBufferGraphic(currentPolyline, currentWidth, buffers, bufferSymbol, template);
        buffers.push(bufferGraphic);
        currentWidth = points[i].attributes.SprayWidth;
        currentPolyline = null;
      }
      if(points[i].attributes.Spraying == true) {
        currentPolyline = new Polyline(points[i].geometry.spatialReference);
        currentPolyline.addPath([[(points[i].geometry as Point).x , (points[i].geometry as Point).y]]);
      }
    }
  }
  if(currentPolyline) {
    let bufferGraphic = createBufferGraphic(currentPolyline, currentWidth, buffers, bufferSymbol, template);
    buffers.push(bufferGraphic);
  }
  return buffers;
}

function createBufferGraphic(line:Polyline, width:number, buffers:Array<Graphic>, symbol:SimpleFillSymbol, template:PopupTemplate): Graphic {
  let buffer = geometryEngine.geodesicBuffer(line, (width / 2), "feet");
  if(buffers.length > 0) {
    if(geometryEngine.overlaps(buffer as Polygon, buffers[buffers.length -1].geometry)) {
      buffer = geometryEngine.union([buffer as Polygon,  buffers[buffers.length -1].geometry]) as Polygon;
      buffers.pop();
    }
  }
  let area = geometryEngine.geodesicArea(buffer as Polygon, "acres").toFixed(2);
  return new Graphic({geometry:buffer, symbol:symbol, attributes:{"area":area},popupTemplate:template});
}

function findTotalAreaCovered(fields:GraphicsLayer,buffers:Array<Graphic>) {
  for(let i = 0; i < buffers.length; i++) {
    let field = fields.graphics.shift();
    let wastedAreaGeometry = geometryEngine.difference(buffers[i].geometry, field.geometry);
    field.attributes["wasted"] = geometryEngine.geodesicArea(wastedAreaGeometry as Polygon, "acres").toFixed(2);
    field.attributes["coverage"] = (((buffers[i].attributes.area - field.attributes.wasted)/ field.attributes.area) * 100).toFixed(2);
    field.attributes["missed"] = (field.attributes.area - (buffers[i].attributes.area - field.attributes.wasted)).toFixed(2);
    fields.graphics.push(field);
  }
}

interface FeatureJSON {
  attributes: Object,
  geometry: Geometry
}

interface FeatureCollectionJSON {
  displayFieldName: string,
  features: Array<FeatureJSON>,
  fieldAliases: JSON,
  fields: Array<JSON>
  geometryType: string,
  spatialReference: SpatialReference
}

interface EsriRequestResponse {
  data: FeatureCollectionJSON,
  requestOptions: Object,
  url: string
}
