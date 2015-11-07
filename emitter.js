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
                    this.events[eventName].forEach(function (item, i, array) {
                        if (!item.count && !item.period) {
                            item.reaction.call(item.student);
                        }
                        if (item.count) {
                            item.count--;
                            if (item.count == 0) {
                                this.off(eventName, item.student);
                            }
                            item.reaction.call(item.student);
                        }
                        if (item.period) {
                            item.current++;
                            if (item.current == item.period) {
                                item.current = 0;
                                item.reaction.call(item.student);
                            }
                        }
                    }, this);
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
            if (n > 0) {
                this.events[eventName]
                    .push({student: student, reaction: callback, period: n, current: 0});
            }
        }
    };
};
