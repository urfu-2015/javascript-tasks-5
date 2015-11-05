module.exports = function () {
    var subscriptions = [];
    function getStudentByName(name) {
        for (var i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].name === name) {
                return subscriptions[i];
            }
        }
        return -1;
    }

    function getPrefixes(eventName) {
        var prefixes = [eventName];
        var suffix = eventName;
        var prefix = '';
        while (suffix.indexOf('.') !== -1) {
            prefix = eventName.slice(0, suffix.indexOf('.') + prefix.length);
            suffix = eventName.slice(prefix.length + 1, suffix.length);
            prefixes.push(prefix);
        }
        return prefixes;
    }

    function isInPrefixes(prefixes, eventName) {
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] === eventName) {
                return true;
            }
        }
        return false;
    }

    return {
        on: function (eventName, student, callback) {
            var currStudent = getStudentByName(student);
            if (currStudent !== -1) {
                currStudent.events[eventName] = {
                    action: callback,
                    period: 1,
                    count: 1,
                    maxCount: Number.MAX_SAFE_INTEGER
                };
            } else {
                var studentActions = {};
                studentActions[eventName] = {
                    action: callback,
                    period: 1,
                    count: 1,
                    maxCount: Number.MAX_SAFE_INTEGER
                };
                subscriptions.push({ name: student, events: studentActions});
            }
        },

        off: function (eventName, student) {
            var newStudent = getStudentByName(student);
            if (newStudent !== -1) {
                var actionsNames = Object.keys(newStudent.events);
                for (var i = 0; i < actionsNames.length; i++) {
                    if (actionsNames[i].indexOf(eventName) !== -1) {
                        delete newStudent.events[actionsNames[i]];
                    }
                }
            }
        },

        emit: function (eventName) {
            var prefixes = getPrefixes(eventName);
            for (var index in subscriptions) {
                var student = subscriptions[index];
                var events = Object.keys(student.events);
                for (var i = 0; i < events.length; i++) {
                    var currAction = student.events[events[i]];
                    if (isInPrefixes(prefixes, events[i])) {
                        if (currAction.count ===
                            currAction.maxCount) {
                            this.off(events[i], student.name);
                            return;
                        }
                        if (currAction.count++ %
                            currAction.period === 0) {
                            currAction.action.call(student.name);
                        }
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            getStudentByName(student).events[eventName].maxCount = n;
        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            getStudentByName(student).events[eventName].period = n;
        }
    };
};
