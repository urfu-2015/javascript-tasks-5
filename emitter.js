module.exports = function () {
    var subscribers = [];
    return {
        on: function (eventName, student, callback) {
            var newSubscriber = {
                student: student,
                callback: callback,
                eventName: eventName,
                checkFunction: function () {
                    return true;
                }
            };
            subscribers.push(newSubscriber);
        },

        off: function (eventName, student) {
            subscribers = subscribers.filter(function (sub) {
                return (!(sub.eventName.indexOf(eventName) === 0 & sub.student === student));
            });
        },

        emit: function (eventName) {
            subscribers.forEach(function (sub) {
                var events = getEvents(eventName);
                if (events.indexOf(sub.eventName) !== -1) {
                    if (sub.checkFunction()) {
                        sub.callback.call(sub.student);
                    }
                }
            });
        },

        several: function (eventName, student, callback, n) {
            var newSubscriber = {
                student: student,
                callback: callback,
                eventName: eventName,
                checkFunction: function () {
                    return this.callCount++ < n;
                },
                callCount: 0
            };
            subscribers.push(newSubscriber);
        },

        through: function (eventName, student, callback, n) {
            var newSubscriber = {
                student: student,
                callback: callback,
                eventName: eventName,
                checkFunction: function () {
                    return ++this.callCount % n == 0;
                },
                callCount: 0
            };
            subscribers.push(newSubscriber);
        }
    };
};

function getEvents(eventName) {
    var events = eventName.split('.');
    for (var i = 1, l = events.length; i < l; i++) {
        events[i] = events[i - 1] + '.' + events[i];
    }
    return events;
}
