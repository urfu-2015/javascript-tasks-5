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
            Object.keys(events).forEach(_event => {
                for (var i = 0; i < eventName.split('.').length; i++) {
                    if (eventName.split('.')[i] !== _event.split('.')[i]) {
                        return;
                    }
                }
                for (var i = 0; i < events[_event].length; i++) {
                    if (student === events[_event][i].student) {
                        events[_event].splice(i, 1);
                        break;
                    }
                }
            });
        },

        emit: function (eventName) {
            var names = eventName.split('.');
            while (names.length > 0) {
                var name = names.length > 1 ? names.join('.') : names[0];
                names.pop();
                if (events[name]) {
                    events[name].forEach(entry => {
                        if (entry.regularity) {
                            if (++entry.counter % entry.regularity !== 0) {
                                return;
                            }
                        }
                        entry.callback.call(entry.student);
                        if (entry.repeat) {
                            if (--entry.repeat === 0) {
                                this.off(eventName, entry.student);
                            }
                        }
                    });
                }
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
