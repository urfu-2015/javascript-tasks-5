module.exports = function () {
    var events = [];
    return {
        on: function (eventName, person, callback) {
            var event = {
                person: person,
                callback: callback
            };
            if (events[eventName] === undefined) {
                events[eventName] = [];
            }
            events[eventName].push(event);
        },

        off: function (eventName, person) {
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
            var namespace = [eventName];
            while (true) {
                var dote = eventName.lastIndexOf('.');
                if (dote !== -1) {
                    eventName = eventName.slice(0, dote);
                    namespace.push(eventName);
                } else {
                    break;
                }
            }
            namespace.forEach(function (name) {
                if (events[name] !== undefined) {
                    events[name].forEach(function (event) {
                        event.callback.call(event.person);
                    });
                }
            });
        },

        several: function (eventName, student, callback, n) {},

        through: function (eventName, student, callback, n) {}
    };
};
