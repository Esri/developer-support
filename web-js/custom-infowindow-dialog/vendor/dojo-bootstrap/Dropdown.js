/* ==========================================================
 * Dropdown.js v3.0.0
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
    "dojo/_base/event",
    "dojo/_base/declare",
    "dojo/query",
    "dojo/_base/lang",
    'dojo/_base/window',
    'dojo/on',
    'dojo/dom-class',
    "dojo/dom-attr",
    'dojo/dom-construct',
    'dojo/NodeList-traverse',
    'dojo/NodeList-manipulate',
    "dojo/domReady!"
], function (support, event, declare, query, lang, win, on, domClass, domAttr, domConstruct) {
    "use strict";

    var toggleSelector = '[data-toggle=dropdown]';
    var backDropSelector = '.dropdown-backdrop';
    var Dropdown = declare([], {
        defaultOptions:{},
        constructor:function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            var el = query(element).closest(toggleSelector);
            if (!el[0]) {
                el = query(element);
            }
            if (el) {
                this.domNode = el[0];
                domAttr.set(el[0], "data-toggle", "dropdown");
            }
        },
        select: function(e){
            var parentNode = _getParent(this)[0];
            if (parentNode) {
                var target = query(toggleSelector, parentNode);
                on.emit(target[0], 'select', { bubbles:true, cancelable:true, selectedItem: query(e.target).closest('li') });
            }
        },
        toggle: function(e){
            if (domClass.contains(this, "disabled") || domAttr.get(this, "disabled")) {
                return false;
            }
            var targetNode = _getParent(this)[0];
            if (targetNode) {
                var isActive = domClass.contains(targetNode, 'open'),
                    inNav = query(targetNode).closest('.navbar-nav').length > 0;
                clearMenus();
                if (!isActive) {
                    if('ontouchstart' in document.documentElement && !inNav){
                        var backdrop = domConstruct.toDom('<div class="dropdown-backdrop" />');
                        domConstruct.place(backdrop, this, "after");
                        on(query(backDropSelector), 'click', clearMenus);
                    }
                    on.emit(targetNode, 'show.bs.dropdown', { bubbles:true, cancelable:true, relatedTarget: this });
                    domClass.toggle(targetNode, 'open');
                    on.emit(targetNode, 'shown.bs.dropdown', { bubbles:true, cancelable:true, relatedTarget: this });
                }
                this.focus();
            }

            if(e){
                event.stop(e);
            }
            return false;
        },
        keydown: function(e) {
            if (!/(38|40|27)/.test(e.keyCode)) { return; }

            event.stop(e);

            if (domClass.contains(this, "disabled") || domAttr.get(this, "disabled")) {
                return false;
            }
            var targetNode = _getParent(this)[0];
            if (targetNode) {
                var isActive = domClass.contains(targetNode, 'open');
                if (!isActive || (isActive && e.keyCode === 27)) {
                    if(e.keyCode === 27){ targetNode.children(toggleSelector)[0].focus(); }
                    return on.emit(targetNode, 'click', { bubbles:true, cancelable:true });
                }

                var desc = " li:not(.divider) a",
                    items = query('[role=menu] '+desc+', [role=listbox] '+desc, targetNode);
                if (!items.length) { return; }
                var index = items.indexOf(document.activeElement);

                if (e.keyCode === 38 && index > 0)                  { index--; }
                if (e.keyCode === 40 && index < items.length - 1)   { index++; }
                if (index < 0)                                      { index = 0; }

                if (items[index]) { items[index].focus(); }
            }
        }
    });

    function clearMenus() {
        query(backDropSelector).remove();
        query(toggleSelector).forEach(function(menu){
            var targetNode = _getParent(menu)[0];
            if(targetNode){
                on.emit(targetNode, 'hide.bs.dropdown', { bubbles:true, cancelable:true, relatedTarget: menu });
                domClass.remove(targetNode, 'open');
                on.emit(targetNode, 'hidden.bs.dropdown', { bubbles:true, cancelable:true, relatedTarget: menu });
            }
        });
    }

    function _getParent(node){
        var selector = domAttr.get(node, 'data-target');
        if (!selector) {
            selector = support.hrefValue(node);
        }
        var parentNode = query(node).parent();
        if (selector && selector !== '#' && selector !== '') {
            parentNode = query(selector).parent();
        }
        return parentNode;
    }

    lang.extend(query.NodeList, {
        dropdown:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'dropdown');
                if (!data) {
                    support.setData(node, 'dropdown', (data = new Dropdown(node, options)));
                }
            });
        }
    });
    on(win.doc, on.selector("body", 'click'), clearMenus);
    on(win.body(), on.selector(toggleSelector, 'click'), Dropdown.prototype.toggle);
    on(win.body(), on.selector('.dropdown form', 'click'), function (e) { e.stopPropagation(); });
    on(win.body(), on.selector('.dropdown-menu', 'click'), Dropdown.prototype.select);
    on(win.body(), on.selector(toggleSelector+', [role=menu], [role=listbox]', 'keydown'), Dropdown.prototype.keydown);

    return Dropdown;
});
