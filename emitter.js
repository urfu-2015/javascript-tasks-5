module.exports = function () {
    var events = {};
    return {
        on: function (eventName, student, callback) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push({student, callback});
        },

        off: function (eventName, student) {
            if (events[eventName]) {
                for (var i = 0; i < events[eventName].length; i++) {
                    if (student === events[eventName][i].student){
                        events[eventName].splice(i, 1);
                        break;
                    }
                }
            }
        },

        emit: function (eventName) {
            if (events[eventName]) {
                events[eventName].forEach(entry => {
                    if (entry.regularity) {
                        if (++entry.counter % entry.regularity !== 0) {
                            return;
                        }
                    }
                    entry.callback.call(entry.student);
                    if (entry.repeat) {
                        if (--entry.repeat === 0) {
                            this.off(eventName, entry.student)
                        }
                    }
                });
            }
        },

        several: function (eventName, student, callback, n) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            var repeat = n;
            events[eventName].push({student, callback, repeat});
        },

        through: function (eventName, student, callback, n) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            var regularity = n;
            var counter = 0;
            events[eventName].push({student, callback, regularity, counter});
        }
    };
};
