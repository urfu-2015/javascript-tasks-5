module.exports = function () {
    var names = [];
    var studentsSubscriptions = [];

    function getIndex(name) {
        for (var i = 0; i < studentsSubscriptions.length; i++) {
            if (studentsSubscriptions[i]['name'] === name) {
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
                studentsSubscriptions[getIndex(student)]['actions'][eventName] = callback;
            } else {
                names.push(student);
                var studentActions = {};
                studentActions[eventName] = callback;
                studentsSubscriptions.push({ name: student, actions: studentActions});
            }
        },

        off: function (eventName, student) {
            var index = getIndex(student);
            if (index !== -1) {
                var actionsNames = Object.keys(studentsSubscriptions[index]['actions']);
                for (var i = 0; i < actionsNames.length; i++) {
                    if (actionsNames[i].indexOf(eventName) !== -1) {
                        delete studentsSubscriptions[index]['actions'][actionsNames[i]];
                    }
                }
            }
        },

        emit: function (eventName) {
            var prefixes = getPrefixes(eventName);
            for (var index in studentsSubscriptions) {
                var student = studentsSubscriptions[index];
                var events = Object.keys(student.actions);
                for (var i = 0; i < events.length; i++) {
                    if (isInPrefixes(prefixes, events[i])) {
                        student.actions[events[i]].call(student['name']);
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
