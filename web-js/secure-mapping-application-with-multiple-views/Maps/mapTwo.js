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
		urlUtils.addProxyRule({
          urlPrefix: "route.arcgis.com",  
          proxyUrl: "proxy/proxy.php"
		});
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
		
		var responsePoints = new FeatureLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND, 
          outFields: ['*']
        });
		layers.push(responsePoints);
		map.addLayers(layers);
		
		createMeasurementWidget = function() {
			$(".panel-body").append("<div id='widgetDiv'></div>");
			var measurement = new Measurement({
			  map: map
			}, "widgetDiv");
			measurement.startup();
			currentWidgets.push(measurement);
		}
		
		createEditorWidget = function() {
			$(".panel-body").append("<div id='editorDiv'></div>");
			$(".panel-body").append("<div id='templateDiv'></div>");
			var templatePicker = new TemplatePicker({
				featureLayers: layers,
				grouping: true,
				rows: "auto",
				columns: 3
			}, "templateDiv");
			templatePicker.startup();
			var layerInfos = [];
			for(var i=0;i<layers.length;i++){
				layerInfos[i] = {featureLayer:layers[i]};
			}
			var settings = {
				map: map,
				templatePicker: templatePicker,
				layerInfos: layerInfos,
				toolbarVisible: true,
				createOptions: {
				polylineDrawTools:[ Editor.CREATE_TOOL_FREEHAND_POLYLINE ],
				polygonDrawTools: [ Editor.CREATE_TOOL_FREEHAND_POLYGON,
					Editor.CREATE_TOOL_CIRCLE,
					Editor.CREATE_TOOL_TRIANGLE,
					Editor.CREATE_TOOL_RECTANGLE
				]
				},
				toolbarOptions: {
					reshapeVisible: true
				}
			};

			var params = { settings: settings };
			var editor = new Editor(params, 'editorDiv');
			var symbol = new SimpleMarkerSymbol(
				SimpleMarkerSymbol.STYLE_CROSS, 
				15, 
				new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID, 
					new Color([255, 0, 0, 0.5]), 
					5
				),
				null
			);
			map.enableSnapping({
				snapPointSymbol: symbol,
				tolerance: 20,
				snapKey: keys.ALT
			});
			editor.startup();
			currentWidgets.push(editor);
			currentWidgets.push(templatePicker);
        }
		showButtons();
    });
};

function showButtons() {
	$("#measureBtn").css("visibility", "visible");
	$("#editBtn").css("visibility", "visible");
}

function enableButtons() {
	$("#measureBtn").click(function() {
		destroyCurrentWidget();
		showPanel(0);
	});
	$("#editBtn").click(function() {
		destroyCurrentWidget();
		showPanel(1);
	});	
}

function showPanel(type) {
	$("#widgetPanel").css("visibility", "visible");
	if(type==0) {
		console.log("createMeasure");
		createMeasurementWidget();
	}
	else if(type==1) {
		console.log("createEdit");
		createEditorWidget();
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