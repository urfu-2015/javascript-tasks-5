module.exports = function () {
    return {
        events: {},
        on: function (eventName, student, callback) {
            if (this.events[eventName] === undefined) {
                this.events[eventName] = [];
            }
            var event = {student: student, callback: callback};
            this.events[eventName].push(event);
        },

        off: function (eventName, student) {
            var keys = Object.keys(this.events);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                if (key.indexOf(eventName) === 0) {
                    if (this.events[key] === undefined) {
                        continue;
                    }
                    var offEvent;
                    var events = this.events[key];
                    for (var i = 0; i < events.length; i++) {
                        if (events[i].student === student) {
                            offEvent = events[i];
                        }
                    }
                    if (offEvent) {
                        events = events.splice(events.indexOf(offEvent), 1);
                    }
                }
            }
        },

        emit: function (eventName) {
            var allEventNames = GetEventNames(eventName);
            for (var i = 0; i < allEventNames.length; i++) {
                eventName = allEventNames[i];
                if (this.events[eventName] !== undefined) {
                    var eventsGroup = this.events[eventName];
                    for (var j = 0; j < eventsGroup.length; j++) {
                        eventsGroup[j].callback.call(eventsGroup[j].student);
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};

function GetEventNames(eventName) {
    var eventNames = [eventName];
    while (eventName.indexOf('.') > 0) {
        var lastDotIndex = eventName.lastIndexOf('.');
        eventName = eventName.slice(0, lastDotIndex);
        eventNames.push(eventName);
    }
    return eventNames;
}
