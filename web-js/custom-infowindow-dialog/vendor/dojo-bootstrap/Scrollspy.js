/* ==========================================================
 * Scrollspy.js v3.0.0
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
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-geometry',
    'dojo/NodeList-dom',
    'dojo/NodeList-traverse',
    'dojo/domReady!'
], function (support, declare, query, lang, win, on, domClass, domConstruct, domAttr, domGeom) {
    "use strict";

    var spySelector = '[data-spy=scroll]';
    var Scrollspy = declare([], {
        defaultOptions:{
            offset:10
        },
        constructor:function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element.tagName === 'BODY' ? win.global : element;
            this.element = element;
            this.scrollEvent = on(this.domNode, 'scroll', lang.hitch(this, 'process'));
            this.selector = this.options.target;
            if (!this.selector) {
                this.selector = support.hrefValue(element);
            }
            this.selector += ' .nav li > a';
            this.refresh();
            this.process();
        },
        refresh:function () {
            this.offsets = [];
            this.targets = [];
            var container_offset = domGeom.position(this.element, false).y;
            query(this.selector, win.body()).map(function (node) {
                var href = support.getData(node, 'target') || domAttr.get(node, 'href');
                var target = /^#\w/.test(href) && query(href);
                var pos;
                if (target[0]) {
                    pos = domGeom.position(target[0], false);
                }
                return (target && target.length && [ pos.y - container_offset, href ] ) || null;
            })
            .filter(function (item) {
                return item;
            })
            .sort(function (a, b) {
                return a[0] - b[0];
            })
            .forEach(function (item) {
                this.offsets.push(item[0]);
                this.targets.push(item[1]);
            }, this);
        },
        process:function () {
            var dompos = domGeom.position(this.element, false);

            // scrollTop determines how much the element is scrolled.
            //
            // In firefox, body has scrollTop set to 0 even when scrolled - hence we use dompos.y
            if (this.element.tagName === "BODY") {
                var scrollTop = Math.abs(Math.round(dompos.y));
            }
            else {
                var scrollTop = this.element.scrollTop;
            }
            scrollTop += parseInt(this.options.offset, 10)
            var scrollHeight = this.element.scrollHeight || win.body().scrollHeight;
            //TODO: innerHeight may not work across browsers
            var domHeight = (this.element.tagName === "BODY") ? this.domNode.innerHeight : dompos.h;
            var maxScroll = Math.abs(scrollHeight - domHeight);
            var offsets = this.offsets;
            var targets = this.targets;
            var activeTarget = this.activeTarget;
            var i;
            if (scrollTop >= maxScroll) {
                return activeTarget !== (i = targets[targets.length - 1]) && this.activate(i);
            }
            for (i = offsets.length; i--;) {
                if (activeTarget !== targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1])) {
                    this.activate(targets[i]);
                }
            }
        },
        activate:function (target) {
            this.activeTarget = target;
            query(this.selector).parent('.active').removeClass('active');
            var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';
            var active = query(selector).parent('li').addClass('active');
            if (active.parent('.dropdown-menu').length) {
                active = active.closest('li.dropdown').addClass('active');
            }
            on.emit(active[0], 'activate.bs.scrollspy', {bubbles:false, cancelable:false});
        }
    });

    lang.extend(query.NodeList, {
        scrollspy:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'scrollspy');
                if (!data) {
                    support.setData(node, 'scrollspy', (data = new Scrollspy(node, options)));
                }
                if (lang.isString(option)) {
                    data[option].call(data);
                }
            });
        }
    });

    query(spySelector).forEach(function (node) {
        query(node).scrollspy(support.getData(node));
    });

    return Scrollspy;
});
