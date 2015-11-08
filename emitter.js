'use strict';

module.exports = function () {
    var events = [];
    return {
        on: function (eventName, student, callback) {
            events.push({eventName, student: student, callback: callback});
        },

        off: function (eventName, student) {
            events = events.filter(item => {
                return !(inNamespace(item, eventName) || item.student !== student);
            });
        },

        emit: function (eventName) {
            for (var item of events) {
                if (eventName.indexOf(item.eventName) === 0 && isNaN(item.through)) {
                    item.callback.call(item.student);
                }
            }
        },

        several: function (eventName, student, callback, n) {
            n = n > 0 ? n : 0;
            this.on(eventName, student, severalDecorator(eventName, student, callback, n, this));
        },

        through: function (eventName, student, callback, n) {
            n = n > 0 ? n : 0;
            this.on(eventName, student, throughDecorator(eventName, student, callback, n));
        }
    };
    function severalDecorator(eventName, student, callback, n, emitter) {
        return function () {
            n--;
            if (n >= 0) {
                callback.call(this);
                return;
            }
            emitter.off(eventName, student);
        };
    }
    function throughDecorator(eventName, student, callback, n) {
        var maxN = n;
        return function () {
            n--;
            if (n === 0) {
                n = maxN;
                callback.call(this);
            }
        };
    }
    function inNamespace(item, eventName) {
        return item.eventName.indexOf(eventName + '.') === 0 ||
            item.eventName === eventName;
    }
};
