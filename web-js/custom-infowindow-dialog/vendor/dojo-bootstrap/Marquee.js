/* ==========================================================
 * Marquee.js v3.0.0
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
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/fx',
    'dojo/query',
    'dojo/on',
    'dojo/Deferred',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dojo/NodeList-dom',
    'dojo/NodeList-traverse',
    'dojo/NodeList-manipulate',
    'dojo/domReady!'
], function (support, declare, lang, array, fx, query, on, Deferred, domClass, domConstruct, domAttr, domStyle, domGeom) {
    "use strict";

    var marqueeSelector = '[data-spy=marquee]';

    function _getSeq(_this, backward) {
        if (backward) {
            return (_this.current - 1 < 0) ? _this.messages.length - 1 : _this.current - 1;
        } else {
            return (_this.current + 1 > _this.messages.length - 1) ? 0 : _this.current + 1;
        }
    }

    function _show(msg) {
        var anim = _animation(msg);
        fx.animateProperty({
            node:msg.domNode,
            properties:anim.trans_in,
            duration:0
        }).play();
    }

    function _hide(msg) {
        var anim = _animation(msg);
        fx.animateProperty({
            node:msg.domNode,
            properties:anim.trans_out,
            duration:0
        }).play();
    }

    function _animation(msg) {
        return {
            trans_in:mqan[msg.options.anim].trans_in(msg),
            trans_out:mqan[msg.options.anim].trans_out(msg)
        };
    }

    var MarqueeMessage = declare([], {
        defaultOptions:{
            link:"",
            className:"",
            life:2,
            anim:"fade",
            duration:1
        },
        constructor:function (options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.options.life = isNaN(this.options.life) ? this.defaultOptions.life : Number(this.options.life);
            this.options.duration = isNaN(this.options.duration) ? this.defaultOptions.duration : Number(this.options.duration);
            this.domNode = domConstruct.toDom("<div>" + (options.message || '') + "</div>");
            if (this.options.link !== "") {
                var link = domConstruct.toDom('<a href="' + this.options.link + '">' + options.message + '</a>');
                query(this.domNode).html(link);
            }
            domClass.add(this.domNode, "marquee-item");
            if (this.options.className !== "") {
                domClass.add(this.domNode, this.options.className);
            }
            domConstruct.place(this.domNode, options.parent || document.body);
            this.parent = this.options.parent;
            this.dim = {
                me:domGeom.position(this.domNode),
                up:domGeom.position(this.parent)
            };
            _hide(this);
        }
    });

    var Marquee = declare([], {
        defaultOptions:{
            autostart:true,
            blend:false
        },
        constructor:function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element;
            this.messages = [];
            domClass.add(this.domNode, "marquee");
            this.load(this.options.messages, this.options.autostart);
        },
        load:function (msgs, start) {
            this.empty();
            this.add(msgs);
            on.emit(this.domNode, 'loaded', {bubbles:false, cancelable:false});
            if (start && start === true) {
                this.start(this.current);
            }
        },
        add:function (msgs) {
            if (msgs) {
                if (msgs instanceof Array) {
                    msgs = msgs;
                } else if (lang.isObject(msgs)) {
                    msgs = [msgs];
                } else if (lang.isString(msgs)) {
                    msgs = [
                        { message:msgs }
                    ];
                } else {
                    return;
                }
            } else {
                return;
            }
            array.forEach(msgs, function (msg) {
                var msgOptions = lang.mixin(lang.clone(this.options), msg);
                msgOptions.parent = this.domNode;
                //remove properties not needed for MarqueeMessage object
                array.forEach(['messages', 'startOnLoad', 'blend', 'toggle'], function(prop){ delete msgOptions[prop]; });
                this.messages.push(new MarqueeMessage(msgOptions));
            }, this);
        },
        remove:function (i) {
            if (this.current === i) {
                this.next();
            }
            this.messages.splice(i, 1);
        },
        clear:function () {
            this.stop(true);
            _hide(this.messages[this.current]);
        },
        empty:function () {
            this.stop();
            query(this.domNode).empty('');
            this.messages = [];
            this.current = 0;
        },
        start:function (s) {
            var _this = this;
            if (this.messages.length === 0 || this.running) {
                return;
            } else if(this.messages.length === 1) {
                _show(this.messages[0]);
                on.emit(_this.domNode, 'changed', {bubbles:false, cancelable:false, currentIndex:0, currentMessage:this.messages[0]});
            } else {
                if (typeof s === 'number') {
                    this.clear();
                    this.current = s;
                    _show(this.messages[this.current]);
                }
                var msgOut = this.messages[this.current];
                var animOut = _animation(msgOut);
                var life = msgOut.options.life;
                _this.lifeTime = window.setTimeout(function () {
                    _this.running = true;
                    function _performAnimIn() {
                        _this.current = _getSeq(_this);
                        var msgIn = _this.messages[_this.current];
                        var animIn = _animation(msgIn);
                        on.emit(_this.domNode, 'before', {bubbles:false, cancelable:false, currentIndex:_this.current, currentMessage:msgIn});
                        fx.animateProperty({
                            node:msgIn.domNode,
                            properties:animIn.trans_in,
                            duration:(msgIn.options.duration * 1000),
                            onEnd:function () {
                                _this.running = false;
                                on.emit(_this.domNode, 'changed', {bubbles:false, cancelable:false, currentIndex:_this.current, currentMessage:msgIn});
                                _this.start();
                            }
                        }).play();
                    }

                    fx.animateProperty({
                        node:msgOut.domNode,
                        properties:animOut.trans_out,
                        duration:(msgOut.options.duration * 1000),
                        onEnd:function () {
                            on.emit(_this.domNode, 'after', {bubbles:false, cancelable:false, currentIndex:_this.current, currentMessage:msgOut});
                            return _this.options.blend || _performAnimIn();
                        }
                    }).play();
                    return _this.options.blend && _performAnimIn();
                }, (life * 1000));
            }
        },
        stop:function (q) {
            this.running = false;
            if (this.lifeTime) {
                window.clearTimeout(this.lifeTime);
            }
            if (q && q === true) {
                return;
            }
            on.emit(this.domNode, 'stop', {bubbles:false, cancelable:false});
        },
        next:function () {
            return this.running || this.start(_getSeq(this));
        },
        previous:function () {
            return this.running || this.start(_getSeq(this, true));
        },
        first:function () {
            return this.running || this.start(0);
        },
        last:function () {
            return this.running || this.start(this.messages.length - 1);
        }
    });

    Marquee.extend({
        animations:{
            "slide":{
                trans_in:function (msg) {
                    return { left:{
                        start:msg.dim.up.w + 1,
                        end:0
                    }};
                },
                trans_out:function (msg) {
                    return { left:{
                        start:0,
                        end:-1 * (msg.dim.me.w + 1)
                    }};
                }
            },
            "scroll":{
                trans_in:function (msg) {
                    return { top:{
                        start:msg.dim.up.h + 1,
                        end:0
                    }};
                },
                trans_out:function (msg) {
                    return { top:{
                        start:0,
                        end:-1 * (msg.dim.me.h + 1)
                    }};
                }
            },
            "fade":{
                trans_in:function (msg) {
                    return { opacity:{ start:0, end:1 }};
                },
                trans_out:function (msg) {
                    return { opacity:{ start:1, end:0 }};
                }
            }
        }
    });

    var mqan = Marquee.prototype.animations;	//shortcut to animations

    lang.extend(query.NodeList, {
        marquee:function (option, args) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'marquee');
                if (!data) {
                    support.setData(node, 'marquee', (data = new Marquee(node, options)));
                }
                if (lang.isString(option)) {
                    data[option].call(data, args || '');
                }
            });
        }
    });

    query(marqueeSelector).forEach(function (marqueeNode) {
        var dataOptions = support.getData(marqueeNode);
        dataOptions.messages = [];
        query('> *', marqueeNode).forEach(function(messageNode){
            var messageOptions = support.getData(messageNode) || {};
            messageOptions.message = messageNode.innerHTML;
            if (messageNode.className !== '') {
                messageOptions.className = messageNode.className;
            }
            dataOptions.messages.push(messageOptions);
        });
        support.setData(marqueeNode, 'marquee', new Marquee(marqueeNode, dataOptions));
    });

    return Marquee;
});