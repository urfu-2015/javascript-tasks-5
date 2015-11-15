module.exports = function () {
    return {
        students: [],
        on: function (eventName, student, callback) {
            var k = 0;
            var arg = eventName.split('.');
            var next;
            var ok = false;
            var i = 0;
            next = findStudent(this.students, student);
            if (next === undefined) {
                this.students.push({
                    character: student,
                    events: [{
                        eventName: arg[k]
                    }]
                });
                next = this.students[this.students.length - 1].events;
            }
            while (k < arg.length - 1) {
                for (i = 0; i < next.length; i++) {
                    if (next[i].eventName === arg[k]) {
                        if (!next[i].hasOwnProperty('nextEv')) {
                            next[i].nextEv = [{
                                eventName: arg[k + 1]
                            }];
                        }
                        next = next[i].nextEv;
                        ok = true;
                        break;
                    }
                }
                if (!ok) {
                    next.push({
                        eventName: arg[k],
                        nextEv: [{
                            eventName: arg[k + 1]
                        }]
                    });
                    next = next[i].nextEv;
                }
                k += 1;
            }
            ok = false;
            for (i = 0; i < next.length; i ++) {
                if (next[i].eventName === arg[k] && !next[i].hasOwnProperty('callback')) {
                    next[i].callback = callback;
                    ok = true;
                    break;
                }
            }
            if (!ok) {
                next.push({
                    eventName: arg[k],
                    callback: callback
                });
            }
        },

        off: function (eventName, student) {
            var k = 0;
            var arg = eventName.split('.');
            var next = findStudent(this.students, student);
            var c_next;
            if (next != undefined) {
                while (next.length != 0 && k < arg.length) {
                    c_next = [];
                    next.forEach(function (ev) {
                        if (ev.eventName === arg[k]) {
                            if (k === arg.length - 1) {
                                delete ev.callback;
                                delete ev.nextEv;
                            } else if (ev.hasOwnProperty('nextEv')) {
                                c_next = c_next.concat(ev.nextEv);
                            }
                        }
                    });
                    next = c_next;
                    k += 1;
                }
            }
        },

        emit: function (eventName) {
            var k;
            var arg = eventName.split('.');
            var next;
            var c_next;
            this.students.forEach(function (st) {
                k = 0;
                next = st.events;
                while (next.length != 0 && k < arg.length) {
                    c_next = [];
                    next.forEach(function (ev) {
                        if (ev.eventName === arg[k]) {
                            if (ev.hasOwnProperty('callback')) {
                                ev.callback.apply(st.character);
                            }
                            if (ev.hasOwnProperty('nextEv')) {
                                c_next = c_next.concat(ev.nextEv);
                            }
                        }
                    });
                    next = c_next;
                    k += 1;
                }
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};

function findStudent(students, student) {
    for (var i = 0; i < students.length; i++) {
        if (students[i].character === student) {
            return students[i].events;
        }
    }
}
