module.exports = function () {
    return {
        emitOn: {},
        counters: {},
        on: function (eventName, student, callback) {
            var levelEvents = eventName.split('.');
            if (levelEvents.length > 1) {
                this.on(levelEvents[0] + levelEvents[1], student, callback);
                return;
            }
            var studentsOn = this.emitOn[eventName];
            var newStudent = {student: student,
                callback: callback};
            if (!studentsOn) {
                this.emitOn[eventName] = [newStudent];
                return;
            }
            if (studentsOn.indexOf(newStudent) < 0) {
                studentsOn.push(newStudent);
            }
        },
        off: function (eventName, student) {
            var levelEvents = eventName.split('.');
            if (levelEvents.length > 1) {
                this.off(levelEvents[0] + levelEvents[1], student);
                return;
            }
            var emitEvents = Object.keys(this.emitOn);
            emitEvents = emitEvents.filter(function (event) {
                return event.search(eventName) > -1;
            });
            emitEvents.forEach(function (eventName) {
                var studentsOn = this.emitOn[eventName];
                if (studentsOn) {
                    this.emitOn[eventName] = studentsOn.filter(function (studentOn) {
                        return studentOn.student != student;
                    });
                }
            }.bind(this));
        },
        emit: function (eventName) {
            var levelEvents = eventName.split('.');
            if (levelEvents.length > 1) {
                this.emit(levelEvents[0]);
                this.emit(levelEvents[0] + levelEvents[1]);
                return;
            }
            var studentsOn = this.emitOn[eventName];
            if (studentsOn) {
                studentsOn.forEach(function (student) {
                    student.callback.call(student.student);
                });
            }
        },
        several: function (eventName, student, callback, n) {
        },
        through: function (eventName, student, callback, n) {

        }
    };
};
