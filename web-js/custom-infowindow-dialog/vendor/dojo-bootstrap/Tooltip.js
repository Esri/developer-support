/* ==========================================================
 * Tooltip.js v3.0.0
 * ==========================================================
 * Copyright 2012 xsokev
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

define([
    "./Support",
    "dojo/_base/declare",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/_base/window',
    'dojo/on',
    'dojo/mouse',
    'dojo/dom-class',
    "dojo/dom-attr",
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dojo/dom-construct',
    'dojo/html',
    "dojo/NodeList-dom",
    'dojo/NodeList-manipulate',
    'dojo/NodeList-traverse',
    "dojo/domReady!"
], function (support, declare, query, lang, array, win, on, mouse, domClass, domAttr, domStyle, domGeom, domConstruct, html) {
    "use strict";

    var toggleSelector = '[data-toggle=tooltip]';
    var Tooltip = declare("Tooltip", null, {
        defaultOptions:{
            animation:true,
            placement:'top',
            selector:false,
            template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger:'hover focus',
            title:'',
            delay:0,
            html: false,
            container: false
        },
        constructor:function (element, options) {
            this.init('tooltip', element, options);
        },
        init:function (type, element, options) {
            var _this = this, eventIn, eventOut,
                _modalHide = function(){
                    _this.hide(false);
                };

            this.domNode = element;
            this.type = type;
            this.options = this.getOptions(options);
            this.enabled = true;

            var triggers = this.options.trigger.split(' ');
            for(var i=triggers.length; i--;){
                var trigger = triggers[i];
                if (trigger === 'click') {
                    query(this.domNode).parents('.modal').on('hide', _modalHide);
                    if (this.options.selector) {
                        this.eventActivate = on(this.domNode, on.selector(this.options.selector, 'click'), lang.hitch(this, 'toggle'));
                    } else {
                        this.eventActivate = on(this.domNode, 'click', lang.hitch(this, 'toggle'));
                    }
                } else if (trigger !== 'manual') {
                    eventIn = trigger === 'hover' ? mouse.enter : 'focusin';
                    eventOut = trigger === 'hover' ? mouse.leave : 'focusout';
                    if (this.options.selector) {
                        eventIn = on.selector(this.options.selector, eventIn);
                        eventOut = on.selector(this.options.selector, eventOut);
                    }
                    this.eventActivate = on(this.domNode, eventIn, lang.hitch(_this, 'enter'));
                    this.eventDeactivate = on(this.domNode, eventOut, lang.hitch(_this, 'leave'));
                }
            }

            if (this.options.selector) {
                (this._options = lang.mixin({}, lang.mixin(lang.clone(this.options), { trigger:'manual', selector:'' })));
            } else {
                this.fixTitle();
            }
        },
        getOptions:function (options) {
            options = lang.mixin({},
                lang.mixin(lang.clone(this.defaultOptions),
                    lang.mixin(options, support.getData(this.domNode))));
            if (options.delay && typeof options.delay === 'number') {
                options.delay = {
                    show:options.delay,
                    hide:options.delay
                };
            }
            return options;
        },
        getDelegateOptions: function(){
            var options = {},
                defaults = this.defaultOptions;
            if(this._options){
                array.forEach(this._options, function(key, value){
                    if(defaults[key] !== value){
                        options[key] = value;
                    }
                });
            }
            return options;
        },
        enter:function (e) {
            var self = support.getData(e.target, 'bs.' + this.type);
            if (!self) {
                query(e.target)[this.type](this.getDelegateOptions());
                self = support.getData(e.target, 'bs.' + this.type);
            }
            self && self.timeout && clearTimeout(self.timeout);
            if (self) {
                if (!self.options.delay || !self.options.delay.show) {
                    return self.show();
                }
                self.hoverState = 'in';
                self.timeout = setTimeout(function () {
                    if (self.hoverState === 'in') {
                        self.show();
                    }
                }, self.options.delay.show);
            }
            return self;
        },
        leave:function (e) {
            var self = support.getData(e.target, 'bs.' + this.type);
            if (!self) {
                query(e.target)[this.type](this.getDelegateOptions());
                self = support.getData(e.target, 'bs.' + this.type);
            }
            self && self.timeout && clearTimeout(this.timeout);
            if (self) {
                if (!self.options.delay || !self.options.delay.hide) {
                    return self.hide();
                }
                self.hoverState = 'out';
                self.timeout = setTimeout(function () {
                    if (self.hoverState === 'out') {
                        self.hide();
                    }
                }, self.options.delay.hide);
            }
            return this;
        },
        show:function (animate) {
            var _this = this,
                tip, inside, pos, actualWidth, actualHeight, placement, tp, tipPos, calculatedOffset;
            animate = animate || true;
            if (this.hasContent() && this.enabled) {
                on.emit(this.domNode, 'show.bs.'+this.type, { bubbles:false, cancelable:false });
                tip = this.tip();
                this.setContent();
                if (this.options.animation === true) {
                    domClass.add(tip, 'fade');
                }
                placement = typeof this.options.placement === 'function' ?
                    this.options.placement.call(this, tip, this.domNode) :
                    this.options.placement;

                var autoToken = /\s?auto?\s?/i,
                    autoPlace = autoToken.test(placement);
                if (autoPlace) {
                    placement = placement.replace(autoToken, '') || 'top';
                }

                query(tip).remove().addClass(placement);
                domStyle.set(tip, {top:0, left:0, display:'block'});
//                domClass.add(tip, placement);
                support.setData(tip, 'bs.' + this.type, this);
                this.options.container ? domConstruct.place(tip, this.options.container) :
                    domConstruct.place(tip, this.domNode, "after");

                pos = this.getPosition();
                actualWidth = tip.offsetWidth;
                actualHeight = tip.offsetHeight;

                if(autoPlace){
                    var parent = this.domNode.parentNode,
                        parentPos = domGeom.position(parent, true),
                        docScroll = document.documentElement.scrollTop || document.body.scrollTop,
                        origPlacement = placement,
                        parentWidth = this.options.container === 'body' ? window.innerWidth : parentPos.w,
                        parentHeight = this.options.container === 'body' ? window.innerHeight : parentPos.h,
                        parentLeft = this.options.container === 'body' ? 0 : parentPos.x;

                    placement = placement === 'bottom' && pos.y   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                                placement === 'top'    && pos.y   - docScroll   - actualHeight < 0                         ? 'bottom' :
                                placement === 'right'  && (pos.x + pos.w) + actualWidth > parentWidth                      ? 'left'   :
                                placement === 'left'   && pos.x  - actualWidth < parentLeft                                ? 'right'  :
                        placement;
                    domClass.remove(tip, origPlacement);
                    domClass.add(tip, placement);
                }

                calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
                this.applyPlacement(calculatedOffset, placement);
                this.hoverState = null;

                var complete = function() {
                    on.emit(_this.domNode, 'shown.bs.'+_this.type, { bubbles:false, cancelable:false });
                };

                if (support.trans && domClass.contains(tip, 'fade') && animate) {
                    on.once(tip, support.trans.end, function () {
                        complete();
                    });
                } else {
                    complete();
                }
            }
        },
        hide:function (animate) {
            var _this = this,
                tip = this.tip();
            animate = animate || true;

            on.emit(this.domNode, 'hide.bs.'+this.type, { bubbles:false, cancelable:false });
            domClass.remove(tip, 'in');

            function _removeWithAnimation() {
                var timeout = setTimeout(function () {
                    _this.hideEvent.remove();
                }, 500);

                _this.hideEvent = on.once(tip, support.trans.end, function () {
                    clearTimeout(timeout);
                    _destroyTip();
                });
            }
            function _destroyTip() {
                domConstruct.destroy(tip);
                _this.tipNode = null;
                on.emit(_this.domNode, 'hidden.bs.'+_this.type, { bubbles:false, cancelable:false });
            }

            if (support.trans && domClass.contains(tip, 'fade') && animate) {
                _removeWithAnimation();
            } else {
                _destroyTip();
            }
            return this;
        },
        getCalculatedOffset: function (placement, pos, actualWidth, actualHeight) {
            return placement === 'bottom' ? { y: pos.y + pos.h, x: pos.x + pos.w / 2 - actualWidth / 2  } :
                   placement === 'top'    ? { y: pos.y - actualHeight, x: pos.x + pos.w / 2 - actualWidth / 2  } :
                   placement === 'left'   ? { y: pos.y + pos.h / 2 - actualHeight / 2, x: pos.x - actualWidth } :
                { y: pos.y + pos.h / 2 - actualHeight / 2, x: pos.x + pos.w };
        },
        applyPlacement: function(offset, placement){
            var replace, actualWidth, actualHeight,
                tip = this.tip(),
                width  = tip.offsetWidth,
                height = tip.offsetHeight,
                marginTop = parseInt(domStyle.get(tip, 'margin-top'), 10),
                marginLeft = parseInt(domStyle.get(tip, 'margin-left'), 10);

            // we must check for NaN for ie 8/9
            if (isNaN(marginTop)){ marginTop  = 0; }
            if (isNaN(marginLeft)){ marginLeft = 0; }

            offset.y  = offset.y  + marginTop;
            offset.x = offset.x + marginLeft;

            support.setOffset(tip, lang.mixin({
                using: function (props) {
                    domStyle.set(tip, {
                        top: Math.round(props.y)+'px',
                        left: Math.round(props.x)+'px'
                    });
                }
            }, offset), 0);

            domClass.add(tip, 'in');

            // check to see if placing tip in new offset caused the tip to resize itself
            actualWidth  = tip.offsetWidth;
            actualHeight = tip.offsetHeight;

            if (placement === 'top' && actualHeight !== height) {
                replace = true;
                offset.y = offset.y + height - actualHeight;
            }

            if (/bottom|top/.test(placement)) {
                var delta = 0;
                if (offset.x < 0) {
                    delta       = offset.x * -2;
                    offset.x = 0;
                    query(tip).offset(offset);
                    actualWidth  = tip.offsetWidth;
                }
                this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
            } else {
                this.replaceArrow(actualHeight - height, actualHeight, 'top');
            }
            if (replace) {
                query(tip).offset(offset);
            }
        },
        replaceArrow: function (delta, dimension, position) {
            domStyle.set(this.arrow(), position, delta ? (50 * (1 - delta / dimension) + '%') : '');
        },
        setContent:function () {
            var tip = this.tip();
            var title = this.getTitle();
            query('.tooltip-inner', tip)[this.options.html ? 'html' : 'text'](title);
            domClass.remove(tip, 'fade in top bottom left right');
        },
        hasContent:function () {
            return this.getTitle();
        },
        fixTitle:function () {
            if (domAttr.get(this.domNode, 'title') || typeof(domAttr.get(this.domNode, 'data-original-title')) !== 'string') {
                domAttr.set(this.domNode, 'data-original-title', domAttr.get(this.domNode, 'title') || '');
                domAttr.remove(this.domNode, 'title');
            }
        },
        getTitle:function () {
            return domAttr.get(this.domNode, 'data-original-title') || (typeof this.options.title === 'function' ? this.options.title.call(this.domNode) : this.options.title);
        },
        getPosition:function () {
            var el = this.domNode, pos = {};
            if(typeof el.getBoundingClientRect === 'function'){
                var rect = el.getBoundingClientRect();
                pos.w = rect.width;
                pos.h = rect.height;
                pos.y = rect.top;
                pos.x = rect.left;
                pos.b = rect.bottom;
                pos.r = rect.right;
            } else {
                pos.w = el.offsetWidth;
                pos.h = el.offsetHeight;
            }
            return lang.mixin({}, pos, query(el).offset());
        },
        tip:function () {
            this.tipNode = this.tipNode ? this.tipNode : domConstruct.toDom(this.options.template);
            return this.tipNode;
        },
        arrow:function () {
            this.arrowNode = this.arrowNode ? this.arrowNode : query('.tooltip-arrow', this.tip())[0];
            return this.arrowNode;
        },
        validate:function () {
            if (!this.domNode.parentNode) {
                this.hide(false);
                this.domNode = null;
                this.options = null;
            }
        },
        enable:function () {
            this.enabled = true;
        },
        disable:function () {
            this.enabled = false;
        },
        toggleEnabled:function () {
            this.enabled = !this.enabled;
        },
        toggle:function () {
            this[domClass.contains(this.tip(), 'in') ? 'hide' : 'show']();
        },
        destroy: function() {
            this.hide();
            if (this.eventActivate) { this.eventActivate.remove(); }
            if (this.eventDeactivate) { this.eventDeactivate.remove(); }
            support.removeData(this.domNode, 'tooltip');
        }
    });

    lang.extend(query.NodeList, {
        tooltip:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'bs.tooltip');
                if (!data) {
                    support.setData(node, 'bs.tooltip', (data = new Tooltip(node, options)));
                }
                if (lang.isString(option)) {
                    data[option].call(data);
                }
            });
        }
    });

    query(toggleSelector).tooltip();

    return Tooltip;
});