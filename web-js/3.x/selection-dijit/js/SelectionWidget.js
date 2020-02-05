define(["dojo/_base/Color", "esri/symbols/SimpleMarkerSymbol",
  "esri/dijit/Geocoder", "dojo/dom-construct", "dijit/form/HorizontalRule",
  "dijit/form/HorizontalSlider", "dojo/Evented", "dojo/_base/declare",
  "dojo/_base/lang", "dijit/_WidgetBase", "dijit/a11yclick",
  "dijit/_TemplatedMixin", "dojo/on",
  "dojo/text!application/templates/SelectionWidget.html",
  "dojo/i18n!application/nls/SelectionWidget", "dojo/dom-style",
  "dojo/dom-class", "dojo/dom-attr", "dojo/domReady!"
], function(Color, SimpleMarkerSymbol, Geocoder, domConstruct,
  HorizontalRule, HorizontalSlider, Evented, declare, lang, _WidgetBase,
  a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domStyle, domClass,
  domAttr) {
  return declare("application.SelectionWidget", [_WidgetBase,
    _TemplatedMixin, Evented
  ], {
    templateString: dijitTemplate,
    options: {
      map: null,
      visible: true
    },
    constructor: function(options, srcRefNode) {
      this.css = {
        toggle: "toggle",
        outer: "selection-outer",
        sliderContainer: "selection-sliderContainer",
        sliderContainerOutside: "selection-sliderContainerOutside",
        divSliderValue: "selection-divSliderValue",
        horizontalRuleContainer: "selection-horizontalRuleContainer",
        horizontalRuleContainerOutside: "selection-horizontalRuleContainerOutside",
        horizontalRule: "selection-horizontalRule",
        unitContainer: "selection-unitContainer",
        geocoderContainer: "selection-geocoderContainer",
        optionsContainer: "selection-optionsContainer",
        optionsDistance: "selection-optionsDistance",
        optionsCheckbox: "selection-optionsCheckbox",
        optionsLabel: "selection-optionsLabel"
      };
      this._i18n = i18n;
      var defaults = lang.mixin({}, this.options, options);
      this.domNode = srcRefNode;
      // set properties
      this.set("map", defaults.map);
      this.set("visible", defaults.visible);
      this.set("container", defaults.container);
      this.set("fullscreen", false);
    },
    postCreate: function() {},
    startup: function() {
      var map = this.get("map");
      // map not defined
      if (!map) {
        console.log("map required");
        this.destroy();
        return;
      }
      if (!this.get("container")) {
        this.set("container", map.container);
      }
      if (map.loaded) {
        this._init();
      } else {
        on.once(map, "load", lang.hitch(this, function() {
          this._init();
        }));
      }
    },
    destroy: function() {
      this.inherited(arguments);
    },
    _init: function() {
      var outer = domConstruct.create("div", {
        className: this.css.outer
      });
      domConstruct.place(outer, this._selectionTemplate, "first"); //fix name
      var optionsContainer = domConstruct.create("div", {
        className: this.css.optionsContainer
      });
      domConstruct.place(optionsContainer, outer, "first");
      var optionsDistance = domConstruct.create("div", {
        className: this.css.optionsDistance
      });
      domConstruct.place(optionsDistance, optionsContainer, "first");
      var optionsInputDistanceCheckbox = domConstruct.create("input", {
        className: this.css.optionsCheckbox
      });
      domConstruct.place(optionsInputDistanceCheckbox,
        optionsDistance, "first");
      domAttr.set(optionsInputDistanceCheckbox, "type", "checkbox");
      var optionsLabelDistance = domConstruct.create("div", {
        className: this.css.optionsLabel
      });
      domConstruct.place(optionsLabelDistance, optionsDistance,
        "last");
      optionsLabelDistance.innerHTML = "Search by distance";
      var optionsInputTimeCheckbox = domConstruct.create("input", {
        className: this.css.optionsCheckbox
      });
      domConstruct.place(optionsInputTimeCheckbox, optionsDistance,
        "last");
      domAttr.set(optionsInputTimeCheckbox, "type", "checkbox");
      var optionsLabelTime = domConstruct.create("div", {
        className: this.css.optionsLabel
      });
      domConstruct.place(optionsLabelTime, optionsDistance, "last");
      optionsLabelTime.innerHTML = "Search by drive time";
      var geocodeContainer = domConstruct.create("div", {
        className: this.css.geocoderContainer
      });
      domConstruct.place(geocodeContainer, outer, "last");
      var geocoder = new Geocoder({
        map: this.map,
        autoComplete: true
      }, geocodeContainer);
      geocoder.startup();
      geocoder.focus();
      geocoder.on("select", function(evt) {
        var point = evt.result.feature.geometry;
        console.log(evt);
        evt.result.feature.symbol = new SimpleMarkerSymbol(
          "circle", 20, null, new Color([255, 0, 0, 0.25]));
        this.map.graphics.add(evt.result.feature);
        var slider = dijit.byId("slider-container-attach-point");
        console.log(slider);
        alert(slider.value);
      });
      geocoder.on("clear", function(evt) {
        this.map.graphics.clear();
        this.map.infoWindow.hide();
      });
      var divSliderValue = domConstruct.create("div", {
        className: this.css.divSliderValue
      });
      domConstruct.place(divSliderValue, outer, "last");
      var unitContainer = domConstruct.create("div", {
        className: this.css.unitContainer
      });
      domConstruct.place(unitContainer, outer, "last");
    
      var sliderContainerOutside = domConstruct.create("div", {
        className: this.css.sliderContainer
      });
      domConstruct.place(sliderContainerOutside, outer, "last"); //fix name
      var sliderContainer = domConstruct.create("div");
      domConstruct.place(sliderContainer, sliderContainerOutside,
        "first")
      domAttr.set(sliderContainer, "data-dojo-attach-point",
        "container-attach-point");
      var horizontalRuleContainerOutside = domConstruct.create("div", {
        className: this.css.horizontalRuleContainer
      });
      domConstruct.place(horizontalRuleContainerOutside, outer,
        "last");
      var horizontalRuleContainer = domConstruct.create("div", {
        className: this.css.horizontalRuleContainer
      });
      domConstruct.place(horizontalRuleContainer,
        horizontalRuleContainerOutside, "last");
      this._createHorizontalSlider(sliderContainer,
        horizontalRuleContainer, divSliderValue, unitContainer);
    },
    _createHorizontalSlider: function(sliderContainer,
      horizontalRuleContainer, divSliderValue, unitContainer) {
      var _self, horizontalSlider, sliderId, horizontalRule,
        sliderTimeOut, tabCount, bufferDistance;
      tabCount = 0;
      bufferDistance = 50;
      var distanceUnitSettings = {
        MinimumValue: 0,
        MaximumValue: 100,
        DistanceUnitName: "Miles"
      };
      sliderId = "slider-" + domAttr.get(sliderContainer,
        "data-dojo-attach-point");
      horizontalRule = new HorizontalRule({
        className: this.css.selection - horizontalRule
      }, horizontalRuleContainer);
      horizontalRule.domNode.firstChild.style.border = "none";
      horizontalRule.domNode.lastChild.style.border = "none";
      horizontalRule.domNode.lastChild.style.right = "0" + "px";
      if (!bufferDistance) {
        if (distanceUnitSettings.MinimumValue >= 0) {
          bufferDistance = distanceUnitSettings.MinimumValue;
        } else {
          bufferDistance = 0;
          distanceUnitSettings.MinimumValue = bufferDistance;
        }
      }
      horizontalSlider = new HorizontalSlider({
        intermediateChanges: true,
        //"class": "horizontalSlider",
        minimum: distanceUnitSettings.MinimumValue,
        value: bufferDistance,
        id: sliderId
      }, sliderContainer);
      horizontalSlider.tabCount = tabCount;
      var axisRight = horizontalRule.domNode.lastChild;
      var axisLeft = horizontalRule.domNode.firstChild;
      if (distanceUnitSettings.MaximumValue > 0) {
        axisRight.innerHTML = distanceUnitSettings.MaximumValue;
        horizontalSlider.maximum = distanceUnitSettings.MaximumValue;
      } else {
        axisRight.innerHTML = 1000;
        horizontalSlider.maximum = 1000;
      }
      if (distanceUnitSettings.MinimumValue >= 0) {
        axisLeft.innerHTML = distanceUnitSettings.MinimumValue;
      } else {
        axisLeft.firstChild.innerHTML = 0;
      }
      domStyle.set(axisRight, "margin-left", "-40px");
      domStyle.set(axisLeft, "margin-left", "20px");
      domStyle.set(axisRight, "float", "right");
      domAttr.set(divSliderValue, "distanceUnit",
        distanceUnitSettings.DistanceUnitName.toString());
      domAttr.set(divSliderValue, "innerHTML", "Show results in " +
        horizontalSlider.value.toString() + " " +
        distanceUnitSettings.DistanceUnitName);
      /**
       * call back for slider change event
       * @param {object} slider value
       * @memberOf widgets/SiteLocator/SiteLocatorHelper
       */
      on(horizontalSlider, "change", lang.hitch(this, function(value) {
        console.log(value);
        if (Number(value) > Number(horizontalSlider.maximum)) {
          horizontalSlider.setValue(horizontalSlider.maximum);
        }
        domAttr.set(divSliderValue, "innerHTML",
          "Show results in " + Math.round(value) + " " +
          domAttr.get(divSliderValue, "distanceUnit"));
        var distance = Math.round(value);
        clearTimeout(sliderTimeOut);
        sliderTimeOut = setTimeout(function() {
          //  				if (_self.featureGeometry && _self.featureGeometry[_self.workflowCount]) {
          //  					_self._createBuffer(_self.featureGeometry[_self.workflowCount]);
          //  					if (_self.workflowCount === 0 && _self.selectBusinessSortForBuilding) {
          //  						dojo.sortingData = null;
          //  						_self.selectBusinessSortForBuilding.set("value", sharedNls.titles.select);
          //  					}
          //	  				if (_self.workflowCount === 1 && _self.selectBusinessSortForSites) {
          //	  					dojo.sortingData = null;
          //	  					_self.selectBusinessSortForSites.set("value", sharedNls.titles.select);
          //	  				}
          //	  				if (_self.workflowCount === 2 && _self.selectSortOption) {
          //	  					_self.selectSortOption.set("value", sharedNls.titles.select);
          //	  				}
          //  				}
          console.log("some time later.");
        }, 500);
      }));
    }
  });
});