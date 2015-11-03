'use strict';

module.exports = function () {
    var students = [];
    function getStudentId(student) {
        for (var item in students) {
            if (students[item] == student) {
                return item;
            };
        };
        student.actions = {};
        students.push(student);
        return students.length - 1;
    };

    function getParentEvents(eventName) {
        var events = [];
        events.push(eventName);
        while (eventName.indexOf('.') > -1) {
            eventName = eventName.slice(0, eventName.indexOf('.'));
            events.push(eventName);
        }
        return events;
    }

    return {
        on: function (eventName, student, callback) {
            var studentId = getStudentId(student);
            students[studentId].actions[eventName] = callback;
        },

        off: function (eventName, student) {
            var studentId = getStudentId(student);
            for (var currentEvent in students[studentId].actions) {
                if (currentEvent.indexOf(eventName) > -1) {
                    delete students[studentId].actions[currentEvent];
                }
            }
        },

        emit: function (eventName) {
            var events = getParentEvents(eventName);
            students.forEach(function (item, i, students) {
                for (var currentEvent in events) {
                    if (item.actions.hasOwnProperty(events[currentEvent])) {
                        item.actions[events[currentEvent]].call(item);
                    }
                };
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
