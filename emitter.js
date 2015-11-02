'use strict';

module.exports = function () {
    var students = [];
    function getStudentId (student) {
        students.forEach(function(item, i, students) {
            if (item.name === student.name) {
                return i;
            }
        });
        student.actions = {};
        students.push(student);
        return students.length - 1;
    };
    return {
        on: function (eventName, student, callback) {
            var studentId = getStudentId(student);
            console.log(eventName);
            console.log(typeof(eventName));
            students[studentId].actions[eventName] = callback;
            console.log(students[studentId].actions);
        },

        off: function (eventName, student) {
            var studentId = getStudentId(student);
            for (var event in students[studentId].actions) {
                if (event.indexOf(eventName) > -1) {
                    delete students[studentId].actions[event];
                }
            }
        },

        emit: function (eventName) {
            students.forEach(function (item, i, students) {
                if (item.actions.hasOwnProperty(eventName)) {
                    item.actions[eventName]();
                }
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
