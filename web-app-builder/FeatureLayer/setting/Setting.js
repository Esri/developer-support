///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
	'dijit/form/ValidationTextBox'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    Table,
	ValidationTextBox
	) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-featurelayer-setting',

    startup: function() {
        this.inherited(arguments);
        
		var fearureLayers = this.config.FeatureLayers;
		if (fearureLayers === undefined) {
			return;
		}

        var fields = [{
          name: 'url',
          title: 'Url',
          type: 'text',
          editable: true,
          unique: true
        }, {
          name: 'servername',
          title: 'Server Name',
          type: 'text',
          editable: true,
          unique: true
        }, {
          name: 'layername',
          title: 'Layer Name',
          type: 'text',
          editable: true
        }, {
          name: 'actions',
          title: 'Actions',
          type: 'actions',
          actions: ['up', 'down', 'delete']
        }];
		
        var args = {
          fields: fields,
          selectable: false
        };
        
		this.displayFieldsTable = new Table(args);
        this.displayFieldsTable.placeAt(this.tableFeatureLayers);
        this.displayFieldsTable.startup();
        this.setConfig(this.config);
	},

      setConfig: function(config) {
        this.config = config;
        this.displayFieldsTable.clear();
        if (config.FeatureLayers.FeatureUrls) {
          var json = [];
          var len = config.FeatureLayers.FeatureUrls.length;
          for (var i = 0; i < len; i++) {
            json.push({
              url: config.FeatureLayers.FeatureUrls[i].url,
              servername: config.FeatureLayers.FeatureUrls[i].servername,
              layername: config.FeatureLayers.FeatureUrls[i].layername
            });
          }
          this.displayFieldsTable.addRows(json);
        }
      },
      
	  add: function() {
        var json = {};
        json.url = this.url.value;
        json.servername = this.servername.value;
        json.layername = this.layername.value;
        if (!json.url || !json.servername || !json.servername) {
          alert(this.nls.warning);
          return;
        }
        this.displayFieldsTable.addRow(json);
      },		
		
      getConfig: function() {
        var data = this.displayFieldsTable.getData();
        var json = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
          json.push(data[i]);
        }
        this.FeatureLayers.FeatureUrls = json;
        return this.config;
      }
	  
	});
});
  
  
  
  