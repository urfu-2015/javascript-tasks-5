module.exports = function () {
    return {
        events: {},
        on: function (eventName, student, callback) {
            if (this.events[eventName] !== undefined) {
                this.events[eventName].push({student: student, callback: callback});
            } else {
                this.events[eventName] = [{student: student, callback: callback}];
            }
        },

        off: function (eventName, student) {
            var event = this.events[eventName];
            if (event !== undefined) {
                for (var i = 0; i < event.length; i++) {
                    if (event[i].student === student) {
                        event = event.slice(0,
                                event.indexOf(event[i])).concat(event.slice(event.indexOf(event[i])+1,
                                event.length))
                        this.events[eventName] = event;
                        return;
                    }
                }
            }
        },

        emit: function (eventName) {
            var indexOfEvent = Object.keys(this.events).indexOf(eventName);
            if (indexOfEvent !== -1) {
                var eventNames = '';
                var names = [];
                if (eventName.indexOf('.') != -1) {
                    var names = [eventName];
                    }
                while (eventName.indexOf('.') != -1) {
                    eventNames = eventName.slice(0,
                                eventName.indexOf('.'))+":"+(eventName.slice(eventName.indexOf('.')+1,
                                eventName.length))
                    eventName = eventName.slice(eventName.indexOf('.')+1,
                                eventName.length)
                }
                names.push(eventNames.split(':'));
                names.forEach(function(eventName) {
                        var event = this.events[eventName];
                        for (var i = 0; i < event.length; i++) {
                            event[i].callback.call(event[i].student);
                        }
                    });
                }
            
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};

