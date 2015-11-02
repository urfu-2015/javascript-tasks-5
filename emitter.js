module.exports = function () {
    var subsribers = {};

    var emitEvent = function (eventName) {
        var eventSubscribers = subsribers[eventName];
        if (eventSubscribers === undefined) {
            return;
        }
        for (var i = 0; i < eventSubscribers.length; i++) {
            var subsriber = eventSubscribers[i];
            (subsriber.callback.bind(subsriber.object))();
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

    return {
        on: function (eventName, student, callback) {
            var subsriber = {
                object: student,
                callback: callback
            };
            if (subsribers[eventName] === undefined) {
                subsribers[eventName] = [];
            }
            subsribers[eventName].push(subsriber);
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

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
