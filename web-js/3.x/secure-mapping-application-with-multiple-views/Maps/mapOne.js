var createMeasurementWidget;
var createEditorWidget;
var currentWidgets = [];
var layers = [];

function initMap() {
	var map;
	require([
		"esri/Color",
		"esri/map",
		"esri/urlUtils",
		"esri/dijit/Search",
		"esri/dijit/Measurement",
		"esri/dijit/editing/Editor",
        "esri/dijit/editing/TemplatePicker",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/layers/FeatureLayer",
		"esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
		"dojo/keys",
		"dojo/domReady!"
	], function(Color, Map, urlUtils, Search, Measurement, Editor, TemplatePicker, DynamicLayer, FeatureLayer, SimpleMarkerSymbol, SimpleLineSymbol, keys) {
		
		map = new Map("mapDiv", {
			basemap: "streets",
			center: [-96.55, 38.36],
			zoom: 13
        });
		
		var dLayer = new DynamicLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer");
		dLayer.setVisibleLayers([1,2,3]);
		map.addLayer(dLayer);
		
		var search = new Search({
			map: map
        }, "searchDiv");
        search.startup();
		
		createMeasurementWidget = function() {
			$(".panel-body").append("<div id='widgetDiv'></div>");
			var measurement = new Measurement({
			  map: map
			}, "widgetDiv");
			measurement.startup();
			currentWidgets.push(measurement);
		}
		
		showButtons();
    });
};

function showButtons() {
	$("#measureBtn").css("visibility", "visible");
}

function enableButtons() {
	$("#measureBtn").click(function() {
		showPanel(0);
	});		
}

function showPanel(type) {
	$("#widgetPanel").css("visibility", "visible");
	if(type==0) {
		console.log("createMeasure");
		createMeasurementWidget();
	}
}

function destroyCurrentWidget() {
	if(currentWidgets.length>0) {
		for(var i=0; i<currentWidgets.length; i++){
			currentWidgets[i].destroy();
		}
		currentWidgets=[];
	}
}