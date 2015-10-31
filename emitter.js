module.exports = function () {
    var students = [];
    return {
        on: function (eventName, student, callback) {
            var index = this.findIndex(student);
            if (index === -1) {
                var studentEvents = [];
                studentEvents[eventName] = callback;
                var newStudent = {
                    description: student,
                    events: studentEvents,
                    isUsuall: true
                };
                students.push(newStudent);
            } else {
                students[index].events[eventName] = callback;
            }
        },

        off: function (eventName, student) {
            var index = this.findIndex(student);
            if (index != -1) {
                var events = Object.keys(students[index].events);
                var toDelete = events.filter(function (ev) {
                    var isEqual = ev === eventName;
                    var isContained = ev.indexOf(eventName) != -1;
                    return isEqual || isContained;
                });
                toDelete.forEach(function (ev) {
                    delete students[index].events[ev];
                });
            }
        },

        emit: function (eventName) {
            var namespace = this.getNamespace(eventName);
            students.forEach(function (student) {
                namespace.forEach(function (name) {
                    if (student.hasOwnProperty('isUsuall')) {
                        if (Object.keys(student.events).indexOf(name) != -1) {
                            student.events[name].apply(student.description);
                        }
                    } else {
                        var counts = student.events[name].counts;
                        var called = student.events[name].called;
                        var mod = -1;
                        if (called > 0) {
                            mod = called % counts;
                        }
                        if (student.hasOwnProperty('isThrough') && student.isThrough) {
                            if (mod === 0) {
                                student.events[name].apply(student.description);
                            }
                            student.events[name].called++;
                        }
                        if (student.hasOwnProperty('isSeveral') && student.isSeveral) {
                            if (counts >= called) {
                                student.events[name].apply(student.description);
                                student.events[name].called++;
                            }
                        }
                    }
                });
            });
        },

        several: function (eventName, student, callback, n) {
            this.add(eventName, student, callback, n, true, false);
        },

        through: function (eventName, student, callback, n) {
            this.add(eventName, student, callback, n, false, true);
        },

        add: function (eventName, student, callback, n, isSeveral, isThrough) {
            var index = this.findIndex(student);
            if (index === -1) {
                var studentEvents = [];
                studentEvents[eventName] = callback;
                studentEvents[eventName].counts = n;
                studentEvents[eventName].called = 1;
                var newStudent = {
                    description: student,
                    events: studentEvents,
                    isSeveral: isSeveral,
                    isThrough: isThrough
                };
                students.push(newStudent);
            } else {
                students[index].events[eventName] = callback;
                students[index].events[eventName].counts = n;
                students[index].events[eventName].called = 1;
            }
        },

        getNamespace: function (eventName) {
            var namespace = [];
            namespace.push(eventName);
            while (true) {
                var pointIndex = eventName.lastIndexOf('.');
                if (pointIndex === -1) {
                    break;
                }
                eventName = eventName.slice(0, pointIndex);
                namespace.push(eventName);
            }
            return namespace;
        },

        findIndex: function (student) {
            for (var i = 0; i < students.length; i++) {
                if (students[i].description == student) {
                    return i;
                }
            }
            return -1;
        }
    };
};
