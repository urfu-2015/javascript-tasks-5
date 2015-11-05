function initializeHandler(student, func, n, type) {
    var newEventHandler = {
        student: student,
        function: func.bind(student)
    };
    if (typeof n !== 'undefined') {
        newEventHandler.numOfCalls = 0;
        if (type === 'several') {
            newEventHandler.callsLimit = n;
        }
        if (type === 'through') {
            newEventHandler.callsAlternation = n;
        }
    }
    return newEventHandler;
}

function addHandler(listOfEvents, eventName, handler) {
    listOfEvents[eventName] = listOfEvents[eventName] || [];
    listOfEvents[eventName].push(handler);
}

module.exports = function () {
    return {
        listOfEvents: {},
        on: function (eventName, student, callback) {
            var newEventHandler = initializeHandler(student, callback);
            addHandler(this.listOfEvents, eventName, newEventHandler);
        },

        off: function (eventName, student) {
            if (Object.keys(this.listOfEvents).indexOf(eventName) + 1) {
                var isThereSuchStudent = false;
                for (var i in this.listOfEvents) {
                    if (i.indexOf(eventName) + 1) {
                        var currentList = this.listOfEvents[i];
                        for (var j in currentList) {
                            if (currentList[j]['student'] === student) {
                                isThereSuchStudent = true;
                                currentList.splice(j, 1);
                            }
                        }
                    }
                }
                if (!isThereSuchStudent) {
                    console.error('Такого студента нет!');
                }
            } else {
                console.error('События не существует!');
            }
        },

        emit: function (eventName) {
            for (var i in this.listOfEvents) {
                if (eventName.indexOf(i) === 0) {
                    var currentEvent = this.listOfEvents[i];
                    for (var j in currentEvent) {
                        if (currentEvent[j].hasOwnProperty('callsLimit')) {
                            if (currentEvent[j].numOfCalls < currentEvent[j].callsLimit) {
                                currentEvent[j].numOfCalls++;
                            } else {
                                this.off(eventName, currentEvent[j].student);
                                continue;
                            }
                        } else if (currentEvent[j].hasOwnProperty('callsAlternation')) {
                            currentEvent[j].numOfCalls++;
                            if ((currentEvent[j].numOfCalls %
                                currentEvent[j].callsAlternation) ||
                                currentEvent[j].callsAlternation === 0) {
                                continue;
                            }
                        }
                        currentEvent[j].function();
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {
            if (n < 0 || typeof n !== 'number') {
                console.error('Неверное количество повторов!');
                return;
            }
            var newEventHandler = initializeHandler(student, callback, n, 'several');
            addHandler(this.listOfEvents, eventName, newEventHandler);

        },

        through: function (eventName, student, callback, n) {
            if (n < 0 || typeof n !== 'number') {
                console.error('Неверное количество чередований!');
                return;
            }
            var newEventHandler = initializeHandler(student, callback, n, 'through');
            addHandler(this.listOfEvents, eventName, newEventHandler);
        }
    };
};
