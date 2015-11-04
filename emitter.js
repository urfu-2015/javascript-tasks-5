module.exports = function () {

    function getEvents(event) {
        return event.split('.');
    }

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
            for (var i = 0; i < students.length; i++) {
                if (students[i] !== undefined &&
                    students[i].event.indexOf(eventName) !== -1 &&
                    students[i].dataOfStudent === student) {
                    delete students[i];
                }
            }
        },
        emit: function (eventName) {
            var eventFstLvl = getEvents(eventName)[0];
            var eventSndLvl = getEvents(eventName)[1];
            if (eventSndLvl === undefined) {
                students.forEach(function (student) {
                    if (student !== undefined &&
                        student.event === eventFstLvl) {
                        student.callBack.call(student.dataOfStudent);
                    }
                });
            } else {
                students.forEach(function (student) {
                    if (student !== undefined &&
                            (student.event === eventName ||
                            student.event.indexOf(eventFstLvl) !== -1)) {
                        student.callBack.call(student.dataOfStudent);
                    }
                });
            }
        },
        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
