/* ==========================================================
 * Modal.js v3.0.0
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
    "dojo/_base/window",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/request",
    "dojo/NodeList-dom",
    "dojo/NodeList-traverse",
    "dojo/NodeList-manipulate",
    "dojo/domReady!"
], function (support, declare, query, lang, win, on, domClass, domConstruct, domAttr, domStyle, request) {
    "use strict";

    var toggleSelector = '[data-toggle=modal]';
    var dismissSelector = '[data-dismiss=modal]';
    var Modal = declare([], {
        defaultOptions:{
            backdrop:true,
            keyboard:true,
            show:true
        },
        constructor:function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            var elm = this.domNode = element;
            on(this.domNode, on.selector(dismissSelector, 'click'), lang.hitch(this, this.hide));
            if (this.options.remote) {
                request(this.options.remote).then(function(html){
                    query('.modal-body', elm).html(html);
                });
            }
        },
        toggle:function () {
            return this[!this.isShown ? 'show' : 'hide']();
        },
        show:function (e) {
            var _this = this;
            on.emit(this.domNode, 'show.bs.modal', {bubbles:false, cancelable:false});
            if (this.isShown && e.defaultPrevented) { return; }
            this.isShown = true;

            _escape.call(this);
            _backdrop.call(this, function () {
                var transition = support.trans && domClass.contains(_this.domNode, 'fade');
                if (!query(_this.domNode).parent().length) {
                    domConstruct.place(_this.domNode, win.body());
                }
                domStyle.set(_this.domNode, 'display', 'block');
                if (transition) {
                    _this._offsetWidth = _this.domNode.offsetWidth;
                }
                domClass.add(_this.domNode, 'in');
                domAttr.set(_this.domNode, 'aria-hidden', false);
                _enforceFocus.call(_this);

                if (transition) {
                    on.once(_this.domNode, support.trans.end, function () {
                        _this.domNode.focus();
                        on.emit(_this.domNode, 'shown.bs.modal', {bubbles:false, cancelable:false});
                    });
                } else {
                    _this.domNode.focus();
                    on.emit(_this.domNode, 'shown.bs.modal', {bubbles:false, cancelable:false});
                }
            });
        },
        hide:function (e) {
            var _this = this;
            on.emit(this.domNode, 'hide.bs.modal', {bubbles:false, cancelable:false});
            if (e) { e.preventDefault(); }
            if (!this.isShown && e.defaultPrevented) {
                return;
            }

            this.isShown = false;
            _escape.call(this);

            if (this.focusInEvent) { this.focusInEvent.remove(); }

            domClass.remove(this.domNode, 'in');
            domAttr.set(_this.domNode, 'aria-hidden', true);

            if (support.trans && domClass.contains(this.domNode, 'fade')) {
                _hideWithTransition.call(this);
            } else {
                _hideModal.call(this);
            }
        }
    });

    function _getTargetSelector(node) {
        var selector = domAttr.get(node, 'data-target');
        if (!selector) {
            selector = support.hrefValue(node);
        }
        return (!selector) ? "" : selector;
    }

    function _hideWithTransition() {
        var _this = this;
        var timeout = setTimeout(function () {
            if (_this.hideEvent) { _this.hideEvent.remove(); }
            _hideModal.call(_this);
        }, 500);
        _this.hideEvent = support.trans ? on.once(_this.domNode, support.trans.end, function () {
            clearTimeout(timeout);
            _hideModal.call(_this);
        }) : null;
    }

    function _hideModal() {
        var _this = this;
        domStyle.set(_this.domNode, 'display', 'none');
        on.emit(_this.domNode, 'hidden.bs.modal', {bubbles:false, cancelable:false});
        _backdrop.call(_this);
    }

    function _backdrop(callback) {
        var _this = this;
        var animate = domClass.contains(_this.domNode, 'fade') ? 'fade' : '';

        if (_this.isShown && _this.options.backdrop) {
            var doAnimate = support.trans && animate;
            _this.backdropNode = domConstruct.place('<div class="modal-backdrop ' + animate + '" />', win.body());
            on(_this.backdropNode, 'click', _this.options.backdrop !== 'static' ?
                lang.hitch(_this.domNode, 'focus') :
                lang.hitch(_this, 'hide'));
            if (doAnimate) {
                _this.backdropNode.offsetWidth;
            }
            domClass.add(_this.backdropNode, 'in');
            if (doAnimate) {
                on.once(_this.backdropNode, support.trans.end, callback);
            } else {
                callback();
            }
        } else if (!_this.isShown && _this.backdropNode) {
            domClass.remove(_this.backdropNode, 'in');
            if (support.trans && domClass.contains(_this.domNode, 'fade')) {
                on.once(_this.backdropNode, support.trans.end, lang.hitch(_this, _removeBackdrop));
            } else {
                _removeBackdrop.call(_this);
            }
        } else if (callback) {
            callback();
        }
    }

    function _removeBackdrop() {
        var _this = this;
        domConstruct.destroy(_this.backdropNode);
        _this.backdropNode = null;
    }

    function _escape() {
        var _this = this;
        if (_this.isShown && _this.options.keyboard) {
            _this.keyupEvent = on(win.body(), 'keyup', function (e) {
                if (e.which === 27) { _this.hide(); }
            });
        } else if (!_this.isShown) {
            if (_this.keyupEvent) {
                _this.keyupEvent.remove();
            }
        }
    }

    function _enforceFocus() {
        var _this = this;
        _this.focusInEvent = on(document, on.selector('.modal', 'focusin'), function (e) {
            if (_this.domNode !== this && !query(this, _this.domNode).length) {
                _this.domNode.focus();
            }
        });
    }

    lang.extend(query.NodeList, {
        modal:function (option) {
            return this.forEach(function (node) {
                var options = lang.mixin({}, lang.mixin(support.getData(node), lang.isObject(option) && option));
                var data = support.getData(node, 'modal');
                if (!data) {
                    support.setData(node, 'modal', (data = new Modal(node, options)));
                }
                if (lang.isString(option)) {
                    data[option].call(data);
                }
                else if (data && data.options.show) {
                    data.show();
                }
            });
        }
    });
    on(win.body(), on.selector(toggleSelector, 'click'), function (e) {
        var target = query(_getTargetSelector(this));
        if (target[0] !== undefined) {
            var href = domAttr.get(this, "href");
            var option = support.getData(target, 'modal') ? 'toggle' : lang.mixin({ remote: !/#/.test(href) && href}, lang.mixin(support.getData(target), support.getData(this)));
            if (option === 'toggle') {
              lang.mixin(support.getData(target, 'modal').options, support.getData(this));
            }
            target.modal(option);
            on.once(target[0], 'hide', function () {
                target[0].focus();
            });
        }
        if (e) {
            e.preventDefault();
        }
    });

    return Modal;
});