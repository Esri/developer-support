/* ==========================================================
 * Alert.js v3.0.0
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
    "dojo/_base/declare",
    "dojo/query",
    "dojo/_base/lang",
    'dojo/_base/window',
    'dojo/on',
    'dojo/dom-class',
    'dojo/dom-construct',
    "dojo/dom-attr",
    "dojo/NodeList-dom",
    'dojo/NodeList-traverse',
    "dojo/domReady!"
], function (support, declare, query, lang, win, on, domClass, domConstruct, domAttr) {
    "use strict";

    var dismissSelector = '[data-dismiss="alert"]';
    var Alert = declare([], {
        defaultOptions:{},
        constructor:function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element;
            on(this.domNode, on.selector(dismissSelector, 'click'), lang.hitch(this, close));
        }
    });

    function close(e) {
        var _this = this;
        var selector = domAttr.get(_this, 'data-target');
        if (!selector) {
            selector = support.hrefValue(_this);
        }
        var targetNode;
        if (selector && selector !== '#' && selector !== '') {
            targetNode = query(selector);
        } else {
            targetNode = domClass.contains(query(_this)[0], 'alert') ? query(_this) : query(_this).parent();
        }

        if (e) { e.stopPropagation(); }

        on.emit(targetNode[0], 'close.bs.modal', {bubbles:true, cancelable:true});
        domClass.remove(targetNode[0], 'in');

        function _remove() {
            on.emit(targetNode[0], 'closed.bs.modal', {bubbles:true, cancelable:true});
            domConstruct.destroy(targetNode[0]);
        }
        var transition = support.trans && domClass.contains(targetNode[0], 'fade');
        if (transition) { on(targetNode[0], support.trans.end, _remove); } else { _remove(); }
        if (e) { e.preventDefault(); }
        return false;
    }

    lang.extend(query.NodeList, {
        alert:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'alert');
                if (!data) {
                    support.setData(node, 'alert', (data = new Alert(node, options)));
                }
                if (lang.isString(option) && option === "close") {
                    close.call(node);
                }
            });
        }
    });
    on(win.body(), on.selector(dismissSelector, 'click'), close);

    return Alert;
});