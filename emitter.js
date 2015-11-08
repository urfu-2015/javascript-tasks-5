module.exports = function () {
    return {
        events: {},

        checkEvent: function (callCount, callPeriodicity) {
            if ((callCount < 0) || (callPeriodicity < 0)) {
                throw new Error('значения периодичности вызова обработчика и количества вызовов +' +
                    ' обработчика должны быть неотрицательными');
            }
        },

        on: function (eventName, student, callback, callCount, callPeriodicity) {
            if (!(eventName in this.events)) {
                this.events[eventName] = [];
            }
            this.checkEvent(callCount, callPeriodicity);
            if ((callCount === undefined) || (callCount === null)) {
                callCount = Number.POSITIVE_INFINITY;
            }
            if ((callPeriodicity === undefined) || (callPeriodicity === null)) {
                callPeriodicity = 1;
            }
            this.events[eventName].push({student: student,
                                         callback: callback,
                                         callNunber: 0,
                                         callCount: callCount,
                                         callPeriodicity: callPeriodicity
                                         });
        },

        off: function (eventName, student) {
            Object.keys(this.events).forEach(function (key) {
                if (key.indexOf(eventName) > -1) {
                    for (var i = 0; i < this.events[key].length; i++) {
                        if (this.events[key][i].student === student) {
                            this.events[key].splice(i, 1);
                            break;
                        }
                    }
                }
            }, this);
        },

        createEventList: function (eventName) {
            var currentEvents = eventName.split('.');
            if (currentEvents.length === 1) {
                return [eventName];
            } else {
                var curEvent = currentEvents[0];
                var eventList = [curEvent];
                for (var i = 1; i < currentEvents.length; i++) {
                    curEvent = curEvent + '.' + currentEvents[i];
                    eventList.push(curEvent);
                }
                return eventList;
            }
        },

        emit: function (eventName) {
            if (eventName in this.events) {
                var eventList = this.createEventList(eventName);
                eventList.forEach(function (eventName) {
                    if (Object.keys(this.events).indexOf(eventName) > -1) {
                        this.events[eventName].forEach(function (currentEvent) {
                            var student = currentEvent.student;
                            currentEvent.callNunber += 1;
                            if (currentEvent.callCount < 1) {
                                this.off(eventName, student);
                                return;
                            }
                            if (currentEvent.callNunber % currentEvent.callPeriodicity === 0) {
                                currentEvent.callCount -= 1;
                                var callback = currentEvent.callback;
                                callback.apply(student);
                            }
                        }, this);
                    }
                }, this);
            }
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback, n);
        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback, null, n);
        }
    };
};
