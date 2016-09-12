/* ==========================================================
 * Datepicker.js v3.0.0
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

    var provideSelector = '[data-provide="datepicker"]';
    var _modes = [
        { clsName: 'days', navFnc: 'Month', navStep: 1 },
        { clsName: 'months', navFnc: 'FullYear', navStep: 1 },
        { clsName: 'years', navFnc: 'FullYear', navStep: 10 }
    ];
    var _dates = {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
    var _isLeapYear = function (year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    };
    var _getDaysInMonth = function (year, month) {
        return [31, (_isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };
    var _parseFormat = function(format) {
        var separator = format.match(/[.\/-].*?/),
            parts = format.split(/\W+/);
        if (!separator || !parts || parts.length === 0){
            throw new Error("Invalid date format.");
        }
        return {separator: separator, parts: parts};
    };
    var _parseDate = function(date, format) {
        var today=new Date();
        if (!date) { date = ""; }
        var parts = date.split(format.separator),
            val;
        date = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0);

        if (parts.length === format.parts.length) {
            for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                val = parseInt(parts[i], 10)||1;
                switch(format.parts[i]) {
                    case 'dd':
                    case 'd':
                        date.setDate(val);
                        break;
                    case 'mm':
                    case 'm':
                        date.setMonth(val - 1);
                        break;
                    case 'yy':
                        date.setFullYear(2000 + val);
                        break;
                    case 'yyyy':
                        date.setFullYear(val);
                        break;
                }
            }
        }
        return date;
    };
    var _formatDate = function(date, format){
        var val = {
            d: date.getDate(),
            m: date.getMonth() + 1,
            yy: date.getFullYear().toString().substring(2),
            yyyy: date.getFullYear()
        };
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        date = [];

        for (var i=0, cnt = format.parts.length; i < cnt; i++) {
            date.push(val[format.parts[i]]);
        }
        return date.join(format.separator);
    };
    var _headTemplate = (function(){
        return '<thead>'+
            '<tr>'+
            '<th class="prev"><i class="icon-arrow-left"/></th>'+
            '<th colspan="5" class="switch"></th>'+
            '<th class="next"><i class="icon-arrow-right"/></th>'+
            '</tr>'+
            '</thead>';
    })();
    var _contTemplate = '<tbody><tr><td colspan="7"></td></tr></tbody>';
    var _template = (function() {
        return '<div class="datepicker dropdown-menu">'+
            '<div class="datepicker-days">'+
            '<table class=" table-condensed">'+
            _headTemplate+
            '<tbody></tbody>'+
            '</table>'+
            '</div>'+
            '<div class="datepicker-months">'+
            '<table class="table-condensed">'+
            _headTemplate+
            _contTemplate+
            '</table>'+
            '</div>'+
            '<div class="datepicker-years">'+
            '<table class="table-condensed">'+
            _headTemplate+
            _contTemplate+
            '</table>'+
            '</div>'+
            '</div>';
    })();

    var Datepicker = declare([], {
        defaultOptions: {

        },
        constructor: function (element, options) {
            this.options = lang.mixin(lang.clone(this.defaultOptions), (options || {}));
            this.domNode = element;

            this.format = _parseFormat(options.format || support.getData(this.domNode, 'date-format') || 'mm/dd/yyyy');
            this.picker = domConstruct.place(_template, document.body);
            query(this.picker).hide();
            this.pickerMouseDownEvent = on(this.picker, 'mousedown', lang.hitch(this, 'mousedown'));
            this.pickerClickEvent = on(this.picker, 'click', lang.hitch(this, 'click'));

            this.isInput = this.domNode.tagName === 'INPUT' || this.domNode.tagName === 'TEXTAREA';
            this.component = domClass.contains(this.domNode, 'date') ? query('.add-on', this.domNode)[0] : false;
            if (this.isInput) {
                on(this.domNode, 'focus', lang.hitch(this, 'show'));
                on(this.domNode, 'click', lang.hitch(this, 'show'));
                on(this.domNode, 'blur', lang.hitch(this, 'blur'));
                on(this.domNode, 'keyup', lang.hitch(this, 'update'));
                on(this.domNode, 'keydown', lang.hitch(this, 'keydown'));
            } else {
                if (this.component){
                    on(this.component, 'click', lang.hitch(this, 'show'));
                } else {
                    on(this.domNode, 'click', lang.hitch(this, 'show'));
                }
            }

            this.viewMode = 0;
            this.weekStart = options.weekStart || support.getData(this.domNode, 'date-weekstart') || 0;
            this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
            this.fillDow();
            this.fillMonths();
            this.update();
            this.showMode();
        },
        show: function (e) {
            query('div.datepicker.dropdown-menu').hide(); //make sure to hide all other calendars
            query(this.picker).show();
            this.height = this.component ? domGeom.position(this.component, true).h : domGeom.position(this.domNode, true).h;
            this.place();
            this.resizeEvent = on(win.global, 'resize', lang.hitch(this, 'place'));
            this.bodyClickEvent = on(win.body(), 'click', lang.hitch(this, 'hide'));
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (!this.isInput) {
                this.docMouseDownEvent = on(document, 'mousedown', lang.hitch(this, 'hide'));
            }
            on.emit(this.domNode, 'show', { bubbles:true, cancelable:true, type:'show', date: this.date });
        },
        hide: function (e) {
            query(this.picker).hide();
            this.resizeEvent.remove();
            this.viewMode = 0;
            this.showMode();
            if (!this.isInput) {
                this.docMouseDownEvent.remove();
            }
            this.bodyClickEvent.remove();
            on.emit(this.domNode, 'hide', { bubbles:true, cancelable:true, type:'hide', date: this.date });
        },
        setValue: function () {
            var formatted = _formatDate(this.date, this.format);
            if (!this.isInput) {
                if (this.component) {
                    query('input', this.domNode)[0].value = formatted;
                }
                support.setData(this.domNode, 'date', formatted);
            } else {
                this.domNode.value = formatted;
            }
        },
        place: function () {
            var pos = this.component ? domGeom.position(this.component, true) : domGeom.position(this.domNode, true);
            domStyle.set(this.picker, {
                top: (pos.y + this.domNode.offsetHeight)+'px',
                left: pos.x+'px'
            });
        },
        update: function () {
            var date = this.domNode.value;
            this.date = _parseDate(
                date ? date : support.getData(this.domNode, 'date'),
                this.format
            );
            this.viewDate = new Date(this.date);
            this.fill();
        },
        fillDow: function () {
            var dowCnt = this.weekStart,
                html = '<tr>';
            while (dowCnt < this.weekStart + 7) {
                html += '<th class="dow">'+_dates.daysMin[(dowCnt++)%7]+'</th>';
            }
            html += '</tr>';
            domConstruct.place(html, query('.datepicker-days thead', this.picker)[0]);
        },
        fillMonths: function () {
            var html = '',
                i = 0;
            while (i < 12) {
                html += '<span class="month" data-month="'+i+'">'+_dates.monthsShort[i++]+'</span>';
            }
            domConstruct.place(html, query('.datepicker-months td', this.picker)[0]);
        },
        fill: function (item) {
            var clsName,
                html = [],
                d = new Date(this.viewDate),
                year = d.getFullYear(),
                month = d.getMonth(),
                currentDate = this.date.valueOf(),
                currentYear = this.date.getFullYear(),
                prevMonth = new Date(year, month-1, 28,0,0,0,0),
                day = _getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());

            query('.datepicker-days th.switch', this.picker)[0].innerHTML = _dates.months[month]+' '+year;

            prevMonth.setDate(day);
            prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);

            var nextMonth = new Date(prevMonth);
            nextMonth.setDate(nextMonth.getDate() + 42);
            nextMonth = nextMonth.valueOf();

            while(prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getDay() === this.weekStart) {
                    html.push('<tr>');
                }
                clsName = '';
                if (prevMonth.getMonth() < month) {
                    clsName += ' old';
                } else if (prevMonth.getMonth() > month) {
                    clsName += ' new';
                }
                if (prevMonth.valueOf() === currentDate) {
                    clsName += ' active';
                }
                html.push('<td class="day'+clsName+'">'+prevMonth.getDate() + '</td>');
                if (prevMonth.getDay() === this.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setDate(prevMonth.getDate()+1);
            }
            domConstruct.empty(query('.datepicker-days tbody', this.picker)[0]);
            domConstruct.place(html.join(' '), query('.datepicker-days tbody', this.picker)[0]);

            var months = query('.datepicker-months', this.picker);
            query('th.switch', months[0])[0].innerHTML = year;
            query('span', months[0]).removeClass('active');
            if (currentYear === year) {
                domClass.add(query('span', months[0])[this.date.getMonth()], 'active');
            }

            html = '';
            year = parseInt(year/10, 10) * 10;

            var yearCont = query('.datepicker-years', this.picker);
            query('th.switch', yearCont[0]).innerHTML = year + '-' + (year + 9);
            yearCont = query('td', yearCont[0]);

            year -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="year'+(i === -1 || i === 10 ? ' old' : '')+(currentYear === year ? ' active' : '')+'">'+year+'</span>';
                year += 1;
            }
            yearCont[0].innerHTML = html;
        },
        blur: function (e) {

        },
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        mousedown: function (e) {
            var month, year, day;
            e.stopPropagation();
            e.preventDefault();
            var target = query(e.target).closest('span, td, th');
            if (target.length === 1) {
                switch(target[0].nodeName.toLowerCase()) {
                    case 'th':
                        switch(target[0].className) {
                            case 'switch':
                                this.showMode(1);
                                break;
                            case 'prev':
                            case 'next':
                                this.viewDate['set'+_modes[this.viewMode].navFnc].call(
                                    this.viewDate,
                                    this.viewDate['get'+_modes[this.viewMode].navFnc].call(this.viewDate) +
                                        _modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1)
                                );
                                this.fill();
                                break;
                        }
                        break;
                    case 'span':
                        if (domClass.contains(target[0], 'month')) {
                            month = support.getData(target[0], 'month');
                            this.viewDate.setMonth(month);
                        } else {
                            var yearText = target[0].innerText || target[0].textContent;
                            year = parseInt(yearText, 10) || 0;
                            this.viewDate.setFullYear(year);
                        }
                        this.showMode(-1);
                        this.fill();
                        break;
                    case 'td':
                        if (domClass.contains(target[0], 'day')){
                            var dayText = target[0].innerText || target[0].textContent;
                            day = parseInt(dayText, 10) || 1;
                            month = this.viewDate.getMonth();
                            if (domClass.contains(target[0], 'old')) {
                                month -= 1;
                            } else if (domClass.contains(target[0], 'new')) {
                                month += 1;
                            }
                            year = this.viewDate.getFullYear();
                            this.date = new Date(year, month, day,0,0,0,0);
                            this.viewDate = new Date(year, month, day,0,0,0,0);
                            this.fill();
                            this.setValue();
                            on.emit(this.domNode, 'changeDate', { bubbles:false, cancelable:false, date:this.date });
                            this.hide();
                        }
                        break;
                }
            }
        },
        keydown: function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode === 9) { this.hide(); } // when hitting TAB, for accessibility
        },
        showMode: function (dir) {
            if (dir) {
                this.viewMode = Math.max(0, Math.min(2, this.viewMode + dir));
            }
            query('>div', this.picker).hide();
            query('>div.datepicker-'+_modes[this.viewMode].clsName, this.picker).show();
        },
        destroy: function (e) {
            support.removeData(this.domNode, "datepicker");
            this.nodeEvent.remove();
            domConstruct.destroy(this.picker);
        }
    });

    lang.extend(query.NodeList, {
        datepicker:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'datepicker');
                if (!data) { support.setData(node, 'datepicker', (data = new Datepicker(node, options))); }
                if (lang.isString(option)) { data[option].call(data); }
            });
        }
    });

    return Datepicker;
});