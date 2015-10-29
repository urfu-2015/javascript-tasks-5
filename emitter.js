'use strict';

module.exports = function () {
    return {
        students: [],
        on: function (eventName, student, callback) {
            if (this.students.indexOf(student) === -1) {
                this.students.push(student);
            }
            if (!student.hasOwnProperty('events')){
                student.events = {};
            }
            student.events[eventName] = callback;
        },
        off: function (eventName, student) {
            var studentIndex = this.students.indexOf(student);
            if (studentIndex !== -1) {
                if(this.students[studentIndex].events.hasOwnProperty(eventName)) {
                    delete this.students[studentIndex].events[eventName];
                }
            }
        },
        emit: function (eventName) {
            var events = eventName.split('.');
            for (var i = 0; i < this.students.length; i++) {
                for (var j = 0; j < events.length; j++) {
                    var emittedEvent = events.slice(0, j + 1).join('.');
                    if (this.students[i].events.hasOwnProperty(emittedEvent)) {
                        this.students[i].events[emittedEvent].apply(this.students[i]);
                    }
                }
            }
        }
    };
};
