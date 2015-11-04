'use strict';

module.exports = function () {
    return {
        students: [],

        on: function (eventName, student, callback) {
            var IndexOfStudent = this.students.indexOf(student);

            if (IndexOfStudent === -1) {
                this.students.push(student);
            }

            if (!student.hasOwnProperty('events')) {
                student.events = {};
            }

            student.events[eventName] = callback;
        },

        off: function (eventName, student) {
            var IndexOfStudent = this.students.indexOf(student);

            if (IndexOfStudent !== -1) {
                var EventsOfStudent = this.students[IndexOfStudent].events;
                for (var event in EventsOfStudent) {
                    if (EventsOfStudent.hasOwnProperty(event)) {
                        if (event.indexOf(eventName) !== -1) {
                            delete this.students[IndexOfStudent].events[event];
                        }
                    }
                }
            }
        },

        emit: function (eventName) {
            var events = eventName.split('.');
            var lenEvents = events.length;
            var lenStudents = this.students.length;

            for (var i = 0; i < lenStudents; i++) {
                for (var j = 0; j < lenEvents; j++) {
                    var emittedEvent = events.slice(0, j + 1).join('.');
                    if (this.students[i].events.hasOwnProperty(emittedEvent)) {
                        this.students[i].events[emittedEvent].apply(this.students[i]);
                    }
                }
            }
        }
    };
};
