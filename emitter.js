module.exports = function () {
    var events = [];
    return {
        on: function (eventName, student, callback) {
            events.push({name: eventName, student: student, callback: callback});
        },

        off: function (eventName, student) {
            var changeEvents = [];
            events.forEach(function (event) {
                var index = event.name.indexOf(eventName);
                if (index === -1) {
                    changeEvents.push(event);
                }
            });
            events = changeEvents;
        },

        emit: function (eventName) {
            var namespace = [];
            namespace.push(eventName);
            while (true) {
                var dote = eventName.lastIndexOf('.');
                if (dote !== -1) {
                    eventName = eventName.slice(0, dote);
                    namespace.push(eventName);
                }
                break;
            }
            events.forEach(function (event) {
                namespace.forEach(function (name) {
                    if (event.name === name) {
                        event.callback.call(event.student);
                    }
                });
            });
        },
        // Сделаю позже
        several: function (eventName, student, callback, n) {
            
        },

        through: function (eventName, student, callback, n) {

        }
    };
};
