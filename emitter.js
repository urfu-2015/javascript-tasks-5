function parseNameSpace(nameSpace) {
    var tokens = nameSpace.split('.');
    var names = [];

    while (tokens.length) {
        names.push(tokens.join('.'));
        tokens.pop();
    }
    return names;
}

module.exports = function () {
    var events = {};
    return {
        on: function (eventName, context, callback) {
            if (!events.hasOwnProperty(eventName)) {
                events[eventName] = [];
            }

            var eventDatas = events[eventName];
            if (!eventDatas.some(function (data) {
                    return data.context === context;
                })) {
                eventDatas.push({context: context, callbacks: []});
            }

            var eventData = eventDatas.filter(function (data) {
                return data.context === context;
            })[0];
            eventData.callbacks.push(callback);
        },

        off: function (eventName, context) {
            if (!events.hasOwnProperty(eventName)) {
                return;
            }

            events[eventName] = events[eventName].filter(function (query) {
                return query.context !== context;
            });
        },

        emit: function (eventNameSpace) {
            var eventNames = parseNameSpace(eventNameSpace);
            eventNames.forEach(function(eventName){
                if (!events.hasOwnProperty(eventName)) {
                    return;
                }

                events[eventName].forEach(function(item){
                    item.callbacks.forEach(function(callback) {
                        callback.call(item.context);
                    })
                })
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
