//****************************************************************************************************************************************
//Created by Nicholas Haney
//Completed on February 5th 2016
//****************************************************************************************************************************************
define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/Evented",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!../html/AddLayers.html",
	"esri/map",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/ArcGISImageServiceLayer",
	"esri/layers/ImageServiceParameters",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/ImageParameters",
	"esri/layers/CSVLayer",
	"esri/layers/GeoRSSLayer",
	"esri/layers/FeatureLayer",
	"esri/layers/KMLLayer",
	"esri/layers/WFSLayer",
	"esri/layers/WMSLayer",
	"esri/layers/WMTSLayer",
	"dojo/domReady!"
  
], function (
	declare, arrayUtils, connect, lang, on, Evented, _WidgetBase, _TemplatedMixin, HTMLString,
	Map, ArcGISDynamicMapServiceLayer, ArcGISImageServiceLayer, ImageServiceParameters, ArcGISTiledMapServiceLayer, 
	mageParameters, CSVLayer, GeoRSSLayer, FeatureLayer, KMLLayer, WFSLayer, WMSLayer, WMTSLayer
) {
	var Widget = declare("mynamespace.AddLayers", [_WidgetBase, _TemplatedMixin, Evented], {
	
	templateString: HTMLString,
	
	//HTML strings that will be dynamically inserted into the DOM depending on which layer options are selected
	_advancedOptionsHTML:'<td><div class="checkbox checkbox-primary"><label><input type="checkbox" name="advancedOptions" id="advancedOptions">Advanced Options</label></div></td>',
	_wfsLayerNameHTML: '<tr><td class="optionLabel optionCell"><div>Layer Name: </div></td><td class="optionCell"><input type="text" id="wfsLayerName" Class="form-control" Class="form-control optionInput"></input></td></tr>',
	_formatHTML: '<tr><td class="optionLabel optionCell">Format: </td><td class="optionCell"><input type="text" id="imageFormat" value="png" Class="form-control optionInput"></input></td></tr>',
	_opacityHTML: '<tr><td class="optionLabel optionCell">Opacity: </td><td class="optionCell"><input type="text" id="layerOpacity" value="1" Class="form-control optionInput"></input></td></tr>',
	_layerIDsHTML: '<tr><td class="optionLabel optionCell">Layer IDs: </td><td class="optionCell"><input type="text" id="layerIDs" value="" Class="form-control optionInput"></input></td></tr>',
	_maxScaleHTML: '<tr><td class="optionLabel optionCell">Max Scale: </td><td class="optionCell"><input type="text" id="maxScale" value="" Class="form-control optionInput"></input></td></tr>',
	_minScaleHTML: '<tr><td class="optionLabel optionCell">Min Scale: </td><td class="optionCell"><input type="text" id="minScale" value="" Class="form-control optionInput"></input></td></tr>',
	_layerDefinitionHTML: '<tr><td class="optionLabel optionCell">Layer Def: </td><td class="optionCell"><input type="text" id="layerDefinition" value="" Class="form-control optionInput"></input></td></tr>',
	_versionHTML: '<tr><td class="optionLabel optionCell">Version: </td><td class="optionCell"><select id="layerVersion" value="" Class="form-control optionInput"><option>1.0.0</option><option>1.1.0</option><option>2.0.0</option></select></td></tr>',
	_inverseResponseHTML: '<tr><td class="optionLabel optionCell">Inverse Response: </td><td class="optionCell"><select id="inverseResponse" value="" Class="form-control optionInput"><option>False</option><option>True</option></select></td></tr>',
	_resamplingHTML: '<tr><td class="optionLabel optionCell">Resampling: </td><td class="optionCell"><select id="resampling" value="" Class="form-control optionInput"><option>False</option><option>True</option></select></td></tr>',
	_serviceModeHTML: '<tr><td class="optionLabel optionCell">Service Mode: </td><td class="optionCell"><select id="serviceMode" value="" Class="form-control optionInput"><option>RESTful</option><option>KVP</option></select></td></tr>',
	_latFieldHTML: '<tr><td class="optionLabel optionCell">Latitude Field: </td><td class="optionCell"><input type="text" id="latField" value="" Class="form-control optionInput"></input></td></tr>',
	_lonFieldHTML: '<tr><td class="optionLabel optionCell">Longitude Field: </td><td class="optionCell"><input type="text" id="lonField" value="" Class="form-control optionInput"></input></td></tr>',
	_columnDelimiterHTML: '<tr><td class="optionLabel optionCell">Column Delimiter: </td><td class="optionCell"><input type="text" id="columnDelimiter" value="" Class="form-control optionInput"></input></td></tr>',
	
	//default values for class level variables
	options: {
		map: null,
		zoomToLayer: true,
		baseNode: null
	},
	
	//The constructor
    constructor: function(options, srcRefNode) {
		//set the values of the class level variables
		var defaults = lang.mixin({}, this.options, options);
		this.set("map", defaults.map);
		this.set("baseNode", srcRefNode);
		this.set("currentFunction", null);
		this.set("zoomToLayer", defaults.zoomToLayer);
		this.set("layerOptions", null);
		this.set("layerType", null);
    },
    
	//Set the event handlers that allow the widget to function
     __init: function() {
		//Set the click event handler for the layer type dropdown
		$('#layerTypeDD li').on('click', lang.hitch(this, function(evt){
			$('#layerType').val(evt.currentTarget.innerText);
			this._changeLayerType();
		}));
		
		//Set the click event handler for the AGS layer sub type dropdown
		$('#subLayerTypeDD li').on('click', lang.hitch(this, function(evt){
			$('#subLayerType').val(evt.currentTarget.innerText);
			this._chooseAGSLayerType();
		}));
		
		//Set the change event of the url input form
		$('#urlInput').change(function(evt) {
			var url = $('#urlInput').val();
			//Perform a simple check to see if the text entered into the input is a URL
			if(url.search("http") > -1) {
				//If it is a URL enable the addLayer button
				$('#addLayerBtn').prop('disabled', false);
			}
			else {
				$('#addLayerBtn').prop('disabled', true);
			}
		});
		
		//listener for the advanced options toggle
		$("#advancedOptions").change(lang.hitch(this, function() {this._showOptions();}));
		
		//listener for the addLayer button click
		$("#addLayerBtn").click(lang.hitch(this, this._addLayer));
		
		//listener for the cancel button click
		$("#cancelBtn").click(lang.hitch(this, function() {
			this._removeAllDialogs();
			$('#layerType').val("");
		}));
    },
	
	//show the action buttons
	_addButtons: function() {
		$("#dialogTable").show();		
	},
	
	//help function to add layer options common to all layer types
	_addCommonLayerOptions: function() {
		$("#optionsTable").append(this._opacityHTML);
		$("#optionsTable").append(this._minScaleHTML);
		$("#optionsTable").append(this._maxScaleHTML);		
	},
	
	//method to add a CSV layer to the map
	_addCSVLayer: function(url) {
		var layer;
		var delimiter = null;
		var lat = null;
		var lon = null;
		if($("#columnDelimiter").val()) {
			delimiter = $("#columnDelimiter").val();
		}
		if($("#latField").val()) {
			lat = parseFloat($("#latField").val());
		}
		if($("#lonField").val()) {
			lon = parseFloat($("#lonField").val());
		}
		//instantiate layer with constructor options
		layer = new CSVLayer(url, {
			columnDelimiter: delimiter,
			latitudeFieldName: lat,
			longitudeFieldName: lon
		});
		this._setCommonLayerOptions(layer);
	},
	
	//add a dynamic layer to the map
	_addDynamicLayer: function(url) {
		var layer = new ArcGISDynamicMapServiceLayer(url);
		if($("#layerIDs").val()) {
			layer.setVisibleLayers($("#layerIDs").val().split(","));
		}
		this._setCommonLayerOptions(layer);
	},
	
	//add a feature layer to the map
	_addFeatureLayer: function(url) {
		var layer = new FeatureLayer(url);
		if($("#layerDefinition").val()) {
			layer.setDefinitionExpression($("#layerDefinition").val());
		}				
		this._setCommonLayerOptions(layer);
	},
	
	//add a GeoRSS layer to the map
	_addGeoRSSLayer: function(url) {
		var layer = new GeoRSSLayer(url);
		this._setCommonLayerOptions(layer);
	},
	
	//add an image service layer to the map
	_addImageService: function(url) {
		var layer = new ArcGISImageServiceLayer(url);
		if($("#imageFormat").val()) {
			layer.setImageFormat($("#imageFormat").val());
		}
		this._setCommonLayerOptions(layer);
	},
	
	//add a kml layer to the map
	_addKMLLayer: function(url) {
		var layer = new KMLLayer(url);
		this._setCommonLayerOptions(layer);
	},
    
	//the event handler for the addLayer button
	_addLayer: function() {
		this.currentFunction($("#urlInput").val());
		$('#layerType').val("");
	},
	
	//add layer options to the optionsTable
	_addLayerOptions: function() {
		//check the current layer type to decide which options to add
		if(this.layerType == "WFS" || this.layerType == "WMS") $("#optionsTable").append(this._versionHTML);
		if(this.layerType == "WFS") {
			$("#optionsTable").append(this._wfsLayerNameHTML);
			$("#optionsTable").append(this._inverseResponseHTML);
		}
		else {
			if(this.layerType == "AFL") $("#optionsTable").append(this._layerDefinitionHTML);
			if(this.layerType == "DYN" || layerType == "WMS") $("#optionsTable").append(this._layerIDsHTML);
			if(this.layerType == "IMG" || layerType == "WMS") $("#optionsTable").append(this._formatHTML);
			if(this.layerType == "TMS" || layerType == "WMTS") $("#optionsTable").append(this._resamplingHTML);
			if(this.layerType == "WMTS") $("#optionsTable").append(this._serviceModeHTML);
			if(this.layerType == "CSV") {
				$("#optionsTable").append(this._latFieldHTML);
				$("#optionsTable").append(this._lonFieldHTML);
				$("#optionsTable").append(this._columnDelimiterHTML);					
			}
			//add layer options common to many layers
			this._addCommonLayerOptions();
		}		
	},
	
	//a tiled layer to the map
	_addTiledLayer: function(url) {
		var layer;
		var resampling = null;
		if($("#resampling").val()) {
			resampling = $("#resampling").val();
		}
		layer = new ArcGISTiledMapServiceLayer(url, {
			resampling: resampling
		});
		this._setCommonLayerOptions(layer);
	},
	
	//add a wfs layer to the map
	_addWFSLayer: function(url) {
		var layer;
		var layerName = null;
		var layerVersion = null;
		var inverseResponse = null;
		if($("#wfsLayerName").val()) {
			layerName = $("#wfsLayerName").val();
		}
		if($("#layerVersion").val()) {
			layerVersion = $("#layerVersion").val();
		}
		if($("#inverseResponse").val()) {
			inverseResponse = $("#inverseResponse").val();
		}		
		layer = new WMSLayer(url, {
			nsLayerName: layerName,
			layerVersion: layerVersion,
			inverseResponse: inverseResponse
		});
		//the wfs layer does not have several options common to most layers such as opacity
		this.map.addLayer(layer);
		this._removeAllDialogs();
	},
	
	//add wms layer to the map
	_addWMSLayer: function(url) {
		var layer;
		var layerVersion = null;
		var imageFormat = null;
		if($("#layerVersion").val()) {
			layerVersion = $("#layerVersion").val();
		}
		if($("#imageFormat").val()) {
			imageFormat = $("#serviceMode").val();
		}
		layer = new WMSLayer(url, {
			format: imageFormat,
			layerVersion: layerVersion
		});
		if($("#layerIDs").val()) {
			layer.setVisibleLayers($("#layerIDs").val().split(","));
		}
		this._setCommonLayerOptions(layer);
	},
	
	//add a wmts layer to the map
	_addWMTSLayer: function(url) {
		var layer;
		var serviceMode = null;
		var resampling = null;
		if($("#resampling").val()) {
			resampling = $("#resampling").val();
		}	
		if($("#serviceMode").val()) {
			serviceMode = $("#serviceMode").val();
		}
		layer = new WMTSLayer(url, {
			serviceMode: serviceMode,
			resampling: resampling
		});
		this._setCommonLayerOptions(layer);
	},
	
	//event handler for the layer type drop down
	_changeLayerType: function() {
		//clear all the current layer dialogs
		this._removeAllDialogs();
		//get the layer type from the input form
		var type = $("#layerType").val().trim();
		//show the appropriate dialog and set the layer type
		switch(type){
			case "ArcGIS Server Service": this._showAGSLayerDialog(); break;
			case "WFS OGC Service": this.layerType = "WFS"; this._showLayerDialog(); break;
			case "WMS OGC Service": this.layerType = "WMS"; this._showLayerDialog(); break;
			case "WMTS OGC Service": this.layerType = "WMTS"; this._showLayerDialog(); break;
			case "KML File": this.layerType = "KML"; this._showLayerDialog(); break;
			case "CSV File": this.layerType = "CSV"; this._showLayerDialog(); break;
			case "GeoRSS File": this.layerType = "RSS"; this._showLayerDialog(); break;
		}		
	},
	
	//dialog for the selecting the arcgis layer subtype
	_chooseAGSLayerType: function() {
		this._removeOptions();
		$('#advancedOptions').attr('checked', false);
		var subLayerType = $("#subLayerType").val().trim();
		switch(subLayerType) {
			case "ImageServiceLayer": this.layerType = "IMG"; break;
			case "ArcGISDynamicMapServiceLayer": this.layerType = "DYN"; break;
			case "FeatureLayer": this.layerType = "AFL"; break;
			case "ArcGISTiledMapServiceLayer": this.layerType = "TMS"; break;
		}
		this._showLayerDialog();
	},
	
	//remove all inputs except for the layer type dropdown
	_removeAllDialogs: function() {
		$("#advancedOptions").prop("checked", false);
		$("#urlInput").val("");
		$("#urlInputForm").hide();
		$("#dialogTable").hide();
		$('#subLayerType').val("");
		$("#subLayerDialog").hide();
		$('#addLayerBtn').prop('disabled', true);
		this._removeOptions();
	},
	
	//empty the options table and disable the add layer button
	_removeOptions: function() {
		$("#optionsTable").empty();
		$('#addLayerBtn').prop('disabled', true);
	},
	
	//set layer options common to all layers
	_setCommonLayerOptions: function(layer) {
		if($("#layerOpacity").val()) {
			layer.setOpacity(parseFloat($("#layerOpacity").val()));
		}
		if($("#minScale").val()) {
			layer.setMinScale(parseInt($("#minScale").val()));
		}
		if($("#maxScale").val()) {
			layer.setMaxScale(parseInt($("#maxScale").val()));
		}
		//wait for the layer to be added to the map
		this.map.on("layer-add-result", lang.hitch(this, function() {
			//check to see the map should zoom to the added layer
			if(this.zoomToLayer) {
				this.map.setExtent(layer.fullExtent, true);
			}
		}));
		//add the layer to the map
		this.map.addLayer(layer);
		//remove all dialogs
		this._removeAllDialogs();
	},
	
	//add the buttons to the map and show the url input form
	_showActionButtons() {
		this._addButtons();
		$("#urlInputForm").show();
	},
	
	//show the arcgis layer subtype dialog
	_showAGSLayerDialog: function() {
		$("#subLayerDialog").show();
	},
	
	//configure the widget to add the appropriate layer type
	_showLayerDialog: function() {
		this._showActionButtons();
		//set the current function to the appropriate add layer function
		switch(this.layerType) {
			case "WFS": this.currentFunction = this._addWFSLayer; break;
			case "WMS": this.currentFunction = this._addWMSLayer; break;
			case "WMTS": this.currentFunction = this._addWMTSLayer; break;
			case "KML": this.currentFunction = this._addKMLLayer; break;
			case "CSV": this.currentFunction = this._addCSVLayer; break;
			case "RSS": this.currentFunction = this._addGeoRSSLayer; break;
			case "IMG": this.currentFunction = this._addImageService; break;
			case "DYN": this.currentFunction = this._addDynamicLayer; break;
			case "AFL": this.currentFunction = this._addFeatureLayer; break;
			case "TMS": this.currentFunction = this._addTiledLayer; break; 
		}		
	},
	
	//show the advanced options dialog when the advancedOptions checkbox is toggled
	_showOptions: function() {
		if($('#advancedOptions').is(':checked')) {
			this._addLayerOptions();
		}
		else {
			this._removeOptions();
		}		
	},
	
	//hide the widget
	hide: function() {
		$("#" + _this.baseNode).hide();
	},

	//show the widget
	show: function() {
		$("#" + _this.baseNode).show();
	},
    
	//instantiate the widget
    startup: function () {
        if (!this.map) {
          this.destroy();
          console.log('Map Required');
        }
        if (this.map.loaded) {
			this.__init();
        } else {
          on(this.map, "load", lang.hitch(this, function () {
            this.__init();
          }));
        }
    },
	
	//set the zoomToLayer variable
	zoomToLayer: function(bool) {
		this.zoomToLayer = bool;
	}
	
	});
	
	return Widget;
});