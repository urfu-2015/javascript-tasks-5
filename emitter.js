module.exports = function () {
    var events = {};
    function chechHasEvent(eventName) {
        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = [];
        }
    }
    return {
        on: function (eventName, student, callback) {
            chechHasEvent(eventName);
            events[eventName].push({
                student: student,
                callback: callback,
                launch: function () {
                    this.callback();
                },
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
                        events[ev][index].launch();
                    });
                }
            });
        },

        several: function (eventName, student, callback, n) {
            chechHasEvent(eventName);
            events[eventName].push({
                student: student,
                callback: callback,
                launch: function () {
                    if (this.n > 0) {
                        this.callback();
                        this.n--;
                    }
                },
                n: n
            });
        },

        through: function (eventName, student, callback, n) {
            chechHasEvent(eventName);
            events[eventName].push({
                student: student,
                callback: callback,
                launch: function () {
                    if (this.iteration % this.n === 0) {
                        this.callback();
                    }
                    this.iteration++;
                },
                n: n,
                iteration: 1
            });
        }
    };
};
