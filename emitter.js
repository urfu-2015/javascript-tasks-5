module.exports = function () {
    var events = {};
    var period = 1;

    function add (eventName, student, callback, n, type) {
        if (!(eventName in events)) {
            events[eventName] = [];
        }
        events[eventName].push({
            student: student,
            callback: callback,
            n: n,
            type: type
        });
    }

    return {
        on: function (eventName, student, callback) {
            add(eventName, student, callback, -1, 'on');
        },

        off: function (eventName, student) {
            while (eventName != '') {
                for (var i = 0; i < events[eventName].length; i++) {
                    if (student == events[eventName][i].student) {
                        events[eventName].splice(i, 1);
                        break;
                    }
                }
                eventName = eventName.replace(/.(\w+)$/, '');
            }
        },

        emit: function (eventName) {
            while (eventName != '') {
                if (eventName in events) {
                    for (var event of events[eventName]) {
                        switch (event.type) {
                            case 'on':
                            case 'several':
                                if (event.n != 0) {
                                    event.callback.call(event.student);
                                    event.n--;
                                }
                                break;
                            case 'through':
                                if (period % event.n == 0) {
                                    event.callback.call(event.student);
                                }
                                period++;
                                break;
                        }
                    }
                }
                eventName = eventName.replace(/.(\w+)$/, '');
            }
        },

        several: function (eventName, student, callback, n) {
            add(eventName, student, callback, n, 'several');
        },

        through: function (eventName, student, callback, n) {
            add(eventName, student, callback, n, 'through');
        }
    };
};
