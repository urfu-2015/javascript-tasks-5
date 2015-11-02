module.exports = function () {
    var students = [];
    var events = {};
    return {
        on: function (eventName, student, callback) {
            if (students.indexOf(student) === -1) {
                var numberOfStudent = students.length - 1;
                events[eventName] = callback;
                var newStudent = {
                    name: student;
                    event: events;
                }
                students.push(newStudent);
            }
            else {
                var index = this.findIndex(student);
                students[index].event[eventName] = callback;
            }
        },

        off: function (eventName, student) {
            var removeEvents = eventName.split('.');
            
        },

        emit: function (eventName) {

        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
