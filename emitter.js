module.exports = function () {
    var events = {};
    return {
        on: function (eventName, person, callback) {
            var event = {
                person: person,
                callback: callback
            };
            if (!events.hasOwnProperty(eventName)) {
                events[eventName] = [];
            }
            events[eventName].push(event);
        },

        off: function (eventName, person) {
            if (eventName === '') {
                return false;
            }
            Object.keys(events).forEach(function (key) {
                if (key.indexOf(eventName) !== -1) {
                    var changeEvents = events[key].filter(function (event) {
                        return event.person !== person;
                    });
                    events[key] = changeEvents;
                }
            });
        },

        emit: function (eventName) {
            var namespace = getNamespace(eventName);
            namespace.forEach(function (name) {
                if (events.hasOwnProperty(name)) {
                    events[name].forEach(function (event) {
                        if (event.hasOwnProperty('several') && event.several > 0) {
                            event.callback.call(event.person);
                            --event.several;
                        }
                        if (event.hasOwnProperty('through') &&
                            event.current % event.through === 0) {
                            event.callback.call(event.person);
                            ++event.current;
                        } else {
                            ++event.current;
                        }
                        if (!event.hasOwnProperty('several') &&
                            !event.hasOwnProperty('through')) {
                            event.callback.call(event.person);
                        }
                    });
                }
            });
        },

        several: function (eventName, person, callback, n) {
            var event = {
                person: person,
                callback: callback,
                several: n
            };
            if (!events.hasOwnProperty(eventName)) {
                events[eventName] = [];
            }
            events[eventName].push(event);
        },

        through: function (eventName, person, callback, n) {
            var event = {
                person: person,
                callback: callback,
                through: n,
                current: 1
            };
            if (!events.hasOwnProperty(eventName)) {
                events[eventName] = [];
            }
            events[eventName].push(event);
        }
    };
};

function getNamespace(name) {
    var namespace = [name];
    while (true) {
        var dote = name.lastIndexOf('.');
        if (dote !== -1) {
            name = name.slice(0, dote);
            namespace.push(name);
        } else {
            break;
        }
    }
    return namespace;
}
