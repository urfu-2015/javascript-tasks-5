module.exports = function () {
    return {
        events: {},

        on: function (eventName, student, callback) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push({student: student, reaction: callback});
        },

        off: function (eventName, student) {
            for (var key in this.events) {
                if (key == eventName || (key.indexOf(eventName + '.') == 0)) {
                    for (var i = 0; i < this.events[key].length; i++) {
                        if (this.events[key][i].student == student) {
                            this.events[key].splice(i, 1);
                        }
                    }
                }
            }
        },

        emit: function (eventName) {
            eventName = eventName + '.';
            while (eventName.lastIndexOf('.') !== -1) {
                eventName = eventName.substring(0, eventName.lastIndexOf('.'));
                if (this.events[eventName]) {
                    for (var i = 0; i < this.events[eventName].length; i++) {
                        if (!this.events[eventName][i].count &&
                            !this.events[eventName][i].period) {
                            this.events[eventName][i].reaction
                                .call(this.events[eventName][i].student);
                        }
                        if (this.events[eventName][i].count) {
                            this.events[eventName][i].count--;
                            if (this.events[eventName][i].count == 0) {
                                this.off(eventName, this.events[eventName][i].student);
                            }
                            this.events[eventName][i].reaction
                                .call(this.events[eventName][i].student);
                        }
                        if (this.events[eventName][i].period) {
                            this.events[eventName][i].current++;
                            if (this.events[eventName][i].current ==
                                this.events[eventName][i].period) {
                                this.events[eventName][i].current = 0;
                                this.events[eventName][i].reaction
                                    .call(this.events[eventName][i].student);
                            }
                        }
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push({student: student, reaction: callback, count: n});
        },

        through: function (eventName, student, callback, n) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push({student: student, reaction: callback,
                period: n, current: 0});
        }
    };
};
