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
            var events = getEvents(eventName);
            if (events.length === 1) {
                for (var j = 0; j < students.length; j++) {
                    if (students[j] !== undefined &&
                        students[j].event === eventName) {
                        students[j].callBack.call(students[j].dataOfStudent);
                    }
                }
            } else {
                for (var j = 0; j < students.length; j++) {
                    if (students[j] !== undefined &&
                            (students[j].event === eventName ||
                            students[j].event.indexOf(events[0]) !== -1)) {
                        students[j].callBack.call(students[j].dataOfStudent);
                    }
                }
            }
        },
        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
