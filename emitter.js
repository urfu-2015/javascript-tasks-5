module.exports = function () {
    return {
        events: {},
        on: function (eventName, person, callback) {
            var event = {
                person: person,
                callback: callback
            };
            addEvent(this.events, eventName, event);
        },

        off: function (eventName, person) {
            if (eventName === '') {
                return false;
            }
            var _this = this.events;
            Object.keys(_this).forEach(function (key) {
                console.log(this.events);
                if (key.indexOf(eventName) !== -1) {
                    var changeEvents = _this[key].filter(function (event) {
                        return event.person !== person;
                    });
                    _this[key] = changeEvents;
                }
            });

            this.events = _this;
        },

        emit: function (eventName) {
            var namespace = getNamespace(eventName);
            emitEvents(this.events, namespace);
        },

        several: function (eventName, person, callback, n) {
            var event = {
                person: person,
                callback: callback,
                several: n
            };
            addEvent(this.events, eventName, event);
        },

        through: function (eventName, person, callback, n) {
            var event = {
                person: person,
                callback: callback,
                through: n,
                current: 1
            };
            addEvent(this.events, eventName, event);
        }
    };
};

function emitEvents(eventsList, namespace) {
    namespace.forEach(function (name) {
        if (eventsList.hasOwnProperty(name)) {
            eventsList[name].forEach(function (event) {
                var isSeveral = event.hasOwnProperty('several');
                var isThrough = event.hasOwnProperty('through');
                if (isSeveral && event.several > 0) {
                    event.callback.call(event.person);
                    --event.several;
                }
                if (isThrough) {
                    if (event.current % event.through === 0) {
                        event.callback.call(event.person);
                    }
                    ++event.current;
                }
                if (!isSeveral && !isThrough) {
                    event.callback.call(event.person);
                }
            });
        }
    });
}

function addEvent(eventsList, eventName, event) {
    if (!eventsList.hasOwnProperty(eventName)) {
        eventsList[eventName] = [];
    }
    eventsList[eventName].push(event);
}

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
