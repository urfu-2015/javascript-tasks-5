module.exports = function () {
    var inf = Infinity;

    function Listener(eventName, student, callback, n, whenRep, current) {
        this.student = student;
        this.cbs = {};
        this.cbs[eventName] = [callback, n, whenRep, current];
    }

    var listeners = [];
    var signedStudents = [];

    function smartOn(eventName, student, callback, n, whenRep, current) {
        if (typeof eventName === 'string' &&
            typeof student === 'object' &&
            typeof callback === 'function') {
            var index = signedStudents.indexOf(student);
            if (index > -1) {
                listeners[index]['cbs'][eventName] = [callback, n, whenRep, current];
            } else {
                listeners.push(new Listener(eventName, student, callback, n, whenRep, current));
                signedStudents.push(student);
            }
        }
    }

    function smartCall(item, eventName) {
        item['cbs'][eventName][0].call(item['student']);
        item['cbs'][eventName][3]++;
        item['cbs'][eventName][1]--;
    }

    return {
        on: function (eventName, student, callback) {
            smartOn(eventName, student, callback, inf, -1, 0);
        },

        off: function (eventName, student) {
            if (typeof eventName === 'string' &&
                eventName !== 'undefined' &&
                typeof student === 'object') {
                var index = signedStudents.indexOf(student);
                if (index > -1) {
                    var events = eventName.split('.');
                    if (events.length == 2) {
                        if (eventName in listeners[index]['cbs']) {
                            delete listeners[index]['cbs'][eventName];
                        }
                    } else {
                        for (var cb in listeners[index]['cbs']) {
                            if (listeners[index]['cbs'].hasOwnProperty(cb)) {
                                if (cb.indexOf(eventName) > -1) {
                                    delete listeners[index]['cbs'][cb];
                                }
                            }
                        }
                    }
                }
            }
        },

        emit: function extendedEmit(eventName) {
            if (typeof eventName === 'string' && eventName !== 'undefined') {
                var events = eventName.split('.');
                var oneMoreEv;
                if (events.length == 2) {
                    oneMoreEv = events[0];
                }
                listeners.forEach(function (item) {
                    if (eventName in item['cbs']) {
                        if (!isFinite(item['cbs'][eventName][1])) {
                            if (item['cbs'][eventName][2] != -1) {
                                if (item['cbs'][eventName][3] % item['cbs'][eventName][2] == 0) {
                                    smartCall(item, eventName);
                                } else {
                                    item['cbs'][eventName][3]++;
                                }
                            } else {
                                smartCall(item, eventName);
                            }
                        } else {
                            if (item['cbs'][eventName][1] > 0) {
                                smartCall(item, eventName);
                            }
                        }
                    }
                });
                extendedEmit(oneMoreEv);
            }
        },

        several: function (eventName, student, callback, n) {
            smartOn(eventName, student, callback, n, -1, 0);
        },

        through: function (eventName, student, callback, n) {
            smartOn(eventName, student, callback, inf, n, 0);
        }
    };
};
