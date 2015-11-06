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
                        if (this.events[keys[i]][j] &&
                                this.events[keys[i]][j].student === student) {
                            delete this.events[keys[i]][j];
                        }
                    }
                }
            }
        },

        emit: function (eventName) {
            var keys = Object.keys(this.events);
            var names = eventName.split('.');
            var events = this.events;
            keys.forEach(function (key) {
                if (key === names[0]) {
                    events[key].forEach(function (student) {
                        student.callback.call(student.student);
                    });
                }
                if (key.indexOf(names[1]) !== -1 && key.indexOf(names[1]) !== 0) {
                    events[key].forEach(function (student) {
                        student.callback.call(student.student);
                    });
                }
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
