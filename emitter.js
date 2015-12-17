'use strict';

module.exports = function () {
    return {
        students: [],

        on: function (eventName, student, callback) {
            if (this.students.indexOf(student) === -1) {
                this.students.push(student);
            }
            if (!student.hasOwnProperty('events')) {
                student.events = [];
                student.function = [];
            }
            student.events.push(eventName);
            student.function.push(callback);
        },

        off: function (eventName, student) {
            var lenEventName = eventName.split('.').length;
            if (this.students.indexOf(student) !== -1) {
                var events = student.events;
                var newEvents = [];
                var newFunctions = [];
                events.forEach(function (event, index, events) {
                    var newEvent = event.split('.');
                    var newEventName = newEvent[0];
                    for (var eve = 1; eve < lenEventName; eve++) {
                        newEventName += '.' + newEvent[eve];
                    }
                    if (newEventName != eventName) {
                        newEvents.push(student.events[index]);
                        newFunctions.push(student.function[index]);
                    }
                });
                student.events = newEvents;
                student.function = newFunctions;
            }
        },

        emit: function (eventName) {
            var level = eventName.split('.');
            var events = [];
            level.forEach(function (event, index) {
                if (index > 0) {
                    events.push(events[index - 1] + '.' + event);
                } else {
                    events.push(event);
                }
            });
            this.students.forEach(function (student) {
                events.forEach(function (event) {
                    for (var index = 0; index < student.events.length; index++) {
                        if (student.events[index] == event) {
                            student.function[index].call(student);
                        }
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
