module.exports = function () {
    var subscriptions = [];

    return {
        generalizedOn: function (eventName, student, callback, max, period) {
            var events = {};
            events[eventName] = {
                func: callback,
                max: max,
                period: period,
                counter: 1
            };
            subscriptions.push(
                {
                    student: student,
                    eventName: eventName,
                    events: events[eventName]
                }
            );
        },

        on: function (eventName, student, callback) {
            this.generalizedOn(eventName, student, callback, Infinity, 1);
        },

        off: function (eventName, student) {
            var indexes = getIndexes(subscriptions, student);
            var newSubscriptions = [];
            for (var i = 0; i < indexes.length; i++) {
                var index = indexes[i];
                var subscription = subscriptions[index];
                if (getNamespaces(subscription.eventName).indexOf(eventName) != -1) {
                    delete subscriptions[index];
                }
            }
            for (var i = 0; i < subscriptions.length; i++) {
                if (subscriptions[i]) {
                    newSubscriptions.push(subscriptions[i]);
                }
            }
            subscriptions = newSubscriptions;
        },

        emit: function (eventName) {
            var namespaces = getNamespaces(eventName);
            for (var i = 0; i < namespaces.length; i++) {
                for (var index in subscriptions) {
                    var subscription = subscriptions[index];
                    if (namespaces[i] == subscription.eventName) {
                        var currentSubscript = subscription.events;
                        var counter = currentSubscript.counter;
                        if (currentSubscript.max >= counter &&
                                counter % currentSubscript.period == 0) {
                            currentSubscript.func.apply(subscription.student);
                        }
                        currentSubscript.counter++;
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

function getIndexes(subscriptions, student) {
    var indexes = [];
    for (var i = 0; i < subscriptions.length; i++) {
        if (subscriptions[i].student == student) {
            indexes.push(i);
        }
    }
    return indexes;
}

function getNamespaces(eventName) {
    var names = eventName.split('.');
    var namespaces = [];
    namespaces[0] = names[0];
    for (var i = 1; i < names.length; i++) {
        namespaces[i] = namespaces[i - 1] + '.' + names[i];
    }
    return namespaces.reverse();
}
