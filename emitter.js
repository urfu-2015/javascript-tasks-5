module.exports = function () {
    var events = {};
    var emitEvent = function (eventName) {
        if (!events.hasOwnProperty(eventName) || events[eventName].length === 0) {
            return;
        }
        var subscribers = events[eventName];
        subscribers.forEach(function (student) {
            student.callback.call(student.studentObject);
        });
    };

    var deleteSubscriber = function (eventName, student) {
        var eventStudents = events[eventName];
        for (var i = eventStudents.length - 1; i >= 0; i--) {
            if (eventStudents[i].studentObject === student) {
                eventStudents.splice(i, 1);
            }
        }
    };

    var addSubscriber = function (eventName, student, subscriber) {
        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = [];
        }
        events[eventName].push(subscriber);
    };

    return {
        on: function (eventName, student, callback) {
            addSubscriber(eventName, student, {
                studentObject: student,
                callback: callback
            });
        },

        off: function (eventName, student) {
            if (!events.hasOwnProperty(eventName)) {
                return;
            }
            var eventsNames = Object.keys(events);
            for (var i = 0; i < eventsNames.length; i++) {
                if (eventsNames[i].indexOf(eventName) === 0) {
                    deleteSubscriber(eventsNames[i], student);
                }
            }
        },

        emit: function (eventName) {
            var parsedName = eventName.split('.');
            var currentEvent = '';
            for (var i = 0; i < parsedName.length; i++) {
                currentEvent += parsedName[i];
                emitEvent.call(this, currentEvent);
                currentEvent += '.';
            }
        },

        several: function (eventName, student, callback, n) {
            var severalCallback = function () {
                if (n > 0) {
                    callback.call(student);
                    n--;
                } else {
                    deleteSubscriber(eventName, student);
                }
            };
            this.on(eventName, student, severalCallback);
        },

        through: function (eventName, student, callback, n) {
            var emitCounter = 0;
            var throughCallback = function () {
                emitCounter++;
                if (emitCounter % n === 0) {
                    callback.call(student);
                }
            };
            this.on(eventName, student, throughCallback);
        }
    };
};
