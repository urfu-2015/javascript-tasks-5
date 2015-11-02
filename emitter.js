module.exports = function () {
    var events = []
    return {
        on: function (eventName, student, callback) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push({student, callback});
        },

        off: function (eventName, student) {
            if (events[eventName]) {
                for (var i = 0; i < events[eventName].length; i++) {
                    if (student === events[eventName][i]["student"]){
                        events[eventName].splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        },

        emit: function (eventName) {
            if (events[eventName]) {
                for (var i = 0; i < events[eventName].length; i++) {
                    events[eventName][i]["callback"].call(events[eventName][i]["student"]);
                }
            }
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
