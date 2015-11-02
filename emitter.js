module.exports = function () {
    var students = [];
    return {
        on: function (eventName, student, callback) {
            var newStudent = {
                dataOfStudent: student,
                event: eventName,
                callBack: callback
            };
            students.push(newStudent);
        },

        off: function (eventName, student) {
            var index;
            for (var i = 0; i < students.length; i++) {
                if (students[i] !== undefined &&
                    students[i].event === eventName &&
                    students[i].dataOfStudent === student) {
                    index = i;
                }
            }
            delete students[index];
        },

        emit: function (eventName) {
            for (var j = 0; j < students.length; j++) {
                if (students[j] !== undefined &&
                    students[j].event === eventName) {
                    students[j].callBack.call(students[j].dataOfStudent);
                }
            }
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
