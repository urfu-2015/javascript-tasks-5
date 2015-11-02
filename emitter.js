
module.exports = function () {
    var eventsOfStudents = [];
    return {
        on: function (eventName, student, callback) {
            var event = {
                name: eventName,
                student: student,
                callback: callback
            };
            eventsOfStudents.push(event);

        },

        off: function (eventName, student) {
            var newEventsOfStudents = [];
            eventsOfStudents.forEach(function (event) {
                if (event.name.indexOf(eventName) < 0 || student != event.student) {
                    newEventsOfStudents.push(event);
                    }
                });
            eventsOfStudents = newEventsOfStudents.slice();
        },

        emit: function (eventName) {
            eventsOfStudents.forEach(function (student) {
                if (student.name === eventName) {
                    student.callback.call(student);
                }
                var mainEvent = eventName.split('.')[0];
                if (mainEvent !== eventName && student.name === eventName) {
                    student.callback.call(student);
                }
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
