module.exports = function () {
    var students = [];
    var subscribedStudents = [];
    return {
        on: function (eventName, student, callback) {
            if (students.indexOf(student) === -1) {
                students.push(student);
                var studentEvents = {}; //словарь событий
                studentEvents[eventName] = {
                    func: callback,
                    period: 1,
                    counter: 1, // счетчик, на каком шаге вызываем функцию
                    max: Number.MAX_SAFE_INTEGER // максимальное число вызова функции
                };
                var newStudent = {
                    data: student,
                    events: studentEvents
                };
                subscribedStudents.push(newStudent);
            } else {
                var index = this.getIndex(student);
                var keys = Object.keys(subscribedStudents[index]['events']);
                if (keys.indexOf(eventName) !== -1) {
                    subscribedStudents[index]['events'][eventName]['func'] = callback;
                } else {
                    subscribedStudents[index]['events'][eventName] = {
                        func: callback,
                        period: 1,
                        counter: 1,
                        max: Number.MAX_SAFE_INTEGER
                    };
                }
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
                var keys = Object.keys(currentStudent.events);
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i].indexOf(eventName) !== -1) {
                        delete currentStudent.events[keys[i]];
                    }
                }
            }
        },

        emit: function (eventName) {
            var namespace = this.getNamespace(eventName);
            for (var i = 0; i < subscribedStudents.length; i++) {
                var student = subscribedStudents[i];
                var keys = Object.keys(student.events);
                for (var j = 0; j < keys.length; j++) {
                    var currentEvent = student.events[keys[j]];
                    if (keys[j] === eventName || keys[j] === namespace) {
                        if (currentEvent.max > currentEvent.counter &&
                            currentEvent.counter % currentEvent.period === 0) {
                            currentEvent.func.call(student['data']);
                        }
                        currentEvent.counter += 1;
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
            this.setAdditionalValue(eventName, student, callback, 'max', n);
        },

        through: function (eventName, student, callback, n) {
            this.setAdditionalValue(eventName, student, callback, 'period', n);
        },

        setAdditionalValue: function (eventName, student, callback, nameValue, n) {
            this.on(eventName, student, callback);
            var index = this.getIndex(student);
            var currentStudent = subscribedStudents[index];
            currentStudent.events[eventName][nameValue] = n;
        }
    };
};
