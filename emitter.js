module.exports = function () {
    var subsribers = {};

    var emitEvent = function (eventName) {
        var eventSubscribers = subsribers[eventName];
        if (!eventSubscribers) {
            return;
        }
        for (var i = 0; i < eventSubscribers.length; i++) {
            var subsriber = eventSubscribers[i];
            if (subsriber.emitCounter) {
                subsriber.emitCounter++;
            }
            if (!subsriber.emitEvery) {
                subsriber.callback.apply(subsriber.object);
            } else {
                if (subsriber.emitCounter === subsriber.emitEvery) {
                    subsriber.callback.apply(subsriber.object);
                    subsriber.emitCounter = 0;
                }
            }
            if (subsriber.emitLimit &&
                subsriber.emitCounter === subsriber.emitLimit
            ) {
                unsubscribe(eventName, subsriber.object);
            }
        }
    };

    var unsubscribe = function (eventName, student) {
        var eventSubscribers = subsribers[eventName];
        for (var i = 0; i < eventSubscribers.length; i++) {
            if (eventSubscribers[i].object === student) {
                eventSubscribers.splice(i, 1);
                i--;
            }
        }
    };

    var addSubsriber = function (eventName, subsriber) {
        if (!subsribers[eventName]) {
            subsribers[eventName] = [];
        }
        subsribers[eventName].push(subsriber);
    };

    return {
        on: function (eventName, student, callback) {
            var subsriber = {
                object: student,
                callback: callback
            };
            addSubsriber(eventName, subsriber);
        },

        off: function (eventName, student) {
            var events = Object.keys(subsribers);
            for (var i = 0; i < events.length; i++) {
                if (events[i].startsWith(eventName)) {
                    unsubscribe(events[i], student);
                }
            }
        },

        emit: function (eventName) {
            var namespaceParts = eventName.split('.');
            var event = '';
            for (var i = 0; i < namespaceParts.length; i++) {
                event += namespaceParts[i];
                emitEvent(event);
                event += '.';
            }
        },

        several: function (eventName, student, callback, n) {
            if (n <= 0) {
                return;
            }
            var subsriber = {
                object: student,
                callback: callback,
                emitCounter: 0,
                emitLimit: n
            };
            addSubsriber(eventName, subsriber);
        },

        through: function (eventName, student, callback, n) {
            if (n <= 0) {
                return;
            }
            var subsriber = {
                object: student,
                callback: callback,
                emitCounter: 0,
                emitEvery: n
            };
            addSubsriber(eventName, subsriber);
        }
    };
};
