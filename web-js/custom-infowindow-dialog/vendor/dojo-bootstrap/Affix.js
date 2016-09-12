/* ==========================================================
 * Affix.js v3.0.0
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
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dojo/NodeList-dom',
    'dojo/NodeList-traverse',
    'dojo/domReady!'
], function (support, declare, query, lang, win, on, domClass, domConstruct, domAttr, domStyle, domGeom) {
    "use strict";

    var spySelector = '[data-spy=affix]';
    var Affix = declare([], {
        defaultOptions:{
            offset: 0
        },
        constructor:function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element;
            on(win.global, 'scroll', lang.hitch(this, 'checkPosition'));
            on(win.global, 'click',  lang.hitch(this, (function () { setTimeout(lang.hitch(this, 'checkPosition'), 1); })));
            this.checkPosition();
        },
        checkPosition: function() {
            if (domStyle.get(this.domNode, 'display') === 'none') { return; }

            var pos = domGeom.position(this.domNode, false),
                scrollHeight = win.doc.height,
                scrollTop = win.global.scrollY,
                offset = this.options.offset,
                reset = 'affix affix-top affix-bottom',
                affix,
                offsetTop,
                offsetBottom;

            if (typeof offset !== 'object') { 
				offsetBottom = offsetTop = offset; 
			} else {
				if (typeof offset.top === 'function') { 
					offsetTop = offset.top(); 
				} else {
					offsetTop = offset.top || 0;
				}
                if (typeof offset.bottom === 'function') {
					offsetBottom = offset.bottom(); 
				} else {
					offsetBottom = offset.bottom || 0;
				}
			}

            affix = this.unpin !== null && (scrollTop + this.unpin <= pos.y) ?
                false    : offsetBottom !== null && (pos.y + pos.h >= scrollHeight - offsetBottom) ?
                'bottom' : offsetTop !== null && scrollTop <= offsetTop ?
                'top'    : false;

            if (this.affixed === affix) { return; }

            this.affixed = affix;
            this.unpin = affix === 'bottom' ? pos.y - scrollTop : null;

            query(this.domNode).removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''));
        }
    });

    lang.extend(query.NodeList, {
        affix:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'affix');
                if (!data) {
                    support.setData(node, 'affix', (data = new Affix(node, options)));
                }
                if (lang.isString(option)) {
                    data[option].call(data);
                }
            });
        }
    });

    query(spySelector).forEach(function (node) {
		var data = support.getData(node);
		data.offset = data.offset || {};
		if(data['offset-bottom']) { data.offset.bottom = data['offset-bottom']; }
		if(data['offset-top']) { data.offset.top = data['offset-top']; }
		query(node).affix(data);
    });

    return Affix;
});