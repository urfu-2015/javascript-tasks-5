module.exports = function () {
    var events = {};
    return {
        on: function (eventName, student, callback, n, typeName) {
            if (!events.hasOwnProperty(eventName)) {
                events[eventName] = [];
            }
            if (typeName === undefined) {
                events[eventName].push({student: student, callback: callback});
            } else {
                events[eventName].push({student: student, callback: callback, typeName: typeName, n: n, iteration: 1});
            }
        },

        off: function (eventName, student) {
            Object.keys(events).forEach(function (event) {
                if (event === eventName || event.indexOf(eventName + '.')) {
                    Object.keys(events[event]).forEach(function (index) {
                        if (events[event][index].student === student) {
                            events[event].splice(index, 1);
                        }
                    });
                }
            });
        },

        emit: function (eventName) {
            function createListOfEvents() {
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
            var listOfEvents = createListOfEvents();
            Object.keys(listOfEvents.reverse()).forEach(function (event) {
                var ev = listOfEvents[event];
                if (events[ev] !== undefined) {
                    Object.keys(events[ev]).forEach(function (index) {
                        var item = events[ev][index];
                        if (item.typeName === undefined) {
                            item.callback.call(events[ev][index].student);
                        } else if (item.typeName === "several" && item.n > 0) {
                            item.callback.call(events[ev][index].student);
                            item.n--;
                        } else if (item.typeName === "through") {
                            if (item.iteration % item.n === 0) {
                                item.callback.call(events[ev][index].student);
                            }
                            item.iteration++;
                        }
                    });
                }
            });
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback, n, "several");
        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback, n, "through");
        }
    };
};
