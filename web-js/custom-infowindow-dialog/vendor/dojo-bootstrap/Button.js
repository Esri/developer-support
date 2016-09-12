/* ==========================================================
 * Button.js v3.0.0
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
    'dojo/_base/window',
    'dojo/on',
    'dojo/dom-class',
    "dojo/dom-attr",
    "dojo/NodeList-dom",
    'dojo/NodeList-traverse',
    "dojo/domReady!"
], function (support, declare, query, lang, win, on, domClass, domAttr) {
    "use strict";

    var toggleSelector = '[data-toggle^=button]';
    var toggleRadioSelector = '[data-toggle="buttons-radio"]';
    var Button = declare([], {
        defaultOptions:{
            "loading-text":'loading...'
        },
        constructor:function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element;
        },
        setState:function (state) {
            var _this = this;
            var d = 'disabled';
            support.getData(this.domNode, 'reset-text', lang.trim((this.domNode.tag === "INPUT") ? this.domNode.val : this.domNode.innerHTML));
            state = state + '-text';
            var data = support.getData(this.domNode, state);
            this.domNode[(this.domNode.tag === "INPUT") ? "val" : "innerHTML"] = data || this.options[state];

            setTimeout(function () {
                if (state === 'loading-text') {
                    domClass.add(_this.domNode, d);
                    domAttr.set(_this.domNode, d, d);
                } else {
                    domClass.remove(_this.domNode, d);
                    domAttr.remove(_this.domNode, d);
                }
            }, 0);
        },
        toggle:function () {
            var $parent = query(this.domNode).parents(toggleRadioSelector);
            if ($parent.length) {
                query('.active', $parent[0]).removeClass('active');
            }
            domClass.toggle(this.domNode, 'active');
            this.domNode.blur();
        }
    });

    lang.extend(query.NodeList, {
        button:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'button');
                if (!data) {
                    support.setData(node, 'button', (data = new Button(node, options)));
                }
                if (lang.isString(option) && option === 'toggle') {
                    data.toggle();
                }
                else if (option) {
                    data.setState(option);
                }
            });
        }
    });

    on(win.body(), on.selector(toggleSelector, '.btn:click'), function (e) {
        var btn = e.target;
        if (!domClass.contains(btn, 'btn')){
            btn = query(btn).closest('.btn');
        }
        query(btn).button('toggle');
    });

    return Button;
});