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
                if(this.students[IndexOfStudent].events.hasOwnProperty(eventName)) {
                    delete this.students[IndexOfStudent].events[eventName];
                }
            }
        },

        emit: function (eventName) {
            var events = eventName.split('.');
            var lenEvents = events.length;
            var lenStudents = this.students.length;

            for (var i = 0; i < lenStudents; i++) {
                for (var j = 0; j < lenEvents; j++) {
                    var eventEmitted = events.slice(0, j + 1).join('.');
                    if (this.students[i].events.hasOwnProperty(eventEmitted)) {
                        this.students[i].events[eventEmitted].apply(this.students[i]);
                    }
                }
            }
        }

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
