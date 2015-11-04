module.exports = function () {
    var subs = [];
    return {
        on: function (eventName, student, callback) {
            checkInput(eventName, student, callback);
            subs.push(createSub(student, eventName, callback, NaN, NaN, NaN));
        },

        off: function (eventName, student) {
            checkInput(eventName, student);
            subs = subs.filter(function (sub) {
                return (!(sub.eventName.indexOf(eventName) === 0 && sub.student === student));
            });
        },

        emit: function (eventName) {
            checkInput(eventName);
            var events = getEvents(eventName);
            subs.forEach(function (sub, index, subs) {
                var isCorrectEvent = (events.indexOf(sub.eventName) !== -1);
                var isAbleToCall = (sub.callsleft !== 0);
                var isTimeToCall = (sub.callTime === sub.nextCall ||
                                isNaN(sub.callTime) && isNaN(sub.nextCall));

                if (isAbleToCall && isTimeToCall && isCorrectEvent) {
                    sub.callback.call(sub.student);
                    isNaN(sub.nextCall) ? sub.nextCall = NaN : sub.nextCall = 1;
                    sub.callsleft--;
                }
                if (!isTimeToCall && isCorrectEvent) {
                    sub.nextCall++;
                }
                if (!isAbleToCall) {
                    delete subs[index];
                }
            });
        },

        several: function (eventName, student, callback, n) {
            checkInput(eventName, student, callback, n);
            subs.push(createSub(student, eventName, callback, n, NaN, NaN));
        },

        through: function (eventName, student, callback, n) {
            checkInput(eventName, student, callback, n);
            subs.push(createSub(student, eventName, callback, NaN, 1, n));
        }
    };
};

function getEvents(eventName) {
    var events = eventName.split('.');
    for (var i = 1, l = events.length; i < l; i++) {
        events[i] = events[i - 1] + '.' + events[i];
    }
    return events;
}

function checkInput() {
    var arg = Array.from(arguments);
    var length = arg.length;
    if (length > 0 && typeof arg[0] !== 'string') {
        throw new TypeError('"eventName" has ' + typeof arg[0] + ' type. string type expected');
    }
    if (length > 2 && typeof arg[2] !== 'function') {
        throw new TypeError('"callback" has ' + typeof arg[2] + ' type. function type expected');
    }
    var n = Number(arg[3]);
    if (length > 3) {
        if (isNaN(arg[3])) {
            throw new TypeError('"n" has ' + typeof arg[3] + ' type. number type expected');
        }
        if (arg[3] < 0) {
            throw new RangeError('n = ' + arg[3] + '. expected: n >= 0');
        }
    }
}

function createSub(student, eventName, callback, callsleft, nextCall, callTime) {
    return {
        student: student,
        eventName: eventName,
        callback: callback,
        callsleft: callsleft,
        nextCall: nextCall,
        callTime: callTime
    };
}
