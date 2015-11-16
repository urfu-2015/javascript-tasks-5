module.exports = function () {

    return {
        events: {},
        on: function (eventName, person, callback) {
            var event = {
                person: person,
                callback: callback
            };
            addEvent(this.events, eventName, event);
            return this;
        },

        off: function (eventName, person) {
            if (eventName === '') {
                return false;
            }
            var _this = this.events;
            Object.keys(_this).forEach(function (key) {
                if (key.indexOf(eventName) !== -1) {
                    var changeEvents = _this[key].filter(function (event) {
                        return event.person !== person;
                    });
                    _this[key] = changeEvents;
                }
            });
            this.events = _this;
            return this;
        },

        emit: function (eventName) {
            var namespace = getNamespace(eventName);
            emitEvents(this.events, namespace);
        },

        several: function (eventName, person, callback, n) {
            var count = 0;
            _this = this;
            var newCallback = function () {
                count++;
                if (count <= n) {
                    callback.call(this);
                } else {
                    _this.off(eventName, person);
                }
            };
            this.on(eventName, person, newCallback);
        },

        through: function (eventName, person, callback, n) {
            var count = 0;
            var newCallback = function () {
                count++;
                if (count === n) {
                    callback.call(this);
                    count = 0;
                }
            };
            this.on(eventName, person, newCallback);
        }
    };
};

function emitEvents(eventsList, namespace) {
    namespace.forEach(function (name) {
        if (eventsList.hasOwnProperty(name)) {
            eventsList[name].forEach(function (event) {
                event.callback.call(event.person);
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
