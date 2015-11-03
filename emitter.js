module.exports = function () {
    var subscriptions = [];
    var counter = 0;

    return {
        generalizedOn: function (eventName, student, callback, max, period) {
            var index = getIndex(subscriptions, student);
            var events = {};
            events[eventName] = {
                func: callback,
                max: max,
                period: period
            };
            if (index == -1) {
                subscriptions.push(
                    {
                        student: student,
                        events: events
                    }
                );
            } else {
                subscriptions[index].events[eventName] = events[eventName];
            }
        },

        on: function (eventName, student, callback) {
            this.generalizedOn(eventName, student, callback, Infinity, 1);
        },

        off: function (eventName, student) {
            var index = getIndex(subscriptions, student);
            if (index != -1) {
                var subscription = subscriptions[index];
                for (var event_ in subscription.events) {
                    if (getNamespaces(event_).indexOf(eventName) != -1) {
                        delete subscriptions[index].events[event_];
                    }
                }
            }
        },

        emit: function (eventName) {
            var namespaces = getNamespaces(eventName);
            for (var index in subscriptions) {
                var subscription = subscriptions[index];
                for (var event_ in subscription.events) {
                    if (namespaces.indexOf(event_) != -1) {
                        if (subscription.events[event_].max > counter &&
                                counter % subscription.events[event_].period == 0) {
                            subscription.events[event_].func.apply(subscription.student);
                        }
                        counter++;
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {
            this.generalizedOn(eventName, student, callback, n, 1);
        },

        through: function (eventName, student, callback, n) {
            this.generalizedOn(eventName, student, callback, Infinity, n);
        }
    };
};

function getIndex(subscriptions, student) {
    for (var i = 0; i < subscriptions.length; i++) {
        if (subscriptions[i].student == student) {
            return i;
        }
    }
    return -1;
};

function getNamespaces(eventName) {
    var names = eventName.split('.');
    var namespaces = [];
    namespaces[0] = names[0];
    for (var i = 1; i < names.length; i++) {
        namespaces[i] = namespaces[i-1] + '.' + names[i];
    }
    return namespaces;
}
