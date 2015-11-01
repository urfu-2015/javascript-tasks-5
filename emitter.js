module.exports = function () {
    var events = {};
    return {
        on: function (eventName, student, callback) {
            eventName = getEventName(eventName);
            addToEvent(events, eventName, student, callback);
        },

        off: function (eventName, student) {
            eventName = getEventName(eventName);
            removeFromEvent(events, eventName, student);
        },

        emit: function (eventName) {
            eventName = getEventName(eventName);
            var curObj = events;

            eventName.forEach(function (item) {
                if (curObj.hasOwnProperty(item)) {
                    curObj = curObj[item];
                    curObj.subscribers.forEach(function (item) {
                        item[1].call(item[0]);
                    });
                }
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};

function getEventName(event) {
    return event.split('.');
}

function addToEvent(events, eventName, student, callback) {
    var curObj = events;

    for (var i = 0; i < eventName.length; i++) {
        if (!curObj.hasOwnProperty(eventName[i])) {
            curObj[eventName[i]] = {
                subscribers: []
            };
        }
        curObj = curObj[eventName[i]];
        if (i === eventName.length - 1) {
            curObj.subscribers.push([student, callback]);
        }
    }
}

function removeFromEvent(events, eventName, student) {
    var curObj = events;

    eventName.forEach(function (item) {
        curObj = curObj[item];
    });
    removeSubEvents(curObj, student);
}

function removeSubEvents(event, student) {
    Object.keys(event).forEach(function (item) {
        if (typeof event[item] === 'object' && item !== 'subscribers') {
            removeSubEvents(event[item], student);
        }
    });
    var clearedSubscribers = [];
    event.subscribers.forEach(function (item) {
        if (!item[0] === student) {
            clearedSubscribers.push(item);
        }
    });
    event.subscribers = clearedSubscribers;
}
