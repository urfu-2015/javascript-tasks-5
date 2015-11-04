module.exports = function () {
    return {
        events: {},
        on: function (eventName, student, callback) {
            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push({student: student, callback: callback});
        },

        off: function (eventName, student) {
            if (!this.events[eventName]) {
                return;
            }
            var keys = Object.keys(this.events);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].indexOf(eventName) != -1) {
                    for (var j = 0; j < this.events[keys[i]].length; j++) {
                        if (this.events[keys[i]][j].student === student) {
                            delete this.events[keys[i]][j];
                        }
                    }
                }
            }
        },

        emit: function (eventName) {
            var keys = Object.keys(this.events);
            var names = [];
            names = [eventName];
            if (eventName.indexOf('.') != -1) {
                names.push(eventName.slice(0, eventName.indexOf('.')));
            }
            var events = this.events;
            names.forEach(function (name) {
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] === name) {
                        callFunction(name, events);
                    }
                }
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
function callFunction(eventName, events) {
    events[eventName].forEach(function (student) {
        if (student !== undefined) {
            student.callback.call(student.student);
        }
    });
}
