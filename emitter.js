'use strict';

module.exports = function () {
    var students = [];

    function getParentEvents(eventName) {
        var events = [];
        events.push(eventName);
        while (eventName.indexOf('.') > -1) {
            eventName = eventName.slice(0, eventName.lastIndexOf('.'));
            events.push(eventName);
        }
        return events;
    }

    return {
        on: function (eventName, student, callback) {
            var newStudent = {
                studentObj: student,
                event_: eventName,
                actions: callback
            }
            students.push(newStudent);
            // console.log('on');
            // console.log(students);
        },

        off: function (eventName, student) {
            var newStudents = [];
            for (var currentObj = 0; currentObj < students.length; currentObj++) {
                if (students[currentObj].studentObj == student
                && (students[currentObj].event_.charAt(students[currentObj].event_.indexOf(eventName) +
                eventName.length) == '.' || students[currentObj].event_.length == eventName.length)) {
                    delete students[currentObj];
                }
            }

            for (var currentObj = 0; currentObj < students.length; currentObj++) {
                if (students[currentObj]) {
                    newStudents.push(students[currentObj]);
                }
            }

            students = newStudents;
            // console.log('off');
            // console.log(students);
        },

        emit: function (eventName) {
            var events = getParentEvents(eventName);
            // console.log(students);
            students.forEach(function(item, i, students) {
                for (var eventIndex = 0; eventIndex < events.length; eventIndex++) {
                    if (item.event_ == events[eventIndex]) {
                        item.actions.call(item);
                    }
                }
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
