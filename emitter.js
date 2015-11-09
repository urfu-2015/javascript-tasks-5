module.exports = function () {
    var subscriptions = [];
    return {
        on: function (eventName, student, callback) {
            subscriptions.push({
                target: student,
                event: eventName,
                callBack: callback
            });
        },
        off: function (eventName, student) {
            for (var i = subscriptions.length; i >= 0; i--) {
                if (subscriptions[i] !== undefined &&
                    subscriptions[i].event.indexOf(eventName) !== -1 &&
                    subscriptions[i].target === student) {
                    subscriptions.splice(i, 1);
                }
            }
        },
        emit: function (eventName) {
            var eventFstLvl = eventName.split('.')[0];
            var eventSndLvl = eventName.split('.')[1];
            subscriptions.forEach(function (student, index) {
                if (student.typeOfEvent === 'several' && student.event === eventName) {
                    if (student.currentCount < student.count) {
                        student.callBack.call(student.target);
                        student.currentCount++;
                    } else {
                        subscriptions.splice(index, 1);
                    }
                };
                if (student.typeOfEvent === 'through' && student.event === eventName) {
                    if (student.currentStep % student.step === 0) {
                        student.callBack.call(student.target);
                    }
                    student.currentStep++;
                };
                if (student.typeOfEvent !== 'several' && student.typeOfEvent !== 'through') {
                    if (eventSndLvl === undefined && student.event === eventFstLvl ||
                    eventSndLvl !== undefined && student.event.indexOf(eventFstLvl) !== -1) {
                        student.callBack.call(student.target);
                    };
                }
            });
        },
        several: function (eventName, student, callback, n) {
            subscriptions.push({target: student,
                            event: eventName,
                            callBack: callback,
                            typeOfEvent: 'several',
                            count: n,
                            currentCount: 0});
        },
        through: function (eventName, student, callback, n) {
            subscriptions.push({target: student,
                            event: eventName,
                            callBack: callback,
                            typeOfEvent: 'through',
                            step: n,
                            currentStep: 1});
        }
    };
};

