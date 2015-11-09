module.exports = function () {
    var subscriptions = [];

    return {
        generalizedOn: function (eventName, student, callback, max, period) {
            var index = getIndex(subscriptions, student);
            var events = {};
            events[eventName] = {
                func: callback,
                max: max,
                period: period,
                counter: 1
            };
            if (index == -1) {
                subscriptions.push(
                    {
                        student: student,
                        events: {}
                    }
                );
                subscriptions[subscriptions.length - 1].events[eventName] = [events[eventName]];
            } else {
                if (!subscriptions[index].events[eventName]) {
                    subscriptions[index].events[eventName] = [];
                }
                subscriptions[index].events[eventName].push(events[eventName]);
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
            for (var index in subscriptions) { // по студентам
                var subscription = subscriptions[index];
                for (var event_ in subscription.events) { // по ивентам в студентах
                    if (namespaces.indexOf(event_) != -1) { // ищем в неймспэйсе
                        var midCount = 0;
                        for (var item in subscription.events[event_]) { // по списку ивента
                            var currentSubscript = subscription.events[event_][item];
                            var counter = currentSubscript.counter;
                            if (currentSubscript.max > counter &&
                                    counter % currentSubscript.period == 0) {
                                currentSubscript.func.apply(subscription.student);
                            }
                            currentSubscript.counter++;
                        }
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
}

function getNamespaces(eventName) {
    var names = eventName.split('.');
    var namespaces = [];
    namespaces[0] = names[0];
    for (var i = 1; i < names.length; i++) {
        namespaces[i] = namespaces[i - 1] + '.' + names[i];
    }
    return namespaces;
}
