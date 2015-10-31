'use strict';

var events = [];

module.exports = function () {
    return {
        on: function (eventName, student, callback) {
            events.push({ eventName: eventName, student: student, callback: callback});
        },

        off: function (eventName, student) {

            events = events.filter(item => {
                var eventsName = item.eventName.split('.');
                return eventsName[0] !== eventName || item.student !== student;
            });
        },

        emit: function (eventName) {
            var eventsName = eventName.split('.');
            eventsName.length === 1 || eventsName.push(eventName);

            for (var eventName of eventsName) {
                for (var item of events) {
                    if (item.eventName === eventName) {
                        throughEmit(item);
                    }
                }
            }
            events = events.filter(item => {
                if (item.hasOwnProperty('count')) {
                    item.count --;
                    if (item.count === 0) {
                        return false;
                    }
                }
                return true;
            });
        },

        several: function (eventName, student, callback, n) {
            events.push({ eventName: eventName, student: student, callback: callback, count: n});
        },

        through: function (eventName, student, callback, n) {
            events.push({ eventName: eventName, student: student,
                callback: callback, through: n, curent: 0});
        }
    };
};
function throughEmit(item) {
    if (!item.hasOwnProperty('through')) {
        item.callback.call(item.student);
    } else {
        item.curent ++;
        if (item.curent - 1 === item.through) {
            item.curent = 0;
            item.callback.call(item.student);
        }
    }
}
