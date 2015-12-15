module.exports = function () {
    function check_student(student) {
        if (students.indexOf(student) === -1) {
            students.push(student);
        }
        if (!student.hasOwnProperty('methods')) {
            student.methods = {};
        }
        if (!student.hasOwnProperty('allSeveral')) {
            student.allSeveral = {};
        }
        if (!student.hasOwnProperty('allThrough')) {
            student.allThrough = {};
            student.nowThrough = {};
        }
    }

    var students = [];
    return {
        on: function (eventName, student, callback) {
            check_student(student);
            student.methods[eventName] = callback;
        },

        off: function (eventName, student) {
            var arryEvent = eventName.split('.');
            var events = [];
            if (students.indexOf(student) > -1) {
                if (arryEvent.length > 1) {
                    events.push(eventName);
                } else {
                    var methods = Object.keys(student.methods);
                    methods.forEach(function (item) {
                        if (item.startsWith(arryEvent[0])) {
                            events.push(item);
                        }
                    });
                }
                events.forEach(function (event) {
                    if (student.methods.hasOwnProperty(event)) {
                        delete student.methods[event];
                    }
                });
            }

        },

        emit: function (eventName) {
            var arryEvent = eventName.split('.');
            students.forEach(function (student) {
                var event = '';
                arryEvent.forEach(function (item) {
                    event += item;
                    if (student.methods.hasOwnProperty(event)) {

                        if (student.allThrough.hasOwnProperty(event)) {
                            student.nowThrough[eventName] += 1;
                            if (student.nowThrough[eventName] === student.allThrough[eventName]) {
                                student.methods[event].call(student);
                                student.nowThrough[eventName] = 0;
                            }

                        } else if (student.allSeveral.hasOwnProperty(event)) {
                            var several = student.allSeveral[event];
                            if (several !== 0) {
                                student.methods[event].call(student);
                                student.allSeveral[event] -= 1;
                            }
                        } else {
                            student.methods[event].call(student);
                        }
                    }
                    event += '.';
                });
            });
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            student.allSeveral[eventName] = n;

        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            student.allThrough[eventName] = n;
            student.nowThrough[eventName] = 0;
        }
    };
};
