module.exports = function () {
    var events = {};
    function getEventStoradge(eventName) {
        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = [];
        }
        return events[eventName];
    }
    function createListOfEvents(eventName) {
        var name = '';
        var listOfEvents = [];
        for (var event of eventName.split('.')) {
            if (name !== '') {
                name += '.' + event;
            } else {
                name = event;
            }
            listOfEvents.push(name);
        }
        return listOfEvents;
    }
    return {
        on: function (eventName, student, callback, iteration) {
            events[eventName] = getEventStoradge(eventName);
            events[eventName].push({
                student: student,
                callback: callback,
                iteration: iteration
            });
        },

        off: function (eventName, student) {
            Object.keys(events).forEach(function (event) {
                if (event === eventName || event.indexOf(eventName + '.') === 0) {
                    Object.keys(events[event]).forEach(function (index) {
                        if (events[event][index].student === student) {
                            events[event].splice(index, 1);
                        }
                    });
                }
            });
        },

        emit: function (eventName) {
            var listOfEvents = createListOfEvents(eventName);
            Object.keys(listOfEvents.reverse()).forEach(function (event) {
                var ev = listOfEvents[event];
                if (events[ev] !== undefined) {
                    Object.keys(events[ev]).forEach(function (index) {
                        events[ev][index].callback.call(events[ev][index].student);
                    });
                }
            });
        },

        several: function (eventName, student, callback, n) {
            var newCallback = function(student) {
                if (this.n > 0 ) {
                    callback.call(student);
                    this.n--;
                } else {
                    this.off(eventName, student);
                }
            };
            this.on(eventName, student, newCallback);
        },

        through: function (eventName, student, callback, n) {
            var newCallback = function(student) {
                if (this.iteration === this.n) {
                    this.callback.call(student);
					this.iteration = 0;
                }
                this.iteration++;
            };
            this.on(eventName, student, newCallback, 1);
        }
    };
};
