module.exports = function () {
    var events = {};
    return {
        on: function (eventName, student, callback) {
            if (!(eventName in events)) {
				events[eventName] = [];
			}
			events[eventName].push({student: student, callback: callback});
        },

        off: function (eventName, student) {
			for (var event in events) {
				if (event === eventName || event.indexOf(eventName + '.') === 0) {
					for (var i = 0; i < events[event].length; i++) {
						if (events[event][i].student === student) {
							events[event].splice(i, 1);
						}
					}
				}
			}
        },

        emit: function (eventName) {
			var name = '';
			var listOfEvents = [];
			for (var event of eventName.split('.')) {
				if (name !== '') {
					name += '.' + event;
				} else {
					name = event;
				}
				listOfEvents.push(name);
			}
			for (var event in listOfEvents.reverse()) {
				var ev = listOfEvents[event];
				for (var index in events[ev]) {
					events[ev][index].callback.call(events[ev][index].student);
				}
			}
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
