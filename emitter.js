module.exports = function () {
    var eventSubscriptions = {};
    return {
        on: function (eventName, student, callback) {
            eventSubscriptions[eventName] = eventSubscriptions[eventName] || [];
            eventSubscriptions[eventName].push({
                student: student,
                callback: callback
            });
        },

        off: function (eventName, student) {
            var eventNames = getEventNames(eventName);
            for (var i = 0; i < eventNames.length; i++) {
                unsubscribeStudentFromEvent(eventNames[i], student);
            }
        },

        emit: function (eventName) {
            var eventNames = splitEventName(eventName);
            for (var i = 0; i < eventNames.length; i++) {
                emitEvent(eventNames[i]);
            }
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };

    function splitEventName(eventName) {
        var eventNameParts = eventName.split('.');
        if (!eventNameParts.length) {
            return [];
        }
        var tempEventName = eventNameParts[0];
        var eventNames = [eventNameParts[0]];
        for (var i = 1; i < eventNameParts.length; i++) {
            tempEventName += '.' + eventNameParts[i];
            eventNames.push(tempEventName);
        }

        return eventNames.reverse();
    }

    function emitEvent(eventName) {
        var subscriptions = eventSubscriptions[eventName];
        if (!subscriptions) {
            return;
        }
        for (var i = 0; i < subscriptions.length; i++) {
            subscriptions[i].callback.call(subscriptions[i].student);
        }
    }

    function getEventNames(prefix) {
        var eventNames = [prefix];
        for (var key in eventSubscriptions) {
            if (key.indexOf(prefix + '.') === 0) {
                eventNames.push(key);
            }
        }
        return eventNames;
    }

    function unsubscribeStudentFromEvent(eventName, student) {
        var oldSubscriptions = eventSubscriptions[eventName];
        if (oldSubscriptions) {
            var newSubscriptions = [];
            for (var i = 0; i < oldSubscriptions.length; i++) {
                if (oldSubscriptions[i].student !== student) {
                    newSubscriptions.push(oldSubscriptions[i]);
                }
            }
            eventSubscriptions[eventName] = newSubscriptions;
        }
    }
};

