module.exports = function () {
    var allEvents = [];
    return {
        on: function (eventName, student, callback) {
            var eventIndex = getIndexEventName(allEvents, eventName);

            return eventIndex > -1 ?
                allEvents[eventIndex].participants.push(student)
                :
                allEvents.push(
                    {
                        eventName: eventName, 
                        participants: [student],
                        senceEvent: callback
                    });
        },

        off: function (eventName, student) {
            var indexEvent = getIndexEventName(allEvents, eventName);
            return allEvents[indexEvent].participants.filter(function (name) {
                return name !== student;
            });
        },

        emit: function (eventName) {
            var indexEvent;
            eventName.split('.').forEach(function (oneEvent) {
                indexEvent = getIndexEventName(allEvents, oneEvent);
                if (indexEvent > -1) {
                    return allEvents[indexEvent].senceEvent;
                }
            });
        }
    };
}

function getIndexEventName (array, key) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].eventName === key) {
            return i;
        }
    }
        return -1;
}
