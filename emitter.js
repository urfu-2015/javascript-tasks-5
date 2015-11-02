'use strict';

module.exports = function () {
    return {
        students: [],
        events: [],

        on: function (eventName, student, callback) {
            if (this.students.indexOf(student) === -1) {
                this.students.push(student);
            }
            if (!student.hasOwnProperty('events')) {
                student.events = {};
            }
            student.events[eventName] = callback;
        },

        off: function (eventName, student) {
            if (this.students.indexOf(student) !== -1 && student.hasOwnProperty('events')) {
                delete student.events[eventName];
                var studentEvents = Object.keys(student.events);
                studentEvents.forEach(function (event) {
                    if (event.indexOf(eventName) === 0) {
                        delete student.events[event];
                    }
                });
            }
        },

        emit: function (eventName) {
            var eventLevels = eventName.split('.');
            var events = [];
            eventLevels.forEach(function (event, index) {
                if (index > 0) {
                    events.push(events[index - 1] + '.' + event);
                } else {
                    events.push(event);
                }
            });
            this.students.forEach(function (student) {
                events.forEach(function (currentEvent) {
                    if (Object.keys(student.events).indexOf(currentEvent) !== -1) {
                        student.events[currentEvent].call(student);
                    }
                });
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
