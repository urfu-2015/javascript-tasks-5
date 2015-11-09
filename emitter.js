module.exports = function () {
    var events = {};
    var eventInit = eventName => {
        if (!events[eventName]) {
            events[eventName] = [];
        }
    };
    return {
        on: (eventName, student, callback) => {
            eventInit(eventName);
            events[eventName].push({student, callback});
        },

        off: (eventName, student) => {
            Object.keys(events).forEach(_eventName => {
                for (var i = 0; i < eventName.split('.').length; i++) {
                    if (eventName.split('.')[i] !== _eventName.split('.')[i]) {
                        return;
                    }
                }
                for (var i = 0; i < events[_eventName].length; i++) {
                    if (student === events[_eventName][i].student) {
                        events[_eventName].splice(i, 1);
                        break;
                    }
                }
            });
        },

        emit: (eventName) => {
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

        several: (eventName, student, callback, n) => {
            eventInit(eventName);
            var repeat = n;
            events[eventName].push({student, callback, repeat});
        },

        through: (eventName, student, callback, n) => {
            eventInit(eventName);
            var regularity = n;
            var counter = 0;
            events[eventName].push({student, callback, regularity, counter});
        }
    };
};
