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
            if (this.events[eventName]) {
                for (var i = 0; i < this.events[eventName].length; i++) {
                    this.events[eventName][i].reaction.call(this.events[eventName][i].student);
                }
            }
            while (eventName.lastIndexOf('.') !== -1) {
                eventName = eventName.substr(0, eventName.lastIndexOf('.'));
                for (var i = 0; i < this.events[eventName].length; i++) {
                    this.events[eventName][i].reaction.call(this.events[eventName][i].student);
                }
            }
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
