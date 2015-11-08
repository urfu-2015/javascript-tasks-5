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
            var _this = this;
            var keys = Object.keys(this.events);
            Object.keys(this.events).forEach(function (key) {
                if (key.indexOf(eventName + '.') === 0 || key === eventName) {
                    var offEvent;
                    var events = _this.events[key];
                    for (var i = 0; i < events.length; i++) {
                        if (events[i].student === student) {
                            offEvent = events[i];
                            break;
                        }
                    }
                    if (offEvent) {
                        events = events.splice(events.indexOf(offEvent), 1);
                    }
                }
            });
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
