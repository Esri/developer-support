var currentWidgets = [];
var layers = [];

function initMap() {
	var map;
	require([
		"esri/Color",
		"esri/map",
		"esri/urlUtils",
		"esri/dijit/Directions",
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
	], function(Color, Map, urlUtils, Directions, Search, Measurement, Editor, TemplatePicker, DynamicLayer, FeatureLayer, SimpleMarkerSymbol, SimpleLineSymbol, keys) {
		//Proxy rules for the secured feature layer and for the services used by the Directions widget
		urlUtils.addProxyRule({
          urlPrefix: "route.arcgis.com",  
          proxyUrl: "proxy/proxy.php"
        });
        urlUtils.addProxyRule({
          urlPrefix: "traffic.arcgis.com",  
          proxyUrl: "proxy/proxy.php"
        });
		urlUtils.addProxyRule({
          urlPrefix: "sampleserver6.arcgisonline.com",  
          proxyUrl: "proxy/proxy.php"
        });
		
		map = new Map("mapDiv", {
			basemap: "streets",
			center: [-96.55, 38.36],
			zoom: 13
        });
		
		//Add in a dynamic layer
		var dLayer = new DynamicLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer");
		dLayer.setVisibleLayers([1,2,3]);
		map.addLayer(dLayer);
		
		var search = new Search({
			map: map
        }, "searchDiv");
        search.startup();
		
		//The secured feature layer
		var editLayer = new FeatureLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire_secure/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND, 
          outFields: ['*']
        });
		layers.push(editLayer);
		map.addLayers(layers);
		
		//create the measurement widget
		createMeasurementWidget = function() {
			//create the div used by the widget
			$(".panel-body").append("<div id='widgetDiv'></div>");
			var measurement = new Measurement({
			  map: map
			}, "widgetDiv");
			measurement.startup();
			//set this as the current widget
			currentWidgets.push(measurement);
		}
		
		//create the directions widget
		createDirectionsWidget = function() {
			//create the div used by the widget
			$(".panel-body").append("<div id='widgetDiv'></div>");
			var directions = new Directions({
				map: map,
				travelModesServiceUrl: "https://utility.arcgis.com/usrsvcs/servers/cdc3efd03ddd4721b99adce219629489/rest/services/World/Utilities/GPServer"
			},"widgetDiv");
			directions.startup();
			//set this as the current widget
			currentWidgets.push(directions);
		};
		
		//create the editor widget
		createEditorWidget = function() {
			//create the div used by the editor widget
			$(".panel-body").append("<div id='editorDiv'></div>");
			//create the div used by template picker
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
			//add the editor and templatePicker widgets to the current widgets list
			currentWidgets.push(editor);
			currentWidgets.push(templatePicker);
        }
		//display the widget buttons
		showButtons();
    });
};

//display the widget buttons
function showButtons() {
	$("#measureBtn").css("visibility", "visible");
	$("#editBtn").css("visibility", "visible");
	$("#routeBtn").css("visibility", "visible");
}

//Add the click events to the widget buttons
function enableButtons() {
	$("#measureBtn").click(function() {
		destroyCurrentWidget();
		showPanel(0);
	});
	$("#editBtn").click(function() {
		destroyCurrentWidget();
		showPanel(1);
	});
	$("#routeBtn").click(function() {
		destroyCurrentWidget();
		showPanel(2);
	});			
}

//Display the widget panel
function showPanel(type) {
	$("#widgetPanel").css("visibility", "visible");
	//check which type of widget will be displayed and create it
	if(type==0) {
		console.log("createMeasure");
		createMeasurementWidget();
	}
	else if(type==1) {
		console.log("createEdit");
		createEditorWidget();
	}
	else if(type==2) {
		console.log("createRoute");
		createDirectionsWidget();
	}
}

//destroy each widget in the current widgets list
function destroyCurrentWidget() {
	if(currentWidgets.length>0) {
		for(var i=0; i<currentWidgets.length; i++){
			currentWidgets[i].destroy();
		}
		currentWidgets=[];
	}
}