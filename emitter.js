module.exports = function () {
    return {
        students: [],
        events: [],

        on: function (eventName, student, callback) {
            this.createEvent(eventName, student, callback, 1, Infinity);
        },

        off: function (eventName, student) {
            this.createEvent(eventName, student, () => null, 1, 0);
        },

        emit: function (eventName) {
            eventName = eventName.split('.');
            for (var i = 0; i < this.students.length; i++) {
                var events = this.events[i]['_all'];
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
            this.createEvent(eventName, student, callback, 1, n);
        },

        through: function (eventName, student, callback, n) {
            this.createEvent(eventName, student, callback, n, Infinity);
        },

        createEvent: function (eventName, student, callback, everyIndex, maxIndex) {
            if (everyIndex < 1) {
                maxIndex = 0;
            }
            if (!Boolean(this.students.indexOf(student) + 1)) {
                this.students.push(student);
                this.events.push({ _all: {} });
            }
            var index = this.students.indexOf(student);
            var currentIndex = 0;
            var prevEvents = this.events[index];
            var events = this.events[index]['_all'];
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
