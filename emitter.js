'use strict';

module.exports = function () {
    return {
        on: function (eventName, student, callback) {
            if (!this[eventName]) {
                this[eventName] = [];
            }
            this[eventName].push({obj: student, cb: callback.bind(student)});
        },

        off: function (eventName, student) {
            if (!this[eventName]) {
                return;
            }

            this[eventName].forEach((item, index, arr) => {
                if (item.obj === student) {
                    arr.splice(index, 1);
                }
            });

            for (var prop in this) {
                if (Array.isArray(this[prop]) &&
                    new RegExp('^' + eventName + '.', 'i').test(prop)) {
                    this[prop].splice(0, this[prop].length);
                }
            }
        },

        emit: function (eventName) {
            do {
                if (!this[eventName]) {
                    break;
                }

                this[eventName].forEach(item => {
                    if ((item.hasOwnProperty('each') && (++item.count % item.each === 0)) ||
                        (item.hasOwnProperty('count') && !item.hasOwnProperty('each') &&
                        item.count--) ||
                        (!item.hasOwnProperty('count') && !item.hasOwnProperty('each'))) {
                        item.cb();
                    }
                });

                var parts = eventName.split('.');
                parts.pop();
                eventName = parts.join('.');
            } while (eventName);
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            this.lastElement(eventName).count = n;
        },

        through: function (eventName, student, callback, n) {
            this.several(eventName, student, callback, 0);
            this.lastElement(eventName).each = n;
        },

        lastElement: function (eventName) {
            return this[eventName][this[eventName].length - 1];
        }
    };
};
