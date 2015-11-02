module.exports = function () {
    return {
        emitOn: {},
        counters: {},
        on: function (eventName, student, callback) {
            var studentsOn = this.emitOn[eventName];
            var newStudent = {student: student,
                              callback: callback};
            if (studentsOn) {
                studentsOn.push(newStudent);
            } else {
                this.emitOn[eventName] = [newStudent];
            }
        },
        off: function (eventName, student) {
            var studentsOn = this.emitOn[eventName];
            if (studentsOn) {
                this.emitOn[eventName] = studentsOn.filter(function (studentOn) {
                    return studentOn.student != student;
                });
            }
        },
        emit: function (eventName) {
            var studentsOn = this.emitOn[eventName];
            if (studentsOn) {
                studentsOn.forEach(function (student) {
                    student.callback.call(student.student);
                })
            }
        },
        several: function (eventName, student, callback, n) {
        },
        through: function (eventName, student, callback, n) {

        }
    };
};
