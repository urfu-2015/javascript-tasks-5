module.exports = function () {
    return {
        events: {},

        on: function (eventName, student, callback) {
            if (!(eventName in this.events)) {
                this.events[eventName] = [];
            }
            this.events[eventName].push({student: student,
                                         callback: callback});
        },

        off: function (eventName, student) {
            for (var key in this.events) {
                if (key.indexOf(eventName) >= 0) {
                    for (var i = 0; i < this.events[key].length; i++) {
                        if (this.events[key][i].student === student) {
                            this.events[key].splice(i, 1);
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
                        var callback = currentEvent.callback;
                        callback.apply(student);
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
