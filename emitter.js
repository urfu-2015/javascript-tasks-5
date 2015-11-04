
module.exports = function () {
    return {
        eventsOfStudents: [],
        on: function (eventName, student, callback) {
            var event = {
                name: eventName,
                student: student,
                callback: callback
            };
            this.eventsOfStudents.push(event);

        },

        off: function (eventName, student) {
                for (var i = 0; i < this.eventsOfStudents.length; i++) {
                    if (this.eventsOfStudents[i].name.indexOf(eventName) >= 0 || student === this.eventsOfStudents[i].student) {
                        this.eventsOfStudents.splice(i, 1);
                    }
                }
        },

        emit: function (eventName) {
            function createEvents() {
                var eventCurrent = eventName.split('.');
                if (eventCurrent.length === 1) {
                    return [eventName];
                } else {
                    var nameEvent = eventCurrent[0];
                    var events = [nameEvent];
                    for (var i = 1; i < eventCurrent.length; i++) {
                        nameEvent = nameEvent + '.' + eventCurrent[i];
                        events.push(nameEvent);
                    }
                    return events;
                }
            }
            if (this.is_exist_name(eventName, this.eventsOfStudents)) {
                var events = createEvents();
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < this.eventsOfStudents.length; j++) {
                        var current = this.eventsOfStudents[j];
                        if (events[i] === current.name){
                            var callback = current.callback;
                            callback.call(this.eventsOfStudents[j].student);
                        }
                    }
                }
            }
        },
        is_exist_name: function(eventName, events) {
            for (var i = 0; i < events.length; i++) {
                if (eventName === events[i].name) {
                    return true;
                }
            }
            return false;

        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
