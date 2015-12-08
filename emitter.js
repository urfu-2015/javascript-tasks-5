'use strict';

module.exports = function () {
    return {
        students: [],

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
            if (this.students.indexOf(student) !== -1) {
                var events = Object.keys(student.events);
                events.forEach(function (event) {
                    if (event.indexOf(eventName) === 0) {
                        delete student.events[event];
                    }
                });
            }
        },

        emit: function (eventName) {
            var level = eventName.split('.');
            var events = [];
            level.forEach(function (event, index) {
                if (index > 0) {
                    events.push(events[index - 1] + '.' + event)
                } else {
                    events.push(event);
                }
            });
            this.students.forEach(function (student) {
                events.forEach(function (event) {
                    if (Object.keys(student.events).indexOf(event) !== -1) {
                        student.events[event].call(student);
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
