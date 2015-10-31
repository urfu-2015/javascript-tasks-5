module.exports = function () {
    var students = [];
    var subscribedStudents = [];
    return {
        on: function (eventName, student, callback) {
            if (students.indexOf(student) === -1) {
                students.push(student);
                var studentEvents = {}; //словарь событий
                studentEvents[eventName] = callback;
                var newStudent = {
                    data: student,
                    events: studentEvents
                };
                subscribedStudents.push(newStudent);
            } else {
                var index = this.getIndex(student);
                subscribedStudents[index].events[eventName] = callback;
            }
        },

        getIndex: function (student) {
            var index = 0;
            for (var i = 0; i < subscribedStudents.length; i++) {
                var currentStudent = subscribedStudents[i];
                if (currentStudent.data === student) {
                    return i;
                }
            }
            return -1;
        },

        off: function (eventName, student) {
            var index = this.getIndex(student);
            if (index !== -1) {
                var currentStudent = subscribedStudents[index];
                delete currentStudent.events[eventName];
                if (currentStudent.events[eventName]) {
                    delete currentStudent.events[eventName];
                }
            }
        },

        emit: function (eventName) {
            var namespace = this.getNamespace(eventName);
            for (var i = 0; i < subscribedStudents.length; i++) {
                var student = subscribedStudents[i];
                var keys = Object.keys(student.events);
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j] === eventName || keys[j] === namespace) {
                        student.events[keys[j]]();
                    }
                }
            }
        },

        getNamespace: function (eventName) {
            var index = eventName.indexOf('.');
            var namespace = eventName;
            if (index !== -1) {
                namespace = eventName.slice(0, index);
            }
            return namespace;
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
