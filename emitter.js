module.exports = function () {
    var allEvents = [];
    return {
        on: function (eventName, student, callback) {
            var eventIndex = getIndexEventName(allEvents, 'eventName', eventName);
 
            return eventIndex > 0 ?
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
            var indexEvent = getIndexEventName(allEvents, 'eventName', eventName);
            return allEvents[indexEvent].participants.filter(function (name) {
                return name !== student;
            });
        },

    function getIndexEventName (array, property, key) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].property === key) {
            return i;
        }
    }
        return -1;
}

};
