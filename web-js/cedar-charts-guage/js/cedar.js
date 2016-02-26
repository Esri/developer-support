/**
 * Cedar
 *
 * Generic charting / visualization library for the ArcGIS Platform
 * that leverages vega + d3 internally.
 * @access private
 */
(function (factory) {
  /* global module */
  'use strict';
  //define an AMD module that relies on 'vega'
  if (typeof define === 'function' && define.amd) {
    define(['vega', 'd3'], function (vg, d3) {
      return factory(vg, d3);
    });
  //define a common js module that relies on 'vega'
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('vega'), require('d3'));
  }

  if (typeof window !== 'undefined' && window.vg && window.d3) {
    window.Cedar = factory(window.vg, window.d3);
  }
} (function (vg, d3) {
  'use strict';

  // get cedar root URL for loading chart specs
  var baseUrl = (function() {
    var cdnProtocol = 'http:';
    var cdnUrl = '//esri.github.io/cedar/js';
    var src;
    if (window && window.document) {
      src = (window.document.currentScript && window.document.currentScript.src);
      if (src) {
        // real browser, get base url from current script
        return src.substr(0, src.lastIndexOf('/'));
      } else {
        // ie, set base url to CDN
        // NOTE: could fallback to CDN only if can't find any scripts named cedar 
        return (window.document.location ? window.document.location.protocol : cdnProtocol) + cdnUrl;
      }
    } else {
      // node, set base url to CDN
      return cdnProtocol + cdnUrl;
    }
  })();

/**
 * Creates a new Chart object.
 * 
 * @example
 *  var chart = new Cedar({
 *    "type": "bar"
 *    "dataset":
 *      "url":"http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Education_WebMercator/MapServer/5",
 *      "query": {
 *        "groupByFieldsForStatistics": "FACUSE",
 *        "outStatistics": [{
 *          "statisticType": "sum", 
 *          "onStatisticField": "TOTAL_STUD", 
 *          "outStatisticFieldName": "TOTAL_STUD_SUM"
 *        }]
 *      },
 *      "mappings":{
 *        "sort": "TOTAL_STUD_SUM DESC",
 *        "x": {"field":"FACUSE","label":"Facility Use"},
 *        "y": {"field":"TOTAL_STUD_SUM","label":"Total Students"}
 *      }
 *    }
 *  });
 * 
 * @param {Object} options
 * @param {String} options.type - Chart type as a chartType ("bar") or a URL to a Cedar specification
 * @param {Object} options.dataset - Dataset definition including Source and Style mappings
 * @param {String} options.dataset.url - GeoService Layer URL
 * 
 * "url":"http://.../rest/services/DATA/Education/MapServer/5"
 * @param {Object} options.dataset.query - GeoServices Layer query parameters (where, bbox, outStatistics) [optional]
 * 
 * "query": {
 *   "groupByFieldsForStatistics": "FACUSE",
 *   "outStatistics": [{
 *     "statisticType": "sum", 
 *     "onStatisticField": "TOTAL_STUD", 
 *     "outStatisticFieldName": "TOTAL_STUD_SUM" }] }
 * @param {Object} options.dataset.data - Inline feature collection, alternative to data from a URL
 *  
 * "data": {"features":[{"attributes":{"ZIP_CODE":20005,"TOTAL_STUD_SUM":327}}]}
 * @param {Object} options.dataset.mappings - Relates data items to the chart style definition
 * @param {Object} options.override - Changes to the "options.type" chart specification
 * @param {Object} options.tooltip - Optional on-hover tooltip. Element has class="cedar-tooltip" for styling.
 * @param {String} options.tooltip.id - Optional HTML element to use for tooltip. (default: unique id created)
 * @param {String} options.tooltip.title - Templated tooltip heading. Uses "{Variable} template format"
 * @param {String} options.tooltip.content - Templated tooltip body text. Uses "{Variable} template format" 
 * @return {Object} new Cedar chart object
 */
var Cedar = function Cedar(options){
  //close over this for use in callbacks
  var self = this;

  //ensure an opts object
  var opts = options || {};

  var spec;


  // Internals for holding state

  // Cedar configuration such as size
  this.width = undefined;
  this.height = undefined;
  this.autolabels = true;

  // Array to hold event handlers
  this._events = [];

  //initialize the internal definition hash
  this._definition = Cedar._defaultDefinition();

  //the vega view aka the chart
  this._view = undefined;

  //the vega view aka the chart
  this._tooltip = undefined;

  //queue to hold methods called while
  //xhrs are in progress
  this._methodQueue=[];

  // override base URL 
  if (opts.baseUrl) {
    this.baseUrl = opts.baseUrl;
  }

  /**
   * Flag used to determine if the library is
   * waiting for an xhr to return. 
   * @access private
   */
  this._pendingXhr = false;

  //defintion 
  if(opts.definition){
    //is it an object or string(assumed to be url)
    if(typeof opts.definition === 'object'){
      //hold onto the definition
      this._definition = opts.definition;
    }else if(typeof opts.definition === 'string' ){ 
      //assume it's a url (relative or abs) and fetch the definition object
      this._pendingXhr = true;
      Cedar.getJson(opts.definition, function(err,data){
        self._pendingXhr = false;
        self._definition = data; 
        self._purgeMethodQueue();
      });
    }else{
      throw new Error('parameter definition must be an object or string (url)');
    }
  }

  if(opts.override) {
    this._definition.override = opts.override;
  }

  // specification

  // first, check for pre-defined chart type passed as "type"
  spec = this._getSpecificationUrl(opts.type);

  // if url or object passed used that
  if(opts.specification){
    spec = opts.specification;
  }

  if (spec) {
    //is it an object or string(assumed to be url)
    if(typeof spec === 'object'){
      //hold onto the template
      this._definition.specification = spec;

    }else if(typeof spec === 'string' ){ 
      //assume it's a url (relative or abs) and fetch the template object
      this._pendingXhr = true;
      Cedar.getJson(spec, function(err,data){
        self._pendingXhr = false;
        self._definition.specification = data; 
        self._purgeMethodQueue();
      });
    }else{
      throw new Error('parameter specification must be an object or string (url)');
    }
  }

  //allow a dataset to be passed in...
  if(opts.dataset && typeof opts.dataset === 'object'){
    opts.dataset.query = Cedar._mixin({}, Cedar._defaultQuery(), opts.dataset.query);
    //assign it
    this._definition.dataset = opts.dataset;
  }

  /**
   * Properties
   *
   * ES 5.1 syntax, so IE 8 & lower won't work
   * 
   * If the val is a url, should we expect
   * cedar to fetch the object? 
   * 
   * I'd say no... as that violates the principal 
   * of least suprise. Also - cedar has a .getJSON
   * helper method the dev should use.
   * 
   * @access private
   */ 
  Object.defineProperty(this, 'dataset', {
    get: function() {
        return this._definition.dataset;
    },
    set: function(val) {
       this._definition.dataset = val;
    }
  });

  Object.defineProperty(this, 'specification', {
    get: function() {
        return this._definition.specification;
    },
    set: function(val) {
      this._definition.specification = val;
    }
  });

  Object.defineProperty(this, 'override', {
    get: function() {
        return this._definition.override;
    },
    set: function(val) {
      this._definition.override = val;
    }
  });  

  Object.defineProperty(this, 'tooltip', {
    get: function() {
        return this._definition.tooltip;
    },
    set: function(val) {
      this._definition.tooltip = val;
      if( this._definition.tooltip.id === undefined || this._definition.tooltip.id === null ) {
        this._definition.tooltip.id = "cedar-" + Date.now();
      }
    }
  });  

  //allow a tooltip to be passed in...
  if(opts.tooltip && typeof opts.tooltip === 'object'){
    this.tooltip = opts.tooltip;
  } else {
    // Build a default tooltip based on first two inputs
    var inputs = []
    for(var input in this._definition.dataset.mappings){
      if (this._definition.dataset.mappings.hasOwnProperty(input)) { 
        var field = this._definition.dataset.mappings[input].field;
        if(field !== undefined && field !== null) {
          inputs.push(field);
        }          
      };
    }
    if(inputs.length >= 2) {
      this.tooltip = {
        "title": "{" + inputs[0] + "}",
        "content": "{" + inputs[1] + "}"
      }
    }     
  }
};

// base URL of this library
Cedar.prototype.baseUrl = baseUrl;

/** 
 * Default pre-defined chart types
 * 
 * ['bar', 'bar-horizontal', 'bubble', 'grouped', 'pie', 'scatter', 'sparkline', 'time'];
 */
Cedar.prototype.chartTypes = ['bar', 'bar-horizontal', 'bubble', 'grouped', 'pie', 'scatter', 'sparkline', 'time'];

/**
 * Inspect the current state of the object
 * and determine if we have sufficient information
 * to render the chart
 * @return {object} Hash of the draw state + any missing requirements
 */
Cedar.prototype.canDraw = function(){

  //dataset?
  //dataset.url || dataset.data?
  //dataset.mappings?
  //specification?
  //specification.template?
  //specification.inputs?
  //specification.inputs ~ dataset.mappings?
  
  return {drawable:true, errs:[]};

};

/**
 * Draw the chart into the DOM element
 * 
 * @example
 * 
 * var chart = new Cedar({
 *   "type": "scatter",
 *   "dataset":{
 *     "url":"http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Education_WebMercator/MapServer/5",
 *     "query":{},
 *     "mappings":{
 *       "x": {"field":"POPULATION_ENROLLED_2008","label":"Enrolment 2008"},
 *       "y": {"field":"SQUARE_FOOTAGE","label":"Square Footage"},
 *       "color":{"field":"FACUSE","label":"Facility Type"}
 *     }
 *   }
 * });
 * 
 * chart.show({
 *   elementId: "#chart"
 * });
 * 
 * @param  {object} options 
 * @param {String} options.elementId [required] Id of the Dom element into which the chart will be rendered
 * @param {String} options.renderer "canvas" or "svg" (default: `svg`)
 * @param {Boolean} options.autolabels place axis labels outside any tick labels (default: false)
 * @param {String} options.token Token to be used if the data or spec are on a secured server
 */
Cedar.prototype.show = function(options){
  if(this._pendingXhr){
    
    this._addToMethodQueue('show', [options]);

  }else{

    var err;
    //ensure we got an elementId
    if( !options.elementId ){
      err= "Cedar.show requires options.elementId";
    }
    //check if element exists in the page
    if(d3.select(options.elementId)[0][0] === null){
      err = "Element " + options.elementId + " is not present in the DOM";
     }
  
    //hold onto the id
    this._elementId = options.elementId;
    this._renderer = options.renderer || "svg"; //default to svg
    this.width = options.width || undefined; // if not set in API, always base on current div size
    this.height = options.height || undefined;
    if(options.autolabels !== undefined && options.autolabels !== null){
      this.autolabels = options.autolabels;
    }
    //hold onto the token
    if(options.token){
      this._token = options.token;
    }

    if( err ){
      throw new Error( err );
    }
    var chk = this.canDraw();
    if(chk.drawable){
      //update centralizes the spec compilation & drawing
      this.update();  
    }else{
      //report the issues
      var errs = chk.issues.join(',');
      throw new Error('Chart can not be drawn because: ' + errs);  
    }
    
  }
};

/**
 * Draw the chart based on any changes to data or specifications
 * Should be called after a user modifies 
 * the dataset, query, mappings, chart specification or element size
 *
 * @example
 * dataset = {"url": "...", "mappings": {"x": {"field": "STATE"}, "y": {"field": "POPULATION"}}};
 * chart = new Cedar({ "type": "bar", "dataset": dataset });
 * chart.show({elementId: "#chart"});
 * chart.dataset.query.where = "POPULATION>30000";
 * chart.update();
 */
Cedar.prototype.update = function(){
  var self = this;
  
  if ( this._view ) { 
    this.emit('update-start');
  }

  if(this._pendingXhr){
    
    this._addToMethodQueue('update');

  }else{

    if(this._view){
      //remove handlers
      //TODO Remove existing handlers
      this._remove(this._view);
    }
    try{

      // Creates the HTML Div and styling if not already created
      if(self._definition.tooltip !== undefined && self._definition.tooltip !== null) {
        self._createTooltip(self._definition.tooltip.id);
      }

      //ensure we have required inputs or defaults 
      var compiledMappings = Cedar._applyDefaultsToMappings(this._definition.dataset.mappings, this._definition.specification.inputs); //Cedar._compileMappings(this._definition.dataset, this._definition.specification.inputs);

      var queryFromSpec = Cedar._mixin({}, this._definition.specification.query, this._definition.dataset.query);
      queryFromSpec = JSON.parse(Cedar._supplant(JSON.stringify(queryFromSpec), compiledMappings));

      //allow binding to query properties
      compiledMappings.query = queryFromSpec;

      //compile the template + mappings --> vega spec
      var spec = JSON.parse(Cedar._supplant(JSON.stringify(this._definition.specification.template), compiledMappings)); 

      // merge in user specified style overrides
      spec = Cedar._mergeRecursive(spec, this._definition.override);

      //if the spec has a url in the data node, delete it
      if(spec.data[0].url){
        delete spec.data[0].url;
      }

      if(this._definition.dataset.data){

        //create the data node using the passed in data
        spec.data[0].values = this._definition.dataset.data;
        
        //send to vega
        this._renderSpec(spec);
      
      }else{
      
        //we need to fetch the data so
        var url = Cedar._createFeatureServiceRequest(this._definition.dataset, queryFromSpec);
      
        //create a callback closure to carry the spec
        var cb = function(err,data){
      
          //todo add error handlers for xhr and ags errors
          spec.data[0].values = data;
          console.dir(spec);
          //send to vega
          self._renderSpec(spec);

        };

        //fetch the data from the service
        Cedar.getJson(url, cb);
      }
    }
    catch(ex){
      throw(ex);
    }
  }
};

/**
 * Render a compiled Vega specification using Vega Runtime
 * @access private
 */
Cedar.prototype._renderSpec = function(spec){
  var self = this;
  try{
    if(self.autolabels === true) {
        spec = self._placeLabels(spec);
        spec = self._placeaAxisTicks(spec);
    }
    //use vega to parse the spec 
    //it will handle the spec as an object or url
    vg.parse.spec(spec, function(chartCtor) { 

      //create the view
      self._view = chartCtor({
        el: self._elementId,
        renderer: self._renderer
      });

      
      var width = self.width || parseInt(d3.select(self._elementId).style('width'), 10) || 500;
      var height = self.height || parseInt(d3.select(self._elementId).style('height'), 10) || 500;

      //render into the element
      self._view.width(width).height(height).update(); 

      //attach event proxies
      self._attach(self._view);

      if ( self._view ) { 
        self.emit('update-end');
      }

    });
  }
  catch(ex){
    throw(ex);
  }
};

/**
 * Automatically determines axis title placement
 * 
 * Calculates the maximum length of a tick label and adds padding
 * @todo remove expectation that there are both x,y axes
 * 
 * @access private
 */
Cedar.prototype._placeLabels = function(spec) {
  var self = this;
  try{  
    var fields = {};
    var lengths = {};
    var inputs = [];
    // Get all inputs that may be axes
    for(var input in self._definition.dataset.mappings){
      // check also if property is not inherited from prototype
      if (self._definition.dataset.mappings.hasOwnProperty(input)) { 
        var field = self._definition.dataset.mappings[input].field;
        if(field !== undefined && field !== null) {
          inputs.push(input);
          fields[input] = field;
          lengths[input] = 0;
        }
      }
    }
    var length = 0;

    // Find the max length value for each axis
    spec.data[0].values.features.forEach(function(feature) {
      inputs.forEach(function(axis) {
        length = (feature.attributes[fields[axis]] || "").toString().length;
        if( length > lengths[axis]) {
          lengths[axis] = length;  
        }      
      });
    });

    // Change each axis title offset based on longest value
    inputs.forEach(function(axis, index) {
      var angle = 0;
      if(spec.axes !== undefined && spec.axes[index] !== undefined) {

        if (spec.axes[index].properties.labels.angle !== undefined) {
          angle = spec.axes[index].properties.labels.angle.value;
        }
        if(spec.axes[index].type == 'y' ) {
          angle = 100 - angle;
        }      
        spec.axes[index].titleOffset = Math.abs(lengths[axis] * angle/100 * 8) + 35;
        //chart._view.model().defs().marks.axes[index].titleOffset = lengths[axis]*4+20
      }
    });
    return spec;

  } catch(ex) {
    throw(ex);
  }
};

/**
 * Automatically determines number of axis tick marks
 * 
 * Calculates the maximum length of a tick label and adds padding
 * @todo remove expectation that there are both x,y axes
 * 
 * @access private
 */
Cedar.prototype._placeaAxisTicks = function(spec) {
  var self = this;
  if(spec.axes !== undefined) {
    try{  
      var width = self.width || parseInt(d3.select(self._elementId).style('width'), 10) || 500;
      var height = self.height || parseInt(d3.select(self._elementId).style('height'), 10) || 500;
      
      spec.axes[0].ticks = width / 100;
      spec.axes[1].ticks = height / 30;
    } catch(ex) {
      throw(ex);
    }
  }  

  return spec;
};

/**
 * Highlight marker based on attribute value
 * 
 * @example
 * chart = new Cedar({...});
 * chart.select({key: "ZIP_CODE", value: "20002"});
 * 
 * @param {Object} options - Object(key, value) to match. Calls hover on mark
 * @returns {Array} items - array of chart objects that match the criteria
 */
Cedar.prototype.select = function( options ) {
  var self = this;
  var view = this._view;
  var items = view.model().scene().items[0].items[0].items;

  items.forEach(function(item) {
    if ( item.datum.attributes[options.key] === options.value ) {
      if ( item.hasPropertySet("hover") ) {
        self._view.update({props:"hover", items:item});
      }
    }
  });

  return items;

};


/**
 * Removes highlighted chart items
 * 
 * If "options" are used, only clear specific items, otherwise clears all highlights.
 * @param {Object} options - Object(key, value) to match. Calls hover on mark
 * @returns {Array} items - array of chart objects that match the criteria, or null if all items.
 */
Cedar.prototype.clearSelection = function( options ) {
  var self = this;
  var view = this._view;

  if ( options && options.key ) {
    var items = view.model().scene().items[0].items[0].items;
    items.forEach(function(item) {
      if ( item.datum.attributes[options.key] === options.value ) {
        self._view.update({props:"update", items:item});
      }
    });
    return items;
  } else {
    //clear all 
    self._view.update();
    return null;
  }
};


/** 
 * Trigger a callback 
 * @param {Strint} eventName - ["mouseover","mouseout","click","update-start","update-end"]
 */
Cedar.prototype.emit = function(eventName) {
  if (this._view._handler._handlers[ eventName ] && this._view._handler._handlers[ eventName ][0] !== undefined){
    this._view._handler._handlers[ eventName ][0].handler();
  }
};

/**
 * Attach the generic proxy handlers to the chart view
 * @access private
 */
Cedar.prototype._attach = function(view){
  
  view.on('mouseover', this._handler('mouseover'));
  view.on('mouseout', this._handler('mouseout'));
  view.on('mousemove', this._handler('mousemove'));
  view.on('click', this._handler("click"));
  view.on('update-start', this._handler('update-start'));
  view.on('update-end', this._handler('update-end'));
  
};

/**
 * Remove all event handlers from the view
 * @access private
 */
Cedar.prototype._remove = function(view){

  view.off('mouseover');
  view.off('mouseout');
  view.off('mousemove');
  view.off('click');
  view.off('update-start');
  view.off('update-end');
  
};

/**
 * Helper function that validates that the 
 * mappings hash contains values for all
 * the inputs
 * @param  {array} inputs   Array of inputs
 * @param  {object} mappings Hash of mappings
 * @return {array}          Missing mappings
 * @access private
 */
Cedar._validateMappings = function(inputs, mappings){
  var missingInputs = [], input;
  for(var i=0;i<inputs.length;i++){
    input = inputs[i];
    if(input.required){
      if(!mappings[input.name]){
        missingInputs.push(input.name);
      }
    }
  }
  return missingInputs;
};

/**
 * Validate that the incoming data has the fields expected
 * in the mappings
 * @access private
 */
Cedar._validateData = function(data, mappings){
  var missingInputs = [];
  if(!data.features || !Array.isArray(data.features)){
    throw new Error('Data is expected to have features array!');
  }
  var firstRow = data.features[0].attributes;
  for(var key in mappings){
    if (mappings.hasOwnProperty(key)) {
      var fld = Cedar._getMappingFieldName(key, mappings[key].field);
      if(!firstRow.hasOwnProperty(fld)){
        missingInputs.push(fld);
      }
    }
  }
  return missingInputs;
};

/**
 * Centralize and abstract the computation of
 * expected field names, based on the mapping name
 * @access private
 */
Cedar._getMappingFieldName = function(mappingName, fieldName){
  var name = fieldName;
  //if(mappingName.toLowerCase() === 'count'){
  //  name = fieldName + '_SUM';
  //}
  return name;
};

/**
 * Return a default definition object
 * @access private
 */
Cedar._defaultDefinition = function(){
  var defn = {
    "dataset": {
      "query": this._defaultQuery()
    },
    "template":{}
  };

  defn.dataset.query = Cedar._defaultQuery();

  return defn;
};

/**
 * Default Query Object
 * @access private
 */
Cedar._defaultQuery = function(){
  var defaultQuery = {
    "where": "1=1",
    "returnGeometry": false,
    "returnDistinctValues": false,
    "returnIdsOnly": false,
    "returnCountOnly": false,
    "outFields": "*",
    "f": "json"
  };
  return defaultQuery;
};

/**
 * Get pre-defined spec url
 * @access private
 */
Cedar.prototype._getSpecificationUrl = function(spec){
  if (this.chartTypes.indexOf(spec) !== -1) {
    spec = this.baseUrl + '/charts/' + this.chartTypes[this.chartTypes.indexOf(spec)] + '.json';
  }
  return spec;
};

/**
 * Generic event handler proxy
 * @access private
 */
Cedar.prototype._handler = function(evtName) {
  var self = this;
  
  //return a handler function w/ the events hash closed over
  var handler = function(evt, item){
    self._events.forEach( function(registeredHandler){
      if(registeredHandler.type === evtName){
        //invoke the callback with the data
        if ( item ) {
          registeredHandler.callback(evt, item.datum.attributes);
        } else {
          registeredHandler.callback(evt,null);
        }
      }
    });
  };
  return handler;
};

/**
 * Add a handler for the named event.
 * Events: 
 *  - mouseover
 *  - mouseout
 *  - click
 *  - update-start
 *  - update-end
 * 
 * 
 * 
 * Callback from Cedar events
 *  - callback Cedar~eventCallback
 *  - param {Object} event - event response such as mouse location 
 *  - param {Object} data - chart data object
 * 
 * @example
 * var chart = new Cedar({ ... });
 * chart.on('mouseover', function(event, data) { 
 *   console.log("Mouse Location:", [event.offsetX, event.offsetY]);
 *   console.log("Data value:", data[Object.keys(data)[0]]);
 * });
 * 
 * @param {String} eventName name of the event that invokes callback
 * @param {Cedar~eventCallback} callback - The callback that handles the event.
 */
Cedar.prototype.on = function(evtName, callback){
  this._events.push({"type":evtName, "callback":callback});
};

/**
 * Remove a handler for the named event
 */
Cedar.prototype.off = function(evtName, callback){
  this._events.forEach(function(registeredEvent, index, object) {
    if(registeredEvent.type == evtName && registeredEvent.callback == callback ) {
      object.splice(index, 1);
    }
  })
};


/**
 * Creates an entry in the method queue, excuted 
 * once a pending xhr is completed 
 * @access private
 */
Cedar.prototype._addToMethodQueue = function(name, args){
  this._methodQueue.push({ method: name, args: args });
};

/**
 * empties the method queue by calling the queued methods
 * This helps build a more syncronous api, while still
 * doing async things in the code
 * @access private
 */
Cedar.prototype._purgeMethodQueue = function(){
  var self = this;
  if(self._methodQueue.length > 0){

    for(var i=0;i<self._methodQueue.length;i++){
      var action = self._methodQueue[i];
      self[action.method].apply(self, action.args);  
    }
  }
};

/**
 * Instantiates the tooltip element and styling
 * @access private
 */
Cedar.prototype._createTooltip = function(elem) {
  var self = this;
  var tooltip_div = document.getElementById(elem);

  // This tooltip has already been created
  if(tooltip_div !== undefined && tooltip_div !== null) {
    return tooltip_div;
  }

  // TODO: remove inline CSS
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = ".cedar-tooltip {background-color: #f36f22; padding: 3px 10px; color: #fff; margin: -30px 0 0 20px; position: absolute; z-index: 2000; font-size: 10px; } .cedar-tooltip .title {font-size: 13pt; font-weight: bold; } .cedar-tooltip .content {font-size: 10pt; } .cedar-tooltip:after {content: ''; position: absolute; border-style: solid; border-width: 15px 15px 15px 0; border-color: transparent #f36f22; display: block; width: 0; z-index: 1; left: -15px; top: 14px; }";
  document.getElementsByTagName('head')[0].appendChild(style);

  tooltip_div = document.createElement('div');
  tooltip_div.className = "cedar-tooltip";
  tooltip_div.id = elem;
  tooltip_div.style.cssText = "display: none";
  // We need tooltip at the top of the page
  document.body.insertBefore(tooltip_div, document.body.firstChild);


  self.on('mouseout', function(event,data){
    self._updateTooltip(event, null);
  });
  self.on('mousemove', function(event,data){
    self._updateTooltip(event, data);
  }); 
  return tooltip_div;
};

/** 
 * Places the tooltip and fills in content
 * 
 * @access private
 */
Cedar.prototype._updateTooltip = function(event, data) {
  var cedartip = document.getElementById(this._definition.tooltip.id);
  if(data === undefined || data === null) {
    cedartip.style.display = "none";
    return;
  }
  cedartip.style.top = event.pageY + "px";
  cedartip.style.left = event.pageX + "px";
  cedartip.style.display = "block";
  var content = "<span class='title'>" + this._definition.tooltip.title + "</span><br />";
  content += "<p class='content'>" + this._definition.tooltip.content + "</p>";

  cedartip.innerHTML = content.replace( /\{(\w+)\}/g, function replacer(match, $1){
    return data[$1];
  } );

};


/**
* @access private
*/
Cedar._mixin = function(source) {
    /*jshint loopfunc: true*/
    // TODO: prob should replace w/ forEach()
    for (var i = 1; i < arguments.length; i++) {
        d3.entries(arguments[i]).forEach(function(p) {
            source[p.key] = p.value;
        });
    }
    return source;
};

/**
 * Helper function to request JSON from a URL
 * @param  {String}   url      URL to json file
 * @param  {Function} callback node-style callback function (error, data)
 */
Cedar.getJson = function( url, callback ){
  var cb = function(err,data) {
    if(err){
      callback('Error loading ' + url + ' ' + err.message);
    }
    callback(null, JSON.parse(data.responseText));
  }
  if(url.length > 2000) {
    var uri = url.split("?")
    d3.xhr(uri[0])
      .header("Content-Type", "application/x-www-form-urlencoded")
      .post(uri[1], cb)
  } else {
    d3.xhr(url).get(cb)
  }
};
/**
 * Given a dataset hash, create the feature service
 * query string
 * @access private
 */
Cedar._createFeatureServiceRequest = function( dataset, queryFromSpec ) {
  var mergedQuery = Cedar._mixin({}, Cedar._defaultQuery(), queryFromSpec);

  //Handle bbox
  if(mergedQuery.bbox){
    //make sure a geometry was not also passed in
    if(mergedQuery.geometry){
      throw new Error('Dataset.query can not have both a geometry and a bbox specified');
    }
    //get the bbox (W,S,E,N)
    var bboxArr = mergedQuery.bbox.split(',');

    //remove it so it's not serialized as-is
    delete mergedQuery.bbox;

    //cook it into a json string 
    mergedQuery.geometry = JSON.stringify({"xmin": bboxArr[0], "ymin": bboxArr[2],"xmax": bboxArr[1], "ymax": bboxArr[3] });
    //set the spatial ref as geographic
    mergedQuery.inSR = '4326';
  }
  if(!mergedQuery.groupByFieldsForStatistics && dataset.mappings.group) {
      mergedQuery.groupByFieldsForStatistics = dataset.mappings.group.field;
  }
  if(!mergedQuery.outStatistics && dataset.mappings.count) {
    mergedQuery.orderByFields = dataset.mappings.count.field + "_SUM";
    mergedQuery.outStatistics = JSON.stringify([{"statisticType": "sum", "onStatisticField": dataset.mappings.count.field, "outStatisticFieldName": dataset.mappings.count.field + "_SUM"}]);
  }



  //iterate the mappings keys to check for sort
  //-----------------------------------------------------------------
  //This approach would seem 'clean' but if there are multiple fields
  //to sort by, the order would be determined by how javascript decides to
  //iterate the mappings property hash.
  //Thus, using mappings.sort gives the developer explicit control
  //-----------------------------------------------------------------
  // var sort = [];
  // for (var property in dataset.mappings) {
  //   if (dataset.mappings.hasOwnProperty(property)) {
  //     if(dataset.mappings[property].sort){
  //       //ok - build up the sort
  //       sort.push(dataset.mappings[property].field + ' ' + dataset.mappings[property].sort);
  //     }
  //   }
  // }
  // if(sort.length > 0){
  //   mergedQuery.orderByFields = sort.join(',');
  // }
  //-----------------------------------------------------------------
  //check for a sort passed directly in
  if(dataset.mappings.sort){
    mergedQuery.orderByFields = dataset.mappings.sort;
  }

  var url = dataset.url + "/query?" + this._serializeQueryParams(mergedQuery);
  
  if(dataset.token){
    url = url + '&token=' + dataset.token;
  }
  
  return url;
};

/**
* @access private
*/
Cedar._applyDefaultsToMappings = function(mappings, inputs){
  var errs = [];
  //loop over the inputs
  for(var i =0; i < inputs.length; i++){
    //get the input
    var input = inputs[i];

    //if it's required and not in the mappings, add an exception
    if(input.required && !mappings[input.name] ){
      errs.push(input.name);
    }
    
    //if it's not required, has a default and not in the mappings
    if(!input.required && !mappings[input.name] && input['default']){
      //add the default
      mappings[input.name] = input['default'];
    }
  }

  if(errs.length > 0){
    throw new Error('Required Mappings Missing: ' + errs.join(','));
  }else{
    return mappings;
  }
};


/**
 * Token Replacement on a string
 * @param  {string} template string template
 * @param  {object} params   object hash that maps to the tokens to be replaced
 * @return {string}          string with values replaced
 * @access private
 */
Cedar._supplant = function( tmpl, params ){
  var t = tmpl.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = Cedar._getTokenValue(params, b);

      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
  return t.replace(/"{([^{}]*)}"/g, 
    function(a, b) {
      var r = Cedar._getTokenValue(params, b);
      return r.constructor === Array ? r = JSON.stringify(r) : a;
    }
  );
};

/*
 * Recursively merge properties of two objects 
 * @access private
 */
Cedar._mergeRecursive = function(obj1, obj2) {
  for (var p in obj2) {
    if (obj2.hasOwnProperty(p)) {
      try {
        // Property in destination object set; update its value.
        if ( obj2[p].constructor===Object || obj2[p].constructor===Array) {
          obj1[p] = Cedar._mergeRecursive(obj1[p], obj2[p]);

        } else {
          obj1[p] = obj2[p];

        }

      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];

      }
    }
  }

  return obj1;
};

/**
 * Get the value of a token from a hash
 * @param  {[type]} tokens    [description]
 * @param  {[type]} tokenName [description]
 * @return {[type]}           [description]
 * Pulled from gulp-token-replace (MIT license)
 * https://github.com/Pictela/gulp-token-replace/blob/master/index.js
 * 
 * @access private
 */
Cedar._getTokenValue = function(tokens, tokenName) {
  var tmpTokens = tokens;
  var tokenNameParts = tokenName.split('.');
  for (var i = 0; i < tokenNameParts.length; i++) {
    if (tmpTokens.hasOwnProperty(tokenNameParts[i])) {
      tmpTokens = tmpTokens[tokenNameParts[i]];
    } else {
      return null;
    }
  }
  return tmpTokens;
};

/**
 * Serilize an object into a query string
 *
 * @param  {object} params Params for the query string
 * @return {string}        query string
 * @access private
 */
Cedar._serializeQueryParams = function(params) {
  var str = [];
  for(var p in params){
    if (params.hasOwnProperty(p)) {
      var val = params[p];
      if (typeof val !== "string") {
          val = JSON.stringify(val);
      }
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
    }
  }
  var queryString = str.join("&");
  return queryString;
};

  return Cedar;
}));