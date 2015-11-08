module.exports = function () {
	var eventsSubscribers = {};
	var students = [];
    return {
        on: function (eventName, student, callback) {
        var numSt = students.indexOf(student);
        if (numSt < 0) {
                numSt = students.length;
                students[numSt] = student;
            }
            if (!eventsSubscribers[eventName]) {
                eventsSubscribers[eventName] = {};
            }
            if (!eventsSubscribers[eventName][numSt]) {
                eventsSubscribers[eventName][numSt] = [];
            }
            eventsSubscribers[eventName][numSt].push(callback);
        },

        off: function (eventName, student) {
            var delSubscriber = function (numSt, evName) {
                if (eventsSubscribers[evName] && eventsSubscribers[evName][numSt]) {
                    delete eventsSubscribers[evName][numSt];
                }
            }
            var numSt = students.indexOf(student);
            if (numSt >= 0) {
                for(var event in eventsSubscribers) {
                    if ((event === eventName) || (event.indexOf(eventName+'.') >= 0)) {
                        delSubscriber(numSt,event);
                    }
                }
            }
        },

        emit: function (eventName) {
            var perform = function (evName) {
                if (eventsSubscribers[evName]) {
                    var subscribers = eventsSubscribers[evName];
                    for(var numSt in subscribers) {
                        for (var j = 0; j < subscribers[numSt].length; j++) {
                            subscribers[numSt][j].call(students[numSt]);
                        }
                    }
                }
            }
            perform(eventName);
            var subEventName = eventName.split('.')[0];
            if (subEventName !== eventName) {
                perform(subEventName);
            }
        },

        several: function (eventName, student, callback, n) {
			
        },

        through: function (eventName, student, callback, n) {

        }
    };
};
