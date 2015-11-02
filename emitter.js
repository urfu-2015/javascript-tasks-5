'use strict';
module.exports = function () {
    var students = [];
    return {
        on: function (eventName, student, callback) {
            if (typeof (eventName) == 'string' && typeof (student) == 'object' &&
                typeof (callback) == 'function') {
                var currentStudentIndex = -1;
                for (var i = 0; i < students.length; i++) {
                    if (students[i].student == student) {
                        currentStudentIndex = i;
                        break;
                    }
                }
                if (currentStudentIndex == -1) {
                    var studentEvents = {};
                    studentEvents[eventName] = callback;
                    var newStudent = {
                        student: student,
                        events: studentEvents
                    };
                    students.push(newStudent);
                } else {
                    students[currentStudentIndex].events[eventName] = callback;
                }
            }
        },

        off: function (eventName, student) {
            if (typeof (eventName) == 'string' && typeof (student) == 'object') {
                var currentStudentIndex = -1;
                for (var i = 0; i < students.length; i++) {
                    if (students[i].student == student) {
                        currentStudentIndex = i;
                        break;
                    }
                }
                if (currentStudentIndex != -1) {
                    for (var event in students[currentStudentIndex].events) {
                        var isFullName = false;
                        var isFirstName = false;
                        if (eventName == event) {
                            isFullName = true;
                        }
                        if (event.indexOf(eventName) != -1) {
                            isFirstName = true;
                        }
                        if (isFirstName || isFullName) {
                            delete students[currentStudentIndex].events[event];
                        }

                    }
                }
            }
        },

        emit: function (eventName) {
            var names = [];
            names.push(eventName);
            while (eventName.lastIndexOf('.') != -1) {
                eventName = eventName.slice(0, eventName.lastIndexOf('.'));
                names.push(eventName);
            }
            students.forEach(function (student) {
                names.forEach(function (name) {
                    if (Object.keys(student.events).indexOf(name) != -1) {
                        student.events[name].apply(student.student);
                    }
                });
            });
        }
    };
};
