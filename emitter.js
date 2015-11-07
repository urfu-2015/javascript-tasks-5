module.exports = function () {
    events = [];
    return {
        on: function (eventName, student, callback) {
            this.add(eventName, student, callback, Infinity, 'on');
        },

        off: function (eventName, student) {
            var index = this.findIndex(eventName, student);
            while (index > -1) {
                events.splice(index, 1);
                index = this.findIndex(eventName, student);
            }
        },

        emit: function (eventName) {
            var namespace = this.getNamespace(eventName);
            events.forEach(function (eventRecord) {
                namespace.forEach(function (name) {
                    if (eventRecord.eventName === name) {
                        var called = eventRecord.calledTimes;
                        var counts = eventRecord.canBeCalled;
                        switch (eventRecord.subscription) {
                            case 'on':
                                eventRecord.action.apply(eventRecord.student);
                                break;
                            case 'several':
                                if (called <= counts) {
                                    eventRecord.action.apply(eventRecord.student);
                                    eventRecord.calledTimes++;
                                }
                                break;
                            case 'through':
                                var mod = called % counts;
                                if (mod === 0) {
                                    eventRecord.action.apply(eventRecord.student);
                                }
                                eventRecord.calledTimes++;
                        }
                    }
                });
            });
        },

        several: function (eventName, student, callback, n) {
            this.add(eventName, student, callback, n, 'several');
        },

        through: function (eventName, student, callback, n) {
            this.add(eventName, student, callback, n, 'through');
        },

        add: function (eventName, student, callback, n, subscription) {
            var newEvent = {
                student: student,
                eventName: eventName,
                action: callback,
                canBeCalled: n,
                calledTimes: 0,
                subscription: subscription
            };
            if (subscription === 'through') {
                newEvent.calledTimes = 1;
            }
            events.push(newEvent);
        },

        findIndex: function (eventName, student) {
            for (var i = 0; i < events.length; i++) {
                if (events[i].student == student &&
                events[i].eventName.indexOf(eventName) != -1) {
                    return i;
                }
            }
            return -1;
        },

        getNamespace: function (eventName) {
            var namespace = [];
            namespace.push(eventName);
            while (true) {
                var pointIndex = eventName.lastIndexOf('.');
                if (pointIndex === -1) {
                    break;
                }
                eventName = eventName.slice(0, pointIndex);
                namespace.push(eventName);
            }
            return namespace;
        }
    };
};
