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
            return newReaction;
        },

        off: function (eventName, student) {
            var studentNumber = students.indexOf(student);
            if (eventName in events && studentNumber !== -1) {
                var deleteEvents = [eventName];
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
            }
        },

        emit: function (eventName) {
            var currentEvents = [eventName];
            var indexOfPoint = eventName.lastIndexOf('.');
            while (indexOfPoint !== -1) {
                eventName = eventName.substring(0, indexOfPoint);
                currentEvents = currentEvents.concat(eventName);
                indexOfPoint = eventName.lastIndexOf('.');
            }
            currentEvents.forEach(function (event) {
                if (!(event in events)) {
                    return;
                }
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
                        if (keys.indexOf('numberOfReaction') !== -1 &&
                            person.currentReaction === person.numberOfReaction) {
                            person.callback.call(students[person.student]);
                            person.currentReaction = 0;
                        }
                    }
                });
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
