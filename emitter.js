module.exports = function () {
    var subs = [];
    return {
        on: function (eventName, student, callback) {
            isFunction(callback);
            isString(eventName);

            var newSub = {
                student: student,
                eventName: eventName,
                callback: callback
            };
            subs.push(newSub);
        },

        off: function (eventName, student) {
            isString(eventName);
            subs = subs.filter(function (sub) {
                return (!(sub.eventName.indexOf(eventName) === 0 && sub.student === student));
            });
        },

        emit: function (eventName) {
            isString(eventName);
            var events = getEvents(eventName);
            subs.forEach(function (sub, index, subs) {
                var AbleToCall = (sub.callsleft !== 0);
                var timeToCall = (sub.callTime === sub.nextCall);

                if (AbleToCall && timeToCall && events.indexOf(sub.eventName) !== -1) {
                    sub.callback.call(sub.student);
                    if (sub.nextCall !== undefined) {
                        sub.nextCall = 1;
                    }
                    if (sub.callsleft !== undefined) {
                        sub.callsleft--;
                    }
                }
                if (!timeToCall &&
                    sub.nextCall !== undefined &&
                    events.indexOf(sub.eventName) !== -1) {
                    sub.nextCall++;
                }
                if (!AbleToCall) {
                    delete subs[index];
                }
            });
        },

        several: function (eventName, student, callback, n) {
            isFunction(callback);
            isString(eventName);
            nonNegativeNumber(n);

            var newSub = {
                student: student,
                eventName: eventName,
                callback: callback,
                callsleft: n
            };
            subs.push(newSub);
        },

        through: function (eventName, student, callback, n) {
            isFunction(callback);
            isString(eventName);
            nonNegativeNumber(n);

            var newSub = {
                student: student,
                eventName: eventName,
                callback: callback,
                nextCall: 1,
                callTime: n
            };
            subs.push(newSub);
        }
    };
};

function isFunction(func) {
    if (typeof func !== 'function') {
        throw new TypeError('callback must have a function type');
    }
};

function isString(string) {
    if (typeof string !== 'string') {
        throw new TypeError('eventName must have a string type');
    }
};

function nonNegativeNumber(number) {
    var n = Number(number);
    if (!(isNaN(n) || n >= 0)) {
        throw new TypeError('n must have a number type');
    }
};

function getEvents(eventName) {
    var events = eventName.split('.');
    for (var i = 1, l = events.length; i < l; i++) {
        events[i] = events[i - 1] + '.' + events[i];
    }
    return events;
}
