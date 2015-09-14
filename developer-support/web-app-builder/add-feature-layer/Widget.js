define([
	'dojo/_base/declare', 
	'dijit/_WidgetsInTemplateMixin', 
	'jimu/BaseWidget', 
	'esri/layers/FeatureLayer',
	'esri/layers/layer',	
	'jimu/dijit/List',
    'jimu/dijit/SimpleTable',
	'dijit/form/ValidationTextBox'	
	],
function(
	declare, 
	_WidgetsInTemplateMixin, 
	BaseWidget, 
	FeatureLayer, 
	Layer,
	List,
	Table,
	ValidationTextBox
	) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    // FeatureLayer widget code goes here 

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,
    baseClass: 'jimu-widget-featurelayer-setting',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
		this.inherited(arguments);

		var fearureLayers = this.config.FeatureLayers;
		if (fearureLayers === undefined) {
			return;
		}

		var FeatureLayerArray = [];
		var UrlArray = fearureLayers.FeatureUrls;
		var index;
		for (index = 0; index < UrlArray.length; ++index) {
			var featureLayerUrl = fearureLayers.FeatureUrls[index].url;
			FeatureLayerArray.push(new esri.layers.FeatureLayer(featureLayerUrl));
		}
		this.map.addLayers(FeatureLayerArray);
		
		var fields = [{
			name: 'servername',
			title: 'Type',
			type: 'text',
			editable: false,
			unique: false
			}, {
			name: 'layername',
			title: 'Name',
			type: 'text',
			editable: true
			}, {
			name: 'actions',
			title: 'Actions',
			type: 'actions',
			actions: ['up', 'down']
		}];

		var args = {
		fields: fields,
		selectable: false
		};

		this.displayFieldsTable = new Table(args);
		this.displayFieldsTable.placeAt(this.tableFeatureLayers);
		this.displayFieldsTable.startup();	  

		console.log('FeatureLayer: startup');
    },

    onOpen: function(){
        this.displayFieldsTable.clear();
		var config = this.config;
		var visibleLayers = this.map.getLayersVisibleAtScale(this.map.getScale());

		var len = visibleLayers.length;
		var json = [];
		for (var i = 0; i < len; i++) {
            if(visibleLayers[i] instanceof FeatureLayer){ 
				if(visibleLayers[i].url != null){
					var featureLayer = visibleLayers[i];
					var layerType = featureLayer.type;
					var layerName = featureLayer.name;
					if (layerType == null) layerType = "Unknown";
					if (layerName == null) layerName = "Unknown";
					
					json.push({
						  url: featureLayer.url,
						  servername: layerType,
						  layername: layerName
					});
				}
			}
        }
        this.displayFieldsTable.addRows(json);
		console.log('FeatureLayer: onOpen');
    },
	
	add: function() {
		var json = {};
		json.url = this.url.value;
		if (!json.url) {
			alert(this.nls.warning);
			return;
		}
		this.map.addLayer(new esri.layers.FeatureLayer(json.url));
		//this.displayFieldsTable.addRow(json);
		this.onOpen();
	},		
	
	refresh: function() {
		this.onOpen();
	},
	
    onClose: function(){
      console.log('FeatureLayer: onClose');
    },

    onMinimize: function(){
      console.log('FeatureLayer: onMinimize');
    },

    onMaximize: function(){
      console.log('FeatureLayer: onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('FeatureLayer: onSignIn');
    },

    onSignOut: function(){
      console.log('FeatureLayer: onSignOut');
    }
  });
});