/* ==========================================================
 * Support.js v3.0.0
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
    "dojo/query",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/_base/array",
    "dojo/json",
    "dojo/has",
    "dojo/on",
    "dojo/NodeList-data"
],
function (query, lang, attr, domStyle, array, json, has, on) {
    "use strict";

    var _transition = (function () {
        var transitionEnd = (function () {
            var el = document.createElement('bootstrap');
            var transEndEventNames = {
                'WebkitTransition':'webkitTransitionEnd',
                'MozTransition':'transitionend',
                'OTransition':'oTransitionEnd',
                'transition':'transitionend'
            };
            for (var name in transEndEventNames) {
                if (el.style[name] !== undefined) {
                    return transEndEventNames[name];
                }
            }
        })();
        return transitionEnd && {
            end:transitionEnd
        };
    })();

    var _loadData = function(node){
        //load data attributes
        var elm = query(node)[0];
        if(elm){
            var _this = this;
            var attrs = elm.attributes;
            array.forEach(attrs, function(attr){
                if(attr.name.indexOf("data-") >= 0){
                    _this.setData(node, attr.name.substr(5), _attrValue(attr.value));
                }
            });
        }
    };

    var _attrValue = function(val){
        if (!val) { return; }
        if (val.indexOf('{') === 0 && val.indexOf('}') === val.length-1) {
            return json.parse(val);
        } else if (val.indexOf('[') === 0 && val.indexOf(']') === val.length-1) {
            return json.parse(val);
        } else {
            return val;
        }
    };

    var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
    };

    var setOffset = function( elem, options, i ) {
        var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
            position = domStyle.get( elem, "position" ),
            curElem = query( elem ),
            props = {};

        // Set position first, in-case top/left are set even on static elem
        if ( position === "static" ) {
            elem.style.position = "relative";
        }

        curOffset = curElem.offset();
        curCSSTop = domStyle.get( elem, "top" );
        curCSSLeft = domStyle.get( elem, "left" );
        calculatePosition = ( position === "absolute" || position === "fixed" ) &&
            ( curCSSTop + curCSSLeft ).toString().indexOf("auto") > -1;

        // Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
        if ( calculatePosition ) {
            curPosition = curElem.position();
            curTop = curPosition.y;
            curLeft = curPosition.x;

        } else {
            curTop = parseFloat( curCSSTop ) || 0;
            curLeft = parseFloat( curCSSLeft ) || 0;
        }

        if ( typeof options === 'function' ) {
            options = options.call( elem, i, curOffset );
        }

        if ( options.y !== null ) {
            props.y = ( options.y - curOffset.y ) + curTop;
        }
        if ( options.x !== null ) {
            props.x = ( options.x - curOffset.x ) + curLeft;
        }

        if ( "using" in options ) {
            options.using.call( elem, props );
        } else {
            domStyle.set(elem, { top: props.y+'px', left: props.x+'px' });
        }
    };

    function getWindow( elem ) {
        return (elem !== null && elem === elem.window) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    function isEventSupported( element, eventName ) {
        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
            // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
            if ( !element.setAttribute ) {
                element = document.createElement('div');
            }
            if ( element.setAttribute && element.removeAttribute ) {
                element.setAttribute(eventName, '');
                isSupported = typeof element[eventName] === 'function';

                // If property was created, "remove it" (by setting value to `undefined`)
                if ( typeof element[eventName] !== 'undefined') {
                    element[eventName] = undefined;
                }
                element.removeAttribute(eventName);
            }
        }

        element = null;
        return isSupported;
    }

    //http://blog.alexmaccaw.com/css-transitions
    function emulateTransitionEnd(element, duration){
        var called = false;
        on.once(element, _transition.end, function(){called = true;});
        var callback = function(){
            if(!called) {
                on.emit(element, _transition.end, {
                    bubbles: true,
                    cancelable: true
                });
            }
        };
        setTimeout(callback, duration);
    }

    lang.extend(query.NodeList, {
        show:function () {
            return this.forEach(function (node) {
                node.style.display = 'block';
            });
        },
        hide:function () {
            return this.forEach(function (node) {
                node.style.display = 'none';
            });
        },
        offset: function(options){
            if(arguments.length){
                return options === undefined ?
                    this :
                    this.forEach(function(elm, i){
                        setOffset(elm, options, i);
                    });
            }
            var docElem, win,
                elem = this[ 0 ],
                box = { y: 0, x: 0 },
                doc = elem && elem.ownerDocument;

            if ( !doc ) {
                return;
            }

            docElem = doc.documentElement;

            // Make sure it's not a disconnected DOM node
            if ( query( elem, docElem).length === 0 ) {
                return box;
            }

            // If we don't have gBCR, just use 0,0 rather than error
            // BlackBerry 5, iOS 3 (original iPhone)
            if ( typeof elem.getBoundingClientRect === 'function' ) {
                var rect = elem.getBoundingClientRect();
                box = { y: rect.top, x: rect.left };
            }
            win = getWindow( doc );
            return {
                y: box.y + win.pageYOffset - docElem.clientTop,
                x: box.x + win.pageXOffset - docElem.clientLeft
            };
        }
    });

    return {
        trans: _transition,
        getData: function(node, key, def){
            key = key || undefined;
            def = def || undefined;
            if(key !== undefined && lang.isString(key)){
                var data = query(node).data(key);
                if (data && data[0] === undefined) {
                    if(query(node)[0]){ data = attr.get(query(node)[0], 'data-'+key); }
                    if (data !== undefined){ data = _attrValue(data); }
                    if (data === undefined && def !== undefined){
                        data = this.setData(node, key, def);
                    }
                }
                return (lang.isArray(data) && data.length > 0) ? data[0] : data;
            } else {
                _loadData.call(this, node);
                return query(node).data()[0];
            }
        },
        setData: function(node, key, value){
            var data = query(node).data(key, value);
            return value;
        },
        removeData: function(node, key){
            return query(node).removeData(key);
        },
        toCamel: function(str){
            return str.replace(/(\-[a-z])/g, function($1){ return $1.toUpperCase().replace('-',''); });
        },
        toDash: function(str){
            return str.replace(/([A-Z])/g, function($1){ return "-"+$1.toLowerCase(); });
        },
        toUnderscore: function(str){
            return str.replace(/([A-Z])/g, function($1){ return "_"+$1.toLowerCase(); });
        },
        hrefValue: function(element){
            var href = attr.get(element, 'href');
            if(href !== null){
                href = href.replace(/.*(?=#[^\s]+$)/, ''); //strip for ie7
            }
            return href || '';
        },
        eventSupported: isEventSupported,
        emulateTransitionEnd: emulateTransitionEnd,
        setOffset: setOffset
    };
});