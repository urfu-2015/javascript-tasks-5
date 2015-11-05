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
            for (var i = 0; i < allEvents.length; i++) {
                if (allEvents[i].eventName.indexOf(eventName) > -1) {
                    allEvents[i].participants = allEvents[i].participants.filter(function (name) {
                    return name !== student;
                    });
                }
            }
            return allEvents;
         },

        emit: function (eventName) {
            var listEvent = eventName.split('.');
            var countEventName = listEvent[0];
            for (var i = 0; i < listEvent.length; i++) {
                if (i > 0) {
                    countEventName += '.' + listEvent[i];
                }
                indexEvent = getIndexEventName(allEvents, countEventName);
                if (indexEvent > -1) {
                    var callBackEvent = allEvents[indexEvent].senceEvent;
                    allEvents[indexEvent].participants.forEach(function (elem) {
                        callBackEvent.call(elem);
                    });
                }
            };
        }
    };
}

function checkHaveEventName (array, eventName, student) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].eventName.indexOf(eventName) > -1) {
            array[i].eventName.participants = array[i].eventName.participants.filter(function (name) {
                return name !== student;
            });
        }
    }
}

function getIndexEventName (array, key) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].eventName === key) {
            return i;
        }
    }
        return -1;
}
