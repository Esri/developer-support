define([
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/has", // feature detection
    "esri/kernel", // esri namespace
    "dijit/_WidgetBase",
    "dijit/a11yclick", // Custom press, release, and click synthetic events which trigger on a left mouse click, touch, or space/enter keyup.
    "dijit/_TemplatedMixin",
    "dojo/on",
    "dojo/Deferred",  
    "dojo/text!application/dijit/templates/HomeButton.html", // template html
    "dojo/i18n!application/nls/jsapi", // localization
    "dojo/dom-class",
    "dojo/dom-style"
],
function (
    Evented,
    declare,
    lang,
    has, esriNS,
    _WidgetBase, a11yclick, _TemplatedMixin,
    on,
    Deferred,
    dijitTemplate, i18n,
    domClass, domStyle
) {
    var Widget = declare("esri.dijit.HomeButton", [_WidgetBase, _TemplatedMixin, Evented], {
        
        // template HTML
        templateString: dijitTemplate,
        
        // default options
        options: {
            theme: "HomeButton",
            map: null,
            extent: null,
            fit: false,
            visible: true
        },
        
        // lifecycle: 1
        constructor: function(options, srcRefNode) {
            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            // widget node
            this.domNode = srcRefNode;
            // store localized strings
            this._i18n = i18n;
            // properties
            this.set("map", defaults.map);
            this.set("theme", defaults.theme);
            this.set("visible", defaults.visible);
            this.set("extent", defaults.extent);
            this.set("fit", defaults.fit);
            // listeners
            this.watch("theme", this._updateThemeWatch);
            this.watch("visible", this._visible);
            // classes
            this._css = {
                container: "homeContainer",
                home: "home",
                loading: "loading"
            };
        },
        // bind listener for button to action
        postCreate: function() {
            this.inherited(arguments);
            this.own(
                on(this._homeNode, a11yclick, lang.hitch(this, this.home))
            );
        },
        // start widget. called by user
        startup: function() {
            // map not defined
            if (!this.map) {
                this.destroy();
                console.log('HomeButton::map required');
            }
            // when map is loaded
            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function() {
                    this._init();
                }));
            }
        },
        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function() {
            this.inherited(arguments);
        },
        /* ---------------- */
        /* Public Events */
        /* ---------------- */
        // home
        // load
        /* ---------------- */
        /* Public Functions */
        /* ---------------- */
        home: function() {
            // deferred to return
            var def = new Deferred();
            
            // get extent property
            var defaultExtent = this.get("extent");
            
            // show loading spinner
            this._showLoading();
            
            // event object
            var homeEvt = {
                extent: defaultExtent
            };
            if(defaultExtent){
                // extent is not the same as current extent
                if(this.map.extent !== defaultExtent){
                    // set map extent
                    this.map.setExtent(defaultExtent, this.get("fit")).then(lang.hitch(this, function(){
                        // hide loading spinner
                        this._hideLoading();
                        // home event
                        this.emit("home", homeEvt);
                        def.resolve(homeEvt);
                    }), lang.hitch(this, function(error){
                        if(!error){
                            error = new Error("HomeButton::Error setting map extent");
                        }
                        homeEvt.error = error;
                        // home event
                        this.emit("home", homeEvt);
                        def.reject(error);
                    }));
                }
                else{
                    // same extent
                    this._hideLoading();
                    this.emit("home", homeEvt);
                    def.resolve(homeEvt);
                }
            }
            else{
                // hide loading spinner
                this._hideLoading();
                var error = new Error("HomeButton::home extent is undefined");
                homeEvt.error = error;
                this.emit("home", homeEvt);
                def.reject(error);
            }
            return def.promise;
        },
        // show widget
        show: function(){
            this.set("visible", true);  
        },
        // hide widget
        hide: function(){
            this.set("visible", false);
        },
        /* ---------------- */
        /* Private Functions */
        /* ---------------- */
        _init: function() {
            // show or hide widget
            this._visible();
            // if no extent set, set extent to map extent
            if(!this.get("extent")){
                this.set("extent", this.map.extent);   
            }
            // widget is now loaded
            this.set("loaded", true);
            this.emit("load", {});
        },
        // show loading spinner
        _showLoading: function(){
            domClass.add(this._homeNode, this._css.loading);
        },
        // hide loading spinner
        _hideLoading: function(){
            domClass.remove(this._homeNode, this._css.loading);
        },
        // theme changed
        _updateThemeWatch: function(attr, oldVal, newVal) {
            domClass.remove(this.domNode, oldVal);
            domClass.add(this.domNode, newVal);
        },
        // show or hide widget
        _visible: function(){
            if(this.get("visible")){
                domStyle.set(this.domNode, 'display', 'block');
            }
            else{
                domStyle.set(this.domNode, 'display', 'none');
            }
        }
    });
    if (has("extend-esri")) {
        lang.setObject("dijit.HomeButton", Widget, esriNS);
    }
    return Widget;
});