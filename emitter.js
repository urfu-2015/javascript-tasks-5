module.exports = function () {
    var events = {};
    var emitEvent = function (eventName) {
        if (!events.hasOwnProperty(eventName) || events[eventName].length === 0) {
            return;
        }
        var subscribers = events[eventName];
        subscribers.forEach(function (student) {
            student.emitCounter++;
            if ((student.emitFrequency === 1 && student.emitCounter <= student.maxEmit) ||
                (student.emitFrequency > 1 &&
                (student.emitCounter % student.emitFrequency === 0))) {
                student.callback.call(student.studentObject);
            }
            if (student.emitCounter < student.maxEmit) {
                this.off(eventName, student);
            }
        }, this);
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
        on: function (eventName, student, callback, maxEmit, emitFrequency) {
            maxEmit = maxEmit || Number.MAX_SAFE_INTEGER;
            emitFrequency = emitFrequency || 1;
            addSubscriber(eventName, student, {
                studentObject: student,
                callback: callback,
                emitCounter: 0,
                maxEmit: maxEmit,
                emitFrequency: emitFrequency
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
            if (n > 0) {
                this.on(eventName, student, callback, n, 1);
            }
        },

        through: function (eventName, student, callback, n) {
            if (n > 0) {
                this.on(eventName, student, callback, Number.MAX_SAFE_INTEGER, n);
            }
        }
    };
};
