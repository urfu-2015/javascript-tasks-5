'use strict';

module.exports = function () {
    var events = [];
    return {
        on: function (eventName, student, callback) {
            events.push({eventName, student: student, callback: callback,
                through: NaN, curent: NaN});
        },

        off: function (eventName, student) {
            events = events.filter(item => {
                return !(inNamespace(item, eventName) || item.student !== student);
            });
        },

        emit: function (eventName) {
            for (var item of events) {
                if (eventName.indexOf(item.eventName) === 0) {
                    item.callback.call(item.student);
                }
            }
            events = events.filter(item => {
                item.curent --;
                if (item.curent === 0) {
                    if (isNaN(item.through)) {
                        return false;
                    }
                    item.curent = item.through;
                }
                return true;
            });
        },

        several: function (eventName, student, callback, n) {
            n = n > 0 ? n : 0;
            events.push({eventName: eventName, student: student, callback: callback,
                through: NaN, curent: n});
        },

        through: function (eventName, student, callback, n) {
            n = n > 0 ? n : 0;
            events.push({eventName: eventName, student: student,
                callback: callback, through: n, curent: n});
        }
    };
    function inNamespace(item, eventName) {
        return item.eventName.indexOf(eventName + '.') === 0 ||
            (item.eventName.indexOf(eventName) === 0 &&
            item.eventName.length === eventName.length);
    }
};
