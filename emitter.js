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
            if (this.students.indexOf(student) > -1) {
                for (var event in student.events) {
                    if (student.events.hasOwnProperty(event) && event.indexOf(eventName.split(".")[0]) > -1) {
                        delete student.events[event];
                    }
                }
            }
        },

        emit: function (eventName) {
            var listEvents = eventName.split(".");
            var f = (student) => {
                if (this.students.indexOf(student) > -1 && student.events.hasOwnProperty(listEvents[0])) {
                    student.events[listEvents[0]].apply(student);
                    if (listEvents.length > 1 && student.events.hasOwnProperty(eventName)) {
                        student.events[eventName].apply(student);
                    }
                }
            };
            this.students.forEach(f);
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
