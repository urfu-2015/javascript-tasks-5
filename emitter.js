module.exports = function () {
    var subscribers = [];
return {
    on: function (eventName, student, callback) {
        if (!subscribers[eventName]) {
            subscribers[eventName] = [];
            subscribers[eventName].push({name: student, func: callback});
        } else {
            if (!checkArray(student, eventName, subscribers)) {
                subscribers[eventName].push({name: student, func: callback});
            }
        }
    },

    off: function (eventName, student) {
        return subscribers[eventName].filter(function (person) {
            return (person.name != student);
        });
    },

    emit: function (eventName) {
        var events = eventName.split('.');
        events[1] = events[0] + '.' + events[1];
        events.forEach(function(event) {
            if (event in subscribers) {
                subscribers[event].forEach(function (person) {
                    person.func;
                })
            }
        });
    }
};
};


function checkArray(student, event, array) {
    var flag = false;
    array[event].forEach(function (person) {
        if (person.name === student) {
            flag = true;
        }
    });
    return flag;
}
