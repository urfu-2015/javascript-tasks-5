module.exports = function () {
    var signedStudents = [];
    var events = {};
    var eventsHierarchy = [];
    var severalParametrs = {};
    var throughParametrs = {};
    return {
        on: function (eventName, student, callback) {
            if (signedStudents.indexOf(student) === -1) {
                signedStudents.push(student);
            }
            var studentIndex = signedStudents.indexOf(student);
            var eventNameArray = eventName.split('.');
            this.recursiveAdd(eventsHierarchy, eventNameArray);
            var lastEvent = eventNameArray.pop();
            events[lastEvent][studentIndex] = callback;
        },

        off: function (eventName, student) {
            var eventNameArray = eventName.split('.');
            pathToEvent = eventsHierarchy;
            for (var i = 0; i < eventNameArray.length; i++) {
                var e = eventNameArray[i];
                pathToEvent = pathToEvent[e];
            }
            this.recursiveOff(pathToEvent, student);
            var rootEvent = eventNameArray[eventNameArray.length - 1];
            for (signedStudent in events[rootEvent]) {
                if (signedStudents[signedStudent] === student) {
                    delete events[rootEvent][signedStudent];
                }
            }
        },

        emit: function (eventName) {
            var eventNameArray = eventName.split('.');
            for (var i = 0; i < eventNameArray.length; i++) {
                var e = eventNameArray[i];
                if (!events[e]) {
                    return;
                }
                events[e].numdersOfCall += 1;
                for (studentIndex in events[e]) {
                    if (studentIndex === 'numdersOfCall') {
                        continue;
                    }
                    if (this.checkSeveralAndThrough(e, studentIndex)) {
                        var action = events[e][studentIndex];
                        action.call(signedStudents[studentIndex]);
                    }
                }
            }
        },

        checkSeveralAndThrough: function (eventName, studentIndex) {
            var calls = events[eventName].numdersOfCall;
            if (severalParametrs[eventName] &&
                severalParametrs[eventName][studentIndex] < calls) {
                return false;
            }
            if (throughParametrs[eventName] &&
                calls % throughParametrs[eventName][studentIndex] !== 0) {
                return false;
            }
            return true;
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            this.addParametrs(severalParametrs, eventName, student, n);
        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            this.addParametrs(throughParametrs, eventName, student, n);
        },

        addParametrs: function (parametrsArray, eventName, student, n) {
            var newEvent = eventName.split('.').pop();
            if (!parametrsArray[newEvent]) {
                parametrsArray[newEvent] = {};
            }
            var studentIndex = signedStudents.indexOf(student);
            parametrsArray[newEvent][studentIndex] = n;
        },

        recursiveAdd: function (listInHierarchy, eventNameArray) {
            if (eventNameArray.length === 1) {
                var newEvent = eventNameArray[0];
                listInHierarchy.push(newEvent);
                if (!events[newEvent]) {
                    events[newEvent] = {numdersOfCall: 0};
                }
                return;
            }
            var nextEvent = eventNameArray.shift();
            if (!listInHierarchy[nextEvent]) {
                listInHierarchy[nextEvent] = [];
            }
            this.recursiveAdd(listInHierarchy[nextEvent], eventNameArray);
            return;
        },

        recursiveOff: function (listInHierarchy, student) {
            if (typeof listInHierarchy === 'undefined') {
                return;
            };
            for (var i = 0; i < listInHierarchy.length; i++) {
                var e = listInHierarchy[i];
                for (signedStudent in events[e]) {
                    if (signedStudents[signedStudent] === student) {
                        delete events[e][signedStudent];
                    }
                }
                this.recursiveOff(listInHierarchy[e], student);
            }
            return;
        }
    };
};
