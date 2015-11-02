module.exports = function () {
    return {
        events: {},

        on: function (eventName, student, callback) {
            if (!(eventName in this.events)) {
                this.events[eventName] = [];
            }
            this.events[eventName].push({student: student,
                                         callback: callback,
                                         callNunber: 0,
                                         callCount: Number.POSITIVE_INFINITY,
                                         callPeriodicity: 1
                                         });
        },

        off: function (eventName, student) {
            var keys = Object.keys(this.events);
            for (var j = 0; j < keys.length; j++) {
                if (keys[j].indexOf(eventName) >= 0) {
                    for (var i = 0; i < this.events[keys[j]].length; i++) {
                        if (this.events[keys[j]][i].student === student) {
                            this.events[keys[j]].splice(i, 1);
                        }
                    }
                }
            }
        },

        emit: function (eventName) {
            function createEventList() {
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
            }
            if (eventName in this.events) {
                var eventList = createEventList();
                for (var i = 0; i < eventList.length; i++) {
                    for (var j = 0; j < this.events[eventList[i]].length; j++) {
                        var currentEvent = this.events[eventList[i]][j];
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
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i].student === student) {
                    this.events[eventName][i].callCount = n;
                    return;
                }
            }
        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i].student === student) {
                    this.events[eventName][i].callPeriodicity = n;
                    return;
                }
            }
        }
    };
};
