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
                    events: studentEvents
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
                /*for (var i = 0; i < events.length; i++) {
                    if (eventName.indexOf(events[i]) != -1 || events[i] === eventName) {
                        console.log('hey');
                        delete students[index].events[events[i]];
                    }
                }*/
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
                    if (Object.keys(student.events).indexOf(name) != -1) {
                        student.events[name].apply(student.description);
                    }
                });
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

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
        },

        print: function (student) {
            var index = this.findIndex(student);
            if (index != -1) {
                console.log(students[index].events);
            }
        }
    };
};
