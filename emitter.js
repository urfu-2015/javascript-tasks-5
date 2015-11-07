module.exports = function () {
    var subscribedStudents = [];
    return {
        on: function (eventName, student, callback) {
            var currentStudent = this.getStudent(student);
            var _event = {
                callback: callback,
                period: 1,
                counter: 1,
                max: Number.MAX_SAFE_INTEGER
            };
            if (Object.keys(currentStudent).length === 0) {
                var studentEvents = {};
                studentEvents[eventName] = _event;
                subscribedStudents.push(
                    {
                        ctx: student,
                        events: studentEvents
                    }
                );
            } else {
                currentStudent.events[eventName] = _event;
            }
        },

        getStudent: function (student) {
            for (var i = 0; i < subscribedStudents.length; i++) {
                if (subscribedStudents[i].ctx === student) {
                    return subscribedStudents[i];
                }
            }
            return {};
        },

        off: function (eventName, student) {
            var currentStudent = this.getStudent(student);
            if (Object.keys(currentStudent).length !== 0) {
                var events = Object.keys(currentStudent.events);
                for (var i = 0; i < events.length; i++) {
                    if (events[i].indexOf(eventName) !== -1) {
                        delete currentStudent.events[events[i]];
                    }
                }
            }
        },

        emit: function (eventName) {
            var namespaces = this.getNamespaces(eventName);
            for (var i = 0; i < subscribedStudents.length; i++) {
                var student = subscribedStudents[i];
                var events = Object.keys(student.events);
                for (var j = 0; j < events.length; j++) {
                    var _event = student.events[events[j]];
                    if (events[j] === eventName || namespaces.indexOf(events[j]) !== -1) {
                        if (_event.max > _event.counter &&
                            _event.counter % _event.period === 0) {
                            _event.callback.call(student['ctx']);
                        }
                        _event.counter += 1;
                    }
                }
            }
        },

        getNamespaces: function (eventName) {
            var namespaces = [];
            var index = eventName.lastIndexOf('.');
            while (index !== -1) {
                var namespace = eventName.slice(0, index);
                namespaces.push(namespace);
                index = namespace.lastIndexOf('.');
            }
            return namespaces;
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            var currentStudent = this.getStudent(student);
            currentStudent.events[eventName]['max'] = n;
        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            var currentStudent = this.getStudent(student);
            currentStudent.events[eventName]['period'] = n;
        }
    };
};
