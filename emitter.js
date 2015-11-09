module.exports = function () {
    return {
        students: [],
        on: function (eventName, student, callback) {
            if (this.students.indexOf(student) < 0) {
                student.events = {};
                this.students.push(student);
            }
            student.events[eventName] = callback;
        },

        off: function (eventName, student) {
            if (this.students.indexOf(student) < 0) {
                return;
            }
            delete student.events[eventName];
            var steps = eventName.split('.');
            for (var event in student.events) {
                if (student.events.hasOwnProperty(event) && steps.length == 1 &&
                    event.indexOf(steps[0]) > -1) {
                    delete student.events[event];
                }
            }
        },

        emit: function (eventName) {
            var listEvents = eventName.split('.');
            this.students.forEach(student => {
                if (this.students.indexOf(student) > -1 &&
                    student.events.hasOwnProperty(listEvents[0])) {
                student.events[listEvents[0]].apply(student);
                }
                if (listEvents.length > 1 && student.events.hasOwnProperty(eventName)) {
                    student.events[eventName].apply(student);
                }
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
