
module.exports = function () {
    return {
        eventsOfStudents: {},
        on: function (eventName, student, callback) {
            if (!(eventName in this.eventsOfStudents)) {
                this.eventsOfStudents[eventName] = [];
                }
            this.eventsOfStudents[eventName].push({student: student, callback: callback});

        },

        off: function (eventName, student) {
            for (event in this.eventsOfStudents) {
                if (event.indexOf(eventName) >= 0) {
                    for (var i = 0; i < this.eventsOfStudents[event].length; i++) {
                        if (this.eventsOfStudents[event][i].student === student) {
                            this.eventsOfStudents.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        },

        emit: function (eventName) {
            if (eventName in this.eventsOfStudents) {
                var events = this.createEvents();
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < this.eventsOfStudents[events[i]].length; j++) {
                        var current = this.eventsOfStudents[events[i]][j];
                            var callback = current.callback;
                            callback.call(this.eventsOfStudents[j].student);
                    }
                }
            }
        },
        createEvents: function () {
            var eventsList = eventName.split('.');
            var nameEvent = eventsList[0];
            var events = [nameEvent];
            for (var i = 1; i < eventsList.length; i++) {
                nameEvent = nameEvent + '.' + eventsList[i];
                events.push(nameEvent);
            }
            return events;
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
