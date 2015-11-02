module.exports = function () {
    var subsribers = {};

    var emitEvent = function (eventName) {
        var eventSubscribers = subsribers[eventName];
        if (eventSubscribers === undefined) {
            return;
        }
        for (var i = 0; i < eventSubscribers.length; i++) {
            var subsriber = eventSubscribers[i];
            subsriber.emitCounter++;
            if (subsriber.type !== 'through') {
                (subsriber.callback.bind(subsriber.object))();
            } else {
                if (subsriber.type === 'through' &&
                    subsriber.emitCounter === subsriber.emitEvery
                ) {
                    (subsriber.callback.bind(subsriber.object))();
                    subsriber.emitCounter = 0;
                }
            }
            if (subsriber.type === 'several' &&
                subsriber.emitCounter == subsriber.emitLimit
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
            }
        }
    };

    var addSubsriber = function (eventName, subsriber) {
        if (subsribers[eventName] === undefined) {
            subsribers[eventName] = [];
        }
        subsribers[eventName].push(subsriber);
    };

    return {
        on: function (eventName, student, callback) {
            var subsriber = {
                object: student,
                callback: callback,
                type: 'always',
                emitCounter: 0
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
            var subsriber = {
                object: student,
                callback: callback,
                type: 'several',
                emitCounter: 0,
                emitLimit: n
            };
            addSubsriber(eventName, subsriber);
        },

        through: function (eventName, student, callback, n) {
            var subsriber = {
                object: student,
                callback: callback,
                type: 'through',
                emitCounter: 0,
                emitEvery: n
            };
            addSubsriber(eventName, subsriber);
        }
    };
};
