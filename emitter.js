module.exports = function () {
    return {
        events: {},
        on: function (eventName, student, callback) {
            if (this.events[eventName] === undefined) {
                this.events[eventName] = [];
            }
            var act = {student: student, callback: callback};
            this.events[eventName].push(act);
        },

        off: function (eventName, student) {
            for (var key in this.events) {
                if (key == eventName || (key.indexOf(eventName + '.') == 0)) {
                    for (var i = 0; i < this.events[key].length; i++) {
                        if (this.events[key][i].student == student) {
                            this.events[key].splice(i, 1);
                        }
                    }
                }
            }
        },

        emit: function (eventName) {
            for (var i = 0; i < this.GetEvent(eventName).length; i++) {
                eventName = this.GetEvent(eventName)[i];
                if (this.events[eventName] !== undefined) {
                    var eventsGroup = this.events[eventName];
                    for (var j = 0; j < eventsGroup.length; j++) {
                        eventsGroup[j].callback.call(eventsGroup[j].student);
                    }
                }
            }
        },
        GetEvent: function (eventName) {
            var eventNames = [eventName];
            while (eventName.indexOf('.') > 0) {
                var lastDotIndex = eventName.lastIndexOf('.');
                eventName = eventName.slice(0, lastDotIndex);
                eventNames.push(eventName);
            }
            return eventNames;
        },
        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
