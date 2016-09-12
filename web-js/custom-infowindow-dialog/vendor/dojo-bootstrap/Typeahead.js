/* ==========================================================
 * Typeahead.js v3.0.0
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
    "dojo/query",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/_base/array",
    "./Support",
    "dojo/NodeList-dom",
    "dojo/NodeList-traverse",
    "dojo/domReady!"
], function (declare, query, lang, win, on, domClass, domAttr, domConstruct, domGeom, domStyle, array, support) {
    "use strict";

    var provideSelector = '[data-provide="typeahead"]';
    var Typeahead = declare([], {
        defaultOptions: {
            source: [],
            items: 8,
            menu: '<ul class="typeahead dropdown-menu"></ul>',
            item: '<li><a href="#"></a></li>',
            minLength: 1,
            autocomplete: false
        },
        constructor: function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element;
            if(this.options.autocomplete === false){
                domAttr.set(element, "autocomplete", "off");
            }
            this.matcher = this.options.matcher || this.matcher;
            this.sorter = this.options.sorter || this.sorter;
            this.highlighter = this.options.highlighter || this.highlighter;
            this.updater = this.options.updater || this.updater;
            this.menuNode = domConstruct.toDom(this.options.menu);
            this.source = this.options.source;
            this.shown = false;
            this.listen();
        },
        select: function () {
            var li = query('.active', this.menuNode)[0];
            this.domNode.value = this.updater(domAttr.get(li, 'data-value'));
            on.emit(this.domNode, 'change', { bubbles:true, cancelable:true });
            return this.hide();
        },
        updater: function (item) {
            return item;
        },
        show: function () {
            var pos = domGeom.position(this.domNode, true);
            domConstruct.place(this.menuNode, document.body);
            domStyle.set(this.menuNode, {
                top: (pos.y + this.domNode.offsetHeight)+'px',
                left: pos.x+'px',
                display: 'block'
            });
            this.shown = true;
            return this;
        },
        hide: function () {
            domStyle.set(this.menuNode, 'display', 'none');
            this.shown = false;
            return this;
        },
        lookup: function () {
            var items;
            this.query = this.domNode.value;
            if (!this.query || this.query.length < this.options.minLength) {
                return this.shown ? this.hide() : this;
            }
            items = (typeof this.source === 'function') ? this.source(this.query, lang.hitch(this, 'process')) : this.source;
            return items ? this.process(items) : this;
        },
        process: function (items) {
            items = array.filter(items, function (item) {
                return this.matcher(item);
            }, this);
            items = this.sorter(items);
            if (!items.length) {
                return this.shown ? this.hide() : this;
            }
            this.render(items.slice(0, this.options.items)).show();
        },
        matcher: function (item) {
            return (item.toString().toLowerCase().indexOf(this.query.toLowerCase()))+1;
        },
        sorter: function (items) {
            var beginswith = [],
                caseSensitive = [],
                caseInsensitive = [],
                item;

            while (item = items.shift()) {
                if (!item.toString().toLowerCase().indexOf(this.query.toString().toLowerCase())) { beginswith.push(item); }
                else if (item.toString().indexOf(this.query) >= 0) { caseSensitive.push(item); }
                else { caseInsensitive.push(item); }
            }
            return beginswith.concat(caseSensitive, caseInsensitive);
        },
        highlighter: function (item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return item.toString().replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>';
            });
        },
        render: function (items) {
            items = array.map(items, function (item, i) {
                var li = domConstruct.toDom(this.options.item);
                domAttr.set(li, 'data-value', item);
                query('a', li)[0].innerHTML = this.highlighter(item);
                if (i === 0) { domClass.add(li, 'active'); }
                return li.outerHTML;
            }, this);
            this.menuNode.innerHTML = items.join('');
            return this;
        },
        next: function () {
            var active = query('.active', this.menuNode);
            active.removeClass('active');
            var next = active.next();

            if (!next.length) {
                next = query('li', this.menuNode).first();
            }
            next.addClass('active');
        },
        prev: function () {
            var active = query('.active', this.menuNode);
            active.removeClass('active');
            var prev = active.prev();

            if (!prev.length) {
                prev = query('li', this.menuNode).last();
            }
            prev.addClass('active');
        },
        listen: function () {
            on(this.domNode, 'blur', lang.hitch(this, 'blur'));
            on(this.domNode, 'keypress', lang.hitch(this, this.keypress));
            on(this.domNode, 'keyup', lang.hitch(this, this.keyup));
            if(support.eventSupported(this.domNode, "keydown")) {
                on(this.domNode, 'keydown', lang.hitch(this, 'keydown'));
            }
            on(this.menuNode, 'click', lang.hitch(this, 'click'));
            on(this.menuNode, on.selector('li', 'mouseover'), lang.hitch(this, 'mouseenter'));
        },
        move: function (e) {
            if (!this.shown) { return; }
            var code = e.charCode || e.keyCode;
            switch(code) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break;

                case 38: // up arrow
                    e.preventDefault();
                    this.prev();
                    break;

                case 40: // down arrow
                    e.preventDefault();
                    this.next();
                    break;
            }

            e.stopPropagation();
        },
        keyup: function (e) {
            var code = e.charCode || e.keyCode;
            switch(code) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt

                break;

                case 9: // tab
                case 13: // enter
                    if (!this.shown) { return; }
                    this.select();
                break;

                case 27: // escape
                    if (!this.shown) { return; }
                    this.hide();
                break;

                default:
                    this.lookup();
            }
            e.stopPropagation();
            e.preventDefault();
        },
        keydown: function (e) {
            var code = e.charCode || e.keyCode;
            this.suppressKeyPressRepeat = array.indexOf([40,38,9,13,27], code) >= 0;
            this.move(e);
        },
        keypress: function (e) {
            if (this.suppressKeyPressRepeat) { return; }
            this.move(e);
        },
        blur: function () {
            var _this = this;
            setTimeout(function () { _this.hide(); }, 150);
        },
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
        },
        mouseenter: function (e) {
            var li = query(e.target).closest('li');
            query('.active', this.menuNode).removeClass('active');
            li.addClass('active');
        }
    });

    lang.extend(query.NodeList, {
        typeahead:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'typeahead');
                if (!data) { support.setData(node, 'typeahead', (data = new Typeahead(node, options))); }
                if (lang.isString(option)) { data[option].call(data); }
            });
        }
    });
    on(document, on.selector(provideSelector, 'focusin'), function (e) {
        var data = support.getData(this, 'typeahead');
        if(data){ return; }
        e.preventDefault();
        query(this).typeahead(support.getData(this));
    });

    return Typeahead;
});