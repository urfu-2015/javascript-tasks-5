module.exports = function () {
    var events = {};
    var _emitEvent = function (eventName) {
        if (!events.hasOwnProperty(eventName) || events[eventName].length === 0) {
            return;
        }
        var subscribers = events[eventName];
        for (var i = 0; i < subscribers.length; i++) {
            var student = subscribers[i];
            student.emitCounter++;
            if (student.emitFrequency === 1 && student.maxEmit === Number.MAX_SAFE_INTEGER) {
                student.callback.call(student.studentObject);
                continue;
            }
            if (student.emitFrequency > 1 && (student.emitCounter % student.emitFrequency === 0)) {
                student.callback.call(student.studentObject);
                continue;
            }
            if (student.emitCounter <= student.maxEmit) {
                student.callback.call(student.studentObject);
            }
        }
    };

    var _deleteSubscriber = function (eventName, student) {
        var eventStudents = events[eventName];
        for (var i = eventStudents.length - 1; i >= 0; i--) {
            if (eventStudents[i].studentObject === student) {
                eventStudents.splice(i, 1);
            }
        }
    };

    var _addSubscriber = function (eventName, student, subscriber) {
        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = [];
        }
        if (!events[eventName].hasOwnProperty(student)) {
            events[eventName].push(subscriber);
        }
    };

    return {
        on: function (eventName, student, callback) {
            var subscriber = {
                studentObject: student,
                callback: callback,
                emitCounter: 0,
                maxEmit: Number.MAX_SAFE_INTEGER,
                emitFrequency: 1
            };
            _addSubscriber(eventName, student, subscriber);
        },

        off: function (eventName, student) {
            if (!events.hasOwnProperty(eventName)) {
                return;
            }
            var eventsNames = Object.keys(events);
            for (var i = 0; i < eventsNames.length; i++) {
                if (eventsNames[i].indexOf(eventName) === 0) {
                    _deleteSubscriber(eventsNames[i], student);
                }
            }
        },

        emit: function (eventName) {
            var parsedName = eventName.split('.');
            var currentEvent = '';
            for (var i = 0; i < parsedName.length; i++) {
                currentEvent += parsedName[i];
                _emitEvent(currentEvent);
                currentEvent += '.';
            }
        },

        several: function (eventName, student, callback, n) {
            var subscriber = {
                studentObject: student,
                callback: callback,
                emitCounter: 0,
                maxEmit: n,
                emitFrequency: 1
            };
            _addSubscriber(eventName, student, subscriber);
        },

        through: function (eventName, student, callback, n) {
            var subscriber = {
                studentObject: student,
                callback: callback,
                emitCounter: 0,
                maxEmit: Number.MAX_SAFE_INTEGER,
                emitFrequency: n
            };
            _addSubscriber(eventName, student, subscriber);
        }
    };
};

