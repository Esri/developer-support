/* ==========================================================
 * Collapse.js v3.0.0
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
    './Support',
    'dojo/_base/declare',
    'dojo/query',
    'dojo/_base/lang',
    'dojo/_base/window',
    'dojo/on',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/dom-geometry',
    'dojo/dom-style',
    'dojo/NodeList-dom',
    'dojo/NodeList-traverse',
    'dojo/domReady!'
], function (support, declare, query, lang, win, on, domClass, domAttr, domGeom, domStyle) {
    "use strict";
    var collapseSelector = '[data-toggle=collapse]';
    var Collapse = declare([], {
        defaultOptions:{
            toggle:true
        },
        constructor:function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element;
            this.transitioning = null;
            if (this.options.parent) { this.parent = query(this.options.parent); }
            if (this.options.toggle) { this.toggle(); }
        },
        dimension:function () {
            return domClass.contains(this.domNode, 'width') ? 'width' : 'height';
        },
        show:function () {
            var dimension, scroll, actives, hasData;

            if (this.transitioning || domClass.con) { return; }
            if(this.parent && this.options.target) {
                query('[data-target=' + this.options.target + ']', this.parent[0]).forEach(function(el) {
                    domClass.remove(el, 'collapsed');
                });
            }

            dimension = this.dimension();
            scroll = support.toCamel(['scroll', dimension].join('-'));
            actives = this.parent && query('> .panel > .in', this.parent[0]);

            if (actives && actives.length) {
                hasData = support.getData(actives[0], 'collapse');
                if (hasData && hasData.transitioning) {
                    return;
                }
                actives.collapse('hide');
                if (!hasData) { support.setData(actives[0], 'collapse', null); }
            }

            domStyle.set(this.domNode, dimension, '0px');
            this.transition('add', 'show', 'shown');
            if (support.trans) { domStyle.set(this.domNode, dimension, this.domNode[scroll] + 'px'); }
        },
        hide:function () {
            if (this.transitioning || !domClass.contains(this.domNode, 'in')) {
                return;
            }
            if(this.parent && this.options.target) {
                query('[data-target=' + this.options.target + ']', this.parent[0]).forEach(function(el) {
                    domClass.add(el, 'collapsed');
                });
            }

            var dimension = this.dimension();
            this.reset(domStyle.get(this.domNode, dimension));
            this.transition('remove', 'hide', 'hidden');
            domStyle.set(this.domNode, dimension, '0px');
        },
        reset:function (size) {
            size = size ? parseFloat(size, 10) + 'px' : 'auto';
            var dimension = this.dimension();
            domClass.remove(this.domNode, 'collapse');
            domStyle.set(this.domNode, dimension, size);
            this._offsetWidth = this.domNode.offsetWidth;
            domClass[(size !== null ? 'add' : 'remove')](this.domNode, 'collapse');
            return this;
        },
        transition:function (method, startEvent, completeEvent) {
            var _complete = lang.hitch(this, function () {
                if (startEvent === 'show'){
                    this.reset();
                }
                this.transitioning = 0;

                if(method === 'add'){
                    domClass.add(this.domNode, 'in');
                } else if(method === 'remove') {
                    domClass.add(this.domNode, 'collapse');
                }

                domClass.remove(this.domNode, 'collapsing');
                on.emit(this.domNode, completeEvent + '.bs.collapse', {bubbles:false, cancelable:false});
            });

            on.emit(this.domNode, startEvent + '.bs.collapse', {bubbles:false, cancelable:false});

            domClass.remove(this.domNode, 'collapse');
            domClass.add(this.domNode, 'collapsing');

            if(method === 'remove'){
                domClass.remove(this.domNode, 'in');
            }

            this.transitioning = 1;

            if (support.trans){
                on.once(this.domNode, support.trans.end, _complete);
                support.emulateTransitionEnd(this.domNode, 350);
            } else {
                _complete();
            }
        },
        toggle:function () {
            this[domClass.contains(this.domNode, 'in') ? 'hide' : 'show']();
        }
    });
    lang.extend(query.NodeList, {
        collapse:function (option) {
            var options = (lang.isObject(option)) ? option : false;
            return this.forEach(function (node) {
                var data = support.getData(node, 'collapse');
                if (!data) {
                    support.setData(node, 'collapse', (data = new Collapse(node, options)));
                }
                if (lang.isString(option)) {
                    data[option].call(data);
                }
            });
        }
    });

    on(win.body(), on.selector(collapseSelector, 'click'), function (e) {
        var node = this;
        if (support.getData(node, 'toggle') !== 'collapse') {
            node = query(this).closest('[data-toggle=collapse]')[0];
        }
        if (node) {
            var target = domAttr.get(node, 'data-target') || e.preventDefault() || support.hrefValue(node);
            if (target) {
                var option = support.getData(target, 'collapse') ? 'toggle' : support.getData(node);
                query(target).collapse(option);
            }
        }
    });
    return Collapse;
});