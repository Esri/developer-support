/* ==========================================================
 * Carousel.js v3.0.0
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
    "dojo/_base/declare",
    "dojo/_base/sniff",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-construct",
    'dojo/mouse',
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/_base/array",
    "./Support",
    "dojo/NodeList-traverse",
    "dojo/NodeList-dom",
    "dojo/domReady!"
], function (declare, sniff, query, lang, win, on, domClass, domAttr, domConstruct, mouse, domGeom, domStyle, array, support) {
    "use strict";

    var slideSelector = '[data-slide]';
    var Carousel = declare([], {
        defaultOptions: {
            interval: 3000,
            pause: 'hover'
        },
        constructor: function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element;
            this.indicators = query('.carousel-indicators', this.domNode)
            if (this.options.slide) { this.slide(this.options.slide); }
            if (this.options.pause === 'hover') {
                on(this.domNode, mouse.enter, lang.hitch(this, 'pause'));
                on(this.domNode, mouse.leave, lang.hitch(this, 'cycle'));
            }
            if (this.options.interval) { this.cycle(); }
        },
        cycle: function (e) {
            if (!e) { this.paused = false; }
            if (this.options.interval && !this.paused) {
                this.interval = setInterval(lang.hitch(this, 'next'), this.options.interval);
            }
            return this;
        },
        to: function (pos) {
            var active = query('.item.active', this.domNode),
                children = active.parent().children(),
                activePos = children.indexOf(active[0]),
                _this = this;
            if (pos > (children.length - 1) || pos < 0) { return; }
            if (this.sliding) {
                return on.once(_this.domNode, 'slid', function () {
                    _this.to(pos);
                });
            }
            if (activePos === pos) {
                return this.pause().cycle();
            }
            return this.slide((pos > activePos ? 'next' : 'prev'), query(children[pos]));
        },
        pause: function (e) {
            if (!e) { this.paused = true; }
            if (query('.next, .prev', this.domNode).length && support.trans.end) {
                on.emit(this.domNode, support.trans.end, { bubbles:true, cancelable:true });
                this.cycle();
            }
            clearInterval(this.interval);
            this.interval = null;
            return this;
        },
        next: function () {
            if (this.sliding) { return; }
            return this.slide('next');
        },
        prev: function () {
            if (this.sliding) { return; }
            return this.slide('prev');
        },
        getActiveIndex: function () {
            this.active = query('.item.active', this.domNode);
            this.items  = this.active.parent().children('.item');
            return this.items.indexOf(this.active[0]);
        },
        slide: function (type, next) {
            var active = query('.item.active', this.domNode),
                isCycling = this.interval,
                direction = type === 'next' ? 'left' : 'right',
                fallback = type === 'next' ? 'first' : 'last',
                _this = this;
            next = next || active[type]();

            this.sliding = true;
            if (isCycling) { this.pause(); }

            if (this.indicators.length) {
                query('.active', this.indicators[0]).removeClass('active');
                on.once(this.domNode, 'slid.bs.carousel', function() {
                    var nextIndicator = _this.indicators.children()[_this.getActiveIndex()];
                    nextIndicator && domClass.add(nextIndicator, 'active');
                });
            }

            next = next.length ? next : query('.item', this.domNode)[fallback]();

            if (domClass.contains(next[0], 'active')) { return; }

            if (support.trans && domClass.contains(this.domNode, 'slide')) {
                on.emit(this.domNode, 'slide.bs.carousel', { bubbles:false, cancelable:false, relatedTarget: next[0] });
                //if (e && e.defaultPrevented) { return; }
                domClass.add(next[0], type);
                next[0].offsetWidth;

                domClass.add(active[0], direction);
                domClass.add(next[0], direction);
                on.once(this.domNode, support.trans.end, function () {
                    domClass.remove(next[0], [type, direction].join(' '));
                    domClass.add(next[0], 'active');
                    domClass.remove(active[0], ['active', direction].join(' '));
                    _this.sliding = false;
                    setTimeout(function () {
                        on.emit(_this.domNode, 'slid.bs.carousel', { bubbles:false, cancelable:false });
                    }, 0);
                });
            } else {
                on.emit(this.domNode, 'slide.bs.carousel', { bubbles:false, cancelable:false, relatedTarget: next[0] });
                domClass.remove(active[0], 'active');
                domClass.add(next[0], 'active');
                this.sliding = false;
                on.emit(_this.domNode, 'slid.bs.carousel', { bubbles:false, cancelable:false });
            }

            if (isCycling) { this.cycle(); }
            return this;
        }
    });

    lang.extend(query.NodeList, {
        carousel:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'carousel');
                var action = typeof option === 'string' ? option : options.slide;
                if (!data) { support.setData(node, 'carousel', (data = new Carousel(node, options))); }
                if (typeof option === 'number') { data.to(option); }
                else if (action) { data[action].call(data); }
            });
        }
    });
    on(win.body(), on.selector(slideSelector, 'click'), function (e) {
        var target = domAttr.get(this, 'data-target') || support.hrefValue(this);
        var options = {};
        if(!support.getData(target, 'collapse')){
            options = lang.mixin({}, lang.mixin(support.getData(target), support.getData(this)));
        }
        query(target).carousel(options);
        e.preventDefault();
    });

    return Carousel;
});