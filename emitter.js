module.exports = function () {
    var allEvents = [];
    return {
        on: function (eventName, student, callback) {
            return allEvents.push(
                {
                    eventName: eventName, 
                    participants: student,
                    senceEvent: callback
                });
        },

        off: function (eventName, student) {
            return allEvents.filter( function (event) {
                return event.eventName !== eventName && 
                       event.participants !== student;
            });
        },

        emit: function (eventName) {
            var indexOneEvent = eventName.length;
            var oneEvent = eventName;
            var indexEvent;
            while (indexOneEvent > 0) {
                oneEvent  = oneEvent.slice(0, indexOneEvent); 
                indexEvent = getIndexEventName(allEvents, oneEvent);
                if (indexEvent > -1) {
                    return allEvents[indexEvent].senceEvent;
                }
                indexOneEvent = oneEvent.lastIndexOf('.') - 1;
            }
        }
        /*several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }*/
    }
};

function getIndexEventName (array, key) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].eventName === key) {
            return i;
        }
    }
        return -1;
}
