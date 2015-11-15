module.exports = function () {
    var subscriptions = [];
    return {
        on: function (eventName, student, callback) {
            subscriptions.push({
                target: student,
                event: eventName,
                callback: callback
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
            // var listEvent = eventName.split('.');
            // for (var i = 1; i < listEvent.length; i++){
                var listEvent = eventName.split('.');
                var oneEvent = listEvent[0];
                for (var i = 0; i < listEvent.length; i++) {
                    if (i > 0) {
                        oneEvent += '.' + listEvent[i];
                    }
            subscriptions.forEach(function (student, index) {
                if (student.typeOfEvent === 'several' && student.event === eventName) {
                    if (student.currentCount < student.count) {
                        student.callback.call(student.target);
                        student.currentCount++;
                    } else {
                        subscriptions.splice(index, 1);
                    }
                };
                if (student.typeOfEvent === 'through' && student.event === eventName) {
                    if (student.currentStep % student.step === 0) {
                        student.callback.call(student.target);
                    }
                    student.currentStep++;
                };
                if (student.typeOfEvent !== 'several' && student.typeOfEvent !== 'through') {
                    if (oneEvent[1] === undefined && student.event === oneEvent[0] ||
                    oneEvent[1] !== undefined && student.event.indexOf(oneEvent[0]) !== -1) {
                        student.callback.call(student.target);
                    };
                }
            });
        }
    },
        several: function (eventName, student, callback, n) {
            subscriptions.push({target: student,
                            event: eventName,
                            callback: callback,
                            typeOfEvent: 'several',
                            count: n,
                            currentCount: 0});
        },
        through: function (eventName, student, callback, n) {
            subscriptions.push({target: student,
                            event: eventName,
                            callback: callback,
                            typeOfEvent: 'through',
                            step: n,
                            currentStep: 1});
        }
    };
};

