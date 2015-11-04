module.exports = function () {
    var names = [];
    var studentsSub = [];
    var limit = {};

    function getIndex(name) {
        for (var i = 0; i < studentsSub.length; i++) {
            if (studentsSub[i]['name'] === name) {
                return i;
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
            if (prefixes[i].indexOf(eventName) !== -1) {
                return true;
            }
        }
        return false;
    }

    return {
        on: function (eventName, student, callback) {
            if (names.indexOf(student) !== -1) {
                if (!('eventName' in studentsSub[getIndex(student)]['actions'])) {
                    studentsSub[getIndex(student)]['actions'][eventName] = {
                        func: callback,
                        period: 1,
                        count: 1,
                        maxCount: Number.MAX_SAFE_INTEGER
                    };
                } else {
                    studentsSub[getIndex(student)]['actions'][eventName]['func'] = callback;
                }

            } else {
                names.push(student);
                var studentActions = {};
                studentActions[eventName] = {
                    func: callback,
                    period: 1,
                    count: 1,
                    maxCount: Number.MAX_SAFE_INTEGER
                };
                studentsSub.push({ name: student, actions: studentActions});
            }
        },

        off: function (eventName, student) {
            var index = getIndex(student);
            if (index !== -1) {
                var actionsNames = Object.keys(studentsSub[index]['actions']);
                for (var i = 0; i < actionsNames.length; i++) {
                    if (actionsNames[i].indexOf(eventName) !== -1) {
                        delete studentsSub[index]['actions'][actionsNames[i]];
                    }
                }
            }
        },

        emit: function (eventName) {
            var prefixes = getPrefixes(eventName);
            for (var index in studentsSub) {
                var student = studentsSub[index];
                var events = Object.keys(student.actions);
                for (var i = 0; i < events.length; i++) {
                    if (isInPrefixes(prefixes, events[i])) {
                        if (student.actions[events[i]]['count'] ===
                            student.actions[events[i]]['maxCount']) {
                            this.off(events[i], student['name']);
                            return;
                        }
                        if (student.actions[events[i]]['count']++ %
                            student.actions[events[i]]['period'] === 0) {
                            student.actions[events[i]]['func'].call(student['name']);
                        }
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            studentsSub[getIndex(student)]['actions'][eventName]['maxCount'] = n;
        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            studentsSub[getIndex(student)]['actions'][eventName]['period'] = n;
        }
    };
};
