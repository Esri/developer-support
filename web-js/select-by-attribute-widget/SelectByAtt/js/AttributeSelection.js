//********************************************************************************************************************************************
//Created by Nicholas Haney
//Completed on May 15th 2015
//********************************************************************************************************************************************
define([
  "dojo/_base/declare",
  "dojo/_base/array",
  "dojo/_base/connect",
  "dojo/_base/lang",
  "dojo/on",
  "dojo/Evented",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!../html/AttributeSelection.html",
  "esri/layers/FeatureLayer",
  "esri/tasks/query",
  "esri/tasks/QueryTask"
  
], function (
  declare, arrayUtils, connect, lang, on, Evented, _WidgetBase, _TemplatedMixin, HTMLString, FeatureLayer, Query, QueryTask
) {
	var _this;
	var Widget = declare("mynamespace.AttributeSelect", [_WidgetBase, _TemplatedMixin, Evented], {
	
	templateString: HTMLString,
	
	options: {
		theme: "AttributeSelection",
		currentResults: null,
		verify: null,
		map: null,
		currentAttribute: null,
		queryList: [],
		currentIndex: 0,
		currentFieldType: null,
		layers: null
	},

    constructor: function(options, srcRefNode) {
		//set the values of the class level variables
		var defaults = lang.mixin({}, this.options, options);
		this.set("map", defaults.map);
		this.set("theme", defaults.theme);
		this.set("layerList", defaults.layers);
        this.set("currentFieldType", defaults.currentFieldType);
        this.set("currentResults", defaults.currentResults);
		this.set("verify", defaults.verify);
		this.set("currentAttribute", defaults.currentAttribute);
		this.set("queryList", defaults.queryList);
        this.set("currentIndex", defaults.currentIndex);
		this.set("baseNode", srcRefNode);
		_this = this;
    },
    
     __init: function() {
		//Add event listeners to all of the buttons which make up the widget
        document.getElementById("layerDropDown").addEventListener("change", this._changeQueryDisplay);
        document.getElementById("attributeDropDown").addEventListener("change", this._addAttribute);
		document.getElementById("methodDropDown").addEventListener("change", this._changeQueryDisplay);
        document.getElementById("uValuesBtn").addEventListener("click", this._getValues);
        document.getElementById("valueDropDown").addEventListener("change", this._addValue);
        document.getElementById("okBtn").addEventListener("click", this.submitQuery);
        document.getElementById("applyBtn").addEventListener("click", this.applyQuery);
        document.getElementById("verify").addEventListener("click", this.verifyQuery);
        document.getElementById("closeWindow").addEventListener("click", this.hide);
        document.getElementById("equals").addEventListener("click", this._addEquals);
	    document.getElementById("greaterLess").addEventListener("click", this._addGreaterLess);
        document.getElementById("like").addEventListener("click", this._addLike);
        document.getElementById("greaterThan").addEventListener("click", this._addGreaterThan);	
        document.getElementById("greaterThanEqual").addEventListener("click", this._addGreaterThanEqual);
        document.getElementById("and").addEventListener("click", this._addAnd);
	    document.getElementById("lessThan").addEventListener("click", this._addLessThan);
        document.getElementById("lessThanEqual").addEventListener("click", this._addLessThanEqual);
        document.getElementById("or").addEventListener("click", this._addOr);
        document.getElementById("underscore").addEventListener("click", this._addUnderscore);
        document.getElementById("percent").addEventListener("click", this._addPercent);
	    document.getElementById("parenthesis").addEventListener("click", this._addParanthesis);
        document.getElementById("not").addEventListener("click", this._addNot);
        document.getElementById("is").addEventListener("click", this._addIs);
        document.getElementById("in").addEventListener("click", this._addIn);
        document.getElementById("null").addEventListener("click", this._addNull);
	    document.getElementById("clear").addEventListener("click", this.clearQuery);
        document.getElementById("help").addEventListener("click", this.getHelp);
        document.getElementById("load").addEventListener("click", this.loadQuery);
	    document.getElementById("save").addEventListener("click", this.saveQuery);
        document.getElementById("closeBtn").addEventListener("click", this.hide);
		//populate the 
        this._addLayerOptions();
    },   
    
    _addAttribute: function() {
		var select = document.getElementById("attributeDropDown");
        var value = select.value;
        var node = document.getElementById("textArea");
        if(value != "none") {
			_this.currentAttribute = value;
			_this.currentFieldType = select.options[select.selectedIndex].getAttribute('type');
			_this._addAttribute2(value);
		}
		document.getElementById("attributeDropDown").value = "none";    
    },   
 
     _addAttribute2: function(value) {
        var node = document.getElementById("textArea");
        var currentStr = document.getElementById("textArea").value;
        var startPos = node.selectionStart;
        if(startPos > currentStr.length) {
            document.getElementById("textArea").value += value;
        }
        else if(startPos == 0) {
            var currentQuery = document.getElementById("textArea").value
			document.getElementById("textArea").value = value + " " + currentQuery;
		}
        else {
            var newValue = value;
            var string1 = currentStr.substring(0, startPos).trim();
            var string2 = currentStr.substring(startPos, currentStr.length).trim();
            document.getElementById("textArea").value = string1 + " " + newValue + " " + string2;
        }        
    },
    
	//add 'AND' to the query
    _addAnd: function() {
        var value = "AND";
        _this._addAttribute2(value);
    },
    
	//add '=' to the query
    _addEquals: function() {
        var value = "=";
        _this._addAttribute2(value);       
    },
	
	//add '<>' to the query
    _addGreaterLess: function() {
        var value = "<>";
        _this._addAttribute2(value);   
    },

	//add '>' to the query
    _addGreaterThan: function() {
        var value = ">";
        _this._addAttribute2(value);   
    },
    
	//add '>=' to the query
    _addGreaterThanEqual: function() {
        var value = ">=";
        _this._addAttribute2(value);   
    },
    
	//add 'IN' to the query
    _addIn: function() {
        var value = "IN";
        _this._addAttribute2(value);   
    },    

	//add 'IS' to the query
    _addIs: function() {
        var value = "IS";
        _this._addAttribute2(value);    
    },
    
    _addLayerOptions: function() {
		//grab the layer drop down 
        var select = document.getElementById("layerDropDown");
		//iterate through the layer list and create an option for each layer
        for(var i = 0; i < this.layerList.length; i++) {
            var option = document.createElement("option");
            option.value = this.layerList[i].name;
            option.innerHTML = this.layerList[i].name;
            select.appendChild(option);
        }
        select.value = this.layerList[0].name;
		//update the query text
        this._changeQueryDisplay();     
    },

	//add '<' to the query
     _addLessThan: function() {
        var value = "<";
        _this._addAttribute2(value);       
    },

	//add '<=' to the query
    _addLessThanEqual: function() {
        var value = "<=";
        _this._addAttribute2(value);    
    },

	//add 'LIKE' to the query
    _addLike: function() {
        var value = "LIKE";
        _this._addAttribute2(value);   
    },
    
	//add 'NOT' to the query
    _addNot: function() {
        var value = "NOT";
        _this._addAttribute2(value);    
    },
	
	//add 'NULL' to the query
    _addNull: function() {
        var value = "NULL";
        _this._addAttribute2(value);        
    },
    
	//add 'OR' to the query
    _addOr: function() {
        var value = "OR";
        _this._addAttribute2(value);   
    },
    
	//add '()' to the query
    _addParenthesis: function() {
        var value = "()";
        _this._addAttribute2(value);   
    },     

	//add '%' to the query
    _addPercent: function() {
        var value = "%";
        _this._addAttribute2(value);    
    },

	//add '_' to the query
    _addUnderscore: function() {
        var value = "_";
        _this._addAttribute2(value);   
    },
    
	//add a value selected from the value drop down list to the query
    _addValue: function() {
		//get the selected value
        var value = document.getElementById("valueDropDown").value;
		//if the value is not 'none'
        if(value != "none") {
			//if the current value is a string, but single quotes around the value
            if(_this.currentFieldType == "esriFieldTypeString") {
				var temp = value;
				value = "'" + temp + "'";
			}
			//add the selected value to the query
            document.getElementById("textArea").value += value.trim();
        }
		//set the selected value to 'none'
        document.getElementById("valueDropDown").value = "none";    
    },
    
	//update the query text
    _changeQueryDisplay: function() {
		//select the layer drop down element
        var select = document.getElementById("layerDropDown");
        var layer = select.value;
		//select the queryDisplay element and update it based on the current layer that was selected 
        document.getElementById("queryDisplay").innerHTML = "SELECT * FROM "  + layer + " WHERE:";
		document.getElementById("textArea").value = "";
		//populate the attribute drop down
        _this._getAttributeFields(layer);    
    },
	
	//remove the options from the value drop down list
	_clearValueDropDown(select) {
		if(!select) {
			select = document.getElementById("valueDropDown");
		}
		while(select.firstChild) {
            select.removeChild(select.firstChild);
        }
	},
    
	//display the error message
    _displayError: function(error) {
		if(this.verify){
			alert(error);
		}
		this.verify = false;  
    },
    
	//populate the attribute drop down
    _getAttributeFields: function(name) {
        var layer;
		//grab the attribute drop down element
        var select = document.getElementById("attributeDropDown");
		//if there are elements in the attribute drop down already, remove them
        while(select.firstChild) {
            select.removeChild(select.firstChild);
        }
		//find the current layer within the layer list
        for(var i = 0; i < this.layerList.length; i++) {
            if(name == this.layerList[i].name) {
                layer = this.layerList[i];
            }
        }
		//Create an additional option called none and add it to the drop down
        var nullOption = document.createElement("option");
        nullOption.value = "none";
        nullOption.innerHTML = "none";
        select.appendChild(nullOption);
		
		//loop through the layer's fields and 
        for(var i = 0; i < layer.fields.length; i++) {
			//exclude the geometry type field
            if(layer.fields[i].type != "esriFieldTypeGeometry") {
				//create a new attribute node called type
                var typeAttribute = document.createAttribute("type");
				//set the value of this attribute to the field data type
				typeAttribute.value = layer.fields[i].type;
				//create an option element and set its value to the name of the attribute
				var option = document.createElement("option");
				option.value = layer.fields[i].name;
				option.innerHTML = layer.fields[i].name;
				select.appendChild(option);
				//add the field type attribute to the option
				option.setAttributeNode(typeAttribute);
			}
        } 
    },

	//queries the service to get distinct values for the selected attribute field
    _getValues: function() {
        var layer;
		//get the name of the selected layer
        var name = document.getElementById("layerDropDown").value;
		//create a query that returns all distinct values for the selected attribute field
        var query = new Query();
        query.where = "1=1";
        query.returnDistinctValues = true;
        query.outFields = [_this.currentAttribute];
        query.returnGeometry = false;
		//loop through the layer list to access the currently selected layer
        for(var i = 0; i < _this.layerList.length; i++) {
            if(name == _this.layerList[i].name) {
                layer = _this.layerList[i];
            }
        }
		//create the query task based on this layer's url
        var queryTask = new QueryTask(layer.url);
		//execute the query and process the results
        queryTask.execute(query, function(results) {
            var select = document.getElementById("valueDropDown");
			//clear the options from the value drop down list
			_this._clearValueDropDown(select);
			//create a null option and add it to the list
            var nullOption = document.createElement("option");
            nullOption.value = "none";
            nullOption.innerHTML = "none";
            select.appendChild(nullOption);
            var valueArray = [];
			//loop through the features returned by the query and add each attribute value to the value array
            for(var i = 0; i < results.features.length; i++) {
                var obj = results.features[i].attributes;
                var value = obj[Object.keys(obj)[0]];
                valueArray.push(value);
            }
			//sort the array (Looks nice!)
            valueArray.sort();
			//loop through the value array and create an option for each value
            for(var i = 0; i < valueArray.length; i++) {
                var option = document.createElement("option");
                option.value = valueArray[i];
                option.innerHTML = valueArray[i];
                select.appendChild(option);
            }
        });
    },

	//print the results to the console
    _showResults: function(results) {
 		if(this.verify) {
            alert("Query is correctly formed");
		}
		else {
			if(results.features) {
				this.currentResults = results.features;
			}
			else {
				this.currentResults = results;
            }
			console.log(this.currentResults);
		}
		this.verify = false;
    },

	//execute the query when the 'Apply' button is clicked
    applyQuery: function () {
        _this.submitQuery();
    },
	
	//push layers to the layer list
	addLayers: function(layers) {
		this.layerList.concat(layers);
	},

	//clear the current query
    clearQuery: function() {
        document.getElementById("textArea").value = "";
    },
    
	//destroy the widget
    destroy: function() {
        this.inherited(arguments);
    },
    
	//takes you to an sql reference page when the help button is clicked
    getHelp: function() {
        window.open("http://www.w3schools.com/sql/sql_quickref.asp");   
    },
	
	//hide the widget
	hide: function() {
		document.getElementById(_this.baseNode).style.visibility = "hidden";
	},
    
	//load a previously saved query each time the 'Load' button is clicked
    loadQuery: function() {
		//pull the query at the current index from the queryList array
        document.getElementById("textArea").value = _this.queryList[_this.currentIndex];
		//if we have reached the end of the queryList, start over at index 0
        if((_this.currentIndex + 1) == _this.queryList.length) {
			_this.currentIndex = 0;
		}
		else {
			_this.currentIndex++;
		}   
    },
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	//remove layers from the layer list
	removeLayers: function(layers) {
		//loop through the layers passed to the method
		for(var j = 0; j < layers.length; j++) {
			//loop through the layerList parameter
			for(var i = 0; i < this.layerList.length; i++) {
				//if the current layer in the method argument matches a layer in the layer list, remove it from the layer list
				if(layers[j].name == this.layerList[i].name) {
					this.layerList[i].splice(i, 1);
				}
			}
		}
	},

	//push a query to the queryList array
    saveQuery: function() {
		//check to see if there is actually a query in the test area
        if(document.getElementById("textArea").value.length > 0) {
			_this.queryList.push(document.getElementById("textArea").value);
			alert("Query saved!");
		}
		else {
			alert("Query empty! Nothing saved!");
		}       
    },

	//show the widget
	show: function() {
		document.getElementById(_this.baseNode).style.visibility = "visible";
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
    
	//send the query to the server
    submitQuery: function() {
        var layer;
		//create a new query pulling the where clause from the text area
		var query = new Query();
        query.where = document.getElementById("textArea").value;
        query.outFields = ["*"];
		//no need to return geometry, we will be using the FeatureLayer's selectFeatures method
        query.returnGeometry = false;
        var name = document.getElementById("layerDropDown").value;
		//loop through the layerList to access the currently selected layer
        for(var i = 0; i < _this.layerList.length; i++) {
            if(name == _this.layerList[i].name) {
                layer = _this.layerList[i];
            }
        }
		//get the current selection method
        var method = document.getElementById("methodDropDown").value;
		//chose how to execute the query based on the method
        switch(parseInt(method)) {
			case 1:
				//select features based on the above query
				layer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (results) {
                     _this._showResults(results);
                },
                function () {
                    _this._displayError();
                });
				break;
			case 2:
				//add features to the current selection based on the above query
                layer.selectFeatures(query, FeatureLayer.SELECTION_ADD, function (results) {
                    _this._showResults(results);
                },
                function () {
                    _this._displayError();
                });
				break;
            case 3:
				//remove features from the current selection based on the above query
                layer.selectFeatures(query, FeatureLayer.SELECTION_SUBTRACT, function (results) {
                    _this._showResults(results);
                },
                function () {
                    this._displayError();
                });
				break;
			default:
				//the default is to select features
                layer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (results) {
                    _this._showResults(results);
                },
                function (error) {
                    _this._displayError(error);
                });
				break;
		}
    },
   
    //verify that the query is valid
    verifyQuery: function () {
		//set the verify parameter to true
		_this.verify = true;
		//execute the query
		_this.submitQuery();   
    }
	});
	
	return Widget
});