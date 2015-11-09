module.exports = function () {
    var events = {
        subLevels: {}
    };
    return {
        on: function (eventName, context, callback) {
            eventName = getEventName(eventName);
            addToEvent(events, eventName, context, callback);
        },

        off: function (eventName, context) {
            eventName = getEventName(eventName);
            removeFromEvent(events, eventName, context);
        },

        emit: function (eventName) {
            eventName = getEventName(eventName);
            emit(events, eventName);
        },

        several: function (eventName, context, callback, n) {

        },

        through: function (eventName, context, callback, n) {

        }
    };
};

function getEventName(event) {
    return event.split('.');
}

function addToEvent(events, eventName, context, callback) {
    var curObj = events;

    for (var i = 0; i < eventName.length; i++) {
        curObj = curObj.subLevels;
        if (!curObj.hasOwnProperty(eventName[i])) {
            curObj[eventName[i]] = {
                subscribers: [],
                subLevels: {}
            };
        }
        curObj = curObj[eventName[i]];
    }
    curObj.subscribers.push(
        {
            context: context,
            handler: callback
        }
    );
}

function removeFromEvent(events, eventName, context) {
    var curObj = events;

    eventName.forEach(function (item) {
        curObj = curObj.subLevels[item];
    });
    removeSubEvents(curObj, context);
}

function removeSubEvents(event, context) {
    Object.keys(event.subLevels).forEach(function (item) {
        removeSubEvents(event.subLevels[item], context);
    });
    var clearedSubscribers = [];
    event.subscribers.forEach(function (item) {
        if (!item[0] === context) {
            clearedSubscribers.push(item);
        }
    });
    event.subscribers = clearedSubscribers;
}

function emit(event, eventName) {
    var curObj = event.subLevels[eventName[0]];
    if (eventName.length < 1) {
        return;
    }
    if (!event.subLevels.hasOwnProperty(eventName[0])) {
        return;
    }
    curObj = event.subLevels[eventName[0]];
    emit(curObj, eventName.slice(1));
    curObj.subscribers.forEach(function (item) {
        item.handler.call(item.context);
    });
}
