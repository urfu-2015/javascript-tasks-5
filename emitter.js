module.exports = function () {
    return {
        students: [],

        on: function (eventName, student, callback) {
            this.createEvent(eventName, student, callback, 0, Infinity);
        },

        off: function (eventName, student) {
            this.createEvent(eventName, student, () => null, 0, 0);
        },

        emit: function (eventName) {
            eventName = eventName.split('.');
            for (var i = 0; i < this.students.length; i++) {
                var events = this.students[i].events;
                for (var j = 0; j < eventName.length; j++) {
                    if (!(eventName[j] in events)) {
                        break;
                    }
                    if (events[eventName[j]]['_callback'] !== undefined) {
                        events[eventName[j]]['_callback'].apply(this.students[i]);
                    }
                    if (!(eventName[j] in events)) {
                        break;
                    }
                    events = events[eventName[j]];
                }
            }
        },

        several: function (eventName, student, callback, n) {
            this.createEvent(eventName, student, callback, 0, n);
        },

        through: function (eventName, student, callback, n) {
            this.createEvent(eventName, student, callback, n, Infinity);
        },

        createEvent: function (eventName, student, callback, everyIndex, maxIndex) {
            if (!('events' in student)) {
                student['events'] = {};
            }
            everyIndex += 1;
            var currentIndex = 0;
            var prevEvents = {};
            var events = student.events;
            eventName = eventName.split('.');
            for (var i = 0; i < eventName.length; i++) {
                if (events[eventName[i]] === undefined) {
                    events[eventName[i]] = {};
                }
                prevEvents = events;
                events = events[eventName[i]];
            }
            events['_callback'] = function () {
                if (currentIndex < maxIndex) {
                    if (currentIndex % everyIndex === 0) {
                        callback.apply(this);
                    }
                    currentIndex += 1;
                } else {
                    delete prevEvents[eventName.pop()];
                }
            };
            if (!(Boolean(this.students.indexOf(student) + 1))) {
                this.students.push(student);
            }
        }
    };
};
