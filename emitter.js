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
            //console.log(eventName, student);
            var studentIndex = this.students.indexOf(student);
            if (studentIndex !== -1) {
                var studentEvents = this.students[studentIndex].events;
                for (var event in studentEvents) {
                    if (studentEvents.hasOwnProperty(event)) {
                        if (event.indexOf(eventName) !== -1) {
                            delete this.students[studentIndex].events[event];
                        }
                    }
                }
            }
            //console.log(eventName, student);
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
