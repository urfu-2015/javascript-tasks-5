module.exports = function () {
	var events_subscribers = {};
	var students = [];
    return {
        on: function (eventName, student, callback) {
			var i = students.indexOf(student);
			if (i < 0) {
				i = students.length;
				students[i] = student;
			}
			if (!events_subscribers.hasOwnProperty(eventName)) {
				events_subscribers[eventName] = {};
			}
			events_subscribers[eventName][i] = callback;
        },

        off: function (eventName, student) {
			var delSubscriber = function(i, evName) {
				if (events_subscribers.hasOwnProperty(evName) && events_subscribers[evName].hasOwnProperty(i)) {
					delete events_subscribers[evName][i];
				}
			}
			var i = students.indexOf(student);
			if (i >= 0) {
				for(var event in events_subscribers) {
					if (event.indexOf(eventName) >= 0) {
						delSubscriber(i,event);
					}
				}
			}
			return events_subscribers;
        },

        emit: function (eventName) {
			var perform = function(evName) {
				if (events_subscribers.hasOwnProperty(evName)) {
					var subscribers = events_subscribers[evName];
					for(var numSt in subscribers) {
						subscribers[numSt].call(students[numSt]);
					}
				}
			}
			perform(eventName);
			var subEventName = eventName.split('.')[0];
			if (!(subEventName === eventName)) {
				perform(subEventName);
			}
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
