module.exports = function () {
	var events_subscribers = {};
	
    return {
        on: function (eventName, student, callback) {
			student[eventName] = callback;
			if (!events_subscribers.hasOwnProperty(eventName)) {
				events_subscribers[eventName] = [];
			}
			events_subscribers[eventName].push(student);
        },

        off: function (eventName, student) {
			delete student[eventName];
			var i = events_subscribers[eventName].indexOf(student);
			if (i >= 0) {
				events_subscribers[eventName].splice(i,1);
			}
        },

        emit: function (eventName) {
			var events = [];
			events.push(eventName)
			var subEventName = eventName.split('.')[0];
			if (!(subEventName === eventName)) {
				events.push(subEventName);
			}
			for (var j = 0; j < events.length; j++) {
				if (events_subscribers.hasOwnProperty(events[j])) {
				var subscribers = events_subscribers[events[j]];
				for (var i = 0; i < subscribers.length; i++) {
					subscribers[i][events[j]].call(subscribers[i]);
					}
				}
			}
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
