'use strict';

var events = [];

module.exports = function () {
    return {
        on: function (eventName, student, callback) {
            var newEvent = {
                name: eventName,
                student: student,
                callback: callback
            };
            events.push(newEvent);
        },

        off: function (eventName, student) {
            events = events.filter(function (event) {
                return event.name.indexOf(eventName) < 0 || student !== event.student;
            });
        },

        emit: function (eventName) {
            var currentEvent = eventName;
            while (currentEvent.length !== 0) {
                var leafEvents = events.filter(function (event) {
                    return event.name === currentEvent;
                });

                if (!this.emitWrapper(leafEvents)) {
                    return false;
                }

                currentEvent = currentEvent.substr(0, currentEvent.lastIndexOf('.'));
            }
            return true;
        },

        several: function (eventName, student, callback, n) {
            var newEvent = {
                name: eventName,
                student: student,
                lifeCount: n,
                callback: callback
            };
            events.push(newEvent);
        },

        through: function (eventName, student, callback, n) {
            var newEvent = {
                name: eventName,
                student: student,
                ignoreCount: n,
                maxIgnoreCount: n,
                callback: callback
            };
            events.push(newEvent);
        },

        emitWrapper: function (events) {
            if (events.length <= 0) {
                return false;
            }
            events.forEach(function (event) {
                if ('lifeCount' in event) {
                    if (event.lifeCount <= 0) {
                        return;
                    }
                    --event.lifeCount;
                }
                if ('ignoreCount' in event) {
                    --event.ignoreCount;
                    if (event.ignoreCount >= 0) {
                        return;
                    }
                    event.ignoreCount = event.maxIgnoreCount;
                }
                event.callback.call(event.student);
            });
            return true;
        }
    };
};

