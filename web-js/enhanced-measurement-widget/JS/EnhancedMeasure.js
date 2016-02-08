//********************************************************************************************************************************************
//Created by Nicholas Haney
//Completed on June 30th 2015
//********************************************************************************************************************************************
define([
	"dojo/_base/declare",
	"dojo/dom",
	"dojo/on",
	"dojo/_base/lang",
	"esri/Color",
	"esri/graphic",
	"esri/dijit/Measurement",
	"esri/geometry/Point",
	"esri/layers/GraphicsLayer",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/TextSymbol",
	"esri/symbols/Font",
	"esri/tasks/DistanceParameters",
	"esri/tasks/GeometryService",
], function (
  declare, dom, on, lang, Color, Graphic, Measurement, Point, GraphicsLayer, SimpleRenderer, TextSymbol, Font, DistanceParameters, GeometryService
) {
	return declare([Measurement], {
		
		options: {
			distanceParams: null,
			graphicLayer: null,
			pointArray: [],
			calculatePoints: null,
			event: false,
			notMeasuring: true,
			mapHasGraphic: false,
			currentDistanceUnits: null,
			symbolFont: null
		},

		constructor: function(options, srcRefNode) {
			//set the values of the class level variables
			var defaults = lang.mixin({}, this.options, options);
			this.set("distanceParams", defaults.distanceParams);
			this.set("graphicLayer", defaults.graphicLayer);
			this.set("pointArray", defaults.pointArray);
			this.set("calculatePoints", defaults.calculatePoints);
			this.set("event", defaults.event);
			this.set("notMeasuring", defaults.notMeasuring);
			this.set("mapHasGraphic", defaults.mapHasGraphic);
			this.set("currentDistanceUnits", defaults.currentDistanceUnits);
			this.set("symbolFont", defaults.symbolFont);
		},
		
		//adds a click event to the map
		_addClickEvent: function() {
			//as the map now has an event, set event to true
			this.event = true;
			//set the value of calculatePoints to the map click event
			this.calculatePoints = this.map.on("click", lang.hitch(this, function(evt) {
				//add the click point to the point array
				this.pointArray.push(evt.mapPoint);
				//if there are 2 or more points in the array
				if(this.pointArray.length > 1) {
					//pull out the next to last point in the array
					this.distanceParams.geometry1 = this.pointArray[(this.pointArray.length - 2)];
					//pull out the last point in the array
					this.distanceParams.geometry2 = this.pointArray[(this.pointArray.length - 1)];
					//call the calculate distance function
					this._calculateDistance(this.distanceParams.geometry1, this.distanceParams.geometry2);
				}
			}));	
		},
		
		//function to calculate the angle of the point
		_calculateAngle: function(point1, point2) {
			//find the angle based on the two input points
			deltaX = (point2.x - point1.x);
			deltaY = (point2.y - point1.y);
			angle = (Math.atan2(deltaX, deltaY) * 180 / Math.PI) - 90;
			//to prevent the text from displaying upside down, reverse the angle if it is less than -90 degress
			if(angle < -90) {
				angle += 180;
			}
			return angle;		
		},
		
		//function to calculate the length of the line segment	
		_calculateDistance: function(point1, point2) {
			switch(this.currentDistanceUnits) {
				case "Feet": this.distanceParams.distanceUnit = GeometryService.UNIT_FOOT; break;
				case "Yards": this.distanceParams.distanceUnit = GeometryService.UNIT_FOOT; break;
				case "Meters": this.distanceParams.distanceUnit = GeometryService.UNIT_METER; break;
				case "Miles": this.distanceParams.distanceUnit = GeometryService.UNIT_STATUTE_MILE; break;
				case "Kilometers": this.distanceParams.distanceUnit = GeometryService.UNIT_KILOMETER; break;
				case "Nautical Miles": this.distanceParams.distanceUnit = GeometryService.UNIT_US_NAUTICAL_MILE; break;
				default: this.distanceParams.distanceUnit = GeometryService.UNIT_METER;
			}
			//Return the geodesic distance 
			this.distanceParams.geodesic = true;
			//Use the default geometry service to calculate the distance
			esriConfig.defaults.geometryService.distance(this.distanceParams, lang.hitch(this, function(results) {
				//Get the midpoint of the line segment
				var midPoint = this._calculateMidPoint(point1, point2);
				//Get the angle of the line segment
				var angle = this._calculateAngle(point1, point2);
				//Create a text symbol
				var textSymbol = this._createTextSymbol(results, angle);
				//Add the graphic to the map
				this.graphicLayer.add(new Graphic(midPoint, textSymbol));
			}));				
		},

		//function to calculate the midpoint of the line segment	
		_calculateMidPoint: function(point1, point2) {
			//Use the midpoint formula you learned in middle school
			var x = ((point1.x + point2.x)/2);
			var y = ((point1.y + point2.y)/2);
			var midPoint = new Point([x, y], this.map.spatialReference);
			return midPoint 
		},
		
		//calculatie the offset of the label so it will not overlap the measurement line
		_calculateSymbolOffset: function(angle) {
			var offset = {};
			if(angle <= 25 && angle >= -25) {
				offset.x = 0;
				offset.y = 3;
			}
			else if(angle > 25 && angle <= 75) {
				offset.x = 3;
				offset.y = 3;
			}
			else if(angle > 75 && angle <= 125) {
				offset.x = 3;
				offset.y = 0;
			}
			else if(angle < -25 && angle >= -75) {
				offset.x = -3;
				offset.y = 3;
			}
			else if(angle < -75 && angle >= -125) {
				offset.x = -3;
				offset.y = 0;
			}
			else {
				offset.x = 0;
				offset.y = 0;
			}
			return offset;
		},

		_createMeasurementWidget: function() {
			//create a graphics layer to hold the distance labels
			this.graphicLayer = new GraphicsLayer();
			this.map.addLayers([this.graphicLayer]);
			//add event listeners
			this.on("measure-end", lang.hitch(this, this._measureEndEvent));
			this.on("tool-change", lang.hitch(this, this._toolChangeEvent));
			this.on("unit-change", lang.hitch(this, this._unitChangeEvent));
			this.on("measure-start", lang.hitch(this, this._measureStartEvent));
			on(this._areaButton, "click", lang.hitch(this, this._polygonButtonClicked));
			on(this._distanceButton, "click", lang.hitch(this, this._lineButtonClicked));
			//create a new distance parameters object
			this.distanceParams = new DistanceParameters();
		},
		
		//Create the text symbol	
		_createTextSymbol: function(result, angle) {
			var symbol;
			if(this.symbolFont) {
				symbol = this.symbolFont;
			}
			else {
				//Instantiate the text symbol with the length trimmed to 3 decimal places
				symbol = new TextSymbol(result.toFixed(3));
				symbol.setColor(new Color([128,0,0]));
				symbol.setFont(new Font("12pt").setWeight(Font.WEIGHT_BOLD));
			}
			//set the angle of the text
			symbol.setAngle(angle);
			var offset = this._calculateSymbolOffset(angle);
			symbol.setOffset(offset.x, offset.y);
			return symbol;		
		},
		
		//adds a click event to the polyline button in the measurement widget
		_lineButtonClicked: function() {
			this.graphicLayer.clear();
			if(this.event == false) {
				this._addClickEvent();
			}
		},
		
		//executes when the measure end event fires
		_measureEndEvent: function(evt) {
			//if the graphic drawn was a polygon, perform one more distance calculation for the closing line segment		
			if(evt.geometry.type == "polygon") {					
				this.distanceParams.geometry1 = this.distanceParams.geometry2;
				//pull the first point drawn on the map
				this.distanceParams.geometry2 = this.pointArray[0];
				this._calculateDistance(this.distanceParams.geometry1, this.distanceParams.geometry2);
			}
			//clear the point array
			this.pointArray = [];
			this.mapHasGraphic = true;
			this.notMeasuring = true;			
		},
		
		//executes when the measure start event fires
		_measureStartEvent: function(evt) {
			if(this.mapHasGraphic && this.notMeasuring == true) {
				this.graphicLayer.clear();
				this.mapHasGraphic = false;
			}
			this.notMeasuring = false;		
		},
		
		//adds a click event to the polygon button in the measurement widget	
		_polygonButtonClicked: function() {
			this.graphicLayer.clear();
			//If the map has no click event, add one
			if(this.event == false) {
				this._addClickEvent();
			}
		},
		
		//after the unit changes recalculate the distance of each line segment
		_recalculateDistance: function(newUnit) {
			//concatenate the previous unit and the current unit
			var a = this.currentDistanceUnits + newUnit
			var factor;
			switch(a) {
				case("FeetMiles"): factor = 0.000189394; break;
				case("FeetKilometers"): factor = 0.0003048; break;
				case("FeetYards"): factor = 0.3333333333; break;
				case("FeetMeters"): factor = 0.3048; break;
				case("FeetNautical Miles"): factor = 0.000164579; break;
				case("YardsMiles"): factor = 0.000568182; break;
				case("YardsKilometers"): factor = 0.0009144; break;
				case("YardsFeet"): factor = 3; break;
				case("YardsMeters"): factor = 0.9144; break;
				case("YardsNautical Miles"): factor = 0.000493737; break;
				case("MilesYards"): factor = 1760; break;
				case("MilesKilometers"): factor = 1.60934; break;
				case("MilesFeet"): factor = 5280; break;
				case("MilesMeters"): factor = 1609.34; break;
				case("MilesNautical Miles"): factor = 0.868976; break;
				case("Nautical MilesYards"): factor = 2025.37; break;
				case("Nautical MilesKilometers"): factor = 1.852; break;
				case("Nautical MilesFeet"): factor = 6076.12; break;
				case("Nautical MilesMeters"): factor = 1852; break;
				case("Nautical MilesMiles"): factor = 1.15078; break;
				case("KilometersYards"): factor = 1093.61; break;
				case("KilometersNautical Miles"): factor = 0.539957; break;
				case("KilometersFeet"): factor = 3280.84; break;
				case("KilometersMeters"): factor = 1000; break;
				case("KilometersMiles"): factor = 0.621371; break;
				case("MetersYards"): factor = 1.09361; break;
				case("MetersNautical Miles"): factor = 0.000539957; break;
				case("MetersFeet"): factor = 3.28084; break;
				case("MetersKilometers"): factor = 0.001; break;
				case("MetersMiles"): factor = 0.000621371; break;
			}
			//loop through the text symbols and update the text values
			for(var i = 0; i < this.graphicLayer.graphics.length; i++) {
				var newText = parseFloat(this.graphicLayer.graphics[i].symbol.text) * factor;
				this.graphicLayer.graphics[i].symbol.text = newText.toFixed(3);
			}
			//redraw the graphics layer to make sure the text is updated
			this.graphicLayer.redraw();
		},
		
		//listen for the tool change event	
		_toolChangeEvent: function(evt) {
			//clear the graphics and remove the marker symbols
			this.currentTool = evt.toolName;
			this.graphicLayer.clear();
			//if the point tool is selected, remove the map click event handler
			if(evt.toolName == "location" && this._calculatePoints) {
				this._calculatePoints.remove();
				this.event = false;
			}
			//if the distance tool is selected get the current unit name
			if(evt.toolName == "distance") {
				if(evt.unitName) {
					this.currentDistanceUnits = evt.unitName;
				}
			}
			//if the area tool is selected
			else {
				if(!this.currentDistanceUnits) {
					this.currentDistanceUnits = "Miles";
				}
			}
		},
		
		//listen for the unit change event
		_unitChangeEvent: function(evt) {
			//if the unit was a distance unit
			if(evt.toolName == "distance") {
				this._recalculateDistance(evt.unitName);
				this.currentDistanceUnits = evt.unitName;
			}	
		},
		
		//set the font object used by the symbol
		setFontObject: function(font) {
			this.symbolFont = font;
		},
		
		//add event handlers after the widget has been created
		postCreate: function() {
			this._createMeasurementWidget();
		}
	});
});