'use strict';

module.exports = function () {
    return {
        _students: [],
        _events: [],

        on: function (eventName, student, callback) {
            this.createEventHandler(eventName, student, callback);
        },

        off: function (eventName, student) {
            var index = this._students.indexOf(student);
            if (index === -1) {
                return;
            }

            var events = this._events[index];
            eventName = eventName.split('.');

            for (var i = 0; i < eventName.length; i++) {
                if (i === eventName.length - 1) {
                    delete events[eventName[i]];
                    break;
                }
                events = events[eventName[i]];
            }
        },

        emit: function (eventName) {
            eventName = eventName.split('.');
            for (var i = 0; i < this._students.length; i++) {
                var events = this._events[i];
                for (var j = 0; j < eventName.length; j++) {
                    if (!events.hasOwnProperty(eventName[j])) {
                        break;
                    }
                    events[eventName[j]].callback.call(this._students[i]);
                    events = events[eventName[j]];
                }
            }
        },

        several: function (eventName, student, callback, n) {
            this.createEventHandler(eventName, student, callback, undefined, n + 1);
        },

        through: function (eventName, student, callback, n) {
            this.createEventHandler(eventName, student, callback, n);
        },

        createEventHandler: function (eventName, student, callback, eachCall, maxCalls) {
            if (!Boolean(this._students.indexOf(student) + 1)) {
                this._students.push(student);
                this._events.push({});
            }

            var currentCall = 1;
            var index = this._students.indexOf(student);
            var events = this._events[index];
            eventName = eventName.split('.');

            eventName.forEach(name => {
                if (!events.hasOwnProperty(name)) {
                    events[name] = {};
                }
                events = events[name];
            });

            events['callback'] = function () {
                if (isNaN(eachCall) && isNaN(maxCalls) ||
                    (!isNaN(eachCall) && currentCall % eachCall === 0) ||
                    (!isNaN(maxCalls) && maxCalls > currentCall)) {
                    callback.call(this);
                }
                currentCall++;
            };
        }
    };
};
