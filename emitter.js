module.exports = function () {
    var events = {};
    var students = [];

    return {
        on: function (eventName, student, callback) {
            var studentNumber = students.indexOf(student);
            if (studentNumber === -1) {
                students.push(student);
                studentNumber = students.length - 1;
            }
            var newReaction = {
                student: studentNumber,
                callback: callback
            };
            if (!(eventName in events)) {
                events[eventName] = [];
            }
            events[eventName] = events[eventName].concat(newReaction);
            return events[eventName][events[eventName].length - 1];
        },

        off: function (eventName, student) {
            var deleteEvents = [eventName];
            var studentNumber = students.indexOf(student);
            if (eventName.indexOf('.') === -1) {
                deleteEvents = deleteEvents.concat(Object.keys(events).filter(function (event) {
                    if (event.indexOf(eventName) === -1 || event === eventName) {
                        return false;
                    }
                    return true;
                }));
            }
            for (var event = 0; event < deleteEvents.length; event++) {
                for (var i = 0; i < events[deleteEvents[event]].length; i++) {
                    if (events[deleteEvents[event]][i].student === studentNumber) {
                        events[deleteEvents[event]].splice(i, 1);
                    }
                }
            }
        },

        emit: function (eventName) {
            var currentEvents = eventName.split('.');
            if (currentEvents.length > 1) {
                currentEvents.splice(1, 1, eventName);
            }
            currentEvents = currentEvents.reverse();
            currentEvents.forEach(function (event) {
                if (event in events) {
                    events[event].forEach(function (person) {
                        var keys = Object.keys(person);
                        if (keys.length == 2) {
                            person.callback.call(students[person.student]);
                        } else {
                            person.currentReaction++;
                            if (keys.indexOf('countOfReactions') !== -1 &&
                                person.currentReaction <= person.countOfReactions) {
                                person.callback.call(students[person.student]);
                            }
                            if (keys.indexOf('numberOfReaction') !== -1) {
                                if (person.currentReaction === person.numberOfReaction) {
                                    person.callback.call(students[person.student]);
                                    person.currentReaction = 0;
                                }
                            }
                        }
                    });
                }
            });
        },

        several: function (eventName, student, callback, n) {
            var newReaction = this.on(eventName, student, callback, n);
            newReaction.countOfReactions = n;
            newReaction.currentReaction = 0;
        },

        through: function (eventName, student, callback, n) {
            var newReaction = this.on(eventName, student, callback, n);
            newReaction.numberOfReaction = n;
            newReaction.currentReaction = 0;
        }
    };
};
