var isWrongArguments = function (eventName, student, callback) {
    if (eventName === undefined || student === undefined || callback === undefined) {
        return true;
    }
    return false;
};

var checkN = function (eventName, student, callback, n) {
    if (n === undefined) {
        this.on(eventName, student, callback);
        return false;
    }
    if (n <= 0) {
        this.off(eventName, student);
        return false;
    }
    if ((isWrongArguments(eventName, student, callback))) {
        return false;
    }
    return true;
};

module.exports = function () {
    return {
        events: {},
        on: function (eventName, student, callback) {
            if ((isWrongArguments(eventName, student, callback))) {
                return;
            }
            if (this.events[eventName] === undefined) {
                this.events[eventName] = [];
            }
            var reaction = callback.bind(student);
            reaction.owner = student;
            this.events[eventName].push(reaction);
            return reaction;
        },

        off: function (eventName, student) {
            if (this.events[eventName] === undefined) {
                return;
            }
            var keys = Object.keys(this.events);
            var offEvents = [];
            offEvents.push(eventName);
            keys.forEach(function (name) {
                var check = eventName + '.';
                if (name.indexOf(check) > -1) {
                    offEvents.push(name);
                }
            });
            offEvents.forEach(function (name) {
                var curEvent = this.events[name];
                var index = -1;
                for (var i = 0; i < curEvent.length; i++) {
                    if (curEvent[i].owner === student) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    curEvent.splice(index, 1);
                }
                return;
            }, this);
            return;
        },

        emit: function (eventName) {
            var rawEvents = eventName.split('.');
            var j = 1;
            var fullEvents = [];
            for (var i = 0; i < rawEvents.length; i++) {
                var event = rawEvents[0];
                for (var k = 1; k < j; k++) {
                    event += '.' + rawEvents[k];
                }
                j++;
                fullEvents.push(event);
            }
            fullEvents.reverse();
            fullEvents.forEach(function (event) {
                if (this.events[event] === undefined) {
                    return;
                }
                this.events[event].forEach(function (cb) {
                    if (!cb.max && !cb.turn) {
                        cb();
                        return;
                    }
                    if (cb.max) {
                        if (cb.max === cb.count) {
                            // Удаления реакции на событие если произшло max раз для several
                            var reactionIndex = this.events[eventName].indexOf(cb);
                            if (reactionIndex > -1) {
                                this.events[eventName].splice(reactionIndex, 1);
                            }
                            return;
                        }
                        cb();
                        cb.count++;
                        return;
                    }
                    if (cb.turn) {
                        if (cb.turn === cb.need) {
                            cb();
                            cb.turn = 1;
                            return;
                        }
                        cb.turn += 1;
                        return;
                    }
                }, this);
            }, this);
            return;
        },

        several: function (eventName, student, callback, n) {
            var flag = checkN.apply(this, arguments);
            if (!flag) {
                return;
            }
            var reaction = this.on(eventName, student, callback);
            reaction.max = n;
            reaction.count = 0;
            return;
        },

        through: function (eventName, student, callback, n) {
            var flag = checkN.apply(this, arguments);
            if (!flag) {
                return;
            }
            var reaction = this.on(eventName, student, callback);
            reaction.turn = 1;
            reaction.need = n;
            return;
        }
    };
};
