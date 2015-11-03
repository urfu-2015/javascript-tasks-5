module.exports = function () {
    var events = {};
    var period = 1;

    function add(eventName, student, callback, n, type) {
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

    var launch = {
        on_several: function (event) {
            if (event.n != 0) {
                event.callback.call(event.student);
                event.n--;
            }
        },
        
        through: function (event) {
            if (period % event.n == 0) {
                event.callback.call(event.student);
            }
            period++;
        }
    };

    return {
        on: function (eventName, student, callback) {
            add(eventName, student, callback, -1, 'on_several');
        },

        off: function (eventName, student) {
            for (var event in events) {
                if (event.startsWith(eventName)) {

                    events[event] = events[event].filter(function (i) {
                        return student != i.student;
                    });

                }
            }
        },

        emit: function (eventName) {
            while (eventName != '') {
                if (eventName in events) {

                    events[eventName].forEach(function (event) {
                        launch[event.type](event);
                    });

                }
                eventName = eventName.replace(/.(\w+)$/, '');
            }
        },

        several: function (eventName, student, callback, n) {
            add(eventName, student, callback, n, 'on_several');
        },

        through: function (eventName, student, callback, n) {
            add(eventName, student, callback, n, 'through');
        }
    };
};
