module.exports = function () {
    var signedStudents = [];
    var events = {childEvents: {}};
    return {
        on: function (eventName, student, callback) {
            this.off(eventName, student);
            if (signedStudents.indexOf(student) === -1) {
                signedStudents.push(student);
            }
            var studentIndex = signedStudents.indexOf(student);
            var eventNameArray = eventName.split('.');
            if (IsEventExist(events, eventName)) {
                var pathToEvent = events;
                for (var i = 0; i < eventNameArray.length; i++) {
                    var eventName = eventNameArray[i];
                    pathToEvent = pathToEvent.childEvents[eventName];
                }
                var newAction = {};
                newAction.studentIndex = studentIndex;
                newAction.studentAction = callback;
                pathToEvent.actions.push(newAction);
                return pathToEvent;
            };
            return this.recursiveAdd(events, eventNameArray, callback, studentIndex);
        },

        off: function (eventName, student) {
            if (!IsEventExist(events, eventName)) {
                return;
            };
            var eventNameArray = eventName.split('.');
            pathToEvent = events;
            for (var i = 0; i < eventNameArray.length; i++) {
                var eventName = eventNameArray[i];
                pathToEvent = pathToEvent.childEvents[eventName];
            }
            var studentIndex = signedStudents.indexOf(student);
            this.recursiveOff(pathToEvent, studentIndex);
        },

        emit: function (eventName) {
            if (!IsEventExist(events, eventName)) {
                return;
            }
            var eventNameArray = eventName.split('.');
            var currentEvent = events;
            for (var i = 0; i < eventNameArray.length; i++) {
                var eventName = eventNameArray[i];
                currentEvent = currentEvent.childEvents[eventName];
            }
            while (currentEvent != events) {
                currentEvent.numdersOfCall += 1;
                for (var j = 0; j < currentEvent.actions.length; j++) {
                    var studentIndex = currentEvent.actions[j].studentIndex;
                    if (this.checkSeveralAndThrough(currentEvent, studentIndex)) {
                        var action = currentEvent.actions[j].studentAction;
                        action.call(signedStudents[studentIndex]);
                    }
                }
                currentEvent = currentEvent.parentEvent;
            }
        },

        checkSeveralAndThrough: function (e, studentIndex) {
            var calls = e.numdersOfCall;
            if (e.severalParametr &&
                e.severalParametr[studentIndex] < calls) {
                this.recursiveOff(e, studentIndex);
                return false;
            }
            if (e.throughParametr &&
                calls % e.throughParametr[studentIndex] !== 0) {
                return false;
            }
            return true;
        },

        several: function (eventName, student, callback, n) {
            if (n < 1) {
                return;
            }
            var newEvent = this.on(eventName, student, callback);
            this.addParametrs('severalParametr', newEvent, student, n);
        },

        through: function (eventName, student, callback, n) {
            if (n < 1) {
                return;
            }
            var newEvent = this.on(eventName, student, callback);
            if (n === 1) {
                return;
            }
            this.addParametrs('throughParametr', newEvent, student, n);
        },

        addParametrs: function (parametr, currentEvent, student, n) {
            if (!currentEvent[parametr]) {
                currentEvent[parametr] = {};
            }
            var studentIndex = signedStudents.indexOf(student);
            currentEvent[parametr][studentIndex] = n;
        },

        recursiveAdd: function (parentEvent, eventNameArray, callback, studentIndex) {
            if (eventNameArray.length === 1) {
                var newEventName = eventNameArray[0];
                var newEvent = {
                    childEvents: {},
                    actions: [],
                    numdersOfCall: 0,
                    parentEvent: parentEvent
                };
                var newAction = {};
                newAction.studentIndex = studentIndex;
                newAction.studentAction = callback;
                newEvent.actions.push(newAction);
                parentEvent.childEvents[newEventName] = newEvent;
                return parentEvent.childEvents[newEventName];
            }
            var nextEventName = eventNameArray.shift();
            if (!parentEvent.childEvents[nextEventName]) {
                var nextEvent = {
                    childEvents: {},
                    actions: [],
                    numdersOfCall: 0,
                    parentEvent: parentEvent
                };
                parentEvent.childEvents[nextEventName] = nextEvent;
            }
            newEvent = parentEvent.childEvents[nextEventName];
            return this.recursiveAdd(newEvent, eventNameArray, callback, studentIndex);
        },

        recursiveOff: function (parentEvent, studentIndex) {
            for (var i = 0; i < parentEvent.actions.length; i++) {
                if (parentEvent.actions[i].studentIndex === studentIndex) {
                    parentEvent.actions.splice(i, 1);
                }
            };
            if (Object.keys(parentEvent.childEvents).length === 0) {
                return;
            }
            for (i in parentEvent.childEvents) {
                this.recursiveOff(parentEvent.childEvents[i], studentIndex);
            }
            return;
        }
    };
};


function IsEventExist(events, eventName) {
    var eventNameArray = eventName.split('.');
    var childEvents = events.childEvents;
    for (var i = 0; i < eventNameArray.length; i++) {
        var name = eventNameArray[i];
        if (!childEvents[name]) {
            return false;
        }
        childEvents = childEvents[name].childEvents;
    };
    return true;
}
